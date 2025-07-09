-- First, drop everything to start fresh
drop trigger if exists set_updated_at on newsletter_subscribers;
drop function if exists set_updated_at();
drop table if exists newsletter_subscribers;

-- Create the table
create table newsletter_subscribers (
    id uuid default gen_random_uuid() primary key,
    email text unique not null,
    confirmed boolean default false,
    confirmation_token uuid,
    token_expires_at timestamp with time zone,
    confirmed_at timestamp with time zone,
    unsubscribed boolean default false,
    unsubscribed_at timestamp with time zone,
    consent_timestamp timestamp with time zone not null,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Create a custom function for updating the timestamp
create or replace function set_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Create the trigger using our custom function
create trigger set_updated_at
    before update on newsletter_subscribers
    for each row
    execute function set_updated_at();
