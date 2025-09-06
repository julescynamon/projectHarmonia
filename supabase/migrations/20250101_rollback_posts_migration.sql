-- Script de rollback pour la migration posts
-- Date: 2025-01-01
-- Description: Permet de revenir à l'ancien système si nécessaire

-- 1. Supprimer les policies de stockage
drop policy if exists "Anyone can read blog images" on storage.objects;
drop policy if exists "Auth can upload blog images" on storage.objects;
drop policy if exists "Owner can update/delete own images" on storage.objects;
drop policy if exists "Owner can delete own images" on storage.objects;

-- 2. Supprimer le bucket de stockage (attention: cela supprime toutes les images)
-- drop policy if exists "blog-images" on storage.buckets;

-- 3. Supprimer les policies RLS de la table posts
drop policy if exists "Public read published" on posts;
drop policy if exists "Authors full access own posts" on posts;

-- 4. Supprimer les triggers
drop trigger if exists update_posts_updated_at on posts;
drop function if exists update_updated_at_column();

-- 5. Supprimer les fonctions
drop function if exists generate_unique_slug(text, uuid);

-- 6. Supprimer les index
drop index if exists posts_published_idx;
drop index if exists posts_author_idx;
drop index if exists posts_slug_idx;

-- 7. Supprimer la table posts
drop table if exists posts;

-- 8. Supprimer le type enum
drop type if exists post_status;

-- Note: Ce script ne restaure pas les données, il supprime seulement la nouvelle structure
-- Les données originales dans blog_posts restent intactes
