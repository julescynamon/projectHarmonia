-- Create profiles table
create table if not exists profiles (
    id uuid references auth.users on delete cascade primary key,
    email text unique not null,
    role text not null default 'user',
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Enable RLS
alter table profiles enable row level security;

-- Create policies
create policy "Allow public read-only access"
    on profiles for select
    to authenticated
    using (true);

create policy "Allow users to update their own profile"
    on profiles for update
    to authenticated
    using (auth.uid() = id)
    with check (auth.uid() = id);

-- Create function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (id, email, role)
    values (new.id, new.email, 'user');
    return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user signup
create or replace trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();
