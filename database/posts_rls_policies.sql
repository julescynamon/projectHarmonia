-- Politiques RLS pour la table posts

-- Activer RLS sur la table posts
alter table posts enable row level security;

-- Politique pour permettre aux utilisateurs de créer leurs propres articles
create policy "Users can create their own posts"
  on posts
  for insert
  to authenticated
  with check (author_id = auth.uid());

-- Politique pour permettre aux utilisateurs de lire tous les articles
create policy "Anyone can read posts"
  on posts
  for select
  to authenticated, anon
  using (true);

-- Politique pour permettre aux utilisateurs de modifier leurs propres articles
create policy "Users can update their own posts"
  on posts
  for update
  to authenticated
  using (author_id = auth.uid())
  with check (author_id = auth.uid());

-- Politique pour permettre aux utilisateurs de supprimer leurs propres articles
create policy "Users can delete their own posts"
  on posts
  for delete
  to authenticated
  using (author_id = auth.uid());
