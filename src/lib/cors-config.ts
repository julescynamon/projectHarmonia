// src/lib/cors-config.ts

/**
 * Configuration CORS pour l'application
 * Permet de gérer les origines autorisées via des variables d'environnement
 */

// Origines autorisées par défaut
const DEFAULT_ALLOWED_ORIGINS = [
  "https://la-maison-sattvaia.com",
  "https://www.la-maison-sattvaia.com",
];

// Méthodes HTTP autorisées
export const ALLOWED_METHODS = [
  "GET",
  "POST", 
  "PUT",
  "DELETE",
  "PATCH",
  "OPTIONS"
] as const;

// Headers autorisés
export const ALLOWED_HEADERS = [
  "Content-Type",
  "Authorization",
  "X-Requested-With",
  "Accept",
  "Origin",
  "Cache-Control",
  "X-File-Name",
  "X-Use-Cookies", // Pour Supabase
  "X-Client-Info", // Pour Supabase
] as const;

// Headers exposés au client
export const EXPOSED_HEADERS = [
  "Content-Length",
  "X-Total-Count",
  "X-Request-Id",
  "X-Rate-Limit-Remaining",
  "X-Rate-Limit-Reset",
] as const;

// Configuration des credentials
export const ALLOW_CREDENTIALS = true;

// Durée de cache pour les requêtes preflight (en secondes)
export const MAX_AGE = 86400; // 24 heures

/**
 * Récupère les origines autorisées depuis les variables d'environnement
 * @returns La liste des origines autorisées
 */
export function getAllowedOrigins(): string[] {
  // Récupérer les origines depuis les variables d'environnement
  let envOrigins: string | undefined;
  
  try {
    // Vérifier si import.meta.env est disponible (contexte Astro)
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      envOrigins = import.meta.env.CORS_ALLOWED_ORIGINS;
    } else {
      // Fallback pour le contexte Node.js
      envOrigins = process.env.CORS_ALLOWED_ORIGINS;
    }
  } catch (error) {
    // Fallback pour le contexte Node.js
    envOrigins = process.env.CORS_ALLOWED_ORIGINS;
  }
  
  if (envOrigins) {
    // Diviser la chaîne par des virgules et nettoyer les espaces
    const origins = envOrigins
      .split(',')
      .map(origin => origin.trim())
      .filter(origin => origin.length > 0);
    
    // Retourner les origines de l'environnement si elles existent
    if (origins.length > 0) {
      return origins;
    }
  }
  
  // Retourner les origines par défaut si aucune variable d'environnement n'est définie
  return [...DEFAULT_ALLOWED_ORIGINS];
}

/**
 * Vérifie si une origine est autorisée
 * @param origin - L'origine à vérifier
 * @returns true si l'origine est autorisée, false sinon
 */
export function isOriginAllowed(origin: string): boolean {
  const allowedOrigins = getAllowedOrigins();
  return allowedOrigins.includes(origin);
}

/**
 * Génère les headers CORS pour une réponse
 * @param origin - L'origine de la requête
 * @returns Un objet contenant les headers CORS
 */
export function generateCorsHeaders(origin: string): Record<string, string> {
  const isAllowed = isOriginAllowed(origin);
  
  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : "",
    "Access-Control-Allow-Methods": ALLOWED_METHODS.join(", "),
    "Access-Control-Allow-Headers": ALLOWED_HEADERS.join(", "),
    "Access-Control-Expose-Headers": EXPOSED_HEADERS.join(", "),
    "Access-Control-Allow-Credentials": ALLOW_CREDENTIALS.toString(),
    "Access-Control-Max-Age": MAX_AGE.toString(),
    "Vary": "Origin",
  };
}

/**
 * Génère les headers CORS pour une réponse preflight (OPTIONS)
 * @param origin - L'origine de la requête
 * @returns Un objet contenant les headers CORS pour preflight
 */
export function generatePreflightHeaders(origin: string): Record<string, string> {
  const corsHeaders = generateCorsHeaders(origin);
  
  return {
    ...corsHeaders,
    "Cache-Control": "no-cache, no-store, must-revalidate",
    "Pragma": "no-cache",
    "Expires": "0",
  };
} 