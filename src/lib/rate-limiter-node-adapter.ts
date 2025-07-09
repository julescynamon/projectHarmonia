// src/lib/rate-limiter-node-adapter.ts
// Exemple d'adaptateur Node.js pour le rate limiting

import { RateLimiter, MemoryStore, RedisStore, type RateLimitConfig } from './rate-limiter';
import { logger } from './logger';

// Configuration pour différents environnements
export const NODE_RATE_LIMIT_CONFIGS = {
  development: {
    default: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 1000, // Plus permissif en développement
      message: 'Rate limit dépassé en développement'
    },
    auth: {
      windowMs: 15 * 60 * 1000,
      maxRequests: 10,
      message: 'Trop de tentatives d\'authentification'
    },
    api: {
      windowMs: 15 * 60 * 1000,
      maxRequests: 500,
      message: 'Trop de requêtes API'
    }
  },
  production: {
    default: {
      windowMs: 15 * 60 * 1000,
      maxRequests: 100,
      message: 'Trop de requêtes, veuillez réessayer plus tard'
    },
    auth: {
      windowMs: 15 * 60 * 1000,
      maxRequests: 5,
      message: 'Trop de tentatives de connexion, veuillez réessayer plus tard'
    },
    api: {
      windowMs: 15 * 60 * 1000,
      maxRequests: 200,
      message: 'Trop de requêtes API, veuillez réessayer plus tard'
    }
  }
};

// Classe pour gérer les rate limiters par type
export class NodeRateLimitManager {
  private limiters: Map<string, RateLimiter> = new Map();
  private store: any;
  private environment: 'development' | 'production';

  constructor(environment: 'development' | 'production' = 'production') {
    this.environment = environment;
    this.initializeStore();
  }

  private async initializeStore() {
    const redisUrl = process.env.REDIS_URL || import.meta.env?.REDIS_URL;
    
    if (redisUrl) {
      try {
        // Exemple avec Redis (nécessite l'installation de 'redis')
        // const { createClient } = await import('redis');
        // const redisClient = createClient({ url: redisUrl });
        // await redisClient.connect();
        // this.store = new RedisStore(redisClient);
        // logger.info('Store Redis initialisé pour le rate limiting Node.js');
        
        // Fallback vers le store mémoire si Redis n'est pas disponible
        this.store = new MemoryStore();
        logger.info('Store mémoire initialisé pour le rate limiting Node.js (Redis non disponible)');
      } catch (error) {
        logger.warn('Impossible d\'initialiser Redis, utilisation du store mémoire:', error);
        this.store = new MemoryStore();
      }
    } else {
      this.store = new MemoryStore();
      logger.info('Store mémoire initialisé pour le rate limiting Node.js');
    }
  }

  // Obtenir un rate limiter pour un type spécifique
  getLimiter(type: 'default' | 'auth' | 'api'): RateLimiter {
    const configKey = `${this.environment}:${type}`;
    
    if (!this.limiters.has(configKey)) {
      const config = NODE_RATE_LIMIT_CONFIGS[this.environment][type];
      const limiter = new RateLimiter(this.store, config);
      this.limiters.set(configKey, limiter);
    }
    
    return this.limiters.get(configKey)!;
  }

  // Obtenir un rate limiter avec une configuration personnalisée
  getCustomLimiter(config: RateLimitConfig): RateLimiter {
    const configKey = `custom:${config.windowMs}:${config.maxRequests}`;
    
    if (!this.limiters.has(configKey)) {
      const limiter = new RateLimiter(this.store, config);
      this.limiters.set(configKey, limiter);
    }
    
    return this.limiters.get(configKey)!;
  }

  // Vérifier une limite avec un identifiant
  async checkLimit(type: 'default' | 'auth' | 'api', identifier: string) {
    const limiter = this.getLimiter(type);
    return await limiter.checkLimit(identifier);
  }

  // Nettoyer les entrées expirées (pour le store mémoire)
  cleanup() {
    if (this.store instanceof MemoryStore) {
      this.store.cleanup();
    }
  }
}

