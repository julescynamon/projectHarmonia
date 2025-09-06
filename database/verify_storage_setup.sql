-- Vérifier la configuration du storage Supabase
-- database/verify_storage_setup.sql

-- 1. Vérifier que le bucket blog-images existe
SELECT 
  name as bucket_name,
  public as is_public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets 
WHERE name = 'blog-images';

-- 2. Vérifier les politiques RLS sur le bucket
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
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND qual LIKE '%blog-images%';

-- 3. Vérifier les permissions sur le bucket
SELECT 
  grantee,
  privilege_type,
  is_grantable
FROM information_schema.role_table_grants 
WHERE table_name = 'objects' 
AND table_schema = 'storage';

-- 4. Lister les fichiers existants (s'il y en a)
SELECT 
  name,
  bucket_id,
  owner,
  created_at,
  updated_at,
  last_accessed_at,
  metadata
FROM storage.objects 
WHERE bucket_id = 'blog-images'
ORDER BY created_at DESC
LIMIT 10;
