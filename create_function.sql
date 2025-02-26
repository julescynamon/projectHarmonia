-- Fonction pour récupérer le rôle d'un utilisateur
create or replace function get_user_role(user_id uuid)
returns text
security definer
set search_path = public
language plpgsql
as $$
declare
  user_role text;
begin
  -- Récupérer le rôle depuis la table profiles
  select role into user_role
  from profiles
  where id = user_id;
  
  -- Si aucun rôle n'est trouvé, retourner 'authenticated'
  if user_role is null then
    user_role := 'authenticated';
  end if;
  
  return user_role;
end;
$$;

-- Accorder les permissions nécessaires
grant execute on function get_user_role(uuid) to authenticated;
grant execute on function get_user_role(uuid) to anon;
