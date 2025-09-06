-- Vérifier la structure actuelle de la table posts

SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'posts' 
ORDER BY ordinal_position;
