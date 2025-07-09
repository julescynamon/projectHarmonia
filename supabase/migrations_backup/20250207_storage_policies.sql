-- Ajouter une colonne is_admin aux utilisateurs si elle n'existe pas
ALTER TABLE auth.users 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Donner les droits d'admin à votre email
UPDATE auth.users
SET is_admin = true
WHERE email = 'julescweb@gmail.com';

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

-- Activer RLS sur products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre à tous de voir les produits
DROP POLICY IF EXISTS "Allow public read access" ON products;
CREATE POLICY "Allow public read access"
    ON products FOR SELECT
    USING (true);

-- Politique pour permettre aux admins de modifier les produits
DROP POLICY IF EXISTS "Allow admin write access" ON products;
CREATE POLICY "Allow admin write access"
    ON products FOR ALL
    USING (auth.email() IN (SELECT email FROM auth.users WHERE is_admin = true));

-- Ajouter une colonne is_admin aux utilisateurs si elle n'existe pas
ALTER TABLE auth.users 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Donner les droits d'admin à votre email
UPDATE auth.users
SET is_admin = true
WHERE email = 'julescweb@gmail.com';  -- Remplacez par votre email