// Exemple d'utilisation dans une route API Express/Node.js
export function createRateLimitMiddleware(manager: NodeRateLimitManager, type: 'default' | 'auth' | 'api' = 'default') {
  return async (req: any, res: any, next: any) => {
    try {
      // Obtenir l'identifiant de la requête
      const identifier = getRequestIdentifier(req);
      
      // Vérifier la limite
      const result = await manager.checkLimit(type, identifier);
      
      if (!result.success) {
        // Limite dépassée
        const limiter = manager.getLimiter(type);
        const errorResponse = limiter.createErrorResponse(result);
        
        // Convertir la Response en réponse Express
        const errorData = await errorResponse.json();
        const headers = Object.fromEntries(errorResponse.headers.entries());
        
        return res.status(errorResponse.status).set(headers).json(errorData);
      }
      
      // Ajouter les headers de rate limit
      res.set({
        'X-RateLimit-Limit': result.total + result.remaining,
        'X-RateLimit-Remaining': result.remaining,
        'X-RateLimit-Reset': result.reset
      });
      
      next();
    } catch (error) {
      logger.error('Erreur lors de la vérification du rate limit:', error);
      next(); // Continuer en cas d'erreur
    }
  };
}

// Fonction pour obtenir l'identifiant de la requête
function getRequestIdentifier(req: any): string {
  const ip = req.ip || 
             req.connection.remoteAddress || 
             req.headers['x-forwarded-for'] || 
             req.headers['x-real-ip'] ||
             'unknown';
  
  const userAgent = req.headers['user-agent'] || 'unknown';
  const path = req.path || req.url;
  
  // Pour les routes d'authentification, utiliser IP + User-Agent
  if (path.includes('/auth/') || path.includes('/login') || path.includes('/register')) {
    return `${ip}:${userAgent}`;
  }
  
  // Pour les autres routes, utiliser IP + chemin
  return `${ip}:${path}`;
}

// Exemple d'utilisation avec Express
export function setupExpressRateLimiting(app: any) {
  const manager = new NodeRateLimitManager(process.env.NODE_ENV as 'development' | 'production');
  
  // Middleware global pour toutes les routes API
  app.use('/api', createRateLimitMiddleware(manager, 'api'));
  
  // Middleware spécifique pour les routes d'authentification
  app.use('/api/auth', createRateLimitMiddleware(manager, 'auth'));
  
  // Middleware pour les routes sensibles
  app.use('/api/admin', createRateLimitMiddleware(manager, 'auth'));
  
  // Nettoyer périodiquement le store mémoire
  setInterval(() => {
    manager.cleanup();
  }, 5 * 60 * 1000); // Toutes les 5 minutes
  
  return manager;
}

// Exemple d'utilisation avec Fastify
export function setupFastifyRateLimiting(fastify: any) {
  const manager = new NodeRateLimitManager(process.env.NODE_ENV as 'development' | 'production');
  
  // Hook preHandler pour toutes les routes
  fastify.addHook('preHandler', async (request: any, reply: any) => {
    try {
      const identifier = getRequestIdentifier(request);
      const type = request.url.includes('/auth/') ? 'auth' : 'api';
      const result = await manager.checkLimit(type, identifier);
      
      if (!result.success) {
        const limiter = manager.getLimiter(type);
        const errorResponse = limiter.createErrorResponse(result);
        const errorData = await errorResponse.json();
        
        return reply
          .status(errorResponse.status)
          .headers(Object.fromEntries(errorResponse.headers.entries()))
          .send(errorData);
      }
      
      // Ajouter les headers de rate limit
      reply.headers({
        'X-RateLimit-Limit': result.total + result.remaining,
        'X-RateLimit-Remaining': result.remaining,
        'X-RateLimit-Reset': result.reset
      });
    } catch (error) {
      logger.error('Erreur lors de la vérification du rate limit:', error);
    }
  });
  
  return manager;
}

// Exemple d'utilisation avec Koa
export function setupKoaRateLimiting(app: any) {
  const manager = new NodeRateLimitManager(process.env.NODE_ENV as 'development' | 'production');
  
  app.use(async (ctx: any, next: any) => {
    try {
      const identifier = getRequestIdentifier(ctx.request);
      const type = ctx.path.includes('/auth/') ? 'auth' : 'api';
      const result = await manager.checkLimit(type, identifier);
      
      if (!result.success) {
        const limiter = manager.getLimiter(type);
        const errorResponse = limiter.createErrorResponse(result);
        const errorData = await errorResponse.json();
        
        ctx.status = errorResponse.status;
        ctx.set(Object.fromEntries(errorResponse.headers.entries()));
        ctx.body = errorData;
        return;
      }
      
      // Ajouter les headers de rate limit
      ctx.set({
        'X-RateLimit-Limit': result.total + result.remaining,
        'X-RateLimit-Remaining': result.remaining,
        'X-RateLimit-Reset': result.reset
      });
      
      await next();
    } catch (error) {
      logger.error('Erreur lors de la vérification du rate limit:', error);
      await next();
    }
  });
  
  return manager;
} 