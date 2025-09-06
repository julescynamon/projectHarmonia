-- Vérifier l'état des RLS sur la table posts

-- Vérifier si RLS est activé
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'posts';

-- Vérifier les politiques existantes
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'posts';

-- Vérifier les permissions de l'utilisateur actuel
SELECT current_user, session_user;

-- Vérifier si l'utilisateur est dans le rôle authenticated
SELECT rolname, rolsuper, rolinherit, rolcreaterole, rolcreatedb, rolcanlogin
FROM pg_roles 
WHERE rolname = current_user;
