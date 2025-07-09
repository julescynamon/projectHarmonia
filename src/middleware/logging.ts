// src/middleware/logging.ts
import { defineMiddleware } from "astro:middleware";
import { logger, createContextLogger, type LogContext } from "../lib/logger";

export const onRequest = defineMiddleware(async (context, next) => {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substring(7);
  
  // Extraire les informations de la requête
  const requestInfo = {
    method: context.request.method,
    url: context.request.url,
    pathname: new URL(context.request.url).pathname,
    userAgent: context.request.headers.get('user-agent') || 'Unknown',
    referer: context.request.headers.get('referer') || 'Direct',
    ip: context.request.headers.get('x-forwarded-for') || 
        context.request.headers.get('x-real-ip') || 
        'Unknown',
  };

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
    referer: requestInfo.referer,
  });

  try {
    // Exécuter la requête
    const response = await next();

    // Calculer la durée
    const duration = Date.now() - startTime;

    // Logger la réponse
    requestLogger.info({
      message: 'Requête terminée',
      statusCode: response.status,
      duration: `${duration}ms`,
      contentLength: response.headers.get('content-length') || 'Unknown',
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

    return response;

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