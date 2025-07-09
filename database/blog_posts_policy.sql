-- Politique pour permettre aux admins de créer des articles
create policy "Admins can create blog posts"
  on blog_posts
  for insert
  to authenticated
  using (
    exists (
      select 1
      from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- Politique pour permettre aux admins de modifier leurs propres articles
create policy "Admins can update their own blog posts"
  on blog_posts
  for update
  to authenticated
  using (
    exists (
      select 1
      from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
    and author_id = auth.uid()
  );

-- Politique pour permettre à tout le monde de lire les articles
create policy "Anyone can read blog posts"
  on blog_posts
  for select
  to authenticated, anon
  using (true);

-- Politique pour permettre aux admins de supprimer leurs propres articles
create policy "Admins can delete their own blog posts"
  on blog_posts
  for delete
  to authenticated
  using (
    exists (
      select 1
      from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
    and author_id = auth.uid()
  );
