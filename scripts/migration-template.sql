-- Migration: [DESCRIPTION]
-- Date: [DATE]
-- Auteur: [AUTHOR]
-- Version: [VERSION]
-- Type: [CREATE|ALTER|DROP|DATA]

-- =====================================================
-- DESCRIPTION: [Description détaillée de la migration]
-- =====================================================

-- OBJECTIFS:
-- - [Objectif 1]
-- - [Objectif 2]
-- - [Objectif 3]

-- IMPACT:
-- - [Impact sur les performances]
-- - [Impact sur les données existantes]
-- - [Impact sur les autres tables/fonctions]

-- =====================================================
-- MIGRATION SQL
-- =====================================================

-- Exemple de création de table
-- CREATE TABLE IF NOT EXISTS nom_table (
--     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
--     nom VARCHAR(255) NOT NULL,
--     email VARCHAR(255) UNIQUE NOT NULL,
--     actif BOOLEAN DEFAULT true,
--     created_at TIMESTAMPTZ DEFAULT NOW(),
--     updated_at TIMESTAMPTZ DEFAULT NOW()
-- );

-- Exemple d'ajout de colonne
-- ALTER TABLE nom_table 
-- ADD COLUMN IF NOT EXISTS nouvelle_colonne VARCHAR(100);

-- Exemple de création d'index
-- CREATE INDEX IF NOT EXISTS idx_nom_table_email ON nom_table(email);
-- CREATE INDEX IF NOT EXISTS idx_nom_table_actif ON nom_table(actif) WHERE actif = true;

-- Exemple de création de fonction
-- CREATE OR REPLACE FUNCTION update_updated_at_column()
-- RETURNS TRIGGER AS $$
-- BEGIN
--     NEW.updated_at = NOW();
--     RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;

-- Exemple de trigger
-- CREATE TRIGGER trigger_update_nom_table_updated_at
--     BEFORE UPDATE ON nom_table
--     FOR EACH ROW
--     EXECUTE FUNCTION update_updated_at_column();

-- Exemple de politique RLS
-- ALTER TABLE nom_table ENABLE ROW LEVEL SECURITY;
-- 
-- CREATE POLICY "Users can view their own data" ON nom_table
--     FOR SELECT USING (auth.uid() = user_id);
-- 
-- CREATE POLICY "Users can update their own data" ON nom_table
--     FOR UPDATE USING (auth.uid() = user_id);

-- Exemple d'insertion de données de test
-- INSERT INTO nom_table (nom, email) VALUES
--     ('Test User 1', 'test1@example.com'),
--     ('Test User 2', 'test2@example.com')
-- ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- VALIDATION
-- =====================================================

-- Vérifications à effectuer après la migration
-- SELECT COUNT(*) FROM nom_table;
-- SELECT * FROM nom_table LIMIT 5;

-- =====================================================
-- ROLLBACK (optionnel - pour les migrations complexes)
-- =====================================================

-- Instructions de rollback (à décommenter si nécessaire)
-- DROP TABLE IF EXISTS nom_table CASCADE;
-- DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- =====================================================
-- NOTES ET COMMENTAIRES
-- =====================================================

-- [Ajoutez ici des notes importantes, des avertissements, 
--  des dépendances, ou des informations pour les développeurs]

-- BONNES PRATIQUES:
-- ✅ Utilisez IF NOT EXISTS pour éviter les erreurs
-- ✅ Utilisez IF EXISTS pour les suppressions
-- ✅ Ajoutez des index pour les colonnes fréquemment utilisées
-- ✅ Activez RLS sur toutes les tables utilisateur
-- ✅ Documentez les politiques de sécurité
-- ✅ Testez les migrations sur un environnement de développement
-- ✅ Utilisez des transactions pour les migrations complexes
-- ✅ Ajoutez des commentaires explicatifs

-- ÉVITEZ:
-- ❌ DROP TABLE sans sauvegarde
-- ❌ Modifications de données sans WHERE
-- ❌ Suppression d'index sans vérification d'impact
-- ❌ Migrations sans rollback planifié
-- ❌ Code SQL non documenté 