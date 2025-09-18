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
export const createServerClient = (cookies?: string) => {
  // Extraire le token d'accès des cookies si présent
  let accessToken = null;
  if (cookies) {
    const cookiesList = cookies.split(';').map(c => c.trim());
    
    // Essayer différents formats de cookies
    const cookiePatterns = [
      'sb-access-token=',
      'supabase.auth.token=',
      'sb-hvthtebjvmutuvzvttdb-auth-token=', // Pattern spécifique au projet
      'supabase-auth-token='
    ];
    
    for (const pattern of cookiePatterns) {
      const cookie = cookiesList.find(c => c.startsWith(pattern));
      if (cookie) {
        try {
          if (pattern === 'supabase.auth.token=') {
            const tokenValue = cookie.substring(pattern.length);
            const decodedToken = decodeURIComponent(tokenValue);
            const sessionData = JSON.parse(decodedToken);
            accessToken = sessionData.access_token;
          } else {
            accessToken = cookie.split('=')[1];
          }
          if (accessToken) {
            break;
          }
        } catch (e) {
          console.error('Erreur décodage cookie:', pattern, e);
        }
      }
    }
  }
  
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      flowType: 'pkce'
    },
    global: {
      headers: accessToken ? {
        Authorization: `Bearer ${accessToken}`
      } : {}
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
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: { "x-use-cookies": "true" } // Force l'utilisation des cookies
  }
});
