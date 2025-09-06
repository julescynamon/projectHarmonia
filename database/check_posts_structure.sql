-- Vérifier la structure des tables

-- Structure de la table posts
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'posts' 
ORDER BY ordinal_position;

-- Structure de la table blog_posts
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'blog_posts' 
ORDER BY ordinal_position;
