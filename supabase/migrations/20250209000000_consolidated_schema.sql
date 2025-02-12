-- Suppression des tables existantes si nécessaire
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS services CASCADE;

-- Création de la table services
CREATE TABLE services (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    duration TEXT NOT NULL,
    price INTEGER NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL
);

-- Insertion des services par défaut
INSERT INTO services (id, title, duration, price, description, icon) VALUES
    ('consultation', 'Consultation Naturopathie', '1h30', 90, 'Bilan de vitalité complet et plan d''action personnalisé', 'eco'),
    ('suivi', 'Suivi Nutritionnel', '1h', 75, 'Accompagnement et ajustement de votre plan alimentaire', 'restaurant'),
    ('phyto', 'Consultation Phytothérapie', '1h', 80, 'Conseils personnalisés en plantes médicinales', 'spa'),
    ('massage', 'Massage Bien-être', '1h', 85, 'Massage relaxant aux huiles essentielles', 'self_improvement');

-- Création de la table appointments
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id TEXT REFERENCES services(id) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    client_email TEXT NOT NULL,
    client_name TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    stripe_session_id TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Création de la table products
CREATE TABLE products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category TEXT NOT NULL,
    pdf_path TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Création de la table cart_items
CREATE TABLE cart_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- Configuration RLS pour appointments
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous insert" ON appointments 
    FOR INSERT TO anon 
    WITH CHECK (true);

CREATE POLICY "Allow users to view own appointments" ON appointments 
    FOR SELECT 
    USING (client_email = auth.jwt()->>'email');

CREATE POLICY "Allow users to update own appointments" ON appointments 
    FOR UPDATE 
    USING (client_email = auth.jwt()->>'email');

-- Configuration RLS pour products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read products" ON products 
    FOR SELECT 
    USING (true);

CREATE POLICY "Allow admin insert products" ON products 
    FOR INSERT 
    WITH CHECK (auth.jwt()->>'email' = 'tyzranaima@gmail.com');

CREATE POLICY "Allow admin delete products" ON products 
    FOR DELETE 
    USING (auth.jwt()->>'email' = 'tyzranaima@gmail.com');

-- Configuration RLS pour cart_items
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to manage own cart" ON cart_items 
    FOR ALL 
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);

-- Configuration des politiques de stockage
CREATE POLICY "Allow public read storage" ON storage.objects 
    FOR SELECT 
    USING (true);

CREATE POLICY "Allow admin write storage" ON storage.objects 
    FOR INSERT 
    WITH CHECK (auth.jwt()->>'email' = 'tyzranaima@gmail.com');

CREATE POLICY "Allow admin delete storage" ON storage.objects 
    FOR DELETE 
    USING (auth.jwt()->>'email' = 'tyzranaima@gmail.com');

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_appointments_client_email ON appointments(client_email);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
