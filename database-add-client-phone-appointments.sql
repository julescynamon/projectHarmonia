-- Colonne téléphone pour les réservations (formulaire / e-mails / admin)
-- À exécuter une fois dans Supabase SQL Editor

ALTER TABLE public.appointments
ADD COLUMN IF NOT EXISTS client_phone TEXT;

COMMENT ON COLUMN public.appointments.client_phone IS 'Numéro fourni par le client à la réservation';
