import { defineMiddleware } from "astro:middleware";
import { createClient } from "@supabase/supabase-js";



export const onRequest = defineMiddleware(async (context, next) => {
  // Récupérer les cookies de la requête
  const cookiesHeader = context.request.headers.get('cookie') || '';
  
  // Créer le client Supabase avec les cookies
  const supabase = createClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
        flowType: "pkce"
      },
      global: {
        headers: cookiesHeader ? { 
          "x-use-cookies": "true",
          "Cookie": cookiesHeader
        } : { "x-use-cookies": "true" }
      }
    }
  );

  // Stocker le client Supabase dans les locals pour qu'il soit accessible partout
  context.locals.supabase = supabase;

  // Récupérer la session depuis les cookies
  let session = null;
  try {
    // Essayer de récupérer la session depuis les cookies
    const { data: { session: supabaseSession }, error } = await supabase.auth.getSession();
    
    if (!error && supabaseSession) {
      session = supabaseSession;
    } else {
      // Si pas de session Supabase, essayer de récupérer depuis nos cookies personnalisés
      const cookiesList = cookiesHeader.split(';').map(c => c.trim());
      const sbAccessTokenCookie = cookiesList.find(c => c.startsWith('sb-access-token='));
      
      if (sbAccessTokenCookie) {
        const accessToken = sbAccessTokenCookie.split('=')[1];
        if (accessToken) {
          // Vérifier le token avec Supabase
          const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken);
          if (!userError && user) {
            // Créer une session basique
            session = {
              access_token: accessToken,
              refresh_token: '',
              expires_in: 3600,
              expires_at: Math.floor(Date.now() / 1000) + 3600,
              token_type: 'bearer',
              user: user
            };
          }
        }
      }
    }

    // Rafraîchir la session si elle expire bientôt
    if (session?.expires_at) {
      const timeNow = Math.round(Date.now() / 1000);
      const expiresIn = session.expires_at - timeNow;

      if (expiresIn < 3600) {
        try {
          const refreshResult = await supabase.auth.refreshSession();
          if (refreshResult.data.session) {
            session = refreshResult.data.session;
          }
        } catch (refreshError) {
          console.error('Erreur lors du rafraîchissement de session:', refreshError);
        }
      }
    }
  } catch (error) {
    console.error('Erreur lors de la récupération de la session:', error);
    session = null;
  }

  // Stocker la session dans les locals
  context.locals.session = session;

  // Continuer vers la page
  return next();
});
