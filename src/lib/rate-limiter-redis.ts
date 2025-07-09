// src/lib/rate-limiter-redis.ts
// Exemple d'utilisation avec Redis pour le rate limiting

import { RateLimiter, RedisStore, type RateLimitConfig } from './rate-limiter';
import { logger } from './logger';

// Configuration Redis
export interface RedisConfig {
  url?: string;
  host?: string;
  port?: number;
  password?: string;
  db?: number;
  retryDelayOnFailover?: number;
  maxRetriesPerRequest?: number;
}

// Classe pour gérer le rate limiting avec Redis
export class RedisRateLimitManager {
  private redisClient: any;
  private limiters: Map<string, RateLimiter> = new Map();
  private isConnected: boolean = false;

  constructor(private config: RedisConfig = {}) {}

  // Initialiser la connexion Redis
  async initialize(): Promise<void> {
    try {
      // Vérifier si Redis est disponible
      const redisUrl = this.config.url || process.env.REDIS_URL || import.meta.env?.REDIS_URL;
      
      if (!redisUrl) {
        throw new Error('URL Redis non configurée');
      }

      // Importer Redis dynamiquement
      const { createClient } = await import('redis');
      
      this.redisClient = createClient({
        url: redisUrl,
        socket: {
          host: this.config.host,
          port: this.config.port,
          reconnectStrategy: (retries) => {
            if (retries > 10) {
              logger.error('Impossible de se reconnecter à Redis après 10 tentatives');
              return new Error('Trop de tentatives de reconnexion');
            }
            return Math.min(retries * 100, 3000);
          }
        },
        password: this.config.password,
        database: this.config.db || 0
      });

      // Gérer les événements de connexion
      this.redisClient.on('connect', () => {
        logger.info('Connexion à Redis établie');
        this.isConnected = true;
      });

      this.redisClient.on('ready', () => {
        logger.info('Redis prêt à recevoir des commandes');
      });

      this.redisClient.on('error', (error: any) => {
        logger.error('Erreur Redis:', error);
        this.isConnected = false;
      });

      this.redisClient.on('end', () => {
        logger.warn('Connexion Redis fermée');
        this.isConnected = false;
      });

      // Se connecter à Redis
      await this.redisClient.connect();
      
      logger.info('Manager Redis de rate limiting initialisé avec succès');
      
    } catch (error) {
      logger.error('Erreur lors de l\'initialisation Redis:', error);
      throw error;
    }
  }

  // Obtenir un rate limiter avec Redis
  getLimiter(config: RateLimitConfig): RateLimiter {
    const configKey = `${config.windowMs}:${config.maxRequests}`;
    
    if (!this.limiters.has(configKey)) {
      if (!this.isConnected) {
        throw new Error('Redis non connecté. Appelez initialize() d\'abord.');
      }
      
      const store = new RedisStore(this.redisClient, 'rate_limit:');
      const limiter = new RateLimiter(store, config);
      this.limiters.set(configKey, limiter);
    }
    
    return this.limiters.get(configKey)!;
  }

  // Vérifier une limite
  async checkLimit(identifier: string, config: RateLimitConfig) {
    const limiter = this.getLimiter(config);
    return await limiter.checkLimit(identifier);
  }

  // Obtenir les statistiques Redis
  async getStats(): Promise<{
    connected: boolean;
    memory: any;
    keys: number;
    info: any;
  }> {
    if (!this.isConnected) {
      return {
        connected: false,
        memory: null,
        keys: 0,
        info: null
      };
    }

    try {
      const info = await this.redisClient.info();
      const memory = await this.redisClient.info('memory');
      const keys = await this.redisClient.dbSize();
      
      return {
        connected: true,
        memory: this.parseRedisInfo(memory),
        keys,
        info: this.parseRedisInfo(info)
      };
    } catch (error) {
      logger.error('Erreur lors de la récupération des stats Redis:', error);
      return {
        connected: false,
        memory: null,
        keys: 0,
        info: null
      };
    }
  }

  // Parser les informations Redis
  private parseRedisInfo(info: string): Record<string, string> {
    const lines = info.split('\r\n');
    const result: Record<string, string> = {};
    
    for (const line of lines) {
      if (line.includes(':')) {
        const [key, value] = line.split(':');
        result[key] = value;
      }
    }
    
    return result;
  }

  // Nettoyer les clés expirées
  async cleanup(): Promise<number> {
    if (!this.isConnected) return 0;

    try {
      // Supprimer les clés avec le préfixe rate_limit: qui ont expiré
      const keys = await this.redisClient.keys('rate_limit:*');
      let deletedCount = 0;
      
      for (const key of keys) {
        const ttl = await this.redisClient.ttl(key);
        if (ttl === -1) { // Pas de TTL, supprimer
          await this.redisClient.del(key);
          deletedCount++;
        }
      }
      
      logger.info(`Nettoyage Redis: ${deletedCount} clés supprimées`);
      return deletedCount;
    } catch (error) {
      logger.error('Erreur lors du nettoyage Redis:', error);
      return 0;
    }
  }

