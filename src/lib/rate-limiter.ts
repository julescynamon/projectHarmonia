// src/lib/rate-limiter.ts
import { logger } from './logger';

// Types pour le rate limiting
export interface RateLimitConfig {
  windowMs: number; // Fenêtre de temps en millisecondes
  maxRequests: number; // Nombre maximum de requêtes
  message?: string; // Message d'erreur personnalisé
  statusCode?: number; // Code de statut HTTP pour les erreurs
  headers?: boolean; // Inclure les headers de rate limit dans la réponse
}

export interface RateLimitInfo {
  remaining: number;
  reset: number;
  total: number;
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number;
  total: number;
  retryAfter?: number;
}

// Interface pour les adaptateurs de stockage
export interface RateLimitStore {
  get(key: string): Promise<RateLimitInfo | null>;
  set(key: string, info: RateLimitInfo, ttl: number): Promise<void>;
  delete(key: string): Promise<void>;
}

// Adaptateur de stockage en mémoire
export class MemoryStore implements RateLimitStore {
  private store = new Map<string, { info: RateLimitInfo; expires: number }>();

  async get(key: string): Promise<RateLimitInfo | null> {
    const item = this.store.get(key);
    if (!item) return null;

    // Vérifier si l'élément a expiré
    if (Date.now() > item.expires) {
      this.store.delete(key);
      return null;
    }

    return item.info;
  }

  async set(key: string, info: RateLimitInfo, ttl: number): Promise<void> {
    this.store.set(key, {
      info,
      expires: Date.now() + ttl
    });
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key);
  }

  // Nettoyer les entrées expirées (à appeler périodiquement)
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.store.entries()) {
      if (now > item.expires) {
        this.store.delete(key);
      }
    }
  }
}

// Adaptateur Redis (optionnel)
export class RedisStore implements RateLimitStore {
  private redis: any;
  private prefix: string;

  constructor(redisClient: any, prefix: string = 'rate_limit:') {
    this.redis = redisClient;
    this.prefix = prefix;
  }

  async get(key: string): Promise<RateLimitInfo | null> {
    try {
      const data = await this.redis.get(this.prefix + key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error('Erreur Redis lors de la récupération:', error);
      return null;
    }
  }

  async set(key: string, info: RateLimitInfo, ttl: number): Promise<void> {
    try {
      await this.redis.setex(
        this.prefix + key,
        Math.ceil(ttl / 1000),
        JSON.stringify(info)
      );
    } catch (error) {
      logger.error('Erreur Redis lors de la sauvegarde:', error);
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.redis.del(this.prefix + key);
    } catch (error) {
      logger.error('Erreur Redis lors de la suppression:', error);
    }
  }
}

// Classe principale de rate limiting
export class RateLimiter {
  private store: RateLimitStore;
  private config: RateLimitConfig;

  constructor(store: RateLimitStore, config: RateLimitConfig) {
    this.store = store;
    this.config = {
      message: 'Trop de requêtes, veuillez réessayer plus tard.',
      statusCode: 429,
      headers: true,
      ...config
    };
  }

  async checkLimit(identifier: string): Promise<RateLimitResult> {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;
    const key = `rate_limit:${identifier}`;

    try {
      // Récupérer les informations actuelles
      const current = await this.store.get(key);
      
      if (!current) {
        // Première requête
        const info: RateLimitInfo = {
          remaining: this.config.maxRequests - 1,
          reset: now + this.config.windowMs,
          total: 1
        };

        await this.store.set(key, info, this.config.windowMs);
        
        return {
          success: true,
          remaining: info.remaining,
          reset: info.reset,
          total: info.total
        };
      }

      // Vérifier si la fenêtre de temps a été réinitialisée
      if (current.reset <= now) {
        const info: RateLimitInfo = {
          remaining: this.config.maxRequests - 1,
          reset: now + this.config.windowMs,
          total: 1
        };

        await this.store.set(key, info, this.config.windowMs);
        
        return {
          success: true,
          remaining: info.remaining,
          reset: info.reset,
          total: info.total
        };
      }

      // Vérifier si la limite est dépassée
      if (current.remaining <= 0) {
        const retryAfter = Math.ceil((current.reset - now) / 1000);
        
        return {
          success: false,
          remaining: 0,
          reset: current.reset,
          total: current.total,
          retryAfter
        };
      }

      // Mettre à jour le compteur
      const info: RateLimitInfo = {
        remaining: current.remaining - 1,
        reset: current.reset,
        total: current.total + 1
      };

      await this.store.set(key, info, this.config.windowMs);
      
      return {
        success: true,
        remaining: info.remaining,
        reset: info.reset,
        total: info.total
      };

    } catch (error) {
      logger.error('Erreur lors de la vérification du rate limit:', error);
      
      // En cas d'erreur, permettre la requête
      return {
        success: true,
        remaining: this.config.maxRequests - 1,
        reset: now + this.config.windowMs,
        total: 1
      };
    }
  }

  // Créer une réponse d'erreur de rate limiting
  createErrorResponse(result: RateLimitResult): Response {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    if (this.config.headers) {
      headers.set('X-RateLimit-Limit', this.config.maxRequests.toString());
      headers.set('X-RateLimit-Remaining', result.remaining.toString());
      headers.set('X-RateLimit-Reset', result.reset.toString());
      
      if (result.retryAfter) {
        headers.set('Retry-After', result.retryAfter.toString());
      }
    }

    return new Response(
      JSON.stringify({
        error: 'Rate limit exceeded',
        message: this.config.message,
        retryAfter: result.retryAfter
      }),
      {
        status: this.config.statusCode,
        headers
      }
    );
  }
}

// Configuration par défaut
export const DEFAULT_RATE_LIMIT_CONFIG: RateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100,
  message: 'Trop de requêtes, veuillez réessayer plus tard.',
  statusCode: 429,
  headers: true
};

// Configuration stricte pour les routes sensibles
export const STRICT_RATE_LIMIT_CONFIG: RateLimitConfig = {
  windowMs: 5 * 60 * 1000, // 5 minutes
  maxRequests: 20,
  message: 'Trop de tentatives, veuillez réessayer dans 5 minutes.',
  statusCode: 429,
  headers: true
};

// Configuration pour les routes d'authentification
export const AUTH_RATE_LIMIT_CONFIG: RateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5,
  message: 'Trop de tentatives de connexion, veuillez réessayer plus tard.',
  statusCode: 429,
  headers: true
}; 