-- Migration des données de blog_posts vers posts
-- Date: 2025-01-01
-- Description: Transfère les articles existants vers la nouvelle structure

-- 1. Insérer les données existantes dans la nouvelle table
insert into posts (
  id,
  title,
  slug,
  excerpt,
  content,
  status,
  published_at,
  author_id,
  created_at,
  updated_at
)
select 
  id,
  title,
  slug,
  summary as excerpt,
  -- Convertir le contenu Markdown en JSON TipTap basique
  jsonb_build_object(
    'type', 'doc',
    'content', jsonb_build_array(
      jsonb_build_object(
        'type', 'paragraph',
        'content', jsonb_build_array(
          jsonb_build_object(
            'type', 'text',
            'text', content
          )
        )
      )
    )
  ) as content,
  'published'::post_status as status,
  created_at as published_at,
  author_id,
  created_at,
  updated_at
from blog_posts
where not exists (
  select 1 from posts where posts.id = blog_posts.id
);

-- 2. Vérifier que la migration s'est bien passée
-- Cette requête doit retourner le même nombre d'articles
-- select count(*) as posts_count from posts;
-- select count(*) as blog_posts_count from blog_posts;

-- 3. Note: Ne pas supprimer blog_posts immédiatement pour permettre un rollback
-- La suppression se fera après validation complète du nouveau système