  // Fermer la connexion Redis
  async disconnect(): Promise<void> {
    if (this.redisClient && this.isConnected) {
      await this.redisClient.quit();
      this.isConnected = false;
      logger.info('Connexion Redis fermée');
    }
  }
}

// Configuration par défaut pour Redis
export const DEFAULT_REDIS_CONFIG: RedisConfig = {
  host: 'localhost',
  port: 6379,
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3
};

// Exemple d'utilisation avec Express et Redis
export async function setupRedisRateLimiting(app: any, redisConfig?: RedisConfig) {
  const manager = new RedisRateLimitManager(redisConfig || DEFAULT_REDIS_CONFIG);
  
  try {
    await manager.initialize();
    
    // Middleware pour toutes les routes API
    app.use('/api', async (req: any, res: any, next: any) => {
      try {
        const identifier = getRequestIdentifier(req);
        const config = getRateLimitConfig(req.path);
        
        if (config) {
          const result = await manager.checkLimit(identifier, config);
          
          if (!result.success) {
            const limiter = manager.getLimiter(config);
            const errorResponse = limiter.createErrorResponse(result);
            const errorData = await errorResponse.json();
            
            return res.status(errorResponse.status)
              .set(Object.fromEntries(errorResponse.headers.entries()))
              .json(errorData);
          }
          
          // Ajouter les headers de rate limit
          res.set({
            'X-RateLimit-Limit': config.maxRequests,
            'X-RateLimit-Remaining': result.remaining,
            'X-RateLimit-Reset': result.reset
          });
        }
        
        next();
      } catch (error) {
        logger.error('Erreur rate limiting Redis:', error);
        next();
      }
    });
    
    // Endpoint pour les statistiques Redis
    app.get('/api/admin/redis-stats', async (req: any, res: any) => {
      try {
        const stats = await manager.getStats();
        res.json(stats);
      } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des stats' });
      }
    });
    
    // Nettoyer périodiquement
    setInterval(async () => {
      await manager.cleanup();
    }, 10 * 60 * 1000); // Toutes les 10 minutes
    
    // Gérer la fermeture propre
    process.on('SIGINT', async () => {
      await manager.disconnect();
      process.exit(0);
    });
    
    process.on('SIGTERM', async () => {
      await manager.disconnect();
      process.exit(0);
    });
    
    logger.info('Rate limiting Redis configuré avec succès');
    return manager;
    
  } catch (error) {
    logger.error('Erreur lors de la configuration du rate limiting Redis:', error);
    throw error;
  }
}

// Fonctions utilitaires
function getRequestIdentifier(req: any): string {
  const ip = req.ip || 
             req.connection.remoteAddress || 
             req.headers['x-forwarded-for'] || 
             req.headers['x-real-ip'] ||
             'unknown';
  
  const userAgent = req.headers['user-agent'] || 'unknown';
  const path = req.path || req.url;
  
  if (path.includes('/auth/')) {
    return `${ip}:${userAgent}`;
  }
  
  return `${ip}:${path}`;
}

function getRateLimitConfig(path: string): RateLimitConfig | null {
  // Configuration basée sur le chemin
  if (path.includes('/auth/')) {
    return {
      windowMs: 15 * 60 * 1000,
      maxRequests: 5,
      message: 'Trop de tentatives de connexion'
    };
  }
  
  if (path.includes('/admin/')) {
    return {
      windowMs: 5 * 60 * 1000,
      maxRequests: 20,
      message: 'Trop de requêtes admin'
    };
  }
  
  if (path.startsWith('/api/')) {
    return {
      windowMs: 15 * 60 * 1000,
      maxRequests: 100,
      message: 'Trop de requêtes API'
    };
  }
  
  return null;
}

// Exemple d'utilisation avec Fastify
export async function setupFastifyRedisRateLimiting(fastify: any, redisConfig?: RedisConfig) {
  const manager = new RedisRateLimitManager(redisConfig || DEFAULT_REDIS_CONFIG);
  
  try {
    await manager.initialize();
    
    fastify.addHook('preHandler', async (request: any, reply: any) => {
      try {
        const identifier = getRequestIdentifier(request);
        const config = getRateLimitConfig(request.url);
        
        if (config) {
          const result = await manager.checkLimit(identifier, config);
          
          if (!result.success) {
            const limiter = manager.getLimiter(config);
            const errorResponse = limiter.createErrorResponse(result);
            const errorData = await errorResponse.json();
            
            return reply
              .status(errorResponse.status)
              .headers(Object.fromEntries(errorResponse.headers.entries()))
              .send(errorData);
          }
          
          reply.headers({
            'X-RateLimit-Limit': config.maxRequests,
            'X-RateLimit-Remaining': result.remaining,
            'X-RateLimit-Reset': result.reset
          });
        }
      } catch (error) {
        logger.error('Erreur rate limiting Redis Fastify:', error);
      }
    });
    
    return manager;
  } catch (error) {
    logger.error('Erreur lors de la configuration Fastify Redis:', error);
    throw error;
  }
} 