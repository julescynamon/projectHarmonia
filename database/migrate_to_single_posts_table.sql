-- Migration vers une seule table posts
-- Ce script migre les données de blog_posts vers posts et met à jour les références

-- 1. Vérifier les données existantes
SELECT 'blog_posts count:' as info, COUNT(*) as count FROM blog_posts
UNION ALL
SELECT 'posts count:', COUNT(*) FROM posts;

-- 2. Migrer les données de blog_posts vers posts (en évitant les doublons)
INSERT INTO posts (
  id, title, slug, summary, content, category, image_url, 
  author_id, created_at, updated_at, status, published_at
)
SELECT 
  id, title, slug, summary, content, category, image_url,
  author_id, created_at, updated_at,
  CASE 
    WHEN published_at IS NOT NULL THEN 'published'
    ELSE 'draft'
  END as status,
  published_at
FROM blog_posts
WHERE id NOT IN (SELECT id FROM posts);

-- 3. Vérifier la migration
SELECT 'posts after migration:' as info, COUNT(*) as count FROM posts;

-- 4. Vérifier qu'il n'y a pas de doublons
SELECT id, COUNT(*) as duplicates
FROM posts 
GROUP BY id 
HAVING COUNT(*) > 1;
