-- Migration pour ajouter les colonnes manquantes à la table appointments
-- À exécuter dans Supabase SQL Editor

-- Ajouter les colonnes pour l'approbation/refus
ALTER TABLE appointments 
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Mettre à jour la contrainte CHECK pour inclure les nouveaux statuts
ALTER TABLE appointments DROP CONSTRAINT IF EXISTS appointments_status_check;

ALTER TABLE appointments 
ADD CONSTRAINT appointments_status_check 
CHECK (status IN ('pending_approval', 'pending', 'confirmed', 'refused', 'cancelled'));

-- Ajouter des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);
CREATE INDEX IF NOT EXISTS idx_appointments_created_at ON appointments(created_at);

-- Commentaire sur les nouveaux statuts
COMMENT ON COLUMN appointments.status IS 'Statuts: pending_approval (en attente d''approbation), pending (en attente de paiement), confirmed (confirmé), refused (refusé), cancelled (annulé)';
COMMENT ON COLUMN appointments.approved_at IS 'Date et heure d''approbation de la réservation';
COMMENT ON COLUMN appointments.rejected_at IS 'Date et heure de refus de la réservation';
COMMENT ON COLUMN appointments.rejection_reason IS 'Motif du refus de la réservation';
