export const prerender = false;

import type { APIRoute } from 'astro';
import { extractAndVerifySession } from '../../../lib/auth';
import { createServerClient } from '../../../lib/supabase';
import { logger, createContextLogger, logError, type LogContext } from '../../../lib/logger';

export const GET: APIRoute = async ({ request, cookies: astroCookies }) => {
  const startTime = Date.now();
  
  // Créer le contexte de logging
  const logContext: LogContext = {
    path: '/api/auth/check-session',
    method: 'GET',
    userAgent: request.headers.get('user-agent') || 'Unknown',
    ip: request.headers.get('x-forwarded-for') || 
        request.headers.get('x-real-ip') || 
        'Unknown',
  };

  const requestLogger = createContextLogger(logContext);

  try {
    requestLogger.info({
      message: 'Vérification de session démarrée',
    });

    // Récupération des cookies
    const cookiesHeader = request.headers.get('cookie');

    // Analyse des cookies individuels
    const cookiesList = cookiesHeader ? cookiesHeader.split(';').map(c => c.trim()) : [];

    // Vérification spécifique des cookies Supabase
    const supabaseAuthToken = cookiesList.find(c => c.startsWith('supabase.auth.token='));
    const sbAccessToken = cookiesList.find(c => c.startsWith('sb-access-token='));
    const sbRefreshToken = cookiesList.find(c => c.startsWith('sb-refresh-token='));

    // Vérification de la session via notre méthode personnalisée
    const decodedSession = extractAndVerifySession(cookiesHeader);

    // Vérification alternative via le client Supabase
    const supabase = createServerClient(cookiesHeader);
    const { data: supabaseSession, error: supabaseError } = await supabase.auth.getSession();

    if (supabaseError) {
      requestLogger.warn({
        message: 'Erreur Supabase lors de la vérification de session',
        error: {
          message: supabaseError.message,
          status: supabaseError.status,
        },
      });
    }

    if (!decodedSession && !supabaseSession?.session) {
      const duration = Date.now() - startTime;
      
      requestLogger.info({
        message: 'Session invalide ou expirée',
        duration: `${duration}ms`,
        cookiesPresent: {
          supabaseAuthToken: !!supabaseAuthToken,
          sbAccessToken: !!sbAccessToken,
          sbRefreshToken: !!sbRefreshToken
        },
      });

      return new Response(JSON.stringify({
        isAuthenticated: false,
        error: 'Invalid or expired session',
        cookiesPresent: {
          supabaseAuthToken: !!supabaseAuthToken,
          sbAccessToken: !!sbAccessToken,
          sbRefreshToken: !!sbRefreshToken
        },
        message: 'Aucune session valide trouvée'
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Session valide (priorité à la session Supabase si disponible)
    const validSession = supabaseSession?.session || decodedSession;
    const userId = supabaseSession?.session?.user?.id || decodedSession?.user?.id;
    
    const duration = Date.now() - startTime;
    
    requestLogger.info({
      message: 'Session vérifiée avec succès',
      duration: `${duration}ms`,
      sessionSource: supabaseSession?.session ? 'supabase' : 'decoded',
      userId,
      cookiesPresent: {
        supabaseAuthToken: !!supabaseAuthToken,
        sbAccessToken: !!sbAccessToken,
        sbRefreshToken: !!sbRefreshToken
      },
    });

    return new Response(JSON.stringify({
      isAuthenticated: true,
      sessionSource: supabaseSession?.session ? 'supabase' : 'decoded',
      userId,
      email: validSession?.user?.email,
      cookiesPresent: {
        supabaseAuthToken: !!supabaseAuthToken,
        sbAccessToken: !!sbAccessToken,
        sbRefreshToken: !!sbRefreshToken
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    
    // Logger l'erreur avec contexte enrichi
    logError(error instanceof Error ? error : new Error(String(error)), {
      ...logContext,
      duration: `${duration}ms`,
      message: 'Erreur lors de la vérification de session',
    });

    return new Response(JSON.stringify({
      isAuthenticated: false,
      error: 'Internal server error',
      message: 'Erreur interne du serveur'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
