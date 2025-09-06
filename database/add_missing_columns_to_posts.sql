-- Ajouter les colonnes manquantes à la table posts

-- Ajouter la colonne status
ALTER TABLE posts ADD COLUMN IF NOT EXISTS status text DEFAULT 'draft';

-- Ajouter la colonne published_at
ALTER TABLE posts ADD COLUMN IF NOT EXISTS published_at timestamp with time zone;

-- Ajouter la colonne notification_sent (utilisée par les notifications)
ALTER TABLE posts ADD COLUMN IF NOT EXISTS notification_sent boolean DEFAULT false;

-- Vérifier la structure mise à jour
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'posts' 
ORDER BY ordinal_position;
