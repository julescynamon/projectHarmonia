-- Ajouter la colonne category à la table posts

-- Ajouter la colonne category avec le même type que dans blog_posts
ALTER TABLE posts ADD COLUMN IF NOT EXISTS category text;

-- Vérifier la structure mise à jour
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'posts' 
ORDER BY ordinal_position;
