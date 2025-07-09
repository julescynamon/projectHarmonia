// src/middleware/cors.ts
import { defineMiddleware } from "astro:middleware";
import type { MiddlewareHandler } from "astro";
import { 
  isOriginAllowed, 
  generateCorsHeaders, 
  generatePreflightHeaders 
} from "../lib/cors-config";

/**
 * Middleware CORS sécurisé pour Astro
 * Gère les requêtes cross-origin de manière sécurisée
 */
export const onRequest: MiddlewareHandler = async (context, next) => {
  const request = context.request;
  const origin = request.headers.get("Origin");
  const method = request.method;

  // Vérifier si l'origine est autorisée
  const originAllowed = origin && isOriginAllowed(origin);
  
  // Pour les requêtes sans origine (même origine), toujours autoriser
  const shouldAllowRequest = !origin || originAllowed;

  // Gérer les requêtes preflight OPTIONS
  if (method === "OPTIONS") {
    const headers = origin ? generatePreflightHeaders(origin) : {};
    
    const response = new Response(null, {
      status: 204,
      headers,
    });

    return response;
  }

  // Pour les requêtes non-OPTIONS, continuer le traitement
  const response = await next();

  // Si la requête n'est pas autorisée, retourner une erreur 403
  if (!shouldAllowRequest) {
    return new Response("Forbidden", {
      status: 403,
      headers: {
        "Content-Type": "text/plain",
        "Vary": "Origin",
      },
    });
  }

  // Ajouter les headers CORS à la réponse
  if (response && origin && originAllowed) {
    // Cloner la réponse pour pouvoir modifier les headers
    const newResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: new Headers(response.headers),
    });

    // Ajouter les headers CORS
    const corsHeaders = generateCorsHeaders(origin);
    Object.entries(corsHeaders).forEach(([key, value]) => {
      newResponse.headers.set(key, value);
    });

    return newResponse;
  }

  return response;
}; 