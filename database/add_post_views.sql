-- Compteur de vues des articles de blog
create table if not exists public.post_views (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  visitor_fingerprint text not null,
  created_at timestamptz not null default now()
);

create index if not exists post_views_post_id_idx on public.post_views(post_id);
create index if not exists post_views_created_at_idx on public.post_views(created_at desc);
create index if not exists post_views_fingerprint_idx on public.post_views(visitor_fingerprint);
