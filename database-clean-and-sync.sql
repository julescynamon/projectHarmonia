-- Script de nettoyage et synchronisation des services
-- À exécuter dans Supabase SQL Editor

-- 1. Supprimer toutes les réservations de test
DELETE FROM appointments;

-- 2. Supprimer tous les anciens services
DELETE FROM services;

-- 3. Insérer les nouveaux services avec les IDs exacts du frontend
INSERT INTO services (id, title, price, duration, description, icon, category) VALUES
('bilan-telephonique-gratuit', 'Bilan téléphonique gratuit', 0, '30min', 'Échange téléphonique gratuit : faire le point sur vos besoins et vous orienter, sans engagement.', 'phone_in_talk', 'offre-gratuite'),

-- Naturopathie Humaine
('naturopathie-humaine-premiere', 'Naturopathie Humaine – Première consultation', 70, '1h30-2h', 'Bilan complet et plan personnalisé pour rééquilibrer votre santé de façon naturelle et durable.', 'eco', 'naturopathie-humaine'),
('naturopathie-humaine-suivi', 'Naturopathie Humaine – Suivi', 50, '1h', 'Accompagnement régulier pour ajuster votre hygiène de vie et maintenir vos progrès.', 'trending_up', 'naturopathie-humaine'),

-- Naturopathie Animale
('naturopathie-animale-premiere', 'Naturopathie Animale – Première consultation', 70, '1h-2h', 'Bilan global et solutions naturelles adaptées pour améliorer la vitalité et le bien-être de votre compagnon.', 'pets', 'naturopathie-animale'),
('naturopathie-animale-suivi', 'Naturopathie Animale – Suivi', 50, '45 min', 'Suivi personnalisé pour accompagner votre animal dans la durée et ajuster son équilibre naturel.', 'healing', 'naturopathie-animale'),

-- Soins Énergétiques
('soins-energetiques-humains', 'Soins Énergétiques Humains', 90, '1h', 'Harmonisation énergétique pour libérer les blocages et retrouver paix, vitalité et équilibre.', 'self_improvement', 'soins-energetiques'),
('soins-energetiques-animaux', 'Soins Énergétiques Animaux', 180, '3h-4h', 'Soin énergétique adapté pour apaiser, rééquilibrer et soutenir la santé globale de votre animal.', 'spa', 'soins-energetiques'),
('soins-energetiques-maison-suivi', 'MAISON – Suivi', 90, '2h', 'Ajustement de l''ingénierie systémique et naturopathique, Renforcement du lien miroir par soins vibratoires croisés pour stabiliser l''harmonie du binôme et ancrer durablement la sérénité au foyer.', 'trending_up', 'soins-energetiques'),

-- Accompagnement
('accompagnement-personnalise', 'Accompagnement Personnalisé', 70, '1h', 'Séance de guidance & coaching de vie pour clarifier vos choix, dépasser vos blocages et avancer avec confiance.', 'psychology', 'accompagnement');

-- 4. Vérifier que tout est propre
SELECT 'Services créés:' as info, COUNT(*) as count FROM services
UNION ALL
SELECT 'Réservations restantes:', COUNT(*) FROM appointments;

-- 5. Afficher les services par catégorie
SELECT 
  category,
  id,
  title,
  price || '€' as price,
  duration
FROM services 
ORDER BY category, title;

-- 6. Ajouter des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_services_id ON services(id);
