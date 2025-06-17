import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase.d';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresIn: number;
  size: number; // Taille approximative en octets
}

interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  itemCount: number;
}

interface CacheOptions {
  maxSize?: number; // Taille maximale en octets
  maxItems?: number; // Nombre maximum d'éléments
  persistToDatabase?: boolean; // Persistance dans Supabase
  cleanupInterval?: number; // Intervalle de nettoyage en ms
}

export class Cache {
  private static instance: Cache;
  private cache: Map<string, CacheItem<any>>;
  private stats: CacheStats;
  private options: Required<CacheOptions>;
  private cleanupInterval: NodeJS.Timeout | null = null;
  private supabase = createClient<Database>(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY
  );
  
  private constructor(options: CacheOptions = {}) {
    this.cache = new Map();
    this.stats = {
      hits: 0,
      misses: 0,
      size: 0,
      itemCount: 0
    };
    
    // Options par défaut
    this.options = {
      maxSize: options.maxSize || 100 * 1024 * 1024, // 100MB par défaut
      maxItems: options.maxItems || 1000,
      persistToDatabase: options.persistToDatabase || false,
      cleanupInterval: options.cleanupInterval || 5 * 60 * 1000 // 5 minutes
    };

    // Démarrer le nettoyage automatique
    this.startCleanup();
  }

  public static getInstance(options?: CacheOptions): Cache {
    if (!Cache.instance) {
      Cache.instance = new Cache(options);
    }
    return Cache.instance;
  }

  private async persistToDatabase<T>(key: string, item: CacheItem<T>): Promise<void> {
    if (!this.options.persistToDatabase) return;

    try {
      const { error } = await this.supabase
        .from('cache')
        .upsert({
          key,
          data: item.data,
          timestamp: new Date(item.timestamp).toISOString(),
          expires_in: item.expiresIn / 1000, // Convertir en secondes
          size: item.size
        });

      if (error) {
        console.error('Erreur lors de la persistance du cache:', error);
      }
    } catch (error) {
      console.error('Erreur lors de la persistance du cache:', error);
    }
  }

  private async loadFromDatabase(key: string): Promise<CacheItem<any> | null> {
    if (!this.options.persistToDatabase) return null;

    try {
      const { data, error } = await this.supabase
        .from('cache')
        .select('*')
        .eq('key', key)
        .single();

      if (error || !data) return null;

      const item: CacheItem<any> = {
        data: data.data,
        timestamp: new Date(data.timestamp).getTime(),
        expiresIn: (data.expires_in || 0) * 1000, // Convertir en millisecondes
        size: data.size
      };

      // Vérifier si l'élément est expiré
      if (Date.now() - item.timestamp > item.expiresIn) {
        await this.delete(key);
        return null;
      }

      return item;
    } catch (error) {
      console.error('Erreur lors du chargement du cache:', error);
      return null;
    }
  }

  private calculateItemSize<T>(item: T): number {
    try {
      return new Blob([JSON.stringify(item)]).size;
    } catch {
      return 0;
    }
  }

  private async cleanup(): Promise<void> {
    const now = Date.now();
    let newSize = 0;
    let newCount = 0;

    // Nettoyer les éléments expirés
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.expiresIn) {
        this.cache.delete(key);
        if (this.options.persistToDatabase) {
          await this.supabase
            .from('cache')
            .delete()
            .eq('key', key);
        }
      } else {
        newSize += item.size;
        newCount++;
      }
    }

    this.stats.size = newSize;
    this.stats.itemCount = newCount;
  }

  private startCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }

    this.cleanupInterval = setInterval(() => {
      this.cleanup().catch(console.error);
    }, this.options.cleanupInterval);
  }

  public async set<T>(key: string, data: T, expiresIn: number = 5 * 60 * 1000): Promise<void> {
    const size = this.calculateItemSize(data);
    
    // Vérifier si l'ajout dépasserait la limite de taille
    if (this.stats.size + size > this.options.maxSize) {
      await this.cleanup(); // Nettoyer avant d'ajouter
      if (this.stats.size + size > this.options.maxSize) {
        throw new Error('Limite de taille du cache dépassée');
      }
    }

    // Vérifier si l'ajout dépasserait la limite d'éléments
    if (this.stats.itemCount >= this.options.maxItems) {
      await this.cleanup(); // Nettoyer avant d'ajouter
      if (this.stats.itemCount >= this.options.maxItems) {
        throw new Error('Limite d\'éléments du cache dépassée');
      }
    }

    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      expiresIn,
      size
    };

    this.cache.set(key, item);
    this.stats.size += size;
    this.stats.itemCount++;

    if (this.options.persistToDatabase) {
      await this.persistToDatabase(key, item);
    }
  }

  public async get<T>(key: string): Promise<T | null> {
    let item = this.cache.get(key);

    // Si l'élément n'est pas en mémoire et que la persistance est activée
    if (!item && this.options.persistToDatabase) {
      item = await this.loadFromDatabase(key);
      if (item) {
        this.cache.set(key, item);
        this.stats.size += item.size;
        this.stats.itemCount++;
      }
    }

    if (!item) {
      this.stats.misses++;
      return null;
    }

    const now = Date.now();
    if (now - item.timestamp > item.expiresIn) {
      await this.delete(key);
      this.stats.misses++;
      return null;
    }

    this.stats.hits++;
    return item.data as T;
  }

  public async clear(): Promise<void> {
    this.cache.clear();
    this.stats = {
      hits: 0,
      misses: 0,
      size: 0,
      itemCount: 0
    };

    if (this.options.persistToDatabase) {
      await this.supabase
        .from('cache')
        .delete()
        .neq('key', '');
    }
  }

  public async delete(key: string): Promise<void> {
    const item = this.cache.get(key);
    if (item) {
      this.stats.size -= item.size;
      this.stats.itemCount--;
    }
    
    this.cache.delete(key);

    if (this.options.persistToDatabase) {
      await this.supabase
        .from('cache')
        .delete()
        .eq('key', key);
    }
  }

  public getStats(): CacheStats {
    return { ...this.stats };
  }

  public setOptions(options: Partial<CacheOptions>): void {
    this.options = {
      ...this.options,
      ...options
    };
    this.startCleanup();
  }
}

// Export une instance par défaut avec les options par défaut
export const cache = Cache.getInstance();
