-- Script pour diagnostiquer et corriger la table profiles
-- scripts/fix-admin-profile.sql

-- 1. Vérifier la structure actuelle de la table profiles
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- 2. Vérifier si l'utilisateur tyzranaima@gmail.com existe
SELECT 
    id,
    email,
    created_at,
    updated_at
FROM auth.users 
WHERE email = 'tyzranaima@gmail.com';

-- 3. Vérifier les profils existants
SELECT 
    id,
    full_name,
    role,
    created_at,
    updated_at
FROM profiles 
LIMIT 5;

-- 4. Créer le profil admin pour tyzranaima@gmail.com
-- (Adapter selon la structure réelle de la table)

-- Option A: Si la table profiles a une colonne email
INSERT INTO profiles (
    id,
    email,
    full_name,
    role,
    created_at,
    updated_at
) VALUES (
    '16343c97-e11d-416f-b64c-e43933d19d45',
    'tyzranaima@gmail.com',
    'Naïma Admin',
    'admin',
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    role = 'admin',
    full_name = 'Naïma Admin',
    updated_at = NOW();

-- Option B: Si la table profiles n'a PAS de colonne email
INSERT INTO profiles (
    id,
    full_name,
    role,
    created_at,
    updated_at
) VALUES (
    '16343c97-e11d-416f-b64c-e43933d19d45',
    'Naïma Admin',
    'admin',
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    role = 'admin',
    full_name = 'Naïma Admin',
    updated_at = NOW();

-- 5. Vérifier que le profil a été créé
SELECT 
    id,
    full_name,
    role,
    created_at,
    updated_at
FROM profiles 
WHERE id = '16343c97-e11d-416f-b64c-e43933d19d45';

-- 6. Vérifier les politiques RLS sur la table profiles
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
