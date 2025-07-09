// src/lib/monitoring.ts
import { logger } from './logger';

export interface MonitoringContext {
  userId?: string;
  sessionId?: string;
  action?: string;
  metadata?: Record<string, any>;
}

export interface Transaction {
  name: string;
  operation: string;
  startTime: number;
  context?: MonitoringContext;
  tags: Map<string, string>;
  measurements: Map<string, number>;
  setTag(key: string, value: string): Transaction;
  setMeasurement(key: string, value: number, unit?: string): Transaction;
  finish(): void;
  captureMessage(message: string, level?: 'info' | 'warning' | 'error', context?: MonitoringContext): void;
}

export interface Span {
  name: string;
  operation: string;
  startTime: number;
  data?: Record<string, any>;
  finish(): void;
}

export class MonitoringService {
  private static instance: MonitoringService;
  private metrics: Map<string, number[]> = new Map();
  private events: Array<{
    timestamp: number;
    type: string;
    data: any;
  }> = [];

  private constructor() {
    this.initializeMonitoring();
  }

  public static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  private initializeMonitoring() {
    logger.info('Système de monitoring initialisé');
    
    // Nettoyer les anciennes métriques toutes les heures
    setInterval(() => {
      this.cleanupOldMetrics();
    }, 60 * 60 * 1000);
  }

  private cleanupOldMetrics() {
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    this.events = this.events.filter(event => event.timestamp > oneHourAgo);
    
    // Garder seulement les 1000 dernières métriques par type
    for (const [key, values] of this.metrics.entries()) {
      if (values.length > 1000) {
        this.metrics.set(key, values.slice(-1000));
      }
    }
  }

  /**
   * Capture une erreur avec contexte
   */
  public captureError(error: Error, context?: MonitoringContext) {
    try {
      // Log local détaillé
      logger.error('🚨 Erreur capturée', { 
        error: error.message, 
        stack: error.stack,
        context,
        timestamp: new Date().toISOString(),
      });

      // Stocker l'événement
      this.events.push({
        timestamp: Date.now(),
        type: 'error',
        data: {
          message: error.message,
          stack: error.stack,
          context,
        }
      });

      // Log dans la console pour le développement
      if (process.env.NODE_ENV === 'development') {
        console.error('🚨 Erreur capturée:', {
          message: error.message,
          stack: error.stack,
          context,
          timestamp: new Date().toISOString(),
        });
      }

      // Alertes pour les erreurs critiques
      if (error.message.includes('database') || error.message.includes('connection')) {
        this.sendAlert('Erreur critique détectée', {
          error: error.message,
          context,
        });
      }

    } catch (monitoringError) {
      logger.error('Erreur lors de la capture:', { error: monitoringError });
    }
  }

