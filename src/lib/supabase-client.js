// Client Supabase partagé pour éviter les instances multiples
// src/lib/supabase-client.js

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Variables d'environnement Supabase manquantes");
}

// Instance partagée
export const supabase = createClient(supabaseUrl, supabaseKey);
