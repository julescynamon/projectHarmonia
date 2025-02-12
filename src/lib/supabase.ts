import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Supabase environment variables are missing. Please check your .env file."
  );
  throw new Error("Missing Supabase environment variables");
}

// Validate URL format
try {
  new URL(supabaseUrl);
} catch (e) {
  console.error("Invalid Supabase URL format. Please check your .env file.");
  throw new Error("Invalid Supabase URL");
}

const isBrowser = typeof window !== 'undefined';

// Créer un client Supabase pour le navigateur
export const createBrowserClient = () => {
  if (!isBrowser) return null;
  
  let storage;
  try {
    storage = window.localStorage;
  } catch (e) {
    console.warn('LocalStorage non disponible:', e);
    storage = null;
  }
  
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storage: storage || undefined,
      storageKey: 'supabase.auth.token'
    }
  });
};

// Créer un client Supabase pour le serveur
export const createServerClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      flowType: 'pkce'
    }
  });
};

// Export le client approprié selon l'environnement
// Créer un client Supabase avec des options spécifiques pour l'API
export const createServiceClient = (accessToken?: string) => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    global: {
      headers: accessToken ? {
        Authorization: `Bearer ${accessToken}`
      } : {}
    }
  });
};

// Client par défaut pour le navigateur
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true
  }
});
