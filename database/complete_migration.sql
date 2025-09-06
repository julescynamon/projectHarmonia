-- Migration complète vers la table posts
-- Ce script gère toutes les différences entre blog_posts et posts

-- 1. Vérifier les données existantes
SELECT 'blog_posts count:' as info, COUNT(*) as count FROM blog_posts
UNION ALL
SELECT 'posts count:', COUNT(*) FROM posts;

-- 2. Migrer les données en adaptant les colonnes
INSERT INTO posts (
  id, title, slug, excerpt, cover_url, content, category, 
  author_id, created_at, updated_at, status, published_at
)
SELECT 
  id, 
  title, 
  slug, 
  summary as excerpt,  -- blog_posts.summary -> posts.excerpt
  image_url as cover_url,  -- blog_posts.image_url -> posts.cover_url
  content::jsonb,  -- Convertir text en jsonb
  category,
  author_id, 
  created_at, 
  updated_at,
  'draft'::post_status as status,  -- Par défaut en brouillon
  NULL as published_at  -- Pas de date de publication pour les articles migrés
FROM blog_posts
WHERE id NOT IN (SELECT id FROM posts);

-- 3. Vérifier la migration
SELECT 'posts after migration:' as info, COUNT(*) as count FROM posts;

-- 4. Vérifier qu'il n'y a pas de doublons
SELECT id, COUNT(*) as duplicates
FROM posts 
GROUP BY id 
HAVING COUNT(*) > 1;
