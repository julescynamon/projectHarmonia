-- Nettoyage : supprimer la table blog_posts obsolète

-- 1. Vérifier qu'il n'y a pas de données importantes dans blog_posts
SELECT 'blog_posts count:' as info, COUNT(*) as count FROM blog_posts;

-- 2. Supprimer la table blog_posts
DROP TABLE IF EXISTS blog_posts;

-- 3. Vérifier que posts contient bien les données
SELECT 'posts count:' as info, COUNT(*) as count FROM posts;
SELECT 'posts structure:' as info;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'posts' 
ORDER BY ordinal_position;
