-- Création d'une fonction pour générer le vecteur de recherche
CREATE OR REPLACE FUNCTION products_search_vector(title TEXT, description TEXT, category TEXT)
RETURNS tsvector AS $$
BEGIN
    RETURN setweight(to_tsvector('french', COALESCE(title, '')), 'A') ||
           setweight(to_tsvector('french', COALESCE(description, '')), 'B') ||
           setweight(to_tsvector('french', COALESCE(category, '')), 'C');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Ajout d'une colonne pour stocker le vecteur de recherche
ALTER TABLE products ADD COLUMN IF NOT EXISTS search_vector tsvector
    GENERATED ALWAYS AS (products_search_vector(title, description, category)) STORED;

-- Création d'un index GIN pour la recherche rapide
CREATE INDEX IF NOT EXISTS idx_products_search_vector ON products USING gin(search_vector);

-- Optimisation des autres index pour les filtres
CREATE INDEX IF NOT EXISTS idx_products_price ON products (price);
CREATE INDEX IF NOT EXISTS idx_products_category_price ON products (category, price);

-- Mise à jour de la fonction de trigger pour maintenir le vecteur de recherche
CREATE OR REPLACE FUNCTION products_vector_update() RETURNS trigger AS $$
BEGIN
    NEW.search_vector := products_search_vector(NEW.title, NEW.description, NEW.category);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Création du trigger
DROP TRIGGER IF EXISTS products_vector_update ON products;
CREATE TRIGGER products_vector_update
    BEFORE INSERT OR UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION products_vector_update();
