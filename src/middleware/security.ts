// src/middleware/security.ts
import { defineMiddleware } from "astro:middleware";
import type { MiddlewareHandler } from "astro";
import { SecurityHeadersManager } from "../lib/security-headers";

/**
 * Vérifie si un chemin doit être exclu des headers de sécurité
 * @param pathname - Le chemin de la requête
 * @param excludePaths - Liste des chemins à exclure
 * @returns true si le chemin doit être exclu
 */
function shouldExcludePath(pathname: string): boolean {
  const excludePaths = [
    '/api/health',
    '/_astro/',
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml',
    '/sw.js',
    '/manifest.json',
  ];

  return excludePaths.some(excludePath => {
    if (excludePath.endsWith('*')) {
      return pathname.startsWith(excludePath.slice(0, -1));
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

  // Vérifier si le chemin doit être exclu
  if (shouldExcludePath(pathname)) {
    return next();
  }

  // Continuer le traitement normal
  const response = await next();

  // Si pas de réponse, continuer
  if (!response) {
    return response;
  }

  // Générer les headers de sécurité
  const securityHeaders = SecurityHeadersManager.generateHeaders();

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