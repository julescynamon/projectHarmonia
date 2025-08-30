-- Fonction pour récupérer toutes les périodes bloquées (contourne RLS)
CREATE OR REPLACE FUNCTION get_all_blocked_times()
RETURNS TABLE (
  id uuid,
  start_date date,
  end_date date,
  start_time time,
  end_time time,
  reason text,
  created_at timestamptz,
  created_by uuid
) 
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    id,
    start_date,
    end_date,
    start_time,
    end_time,
    reason,
    created_at,
    created_by
  FROM blocked_times
  ORDER BY start_date, start_time;
$$;

-- Donner les permissions d'exécution
GRANT EXECUTE ON FUNCTION get_all_blocked_times() TO anon;
GRANT EXECUTE ON FUNCTION get_all_blocked_times() TO authenticated;
