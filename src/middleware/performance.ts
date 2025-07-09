// src/middleware/performance.ts
import type { APIContext } from 'astro';
import { monitoring } from '../lib/monitoring';
import { logger } from '../lib/logger';

export interface PerformanceContext {
  userId?: string;
  sessionId?: string;
  action?: string;
}

export function withPerformanceMonitoring<T extends APIContext>(
  handler: (context: T) => Promise<Response>
) {
  return async (context: T): Promise<Response> => {
    const startTime = Date.now();
    const url = context.request.url;
    const method = context.request.method;
    
    // Extraire l'ID utilisateur si disponible
    const userId = context.locals?.user?.id;
    const sessionId = context.locals?.session?.access_token;
    
    const perfContext: PerformanceContext = {
      userId,
      sessionId,
      action: `${method} ${new URL(url).pathname}`,
    };

    try {
      // Démarrer la transaction Sentry
      const transaction = monitoring.startTransaction(
        `${method} ${new URL(url).pathname}`,
        'http.server',
        perfContext
      );

      // Exécuter le handler
      const response = await handler(context);
      
      const duration = Date.now() - startTime;
      const statusCode = response.status;

      // Capturer les performances
      monitoring.captureApiPerformance(
        url,
        method,
        duration,
        statusCode,
        perfContext
      );

      // Finir la transaction
      if (transaction) {
        transaction.setTag('http.status_code', statusCode);
        transaction.setTag('http.duration', duration);
        transaction.finish();
      }

      // Log des performances
      logger.info('API Performance', {
        method,
        url: new URL(url).pathname,
        duration,
        statusCode,
        userId,
      });

      return response;

    } catch (error) {
      const duration = Date.now() - startTime;
      
      // Capturer l'erreur avec contexte
      monitoring.captureError(error as Error, {
        ...perfContext,
        metadata: {
          url,
          method,
          duration,
          error_type: 'api_error',
        }
      });

      // Log de l'erreur
      logger.error('Erreur API', {
        method,
        url: new URL(url).pathname,
        duration,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        userId,
      });

      // Retourner une réponse d'erreur appropriée
      return new Response(
        JSON.stringify({ 
          error: 'Erreur interne du serveur',
          message: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
  };
}

/**
 * Wrapper pour les fonctions API avec monitoring automatique
 */
export function monitorApi<T extends APIContext>(
  handler: (context: T) => Promise<Response>
) {
  return withPerformanceMonitoring(handler);
} 