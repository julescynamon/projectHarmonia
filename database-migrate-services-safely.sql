-- Script de migration sécurisée des services
-- À exécuter dans Supabase SQL Editor

-- 1. Désactiver temporairement la contrainte de clé étrangère
ALTER TABLE appointments 
DROP CONSTRAINT IF EXISTS appointments_service_id_fkey;

-- 2. Supprimer les anciens services (maintenant possible)
DELETE FROM services;

-- 3. Insérer les nouveaux services avec les IDs exacts du frontend
INSERT INTO services (id, title, price, duration, description, category) VALUES
-- Naturopathie Humaine
('naturopathie-humaine-premiere', 'Naturopathie Humaine – Première consultation', 150, '1h30-2h', 'Bilan complet et plan personnalisé pour rééquilibrer votre santé de façon naturelle et durable.', 'naturopathie-humaine'),
('naturopathie-humaine-suivi', 'Naturopathie Humaine – Suivi', 60, '1h', 'Accompagnement régulier pour ajuster votre hygiène de vie et maintenir vos progrès.', 'naturopathie-humaine'),

-- Naturopathie Animale
('naturopathie-animale-premiere', 'Naturopathie Animale – Première consultation', 80, '1h15', 'Bilan global et solutions naturelles adaptées pour améliorer la vitalité et le bien-être de votre compagnon.', 'naturopathie-animale'),
('naturopathie-animale-suivi', 'Naturopathie Animale – Suivi', 50, '45 min', 'Suivi personnalisé pour accompagner votre animal dans la durée et ajuster son équilibre naturel.', 'naturopathie-animale'),

-- Soins Énergétiques
('soins-energetiques-humains', 'Soins Énergétiques Humains', 90, '1h', 'Harmonisation énergétique pour libérer les blocages et retrouver paix, vitalité et équilibre.', 'soins-energetiques'),
('soins-energetiques-animaux', 'Soins Énergétiques Animaux', 50, '45 min – 1h', 'Soin énergétique adapté pour apaiser, rééquilibrer et soutenir la santé globale de votre animal.', 'soins-energetiques'),

-- Accompagnement
('accompagnement-personnalise', 'Accompagnement Personnalisé', 70, '1h', 'Séance de guidance & coaching de vie pour clarifier vos choix, dépasser vos blocages et avancer avec confiance.', 'accompagnement');

-- 4. Mettre à jour les réservations existantes pour pointer vers un service valide
-- (On les redirige vers le service le plus proche : naturopathie-humaine-premiere)
UPDATE appointments 
SET service_id = 'naturopathie-humaine-premiere'
WHERE service_id NOT IN (
  SELECT id FROM services
);

-- 5. Recréer la contrainte de clé étrangère
ALTER TABLE appointments 
ADD CONSTRAINT appointments_service_id_fkey 
FOREIGN KEY (service_id) REFERENCES services(id);

-- 6. Vérifier que tout fonctionne
SELECT 
  s.id as service_id,
  s.title as service_title,
  s.category,
  COUNT(a.id) as appointment_count
FROM services s
LEFT JOIN appointments a ON s.id = a.service_id
GROUP BY s.id, s.title, s.category
ORDER BY s.category, s.title;

-- 7. Ajouter des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_services_id ON services(id);
