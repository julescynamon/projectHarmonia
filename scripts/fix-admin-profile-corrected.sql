-- Script corrigé pour la table profiles (sans colonne email)
-- scripts/fix-admin-profile-corrected.sql

-- 1. Vérifier l'utilisateur tyzranaima@gmail.com
SELECT 
    id,
    email,
    created_at,
    updated_at
FROM auth.users 
WHERE email = 'tyzranaima@gmail.com';

-- 2. Vérifier les profils existants
SELECT 
    id,
    role,
    created_at
FROM profiles 
LIMIT 5;

-- 3. Créer le profil admin pour tyzranaima@gmail.com
-- (Adapté à la structure réelle : id, role, created_at)
INSERT INTO profiles (
    id,
    role,
    created_at
) VALUES (
    '16343c97-e11d-416f-b64c-e43933d19d45',
    'admin',
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    role = 'admin';

-- 4. Vérifier que le profil a été créé
SELECT 
    id,
    role,
    created_at
FROM profiles 
WHERE id = '16343c97-e11d-416f-b64c-e43933d19d45';

-- 5. Vérifier les politiques RLS sur la table profiles
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'profiles';
