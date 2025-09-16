import { c as createClient } from './index_DeVVxtlF.mjs';

const supabaseUrl = "https://hvthtebjvmutuvzvttdb.supabase.co";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export { supabase as s };
