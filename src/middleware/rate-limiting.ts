// src/middleware/rate-limiting.ts
import { defineMiddleware } from "astro:middleware";
import { 
  RateLimiter, 
  MemoryStore, 
  RedisStore,
  DEFAULT_RATE_LIMIT_CONFIG,
  STRICT_RATE_LIMIT_CONFIG,
  AUTH_RATE_LIMIT_CONFIG,
  type RateLimitConfig 
} from "../lib/rate-limiter";
import { logger, createContextLogger, type LogContext } from "../lib/logger";

// Configuration des routes avec leurs limites spécifiques
const RATE_LIMIT_ROUTES: Record<string, RateLimitConfig> = {
  // Routes d'authentification (limites strictes)
  '/api/auth/login': AUTH_RATE_LIMIT_CONFIG,
  '/api/auth/register': AUTH_RATE_LIMIT_CONFIG,
  '/api/auth/forgot-password': AUTH_RATE_LIMIT_CONFIG,
  '/api/auth/reset-password': AUTH_RATE_LIMIT_CONFIG,
  
  // Routes sensibles (limites strictes)
  '/api/admin': STRICT_RATE_LIMIT_CONFIG,
  '/api/blog/create': STRICT_RATE_LIMIT_CONFIG,
  '/api/blog/update': STRICT_RATE_LIMIT_CONFIG,
  '/api/blog/delete': STRICT_RATE_LIMIT_CONFIG,
  '/api/cart/checkout': STRICT_RATE_LIMIT_CONFIG,
  
  // Routes de contact et newsletter
  '/api/contact': {
    ...DEFAULT_RATE_LIMIT_CONFIG,
    maxRequests: 10,
    windowMs: 10 * 60 * 1000, // 10 minutes
    message: 'Trop de messages envoyés, veuillez réessayer plus tard.'
  },
  '/api/newsletter/subscribe': {
    ...DEFAULT_RATE_LIMIT_CONFIG,
    maxRequests: 5,
    windowMs: 60 * 60 * 1000, // 1 heure
    message: 'Trop de tentatives d\'inscription, veuillez réessayer plus tard.'
  },
  
  // Routes de rendez-vous
  '/api/appointments/create': {
    ...DEFAULT_RATE_LIMIT_CONFIG,
    maxRequests: 10,
    windowMs: 30 * 60 * 1000, // 30 minutes
    message: 'Trop de tentatives de création de rendez-vous, veuillez réessayer plus tard.'
  },
  
  // Routes de recherche et filtres
  '/api/products': {
    ...DEFAULT_RATE_LIMIT_CONFIG,
    maxRequests: 200,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  
  // Routes de blog
  '/api/blog': {
    ...DEFAULT_RATE_LIMIT_CONFIG,
    maxRequests: 150,
    windowMs: 15 * 60 * 1000, // 15 minutes
  }
};

// Routes à ignorer pour le rate limiting
const IGNORED_ROUTES = [
  '/api/health',
  '/api/monitoring',
  '/api/webhook/stripe',
  '/api/webhook',
  '/api/appointments/webhook'
];

// Initialiser le store de rate limiting
let rateLimitStore: any;
let rateLimiters: Map<string, RateLimiter> = new Map();

// Fonction pour initialiser le store
function initializeRateLimitStore() {
  if (rateLimitStore) return rateLimitStore;

  // Vérifier si Redis est disponible
  const redisUrl = import.meta.env.REDIS_URL;
  
  if (redisUrl) {
    try {
      // Note: Vous devrez installer redis et l'importer
      // import { createClient } from 'redis';
      // const redisClient = createClient({ url: redisUrl });
      // await redisClient.connect();
      // rateLimitStore = new RedisStore(redisClient);
      logger.info('Store Redis initialisé pour le rate limiting');
    } catch (error) {
      logger.warn('Impossible d\'initialiser Redis, utilisation du store mémoire:', error);
      rateLimitStore = new MemoryStore();
    }
  } else {
    rateLimitStore = new MemoryStore();
    logger.info('Store mémoire initialisé pour le rate limiting');
  }

  return rateLimitStore;
}

// Fonction pour obtenir l'identifiant unique de la requête
function getRequestIdentifier(request: Request): string {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  // Obtenir l'IP du client
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             request.headers.get('cf-connecting-ip') ||
             'unknown';
  
  // Pour les routes d'authentification, utiliser l'IP + User-Agent
  if (pathname.includes('/auth/')) {
    const userAgent = request.headers.get('user-agent') || 'unknown';
    return `${ip}:${userAgent}`;
  }
  
  // Pour les autres routes, utiliser l'IP + le chemin
  return `${ip}:${pathname}`;
}

// Fonction pour obtenir la configuration de rate limit pour une route
function getRateLimitConfig(pathname: string): RateLimitConfig | null {
  // Vérifier les correspondances exactes
  if (RATE_LIMIT_ROUTES[pathname]) {
    return RATE_LIMIT_ROUTES[pathname];
  }
  
  // Vérifier les correspondances par préfixe
  for (const [route, config] of Object.entries(RATE_LIMIT_ROUTES)) {
    if (pathname.startsWith(route)) {
      return config;
    }
  }
  
  // Vérifier si c'est une route API générale
  if (pathname.startsWith('/api/') && !IGNORED_ROUTES.includes(pathname)) {
    return DEFAULT_RATE_LIMIT_CONFIG;
  }
  
  return null;
}

// Fonction pour obtenir ou créer un rate limiter
function getRateLimiter(config: RateLimitConfig): RateLimiter {
  const configKey = `${config.windowMs}:${config.maxRequests}`;
  
  if (!rateLimiters.has(configKey)) {
    const store = initializeRateLimitStore();
    const limiter = new RateLimiter(store, config);
    rateLimiters.set(configKey, limiter);
  }
  
  return rateLimiters.get(configKey)!;
}

// Fonction pour nettoyer périodiquement le store mémoire
function scheduleCleanup() {
  if (rateLimitStore instanceof MemoryStore) {
    setInterval(() => {
      rateLimitStore.cleanup();
    }, 5 * 60 * 1000); // Nettoyer toutes les 5 minutes
  }
}

// Initialiser le nettoyage
scheduleCleanup();

export const onRequest = defineMiddleware(async (context, next) => {
  const { request } = context;
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  // Créer le contexte de logging
  const logContext: LogContext = {
    requestId: Math.random().toString(36).substring(7),
    method: request.method,
    path: pathname,
    userAgent: request.headers.get('user-agent') || 'Unknown',
    ip: request.headers.get('x-forwarded-for') || 
        request.headers.get('x-real-ip') || 
        'Unknown',
  };
  
  const requestLogger = createContextLogger(logContext);
  
  // Vérifier si la route doit être limitée
  const rateLimitConfig = getRateLimitConfig(pathname);
  
  if (!rateLimitConfig) {
    // Pas de rate limiting pour cette route
    return next();
  }
  
  try {
    // Obtenir l'identifiant de la requête
    const identifier = getRequestIdentifier(request);
    
    // Obtenir le rate limiter
    const rateLimiter = getRateLimiter(rateLimitConfig);
    
    // Vérifier la limite
    const result = await rateLimiter.checkLimit(identifier);
    
    // Logger les informations de rate limiting
    requestLogger.info({
      message: 'Vérification du rate limit',
      identifier,
      remaining: result.remaining,
      total: result.total,
      success: result.success
    });
    
    if (!result.success) {
      // Limite dépassée
      requestLogger.warn({
        message: 'Rate limit dépassé',
        identifier,
        retryAfter: result.retryAfter
      });
      
      return rateLimiter.createErrorResponse(result);
    }
    
    // Ajouter les headers de rate limit à la réponse
    const response = await next();
    
    if (response && rateLimitConfig.headers) {
      const newHeaders = new Headers(response.headers);
      newHeaders.set('X-RateLimit-Limit', rateLimitConfig.maxRequests.toString());
      newHeaders.set('X-RateLimit-Remaining', result.remaining.toString());
      newHeaders.set('X-RateLimit-Reset', result.reset.toString());
      
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders
      });
    }
    
    return response;
    
  } catch (error) {
    requestLogger.error({
      message: 'Erreur lors de la vérification du rate limit',
      error: {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error)
      }
    });
    
    // En cas d'erreur, permettre la requête
    return next();
  }
}); 