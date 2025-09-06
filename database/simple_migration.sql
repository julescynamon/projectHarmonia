-- Migration simple vers la table posts
-- Ce script s'adapte à la structure existante

-- 1. Vérifier les données existantes
SELECT 'blog_posts count:' as info, COUNT(*) as count FROM blog_posts
UNION ALL
SELECT 'posts count:', COUNT(*) FROM posts;

-- 2. Migrer les données de base (colonnes communes)
INSERT INTO posts (
  id, title, slug, content, category, image_url, 
  author_id, created_at, updated_at
)
SELECT 
  id, title, slug, content, category, image_url,
  author_id, created_at, updated_at
FROM blog_posts
WHERE id NOT IN (SELECT id FROM posts);

-- 3. Vérifier la migration
SELECT 'posts after migration:' as info, COUNT(*) as count FROM posts;
