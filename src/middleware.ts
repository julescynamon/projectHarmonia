import { defineMiddleware } from "astro:middleware";
import { createClient } from "@supabase/supabase-js";
import { onRequest as authMiddleware } from "./middleware/auth"; // Importer le middleware d'authentification
import { onRequest as rateLimitMiddleware } from "./middleware/rate-limiting"; // Importer le middleware de rate limiting
import { onRequest as corsMiddleware } from "./middleware/cors"; // Importer le middleware CORS
import { onRequest as securityMiddleware } from "./middleware/security"; // Importer le middleware de sécurité
import { logger, createContextLogger, type LogContext } from "./lib/logger";
import { generateCSPHeader } from "./lib/csp-config";



export const onRequest = defineMiddleware(async (context, next) => {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substring(7);
  
  // Extraire les informations de la requête pour le logging
  const requestInfo = {
    method: context.request.method,
    url: context.request.url,
    pathname: new URL(context.request.url).pathname,
    userAgent: context.request.headers.get('user-agent') || 'Unknown',
    ip: context.request.headers.get('x-forwarded-for') || 
        context.request.headers.get('x-real-ip') || 
        'Unknown',
  };

  // Créer le client Supabase avec une configuration standard
  const supabase = createClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: "pkce"
      },
      global: {
        headers: { "x-use-cookies": "true" }
      }
    }
  );

  // Stocker le client Supabase dans les locals pour qu'il soit accessible partout
  context.locals.supabase = supabase;

  // Récupérer la session
  try {
    const { data: { session } } = await supabase.auth.getSession();
    context.locals.session = session;

    // Rafraîchir la session si elle expire bientôt
    if (session?.expires_at) {
      const timeNow = Math.round(Date.now() / 1000);
      const expiresIn = session.expires_at - timeNow;

      if (expiresIn < 3600) {
        const refreshResult = await supabase.auth.refreshSession();
        context.locals.session = refreshResult.data.session;
      }
    }
  } catch (error) {
    console.error('Erreur lors de la récupération de la session:', error);
    context.locals.session = null;
  }

  // Créer le contexte de logging
  const logContext: LogContext = {
    requestId,
    method: requestInfo.method,
    path: requestInfo.pathname,
    userAgent: requestInfo.userAgent,
    ip: requestInfo.ip,
    userId: context.locals.session?.user?.id,
    sessionId: context.locals.session?.access_token,
  };

  // Créer le logger avec contexte
  const requestLogger = createContextLogger(logContext);

  // Logger la requête entrante
  requestLogger.info({
    message: 'Requête entrante',
    method: requestInfo.method,
    url: requestInfo.url,
    pathname: requestInfo.pathname,
  });

  try {
    // Appeler le middleware CORS en premier
    const corsResponse = await corsMiddleware(context, next);
    
    // Si le CORS a retourné une réponse (comme OPTIONS), la retourner
    if (corsResponse && corsResponse.status === 204) {
      return corsResponse;
    }
    
    // Appeler le middleware de rate limiting
    const rateLimitResponse = await rateLimitMiddleware(context, next);
    
    // Si le rate limiting a retourné une réponse d'erreur, la retourner
    if (rateLimitResponse && rateLimitResponse.status === 429) {
      return rateLimitResponse;
    }
    
    // Appeler le middleware d'authentification
    const authResponse = await authMiddleware(context, next);
    
    // Appeler le middleware de sécurité en dernier pour ajouter les headers
    const response = await securityMiddleware(context, () => Promise.resolve(authResponse || next()));

    // Calculer la durée
    const duration = Date.now() - startTime;

    // Logger la réponse si elle existe
    if (response) {
      // Ajouter le header CSP à la réponse
      const cspHeader = generateCSPHeader();
      response.headers.set("Content-Security-Policy", cspHeader);
      
      requestLogger.info({
        message: 'Requête terminée',
        statusCode: response.status,
        duration: `${duration}ms`,
      });

      // Logger les erreurs 4xx et 5xx
      if (response.status >= 400) {
        requestLogger.warn({
          message: 'Requête avec erreur',
          statusCode: response.status,
          statusText: response.statusText,
          duration: `${duration}ms`,
        });
      }
    } else {
      requestLogger.info({
        message: 'Requête terminée (pas de réponse)',
        duration: `${duration}ms`,
      });
    }

    return response || next();
  } catch (error) {
    // Calculer la durée même en cas d'erreur
    const duration = Date.now() - startTime;

    // Logger l'erreur
    requestLogger.error({
      message: 'Erreur lors du traitement de la requête',
      error: {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      duration: `${duration}ms`,
    });

    // Re-lancer l'erreur pour qu'elle soit gérée par Astro
    throw error;
  }
});
