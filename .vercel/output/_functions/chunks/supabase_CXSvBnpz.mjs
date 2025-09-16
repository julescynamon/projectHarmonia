import { c as createClient } from './index_DeVVxtlF.mjs';

const supabaseUrl = "https://hvthtebjvmutuvzvttdb.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2dGh0ZWJqdm11dHV2enZ0dGRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY2OTM5NTgsImV4cCI6MjA1MjI2OTk1OH0.gpI9njtvd6Mu_0wTnwfvtx0bFpUDNexuzwu3hgOGDdY";
try {
  new URL(supabaseUrl);
} catch (e) {
  console.error("Invalid Supabase URL format. Please check your .env file.");
  throw new Error("Invalid Supabase URL");
}
const createServerClient = (cookies) => {
  let accessToken = null;
  if (cookies) {
    const cookiesList = cookies.split(";").map((c) => c.trim());
    const sbAccessTokenCookie = cookiesList.find((c) => c.startsWith("sb-access-token="));
    if (sbAccessTokenCookie) {
      accessToken = sbAccessTokenCookie.split("=")[1];
    }
    if (!accessToken) {
      const supabaseAuthTokenCookie = cookiesList.find((c) => c.startsWith("supabase.auth.token="));
      if (supabaseAuthTokenCookie) {
        try {
          const tokenValue = supabaseAuthTokenCookie.substring("supabase.auth.token=".length);
          const decodedToken = decodeURIComponent(tokenValue);
          const sessionData = JSON.parse(decodedToken);
          accessToken = sessionData.access_token;
        } catch (e) {
          console.error("Erreur lors du décodage du cookie de session:", e);
        }
      }
    }
  }
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      flowType: "pkce"
    },
    global: {
      headers: accessToken ? {
        Authorization: `Bearer ${accessToken}`
      } : {}
    }
  });
};
const createServiceClient = (accessToken) => {
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
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: "pkce"
  },
  global: {
    headers: { "x-use-cookies": "true" }
    // Force l'utilisation des cookies
  }
});

export { createServiceClient as a, createServerClient as c, supabase as s };
