-- Script pour activer RLS sur toutes les tables et vérifier les politiques
-- Date: 2025-05-03

-- 1. Activer RLS sur toutes les tables mentionnées dans les logs d'erreur
ALTER TABLE IF EXISTS public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.appointments_pending ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.availabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- 2. Activer RLS sur les tables principales du système
ALTER TABLE IF EXISTS profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS blocked_times ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS products ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- 3. Vérification des politiques pour les tables principales

-- Politiques pour profiles (si elles n'existent pas déjà)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Allow public read-only access') THEN
        CREATE POLICY "Allow public read-only access"
            ON profiles FOR SELECT
            TO authenticated
            USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Allow users to update their own profile') THEN
        CREATE POLICY "Allow users to update their own profile"
            ON profiles FOR UPDATE
            TO authenticated
            USING (auth.uid() = id)
            WITH CHECK (auth.uid() = id);
    END IF;
END
$$;

-- Politiques pour blocked_times (si elles n'existent pas déjà)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'blocked_times' AND policyname = 'Allow admins to insert blocked times') THEN
        CREATE POLICY "Allow admins to insert blocked times"
            ON blocked_times FOR INSERT
            TO authenticated
            USING (
                EXISTS (
                    SELECT 1 FROM profiles
                    WHERE id = auth.uid()
                    AND role = 'admin'
                )
            );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'blocked_times' AND policyname = 'Allow admins to update blocked times') THEN
        CREATE POLICY "Allow admins to update blocked times"
            ON blocked_times FOR UPDATE
            TO authenticated
            USING (
                EXISTS (
                    SELECT 1 FROM profiles
                    WHERE id = auth.uid()
                    AND role = 'admin'
                )
            );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'blocked_times' AND policyname = 'Allow admins to delete blocked times') THEN
        CREATE POLICY "Allow admins to delete blocked times"
            ON blocked_times FOR DELETE
            TO authenticated
            USING (
                EXISTS (
                    SELECT 1 FROM profiles
                    WHERE id = auth.uid()
                    AND role = 'admin'
                )
            );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'blocked_times' AND policyname = 'Allow public to view blocked times') THEN
        CREATE POLICY "Allow public to view blocked times"
            ON blocked_times FOR SELECT
            TO authenticated
            USING (true);
    END IF;
END
$$;

-- Politiques pour cart_items (si elles n'existent pas déjà)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'cart_items' AND policyname = 'Users can view own cart items') THEN
        CREATE POLICY "Users can view own cart items"
            ON cart_items FOR SELECT
            USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'cart_items' AND policyname = 'Users can insert own cart items') THEN
        CREATE POLICY "Users can insert own cart items"
            ON cart_items FOR INSERT
            WITH CHECK (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'cart_items' AND policyname = 'Users can update own cart items') THEN
        CREATE POLICY "Users can update own cart items"
            ON cart_items FOR UPDATE
            USING (auth.uid() = user_id)
            WITH CHECK (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'cart_items' AND policyname = 'Users can delete own cart items') THEN
        CREATE POLICY "Users can delete own cart items"
            ON cart_items FOR DELETE
            USING (auth.uid() = user_id);
    END IF;
END
$$;

-- 4. Créer des politiques de base pour les tables qui n'en ont pas encore

-- Pour order_items
DO $$
DECLARE
    order_id_exists BOOLEAN;
    orders_user_id_exists BOOLEAN;
    orders_client_email_exists BOOLEAN;
    orders_customer_id_exists BOOLEAN;
