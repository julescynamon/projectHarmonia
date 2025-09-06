-- Migration pour créer la nouvelle table posts avec support TipTap
-- Date: 2025-01-01
-- Description: Remplace blog_posts par posts avec support JSONB pour TipTap

-- 1. Créer le type enum pour le statut
create type if not exists post_status as enum ('draft', 'published');

-- 2. Créer la nouvelle table posts
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text,
  cover_url text,
  cover_alt text,
  content jsonb not null default '{}'::jsonb, -- TipTap JSON
  status post_status not null default 'draft',
  published_at timestamptz,
  author_id uuid references auth.users(id) on delete set null,
  tags text[] default '{}',
  seo_title text,
  seo_description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Créer les index pour les performances
create index if not exists posts_published_idx on posts (status, published_at desc);
create index if not exists posts_author_idx on posts (author_id);
create index if not exists posts_slug_idx on posts (slug);

-- 4. Activer RLS
alter table posts enable row level security;

-- 5. Créer les policies RLS
create policy "Public read published" on posts
  for select using (status = 'published');

create policy "Authors full access own posts" on posts
  for all using (auth.uid() = author_id) with check (auth.uid() = author_id);

-- 6. Créer le bucket de stockage pour les images
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('blog-images', 'blog-images', true, 10485760, array['image/*'])
on conflict (id) do nothing;

-- 7. Créer les policies de stockage
create policy "Anyone can read blog images"
on storage.objects for select
to public using (bucket_id = 'blog-images');

create policy "Auth can upload blog images"
on storage.objects for insert
to authenticated with check (bucket_id = 'blog-images');

create policy "Owner can update/delete own images"
on storage.objects for update using (bucket_id = 'blog-images' and owner = auth.uid())
with check (bucket_id = 'blog-images' and owner = auth.uid());

create policy "Owner can delete own images"
on storage.objects for delete using (bucket_id = 'blog-images' and owner = auth.uid());

-- 8. Fonction pour générer des slugs uniques
create or replace function generate_unique_slug(title text, exclude_id uuid default null)
returns text as $$
declare
  base_slug text;
  final_slug text;
  counter integer := 0;
begin
  -- Générer le slug de base
  base_slug := lower(
    regexp_replace(
      regexp_replace(title, '[^a-zA-Z0-9\s-]', '', 'g'),
      '\s+',
      '-',
      'g'
    )
  );
  
  final_slug := base_slug;
  
  -- Vérifier l'unicité et ajouter un compteur si nécessaire
  while exists(
    select 1 from posts 
    where slug = final_slug 
    and (exclude_id is null or id != exclude_id)
  ) loop
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  end loop;
  
  return final_slug;
end;
$$ language plpgsql;

-- 9. Trigger pour mettre à jour updated_at automatiquement
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_posts_updated_at
  before update on posts
  for each row
  execute function update_updated_at_column();
