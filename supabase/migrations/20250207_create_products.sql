-- Créer la table products si elle n'existe pas
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category TEXT NOT NULL,
    pdf_path TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ajouter des produits de test si la table est vide
INSERT INTO products (title, description, price, category, pdf_path)
SELECT 
    'Guide de Méditation',
    'Un guide complet pour débuter la méditation et développer une pratique quotidienne.',
    19.99,
    'Bien-être',
    'guides/meditation-guide.pdf'
WHERE NOT EXISTS (SELECT 1 FROM products LIMIT 1);

-- Activer RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre à tous de voir les produits
CREATE POLICY "Allow public read access"
    ON products FOR SELECT
    USING (true);

-- Politique pour permettre aux admins de modifier les produits
CREATE POLICY "Allow admin write access"
    ON products
    USING (auth.role() = 'authenticated' AND auth.email() IN (SELECT email FROM auth.users WHERE is_admin = true));