BEGIN
    -- Vérifier si la colonne order_id existe
    SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'order_items' AND column_name = 'order_id') INTO order_id_exists;
    
    -- Vérifier quelles colonnes d'identification existent dans la table orders
    SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'user_id') INTO orders_user_id_exists;
    SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'client_email') INTO orders_client_email_exists;
    SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'customer_id') INTO orders_customer_id_exists;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'order_items') THEN
        -- Politique pour permettre aux utilisateurs de voir leurs propres articles de commande
        IF order_id_exists THEN
            IF orders_user_id_exists THEN
                CREATE POLICY "Users can view own order items by user_id"
                    ON order_items FOR SELECT
                    USING (
                        EXISTS (
                            SELECT 1 FROM orders
                            WHERE orders.id = order_items.order_id
                            AND orders.user_id = auth.uid()
                        )
                    );
            ELSIF orders_client_email_exists THEN
                CREATE POLICY "Users can view own order items by email"
                    ON order_items FOR SELECT
                    USING (
                        EXISTS (
                            SELECT 1 FROM orders
                            WHERE orders.id = order_items.order_id
                            AND orders.client_email = auth.jwt()->>'email'
                        )
                    );
            ELSIF orders_customer_id_exists THEN
                CREATE POLICY "Users can view own order items by customer_id"
                    ON order_items FOR SELECT
                    USING (
                        EXISTS (
                            SELECT 1 FROM orders
                            WHERE orders.id = order_items.order_id
                            AND orders.customer_id = auth.uid()
                        )
                    );
            ELSE
                RAISE NOTICE 'Aucune colonne d''identification utilisateur trouvée dans la table orders';
            END IF;
        ELSE
            RAISE NOTICE 'La colonne order_id n''existe pas dans la table order_items';
        END IF;
            
        -- Politique pour permettre aux admins de voir tous les articles de commande
        CREATE POLICY "Admins can view all order items"
            ON order_items FOR SELECT
            USING (
                EXISTS (
                    SELECT 1 FROM profiles
                    WHERE profiles.id = auth.uid()
                    AND profiles.role = 'admin'
                )
            );
            
        -- Politique pour permettre aux admins de modifier les articles de commande
        CREATE POLICY "Admins can manage order items"
            ON order_items FOR ALL
            USING (
                EXISTS (
                    SELECT 1 FROM profiles
                    WHERE profiles.id = auth.uid()
                    AND profiles.role = 'admin'
                )
            );
    END IF;
END
$$;

-- Pour orders
DO $$
DECLARE
    user_id_exists BOOLEAN;
    client_email_exists BOOLEAN;
    customer_id_exists BOOLEAN;
BEGIN
    -- Vérifier quelles colonnes existent dans la table orders
    SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'user_id') INTO user_id_exists;
    SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'client_email') INTO client_email_exists;
    SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'customer_id') INTO customer_id_exists;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'orders') THEN
        -- Politique pour permettre aux utilisateurs de voir leurs propres commandes
        IF user_id_exists THEN
            CREATE POLICY "Users can view own orders by user_id"
                ON orders FOR SELECT
                USING (user_id = auth.uid());
        ELSIF client_email_exists THEN
            CREATE POLICY "Users can view own orders by email"
                ON orders FOR SELECT
                USING (client_email = auth.jwt()->>'email');
        ELSIF customer_id_exists THEN
            CREATE POLICY "Users can view own orders by customer_id"
                ON orders FOR SELECT
                USING (customer_id = auth.uid());
        ELSE
            -- Créer une politique par défaut sécurisée si aucune colonne d'identification n'est trouvée
            RAISE NOTICE 'Aucune colonne d''identification utilisateur trouvée dans la table orders';
        END IF;
            
        -- Politique pour permettre aux admins de voir toutes les commandes
        CREATE POLICY "Admins can view all orders"
            ON orders FOR SELECT
            USING (
                EXISTS (
                    SELECT 1 FROM profiles
                    WHERE profiles.id = auth.uid()
                    AND profiles.role = 'admin'
                )
            );
            
        -- Politique pour permettre aux admins de gérer les commandes
        CREATE POLICY "Admins can manage orders"
            ON orders FOR ALL
            USING (
                EXISTS (
                    SELECT 1 FROM profiles
                    WHERE profiles.id = auth.uid()
                    AND profiles.role = 'admin'
                )
            );
    END IF;
END
$$;