  /**
   * Capture un message d'information
   */
  public captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info', context?: MonitoringContext) {
    try {
      // Log local
      if (level === 'info') {
        logger.info('Message capturé', { message, level, context });
      } else if (level === 'warning') {
        logger.warn('Message capturé', { message, level, context });
      } else if (level === 'error') {
        logger.error('Message capturé', { message, level, context });
      }

      // Stocker l'événement
      this.events.push({
        timestamp: Date.now(),
        type: 'message',
        data: {
          message,
          level,
          context,
        }
      });

      // Log dans la console pour le développement
      if (process.env.NODE_ENV === 'development') {
        const emoji = level === 'error' ? '🚨' : level === 'warning' ? '⚠️' : 'ℹ️';
        console.log(`${emoji} Message capturé:`, { message, level, context });
      }

      // Alertes pour les messages critiques
      if (level === 'error') {
        this.sendAlert('Message d\'erreur', {
          message,
          context,
        });
      }

    } catch (monitoringError) {
      logger.error('Erreur lors de la capture du message:', { error: monitoringError });
    }
  }

  /**
   * Démarre une transaction pour mesurer les performances
   */
  public startTransaction(name: string, operation: string, context?: MonitoringContext): Transaction {
    try {
      const startTime = Date.now();
      
      const transaction: Transaction = {
        name,
        operation,
        startTime,
        context,
        tags: new Map<string, string>(),
        measurements: new Map<string, number>(),
        
        setTag(key: string, value: string) {
          this.tags.set(key, value);
          return this;
        },
        
        setMeasurement(key: string, value: number, unit?: string) {
          this.measurements.set(key, value);
          return this;
        },
        
        finish() {
          const duration = Date.now() - this.startTime;
          
          // Log de la transaction
          logger.info('✅ Transaction terminée', {
            name: this.name,
            operation: this.operation,
            duration: `${duration}ms`,
            tags: Object.fromEntries(this.tags),
            measurements: Object.fromEntries(this.measurements),
            context: this.context,
          });

          // Stocker la métrique de durée
          const metricKey = `transaction_${this.name}`;
          if (!this.metrics.has(metricKey)) {
            this.metrics.set(metricKey, []);
          }
          this.metrics.get(metricKey)!.push(duration);

          // Stocker l'événement
          this.events.push({
            timestamp: Date.now(),
            type: 'transaction',
            data: {
              name: this.name,
              operation: this.operation,
              duration,
              tags: Object.fromEntries(this.tags),
              measurements: Object.fromEntries(this.measurements),
              context: this.context,
            }
          });

          // Alertes pour les transactions lentes
          if (duration > 1000) {
            monitoring.captureMessage(`Transaction lente: ${this.name} (${duration}ms)`, 'warning', this.context);
          }

          // Alertes pour les transactions très lentes
          if (duration > 5000) {
            monitoring.sendAlert('Transaction très lente détectée', {
              name: this.name,
              duration,
              context: this.context,
            });
          }
        },
        
        captureMessage: monitoring.captureMessage.bind(monitoring),
      };

      return transaction;
    } catch (error) {
      logger.error('Erreur lors du démarrage de la transaction:', { error });
      // Retourner une transaction factice en cas d'erreur
      return {
        name,
        operation,
        startTime: Date.now(),
        context,
        tags: new Map(),
        measurements: new Map(),
        setTag: () => this as any,
        setMeasurement: () => this as any,
        finish: () => {},
        captureMessage: () => {},
      };
    }
  }

  /**
   * Ajoute un span à la transaction courante
   */
  public addSpan(name: string, operation: string, data?: Record<string, any>): Span {
    try {
      const startTime = Date.now();
      
      const span: Span = {
        name,
        operation,
        startTime,
        data,
        
        finish() {
          const duration = Date.now() - this.startTime;
          
          logger.debug('Span terminé', {
            name: this.name,
            operation: this.operation,
            duration: `${duration}ms`,
            data: this.data,
          });

          // Stocker la métrique de durée
          const metricKey = `span_${this.name}`;
          if (!this.metrics.has(metricKey)) {
            this.metrics.set(metricKey, []);
          }
          this.metrics.get(metricKey)!.push(duration);
        },
      };

      return span;
    } catch (error) {
      logger.error('Erreur lors de l\'ajout du span:', { error });
      return {
        name,
        operation,
        startTime: Date.now(),
        data,
        finish: () => {},
      };
    }
  }

  /**
   * Capture les métriques de performance d'une API
   */
  public captureApiPerformance(url: string, method: string, duration: number, statusCode: number, context?: MonitoringContext) {
    try {
      // Log des performances
      logger.info('📊 Performance API', {
        url,
        method,
        duration: `${duration}ms`,
        statusCode,
        context,
      });

      // Stocker la métrique
      const metricKey = `api_${method}_${statusCode}`;
      if (!this.metrics.has(metricKey)) {
        this.metrics.set(metricKey, []);
      }
      this.metrics.get(metricKey)!.push(duration);

      // Stocker l'événement
      this.events.push({
        timestamp: Date.now(),
        type: 'api_performance',
        data: {
          url,
          method,
          duration,
          statusCode,
          context,
        }
      });

      // Alertes pour les API lentes
      if (duration > 1000) {
        this.captureMessage(`API lente: ${method} ${url} (${duration}ms)`, 'warning', context);
      }

      // Alertes pour les erreurs 5xx
      if (statusCode >= 500) {
        this.captureMessage(`Erreur serveur: ${method} ${url} (${statusCode})`, 'error', context);
        this.sendAlert('Erreur serveur détectée', {
          method,
          url,
          statusCode,
          context,
        });
      }

    } catch (error) {
      logger.error('Erreur lors de la capture des performances API:', { error });
    }
  }

  /**
   * Capture les erreurs Supabase
   */
  public captureSupabaseError(error: any, operation: string, context?: MonitoringContext) {
    try {
      const enhancedContext = {
        ...context,
        metadata: {
          ...context?.metadata,
          supabase_operation: operation,
          supabase_error_code: error?.code,
          supabase_message: error?.message,
        }
      };

      this.captureError(new Error(`Erreur Supabase: ${error?.message || 'Erreur inconnue'}`), enhancedContext);
      
      // Alertes spécifiques pour les erreurs de base de données
      this.sendAlert('Erreur Supabase détectée', {
        operation,
        error: error?.message,
        code: error?.code,
        context: enhancedContext,
      });

    } catch (monitoringError) {
      logger.error('Erreur lors de la capture de l\'erreur Supabase:', { error: monitoringError });
    }
  }

  /**
   * Capture les erreurs Stripe
   */
  public captureStripeError(error: any, operation: string, context?: MonitoringContext) {
    try {
      const enhancedContext = {
        ...context,
        metadata: {
          ...context?.metadata,
          stripe_operation: operation,
          stripe_error_type: error?.type,
          stripe_error_code: error?.code,
          stripe_decline_code: error?.decline_code,
        }
      };

      this.captureError(new Error(`Erreur Stripe: ${error?.message || 'Erreur inconnue'}`), enhancedContext);
      
      // Alertes spécifiques pour les erreurs de paiement
      this.sendAlert('Erreur Stripe détectée', {
        operation,
        error: error?.message,
        type: error?.type,
        code: error?.code,
        context: enhancedContext,
      });

    } catch (monitoringError) {
      logger.error('Erreur lors de la capture de l\'erreur Stripe:', { error: monitoringError });
    }
  }

  /**
   * Capture des métriques personnalisées
   */
  public captureMetric(name: string, value: number, tags?: Record<string, string>, context?: Record<string, any>) {
    try {
      // Log de la métrique
      logger.info('📈 Métrique capturée', { name, value, tags, context });

      // Stocker la métrique
      if (!this.metrics.has(name)) {
        this.metrics.set(name, []);
      }
      this.metrics.get(name)!.push(value);

      // Stocker l'événement
      this.events.push({
        timestamp: Date.now(),
        type: 'metric',
        data: {
          name,
          value,
          tags,
          context,
        }
      });

    } catch (error) {
      logger.error('Erreur lors de la capture de la métrique:', { error });
    }
  }

  /**
   * Capture des événements personnalisés
   */
  public captureEvent(name: string, properties?: Record<string, any>, context?: MonitoringContext) {
    try {
      // Log de l'événement
      logger.info('🎯 Événement capturé', { name, properties, context });

      // Stocker l'événement
      this.events.push({
        timestamp: Date.now(),
        type: 'event',
        data: {
          name,
          properties,
          context,
        }
      });

    } catch (error) {
      logger.error('Erreur lors de la capture de l\'événement:', { error });
    }
  }

  /**
   * Envoie une alerte (peut être étendue pour envoyer des emails, Slack, etc.)
   */
  public sendAlert(title: string, data: any) {
    try {
      logger.warn(`🚨 ALERTE: ${title}`, data);
      
      // Ici vous pouvez ajouter l'envoi d'emails, notifications Slack, etc.
      // Exemple avec email (si configuré) :
      // await sendAlertEmail(title, data);
      
    } catch (error) {
      logger.error('Erreur lors de l\'envoi de l\'alerte:', { error });
    }
  }

  /**
   * Récupère les statistiques de monitoring
   */
  public getStats() {
    const now = Date.now();
    const oneHourAgo = now - (60 * 60 * 1000);
    const oneDayAgo = now - (24 * 60 * 60 * 1000);

    const recentEvents = this.events.filter(event => event.timestamp > oneHourAgo);
    const dailyEvents = this.events.filter(event => event.timestamp > oneDayAgo);

    const stats = {
      totalEvents: this.events.length,
      recentEvents: recentEvents.length,
      dailyEvents: dailyEvents.length,
      errors: this.events.filter(e => e.type === 'error').length,
      warnings: this.events.filter(e => e.type === 'message' && e.data.level === 'warning').length,
      metrics: Object.fromEntries(
        Array.from(this.metrics.entries()).map(([key, values]) => [
          key,
          {
            count: values.length,
            average: values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0,
            min: values.length > 0 ? Math.min(...values) : 0,
            max: values.length > 0 ? Math.max(...values) : 0,
          }
        ])
      ),
    };

    return stats;
  }

  /**
   * Exporte les données de monitoring (pour analyse externe)
   */
  public exportData() {
    return {
      events: this.events,
      metrics: Object.fromEntries(this.metrics),
      stats: this.getStats(),
      timestamp: new Date().toISOString(),
    };
  }
}

// Instance singleton
export const monitoring = MonitoringService.getInstance(); 