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

// Créer un client Supabase pour le navigateur avec localStorage
export const createBrowserClient = () => {
  if (!isBrowser) return null;
  
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      storage: {
        getItem: (key) => localStorage.getItem(key),
        setItem: (key, value) => localStorage.setItem(key, value),
        removeItem: (key) => localStorage.removeItem(key),
      },
    },
  });
};

// Créer un client Supabase pour le serveur sans storage
export const createServerClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
};

// Export le client approprié selon l'environnement
export const supabase = isBrowser ? createBrowserClient() : createServerClient();
