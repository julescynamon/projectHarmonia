-- Créer des index pour optimiser les requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_download_count ON products(download_count DESC NULLS LAST);

-- Index pour la recherche textuelle sur le titre et la description
CREATE INDEX IF NOT EXISTS idx_products_title_description ON products
USING gin(to_tsvector('french', title || ' ' || description));
