-- Script pour vérifier les réservations existantes
-- À exécuter dans Supabase SQL Editor

-- 1. Vérifier les services actuellement utilisés dans les réservations
SELECT 
  s.id as service_id,
  s.title as service_title,
  COUNT(a.id) as appointment_count
FROM services s
LEFT JOIN appointments a ON s.id = a.service_id
GROUP BY s.id, s.title
ORDER BY appointment_count DESC;

-- 2. Voir les détails des réservations existantes
SELECT 
  a.id as appointment_id,
  a.date,
  a.time,
  a.client_name,
  a.status,
  s.id as service_id,
  s.title as service_title
FROM appointments a
JOIN services s ON a.service_id = s.id
ORDER BY a.created_at DESC
LIMIT 10;
