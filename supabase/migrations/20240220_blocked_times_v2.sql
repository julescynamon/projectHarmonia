-- Create blocked_times table
create table if not exists blocked_times (
    id uuid default uuid_generate_v4() primary key,
    start_date date not null,
    end_date date not null,
    start_time time not null,
    end_time time not null,
    reason text,
    created_at timestamptz default now(),
    created_by uuid references auth.users(id) not null default auth.uid()
);

-- Enable RLS
alter table blocked_times enable row level security;

-- Create policies
-- Admins can insert new blocked times
create policy "Allow admins to insert blocked times"
    on blocked_times for insert
    to authenticated
    using (
        exists (
            select 1 from profiles
            where id = auth.uid()
            and role = 'admin'
        )
    );

-- Admins can update blocked times
create policy "Allow admins to update blocked times"
    on blocked_times for update
    to authenticated
    using (
        exists (
            select 1 from profiles
            where id = auth.uid()
            and role = 'admin'
        )
    );

-- Admins can delete blocked times
create policy "Allow admins to delete blocked times"
    on blocked_times for delete
    to authenticated
    using (
        exists (
            select 1 from profiles
            where id = auth.uid()
            and role = 'admin'
        )
    );

-- Everyone can view blocked times
create policy "Allow public to view blocked times"
    on blocked_times for select
    to authenticated
    using (true);
