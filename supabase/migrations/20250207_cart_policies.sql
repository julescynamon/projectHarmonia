-- Activer RLS sur la table cart_items
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Supprimer les politiques existantes
DROP POLICY IF EXISTS "Users can view own cart items" ON cart_items;
DROP POLICY IF EXISTS "Users can insert own cart items" ON cart_items;
DROP POLICY IF EXISTS "Users can update own cart items" ON cart_items;
DROP POLICY IF EXISTS "Users can delete own cart items" ON cart_items;

-- Politique pour voir ses propres articles
CREATE POLICY "Users can view own cart items"
ON cart_items FOR SELECT
USING (auth.uid() = user_id);

-- Politique pour ajouter des articles
CREATE POLICY "Users can insert own cart items"
ON cart_items FOR INSERT
WITH CHECK (
    auth.uid() = user_id
);

-- Politique pour mettre à jour ses articles
CREATE POLICY "Users can update own cart items"
ON cart_items FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Politique pour supprimer ses articles
CREATE POLICY "Users can delete own cart items"
ON cart_items FOR DELETE
USING (auth.uid() = user_id);
