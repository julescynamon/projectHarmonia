// src/middleware/security.ts
import { defineMiddleware } from "astro:middleware";
import type { MiddlewareHandler } from "astro";
import { getSecurityConfig, generateSecurityHeaders, type SecurityConfig } from "../lib/security-config";

/**
 * Vérifie si un chemin doit être exclu des headers de sécurité
 * @param pathname - Le chemin de la requête
 * @param excludePaths - Liste des chemins à exclure
 * @returns true si le chemin doit être exclu
 */
function shouldExcludePath(pathname: string, excludePaths: string[] = []): boolean {
  return excludePaths.some(excludePath => {
    if (excludePath.endsWith('*')) {
      // Support des wildcards
      const basePath = excludePath.slice(0, -1);
      return pathname.startsWith(basePath);
    }
    return pathname === excludePath || pathname.startsWith(excludePath);
  });
}

/**
 * Middleware de sécurité HTTP pour Astro
 * Ajoute des headers de sécurité essentiels à toutes les réponses
 */
export const onRequest: MiddlewareHandler = async (context, next) => {
  const request = context.request;
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Récupérer la configuration de sécurité
  const securityConfig = getSecurityConfig();

  // Vérifier si le chemin doit être exclu
  if (shouldExcludePath(pathname, securityConfig.excludePaths)) {
    return next();
  }

  // Continuer le traitement normal
  const response = await next();

  // Si pas de réponse, continuer
  if (!response) {
    return response;
  }

  // Générer les headers de sécurité
  const securityHeaders = generateSecurityHeaders(securityConfig);

  // Cloner la réponse pour pouvoir modifier les headers
  const newResponse = new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: new Headers(response.headers),
  });

  // Ajouter les headers de sécurité
  Object.entries(securityHeaders).forEach(([key, value]) => {
    newResponse.headers.set(key, value);
  });

  return newResponse;
}; 