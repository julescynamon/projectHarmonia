-- Script pour activer RLS sur toutes les tables et vérifier les politiques
-- Date: 2025-05-02

-- 1. Activer RLS sur toutes les tables mentionnées dans les logs d'erreur
ALTER TABLE IF EXISTS articles_de_commande ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS commandes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS rendez_vous ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS disponibilites ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS abonnes_newsletter ENABLE ROW LEVEL SECURITY;

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

-- Pour articles_de_commande
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'articles_de_commande') THEN
        -- Politique pour permettre aux utilisateurs de voir leurs propres articles de commande
        CREATE POLICY "Users can view own order items"
            ON articles_de_commande FOR SELECT
            USING (
                EXISTS (
                    SELECT 1 FROM commandes
                    WHERE commandes.id = articles_de_commande.commande_id
                    AND commandes.user_id = auth.uid()
                )
            );
            
        -- Politique pour permettre aux admins de voir tous les articles de commande
        CREATE POLICY "Admins can view all order items"
            ON articles_de_commande FOR SELECT
            USING (
                EXISTS (
                    SELECT 1 FROM profiles
                    WHERE profiles.id = auth.uid()
                    AND profiles.role = 'admin'
                )
            );
            
        -- Politique pour permettre aux admins de modifier les articles de commande
        CREATE POLICY "Admins can manage order items"
            ON articles_de_commande FOR ALL
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

-- Pour commandes
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'commandes') THEN
        -- Politique pour permettre aux utilisateurs de voir leurs propres commandes
        CREATE POLICY "Users can view own orders"
            ON commandes FOR SELECT
            USING (user_id = auth.uid());
            
        -- Politique pour permettre aux admins de voir toutes les commandes
        CREATE POLICY "Admins can view all orders"
            ON commandes FOR SELECT
            USING (
                EXISTS (
                    SELECT 1 FROM profiles
                    WHERE profiles.id = auth.uid()
                    AND profiles.role = 'admin'
                )
            );
            
        -- Politique pour permettre aux admins de gérer les commandes
        CREATE POLICY "Admins can manage orders"
            ON commandes FOR ALL
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

-- Pour rendez_vous
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'rendez_vous') THEN
        -- Politique pour permettre aux utilisateurs de voir leurs propres rendez-vous
        CREATE POLICY "Users can view own appointments"
            ON rendez_vous FOR SELECT
            USING (user_id = auth.uid());
            
        -- Politique pour permettre aux utilisateurs de créer leurs propres rendez-vous
        CREATE POLICY "Users can create own appointments"
            ON rendez_vous FOR INSERT
            WITH CHECK (user_id = auth.uid());
            
        -- Politique pour permettre aux admins de voir tous les rendez-vous
        CREATE POLICY "Admins can view all appointments"
            ON rendez_vous FOR SELECT
            USING (
                EXISTS (
                    SELECT 1 FROM profiles
                    WHERE profiles.id = auth.uid()
                    AND profiles.role = 'admin'
                )
            );
            
        -- Politique pour permettre aux admins de gérer les rendez-vous
        CREATE POLICY "Admins can manage appointments"
            ON rendez_vous FOR ALL
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

-- Pour disponibilites
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'disponibilites') THEN
        -- Politique pour permettre à tous les utilisateurs authentifiés de voir les disponibilités
        CREATE POLICY "Anyone can view availabilities"
            ON disponibilites FOR SELECT
            TO authenticated
            USING (true);
            
        -- Politique pour permettre aux admins de gérer les disponibilités
        CREATE POLICY "Admins can manage availabilities"
            ON disponibilites FOR ALL
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

-- Pour abonnes_newsletter
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'abonnes_newsletter') THEN
        -- Politique pour permettre aux utilisateurs de s'abonner
        CREATE POLICY "Users can subscribe"
            ON abonnes_newsletter FOR INSERT
            WITH CHECK (true);
            
        -- Politique pour permettre aux utilisateurs de se désabonner
        CREATE POLICY "Users can unsubscribe"
            ON abonnes_newsletter FOR DELETE
            USING (email = current_setting('request.jwt.claims', true)::json->>'email');
            
        -- Politique pour permettre aux admins de voir tous les abonnés
        CREATE POLICY "Admins can view all subscribers"
            ON abonnes_newsletter FOR SELECT
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
