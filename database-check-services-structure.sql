-- Script pour vérifier et corriger la structure de la table services
-- À exécuter dans Supabase SQL Editor

-- 1. Vérifier la structure actuelle de la table services
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'services' 
ORDER BY ordinal_position;

-- 2. Ajouter la colonne category si elle n'existe pas
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS category TEXT;

-- 3. Ajouter des contraintes pour la cohérence des données
ALTER TABLE services 
ALTER COLUMN id SET NOT NULL,
ALTER COLUMN title SET NOT NULL,
ALTER COLUMN price SET NOT NULL;

-- 4. Créer une contrainte pour les catégories valides
ALTER TABLE services 
DROP CONSTRAINT IF EXISTS services_category_check;

ALTER TABLE services 
ADD CONSTRAINT services_category_check 
CHECK (category IN ('naturopathie-humaine', 'naturopathie-animale', 'soins-energetiques', 'accompagnement'));

-- 5. Vérifier la structure finale
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'services' 
ORDER BY ordinal_position;
