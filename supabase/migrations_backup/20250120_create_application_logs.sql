-- Migration pour créer la table application_logs
-- Cette table stocke les logs structurés de l'application

-- Créer la table application_logs
CREATE TABLE IF NOT EXISTS application_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    level TEXT NOT NULL CHECK (level IN ('fatal', 'error', 'warn', 'info', 'debug', 'trace')),
    message TEXT,
    request_id TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_id TEXT,
    method TEXT,
    path TEXT,
    user_agent TEXT,
    ip_address INET,
    status_code INTEGER,
    duration_ms INTEGER,
    error_name TEXT,
    error_message TEXT,
    error_stack TEXT,
    context JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Créer des index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_application_logs_timestamp ON application_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_application_logs_level ON application_logs(level);
CREATE INDEX IF NOT EXISTS idx_application_logs_user_id ON application_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_application_logs_request_id ON application_logs(request_id);
CREATE INDEX IF NOT EXISTS idx_application_logs_path ON application_logs(path);
CREATE INDEX IF NOT EXISTS idx_application_logs_status_code ON application_logs(status_code);

-- Index pour les requêtes de recherche dans le contexte JSON
CREATE INDEX IF NOT EXISTS idx_application_logs_context_gin ON application_logs USING GIN(context);
CREATE INDEX IF NOT EXISTS idx_application_logs_metadata_gin ON application_logs USING GIN(metadata);

-- Fonction pour nettoyer automatiquement les anciens logs
CREATE OR REPLACE FUNCTION cleanup_old_logs(days_to_keep INTEGER DEFAULT 30)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM application_logs 
    WHERE timestamp < NOW() - INTERVAL '1 day' * days_to_keep;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    -- Logger le nettoyage
    INSERT INTO application_logs (level, message, context)
    VALUES ('info', 'Nettoyage automatique des logs', 
            jsonb_build_object('deleted_count', deleted_count, 'days_to_keep', days_to_keep));
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Créer un trigger pour nettoyer automatiquement les logs tous les jours
-- (Cette fonction sera appelée par un cron job ou un script externe)
CREATE OR REPLACE FUNCTION schedule_log_cleanup()
RETURNS void AS $$
BEGIN
    -- Cette fonction peut être appelée par un cron job
    -- Exemple: SELECT schedule_log_cleanup();
    PERFORM cleanup_old_logs(30);
END;
$$ LANGUAGE plpgsql;

-- Politique RLS pour sécuriser l'accès aux logs
ALTER TABLE application_logs ENABLE ROW LEVEL SECURITY;

-- Seuls les administrateurs peuvent voir tous les logs
CREATE POLICY "Admins can view all logs" ON application_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Seuls les administrateurs peuvent insérer des logs
CREATE POLICY "Admins can insert logs" ON application_logs
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Seuls les administrateurs peuvent supprimer des logs
CREATE POLICY "Admins can delete logs" ON application_logs
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Fonction pour obtenir des statistiques sur les logs
CREATE OR REPLACE FUNCTION get_log_statistics(
    start_date TIMESTAMPTZ DEFAULT NOW() - INTERVAL '24 hours',
    end_date TIMESTAMPTZ DEFAULT NOW()
)
RETURNS TABLE (
    level TEXT,
    count BIGINT,
    avg_duration_ms NUMERIC,
    error_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        l.level,
        COUNT(*) as count,
        AVG(l.duration_ms) as avg_duration_ms,
        COUNT(CASE WHEN l.level IN ('error', 'fatal') THEN 1 END) as error_count
    FROM application_logs l
    WHERE l.timestamp BETWEEN start_date AND end_date
    GROUP BY l.level
    ORDER BY l.level;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour obtenir les erreurs récentes
CREATE OR REPLACE FUNCTION get_recent_errors(limit_count INTEGER DEFAULT 50)
RETURNS TABLE (
    id UUID,
    timestamp TIMESTAMPTZ,
    message TEXT,
    error_name TEXT,
    error_message TEXT,
    path TEXT,
    user_id UUID
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        l.id,
        l.timestamp,
        l.message,
        l.error_name,
        l.error_message,
        l.path,
        l.user_id
    FROM application_logs l
    WHERE l.level IN ('error', 'fatal')
    ORDER BY l.timestamp DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Commentaires pour documenter la table
COMMENT ON TABLE application_logs IS 'Table pour stocker les logs structurés de l''application';
COMMENT ON COLUMN application_logs.level IS 'Niveau de log (fatal, error, warn, info, debug, trace)';
COMMENT ON COLUMN application_logs.context IS 'Contexte JSON additionnel du log';
COMMENT ON COLUMN application_logs.metadata IS 'Métadonnées JSON additionnelles';
COMMENT ON COLUMN application_logs.duration_ms IS 'Durée de traitement de la requête en millisecondes'; 