-- Pour appointments_pending
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'appointments_pending') THEN
        -- Politique pour permettre aux utilisateurs de voir leurs propres rendez-vous
        CREATE POLICY "Users can view own appointments"
            ON appointments_pending FOR SELECT
            USING (client_email = auth.jwt()->>'email');
            
        -- Politique pour permettre aux utilisateurs de créer leurs propres rendez-vous
        CREATE POLICY "Users can create own appointments"
            ON appointments_pending FOR INSERT
            WITH CHECK (client_email = auth.jwt()->>'email');
            
        -- Politique pour permettre aux admins de voir tous les rendez-vous
        CREATE POLICY "Admins can view all appointments"
            ON appointments_pending FOR SELECT
            USING (
                EXISTS (
                    SELECT 1 FROM profiles
                    WHERE profiles.id = auth.uid()
                    AND profiles.role = 'admin'
                )
            );
            
        -- Politique pour permettre aux admins de gérer les rendez-vous
        CREATE POLICY "Admins can manage appointments"
            ON appointments_pending FOR ALL
            USING (
                EXISTS (
                    SELECT 1 FROM profiles
                    WHERE profiles.id = auth.uid()
                    AND profiles.role = 'admin'
                )
            );
    END IF;
END
$$;

-- Pour availabilities
DO $$
BEGIN
    -- Vérifier si la table existe avant de créer des politiques
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'availabilities') THEN
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'availabilities') THEN
            -- Politique pour permettre à tous les utilisateurs authentifiés de voir les disponibilités
            CREATE POLICY "Anyone can view availabilities"
                ON availabilities FOR SELECT
                TO authenticated
                USING (true);
                
            -- Politique pour permettre aux admins de gérer les disponibilités
            CREATE POLICY "Admins can manage availabilities"
                ON availabilities FOR ALL
                USING (
                    EXISTS (
                        SELECT 1 FROM profiles
                        WHERE profiles.id = auth.uid()
                        AND profiles.role = 'admin'
                    )
                );
        END IF;
    ELSE
        RAISE NOTICE 'La table availabilities n''existe pas';
    END IF;
END
$$;

-- Pour newsletter_subscribers
DO $$
DECLARE
    email_exists BOOLEAN;
BEGIN
    -- Vérifier si la table existe et si la colonne email existe
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'newsletter_subscribers') THEN
        SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'newsletter_subscribers' AND column_name = 'email') INTO email_exists;
        
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'newsletter_subscribers') THEN
            -- Politique pour permettre aux utilisateurs de s'abonner
            CREATE POLICY "Users can subscribe"
                ON newsletter_subscribers FOR INSERT
                WITH CHECK (true);
                
            -- Politique pour permettre aux utilisateurs de se désabonner
            IF email_exists THEN
                CREATE POLICY "Users can unsubscribe"
                    ON newsletter_subscribers FOR DELETE
                    USING (email = current_setting('request.jwt.claims', true)::json->>'email');
            ELSE
                RAISE NOTICE 'La colonne email n''existe pas dans la table newsletter_subscribers';
            END IF;
                
            -- Politique pour permettre aux admins de voir tous les abonnés
            CREATE POLICY "Admins can view all subscribers"
                ON newsletter_subscribers FOR SELECT
                USING (
                    EXISTS (
                        SELECT 1 FROM profiles
                        WHERE profiles.id = auth.uid()
                        AND profiles.role = 'admin'
                    )
                );
        END IF;
    ELSE
        RAISE NOTICE 'La table newsletter_subscribers n''existe pas';
    END IF;
END
$$;

-- 5. Requête pour vérifier l'état de RLS sur toutes les tables
SELECT 
    schemaname, 
    tablename, 
    rowsecurity,
    (SELECT COUNT(*) FROM pg_policies WHERE pg_policies.tablename = pg_tables.tablename) AS policy_count
FROM 
    pg_tables 
WHERE 
    schemaname = 'public'
ORDER BY 
    tablename;
