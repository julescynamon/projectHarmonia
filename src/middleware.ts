import { defineMiddleware } from "astro:middleware";
import { createServerClient } from "./lib/supabase";
import { onRequest as cacheMiddleware } from "./middleware/cache";
import { onRequest as securityMiddleware } from "./middleware/security";

export const onRequest = defineMiddleware(async (context, next) => {
  // Récupérer les cookies de la requête
  const cookiesHeader = context.request.headers.get('cookie') || '';
  
  // Créer le client Supabase serveur avec les cookies
  const supabase = createServerClient(cookiesHeader);

  // Stocker le client Supabase dans les locals pour qu'il soit accessible partout
  context.locals.supabase = supabase;

  // Récupérer la session depuis les cookies
  let session = null;
  try {
    // Récupérer les cookies httpOnly créés par l'API sync-session
    const accessToken = context.cookies.get('sb-access-token')?.value;
    const refreshToken = context.cookies.get('sb-refresh-token')?.value;
    
    if (accessToken) {
      console.log('🔍 Token d\'accès trouvé dans les cookies httpOnly');
      
      // Vérifier le token avec Supabase
      const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken);
      if (!userError && user) {
        console.log('✅ Session récupérée via cookies httpOnly:', user.email);
        // Créer une session basique
        session = {
          access_token: accessToken,
          refresh_token: refreshToken || '',
          expires_in: 21600,
          expires_at: Math.floor(Date.now() / 1000) + 21600,
          token_type: 'bearer',
          user: user
        };
      } else {
        console.log('❌ Token httpOnly invalide:', userError?.message);
      }
    } else {
      console.log('❌ Aucun cookie httpOnly trouvé');
      
      // Fallback : essayer de récupérer depuis les cookies normaux
      const cookiesList = cookiesHeader.split(';').map(c => c.trim());
      const sbAccessTokenCookie = cookiesList.find(c => c.startsWith('sb-access-token='));
      
      if (sbAccessTokenCookie) {
        const accessToken = sbAccessTokenCookie.split('=')[1];
        if (accessToken) {
          console.log('🔍 Tentative de récupération via cookie normal');
          // Vérifier le token avec Supabase
          const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken);
          if (!userError && user) {
            console.log('✅ Session récupérée via cookie normal:', user.email);
            // Créer une session basique
            session = {
              access_token: accessToken,
              refresh_token: '',
              expires_in: 21600,
              expires_at: Math.floor(Date.now() / 1000) + 21600,
              token_type: 'bearer',
              user: user
            };
          } else {
            console.log('❌ Cookie normal invalide:', userError?.message);
          }
        }
      } else {
        console.log('❌ Aucun cookie de session trouvé');
      }
    }

    // Rafraîchir la session si elle expire bientôt
    if (session?.expires_at) {
      const timeNow = Math.round(Date.now() / 1000);
      const expiresIn = session.expires_at - timeNow;

      if (expiresIn < 7200) {
        console.log('🔄 Session expire bientôt, tentative de rafraîchissement');
        try {
          const refreshResult = await supabase.auth.refreshSession();
          if (refreshResult.data.session) {
            session = refreshResult.data.session;
            console.log('✅ Session rafraîchie avec succès');
          } else {
            console.log('❌ Échec du rafraîchissement de session');
          }
        } catch (refreshError) {
          console.error('❌ Erreur lors du rafraîchissement de session:', refreshError);
        }
      }
    }
  } catch (error) {
    console.error('Erreur lors de la récupération de la session:', error);
    session = null;
  }

  // Stocker la session dans les locals
  context.locals.session = session;

  // Log pour diagnostiquer la session
  const isHomePage = context.url.pathname === '/';
  if (isHomePage) {
    console.log('🏠 [MIDDLEWARE_HOME] Page d\'accueil:', {
      hasSession: !!session,
      userEmail: session?.user?.email || 'N/A',
      hasAccessToken: !!context.cookies.get('sb-access-token')?.value,
      hasRefreshToken: !!context.cookies.get('sb-refresh-token')?.value,
      cookiesHeader: !!cookiesHeader,
      pathname: context.url.pathname
    });
  }
  
  if (session) {
    console.log('🔐 Session trouvée dans middleware:', {
      userEmail: session.user?.email,
      expiresAt: session.expires_at,
      hasAccessToken: !!session.access_token
    });
  } else {
    console.log('❌ Aucune session dans middleware');
  }

  // Continuer vers la page
  const response = await next();
  
  // Appliquer les middlewares de cache et sécurité
  const cachedResponse = await cacheMiddleware(context, async () => response);
  const secureResponse = await securityMiddleware(context, async () => cachedResponse);
  
  return secureResponse;
});
