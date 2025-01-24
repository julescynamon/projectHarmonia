/*
  # Configuration de la boutique en ligne

  1. Nouvelles Tables
    - `products`
      - `id` (uuid, clé primaire)
      - `title` (text, titre du produit)
      - `description` (text, description du produit)
      - `price` (decimal, prix)
      - `category` (text, catégorie)
      - `pdf_path` (text, chemin du fichier dans Supabase Storage)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `orders`
      - `id` (uuid, clé primaire)
      - `user_id` (uuid, référence vers auth.users)
      - `total_amount` (decimal, montant total)
      - `status` (text, statut de la commande)
      - `created_at` (timestamp)

    - `order_items`
      - `id` (uuid, clé primaire)
      - `order_id` (uuid, référence vers orders)
      - `product_id` (uuid, référence vers products)
      - `price` (decimal, prix au moment de l'achat)
      - `download_count` (int, nombre de téléchargements)
      - `created_at` (timestamp)

  2. Sécurité
    - RLS activé sur toutes les tables
    - Politiques de lecture publique pour les produits
    - Politiques de lecture privée pour les commandes
*/

-- Table des produits
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  price decimal NOT NULL CHECK (price >= 0),
  category text NOT NULL,
  pdf_path text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des commandes
CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  total_amount decimal NOT NULL CHECK (total_amount >= 0),
  status text NOT NULL DEFAULT 'completed',
  created_at timestamptz DEFAULT now()
);

-- Table des produits commandés
CREATE TABLE order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders NOT NULL,
  product_id uuid REFERENCES products NOT NULL,
  price decimal NOT NULL CHECK (price >= 0),
  download_count int DEFAULT 0 CHECK (download_count >= 0),
  created_at timestamptz DEFAULT now()
);

-- Activation de la sécurité RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Politiques de sécurité pour les produits
CREATE POLICY "Les produits sont visibles par tous"
  ON products
  FOR SELECT
  TO public
  USING (true);

-- Politiques de sécurité pour les commandes
CREATE POLICY "Les utilisateurs peuvent voir leurs commandes"
  ON orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Politiques de sécurité pour les produits commandés
CREATE POLICY "Les utilisateurs peuvent voir leurs produits commandés"
  ON order_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );