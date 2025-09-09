// src/middleware/cache.ts
import type { MiddlewareHandler } from 'astro';

export interface CacheConfig {
  staticAssets: {
    maxAge: number;
    immutable: boolean;
  };
  htmlPages: {
    maxAge: number;
    mustRevalidate: boolean;
  };
  apiResponses: {
    maxAge: number;
    staleWhileRevalidate: number;
  };
  images: {
    maxAge: number;
    immutable: boolean;
  };
  fonts: {
    maxAge: number;
    immutable: boolean;
  };
}

const DEFAULT_CACHE_CONFIG: CacheConfig = {
  staticAssets: {
    maxAge: 31536000, // 1 an
    immutable: true,
  },
  htmlPages: {
    maxAge: 3600, // 1 heure
    mustRevalidate: true,
  },
  apiResponses: {
    maxAge: 300, // 5 minutes
    staleWhileRevalidate: 3600, // 1 heure
  },
  images: {
    maxAge: 2592000, // 30 jours
    immutable: true,
  },
  fonts: {
    maxAge: 31536000, // 1 an
    immutable: true,
  },
};

export const onRequest: MiddlewareHandler = async (context, next) => {
  const response = await next();
  
  if (!response) return response;

  const headers = new Headers(response.headers);
  const pathname = context.url.pathname;
  const isProduction = import.meta.env.PROD;

  // Ne pas appliquer le cache en développement
  if (!isProduction) {
    return response;
  }

  // Configuration du cache selon le type de ressource
  if (isStaticAsset(pathname)) {
    const config = DEFAULT_CACHE_CONFIG.staticAssets;
    headers.set('Cache-Control', `public, max-age=${config.maxAge}${config.immutable ? ', immutable' : ''}`);
    headers.set('Vary', 'Accept-Encoding');
  }
  
  else if (isImage(pathname)) {
    const config = DEFAULT_CACHE_CONFIG.images;
    headers.set('Cache-Control', `public, max-age=${config.maxAge}${config.immutable ? ', immutable' : ''}`);
    headers.set('Vary', 'Accept-Encoding');
  }
  
  else if (isFont(pathname)) {
    const config = DEFAULT_CACHE_CONFIG.fonts;
    headers.set('Cache-Control', `public, max-age=${config.maxAge}${config.immutable ? ', immutable' : ''}`);
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Timing-Allow-Origin', '*');
  }
  
  else if (isApiEndpoint(pathname)) {
    const config = DEFAULT_CACHE_CONFIG.apiResponses;
    headers.set('Cache-Control', `public, max-age=${config.maxAge}, stale-while-revalidate=${config.staleWhileRevalidate}`);
    headers.set('Vary', 'Accept-Encoding, Accept');
  }
  
  else if (isHtmlPage(pathname)) {
    const config = DEFAULT_CACHE_CONFIG.htmlPages;
    headers.set('Cache-Control', `public, max-age=${config.maxAge}${config.mustRevalidate ? ', must-revalidate' : ''}`);
    headers.set('Vary', 'Accept-Encoding');
  }

  // Headers de performance
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('X-XSS-Protection', '1; mode=block');

  // Headers de compression
  const acceptEncoding = context.request.headers.get('accept-encoding') || '';
  if (acceptEncoding.includes('br')) {
    headers.set('Content-Encoding', 'br');
  } else if (acceptEncoding.includes('gzip')) {
    headers.set('Content-Encoding', 'gzip');
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};

// Fonctions utilitaires pour identifier les types de ressources
function isStaticAsset(pathname: string): boolean {
  return /\.(js|css|map)$/i.test(pathname);
}

function isImage(pathname: string): boolean {
  return /\.(png|jpg|jpeg|gif|svg|webp|avif|ico)$/i.test(pathname);
}

function isFont(pathname: string): boolean {
  return /\.(woff2|woff|ttf|eot|otf)$/i.test(pathname);
}

function isApiEndpoint(pathname: string): boolean {
  return pathname.startsWith('/api/');
}

function isHtmlPage(pathname: string): boolean {
  return pathname.endsWith('.html') || !pathname.includes('.');
}

// Configuration avancée du cache
export class CacheManager {
  private static cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  static set(key: string, data: any, ttl: number = 3600): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl * 1000,
    });
  }

  static get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    const now = Date.now();
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  static delete(key: string): boolean {
    return this.cache.delete(key);
  }

  static clear(): void {
    this.cache.clear();
  }

  static getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Middleware de cache pour les API
export const apiCacheMiddleware: MiddlewareHandler = async (context, next) => {
  const pathname = context.url.pathname;
  
  if (!isApiEndpoint(pathname)) {
    return next();
  }

  const cacheKey = `api:${pathname}:${context.url.search}`;
  const cachedResponse = CacheManager.get(cacheKey);

  if (cachedResponse) {
    return new Response(JSON.stringify(cachedResponse), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600',
        'X-Cache': 'HIT',
      },
    });
  }

  const response = await next();
  
  if (response && response.status === 200) {
    try {
      const responseData = await response.clone().json();
      CacheManager.set(cacheKey, responseData, 300); // 5 minutes
    } catch (error) {
      // Ignorer les erreurs de parsing JSON
    }
  }

  return response;
};

