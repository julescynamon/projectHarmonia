-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create cron schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS cron;

-- Create cache table
CREATE TABLE IF NOT EXISTS cache (
    key TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_in INTEGER,
    size BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE cache ENABLE ROW LEVEL SECURITY;

-- Create policy for service role
CREATE POLICY "Service role can do everything" ON cache
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Create function to clean expired cache entries
CREATE OR REPLACE FUNCTION clean_expired_cache()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    DELETE FROM cache
    WHERE expires_in IS NOT NULL
    AND created_at + (expires_in || ' seconds')::INTERVAL < CURRENT_TIMESTAMP;
END;
$$;

-- Schedule the cleanup job to run every hour
SELECT cron.schedule(
    'clean-expired-cache',
    '0 * * * *',  -- Every hour at minute 0
    'SELECT clean_expired_cache()'
); 