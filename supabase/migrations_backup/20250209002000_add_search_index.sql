-- Désactiver temporairement les triggers pour éviter les conflits
ALTER TABLE products DISABLE TRIGGER ALL;

-- Créer une fonction pour générer le vecteur de recherche
CREATE OR REPLACE FUNCTION generate_product_search_vector(
    p_title TEXT,
    p_description TEXT,
    p_category TEXT
) RETURNS tsvector AS $$
BEGIN
    RETURN setweight(to_tsvector('french', COALESCE(p_title, '')), 'A') ||
           setweight(to_tsvector('french', COALESCE(p_description, '')), 'B') ||
           setweight(to_tsvector('french', COALESCE(p_category, '')), 'C');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Ajouter la colonne search_vector si elle n'existe pas
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'products' 
        AND column_name = 'search_vector'
    ) THEN
        ALTER TABLE products 
        ADD COLUMN search_vector tsvector;
    END IF;
END $$;

-- Mettre à jour les vecteurs de recherche existants
UPDATE products 
SET search_vector = generate_product_search_vector(title, description, category);

-- Créer l'index GIN
DROP INDEX IF EXISTS idx_products_search;
CREATE INDEX idx_products_search ON products USING gin(search_vector);

-- Créer le trigger pour maintenir le vecteur de recherche à jour
CREATE OR REPLACE FUNCTION update_product_search_vector()
RETURNS trigger AS $$
BEGIN
    NEW.search_vector := generate_product_search_vector(
        NEW.title,
        NEW.description,
        NEW.category
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Créer le trigger
DROP TRIGGER IF EXISTS tr_update_product_search_vector ON products;
CREATE TRIGGER tr_update_product_search_vector
    BEFORE INSERT OR UPDATE OF title, description, category
    ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_product_search_vector();

-- Réactiver les triggers
ALTER TABLE products ENABLE TRIGGER ALL;

-- Créer des index supplémentaires pour les filtres courants
CREATE INDEX IF NOT EXISTS idx_products_category_price 
ON products(category, price);

CREATE INDEX IF NOT EXISTS idx_products_price 
ON products(price);

-- Analyser la table pour mettre à jour les statistiques
ANALYZE products;
