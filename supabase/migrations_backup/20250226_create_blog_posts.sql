-- Create blog posts table
create table public.blog_posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text not null unique,
  content text not null,
  summary text not null,
  image_url text not null,
  category text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  author_id uuid references auth.users not null
);

-- Enable RLS
alter table public.blog_posts enable row level security;

-- Create policies
create policy "Public blog posts are viewable by everyone" on public.blog_posts
  for select using (true);

create policy "Only admins can insert blog posts" on public.blog_posts
  for insert with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "Only admins can update blog posts" on public.blog_posts
  for update using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "Only admins can delete blog posts" on public.blog_posts
  for delete using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- Create function to generate slug
create or replace function generate_slug(title text)
returns text as $$
begin
  return lower(
    regexp_replace(
      regexp_replace(title, '[^a-zA-Z0-9\s-]', '', 'g'),
      '\s+',
      '-',
      'g'
    )
  );
end;
$$ language plpgsql;
