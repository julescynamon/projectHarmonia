import { a as logger } from './logger_D2N0LYGt.mjs';

class MonitoringService {
  static instance;
  metrics = /* @__PURE__ */ new Map();
  events = [];
  constructor() {
    this.initializeMonitoring();
  }
  static getInstance() {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }
  initializeMonitoring() {
    logger.info("Système de monitoring initialisé");
    setInterval(() => {
      this.cleanupOldMetrics();
    }, 60 * 60 * 1e3);
  }
  cleanupOldMetrics() {
    const oneHourAgo = Date.now() - 60 * 60 * 1e3;
    this.events = this.events.filter((event) => event.timestamp > oneHourAgo);
    for (const [key, values] of this.metrics.entries()) {
      if (values.length > 1e3) {
        this.metrics.set(key, values.slice(-1e3));
      }
    }
  }
  /**
   * Capture une erreur avec contexte
   */
  captureError(error, context) {
    try {
      logger.error("🚨 Erreur capturée", {
        error: error.message,
        stack: error.stack,
        context,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
      this.events.push({
        timestamp: Date.now(),
        type: "error",
        data: {
          message: error.message,
          stack: error.stack,
          context
        }
      });
      if (process.env.NODE_ENV === "development") {
        console.error("🚨 Erreur capturée:", {
          message: error.message,
          stack: error.stack,
          context,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        });
      }
      if (error.message.includes("database") || error.message.includes("connection")) {
        this.sendAlert("Erreur critique détectée", {
          error: error.message,
          context
        });
      }
    } catch (monitoringError) {
      logger.error("Erreur lors de la capture:", { error: monitoringError });
    }
  }
  /**
   * Capture un message d'information
   */
  captureMessage(message, level = "info", context) {
    try {
      if (level === "info") {
        logger.info("Message capturé", { message, level, context });
      } else if (level === "warning") {
        logger.warn("Message capturé", { message, level, context });
      } else if (level === "error") {
        logger.error("Message capturé", { message, level, context });
      }
      this.events.push({
        timestamp: Date.now(),
        type: "message",
        data: {
          message,
          level,
          context
        }
      });
      if (process.env.NODE_ENV === "development") {
        const emoji = level === "error" ? "🚨" : level === "warning" ? "⚠️" : "ℹ️";
        console.log(`${emoji} Message capturé:`, { message, level, context });
      }
      if (level === "error") {
        this.sendAlert("Message d'erreur", {
          message,
          context
        });
      }
    } catch (monitoringError) {
      logger.error("Erreur lors de la capture du message:", { error: monitoringError });
    }
  }
  /**
   * Démarre une transaction pour mesurer les performances
   */
  startTransaction(name, operation, context) {
    try {
      const startTime = Date.now();
      const transaction = {
        name,
        operation,
        startTime,
        context,
        tags: /* @__PURE__ */ new Map(),
        measurements: /* @__PURE__ */ new Map(),
        setTag(key, value) {
          this.tags.set(key, value);
          return this;
        },
        setMeasurement(key, value, unit) {
          this.measurements.set(key, value);
          return this;
        },
        finish() {
          const duration = Date.now() - this.startTime;
          logger.info("✅ Transaction terminée", {
            name: this.name,
            operation: this.operation,
            duration: `${duration}ms`,
            tags: Object.fromEntries(this.tags),
            measurements: Object.fromEntries(this.measurements),
            context: this.context
          });
          const metricKey = `transaction_${this.name}`;
          if (!this.metrics.has(metricKey)) {
            this.metrics.set(metricKey, []);
          }
          this.metrics.get(metricKey).push(duration);
          this.events.push({
            timestamp: Date.now(),
            type: "transaction",
            data: {
              name: this.name,
              operation: this.operation,
              duration,
              tags: Object.fromEntries(this.tags),
              measurements: Object.fromEntries(this.measurements),
              context: this.context
            }
          });
          if (duration > 1e3) {
            monitoring.captureMessage(`Transaction lente: ${this.name} (${duration}ms)`, "warning", this.context);
          }
          if (duration > 5e3) {
            monitoring.sendAlert("Transaction très lente détectée", {
              name: this.name,
              duration,
              context: this.context
            });
          }
        },
        captureMessage: monitoring.captureMessage.bind(monitoring)
      };
      return transaction;
    } catch (error) {
      logger.error("Erreur lors du démarrage de la transaction:", { error });
      return {
        name,
        operation,
        startTime: Date.now(),
        context,
        tags: /* @__PURE__ */ new Map(),
        measurements: /* @__PURE__ */ new Map(),
        setTag: () => this,
        setMeasurement: () => this,
        finish: () => {
        },
        captureMessage: () => {
        }
      };
    }
  }
  /**
   * Ajoute un span à la transaction courante
   */
  addSpan(name, operation, data) {
    try {
      const startTime = Date.now();
      const span = {
        name,
        operation,
        startTime,
        data,
        finish() {
          const duration = Date.now() - this.startTime;
          logger.debug("Span terminé", {
            name: this.name,
            operation: this.operation,
            duration: `${duration}ms`,
            data: this.data
          });
          const metricKey = `span_${this.name}`;
          if (!this.metrics.has(metricKey)) {
            this.metrics.set(metricKey, []);
          }
          this.metrics.get(metricKey).push(duration);
        }
      };
      return span;
    } catch (error) {
      logger.error("Erreur lors de l'ajout du span:", { error });
      return {
        name,
        operation,
        startTime: Date.now(),
        data,
        finish: () => {
        }
      };
    }
  }
  /**
   * Capture les métriques de performance d'une API
   */
  captureApiPerformance(url, method, duration, statusCode, context) {
    try {
      logger.info("📊 Performance API", {
        url,
        method,
        duration: `${duration}ms`,
        statusCode,
        context
      });
      const metricKey = `api_${method}_${statusCode}`;
      if (!this.metrics.has(metricKey)) {
        this.metrics.set(metricKey, []);
      }
      this.metrics.get(metricKey).push(duration);
      this.events.push({
        timestamp: Date.now(),
        type: "api_performance",
        data: {
          url,
          method,
          duration,
          statusCode,
          context
        }
      });
      if (duration > 1e3) {
        this.captureMessage(`API lente: ${method} ${url} (${duration}ms)`, "warning", context);
      }
      if (statusCode >= 500) {
        this.captureMessage(`Erreur serveur: ${method} ${url} (${statusCode})`, "error", context);
        this.sendAlert("Erreur serveur détectée", {
          method,
          url,
          statusCode,
          context
        });
      }
    } catch (error) {
      logger.error("Erreur lors de la capture des performances API:", { error });
    }
  }
  /**
   * Capture les erreurs Supabase
   */
  captureSupabaseError(error, operation, context) {
    try {
      const enhancedContext = {
        ...context,
        metadata: {
          ...context?.metadata,
          supabase_operation: operation,
          supabase_error_code: error?.code,
          supabase_message: error?.message
        }
      };
      this.captureError(new Error(`Erreur Supabase: ${error?.message || "Erreur inconnue"}`), enhancedContext);
      this.sendAlert("Erreur Supabase détectée", {
        operation,
        error: error?.message,
        code: error?.code,
        context: enhancedContext
      });
    } catch (monitoringError) {
      logger.error("Erreur lors de la capture de l'erreur Supabase:", { error: monitoringError });
    }
  }
  /**
   * Capture les erreurs Stripe
   */
  captureStripeError(error, operation, context) {
    try {
      const enhancedContext = {
        ...context,
        metadata: {
          ...context?.metadata,
          stripe_operation: operation,
          stripe_error_type: error?.type,
          stripe_error_code: error?.code,
          stripe_decline_code: error?.decline_code
        }
      };
      this.captureError(new Error(`Erreur Stripe: ${error?.message || "Erreur inconnue"}`), enhancedContext);
      this.sendAlert("Erreur Stripe détectée", {
        operation,
        error: error?.message,
        type: error?.type,
        code: error?.code,
        context: enhancedContext
      });
    } catch (monitoringError) {
      logger.error("Erreur lors de la capture de l'erreur Stripe:", { error: monitoringError });
    }
  }
  /**
   * Capture des métriques personnalisées
   */
  captureMetric(name, value, tags, context) {
    try {
      logger.info("📈 Métrique capturée", { name, value, tags, context });
      if (!this.metrics.has(name)) {
        this.metrics.set(name, []);
      }
      this.metrics.get(name).push(value);
      this.events.push({
        timestamp: Date.now(),
        type: "metric",
        data: {
          name,
          value,
          tags,
          context
        }
      });
    } catch (error) {
      logger.error("Erreur lors de la capture de la métrique:", { error });
    }
  }
  /**
   * Capture des événements personnalisés
   */
  captureEvent(name, properties, context) {
    try {
      logger.info("🎯 Événement capturé", { name, properties, context });
      this.events.push({
        timestamp: Date.now(),
        type: "event",
        data: {
          name,
          properties,
          context
        }
      });
    } catch (error) {
      logger.error("Erreur lors de la capture de l'événement:", { error });
    }
  }
  /**
   * Envoie une alerte (peut être étendue pour envoyer des emails, Slack, etc.)
   */
  sendAlert(title, data) {
    try {
      logger.warn(`🚨 ALERTE: ${title}`, data);
    } catch (error) {
      logger.error("Erreur lors de l'envoi de l'alerte:", { error });
    }
  }
  /**
   * Récupère les statistiques de monitoring
   */
  getStats() {
    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1e3;
    const oneDayAgo = now - 24 * 60 * 60 * 1e3;
    const recentEvents = this.events.filter((event) => event.timestamp > oneHourAgo);
    const dailyEvents = this.events.filter((event) => event.timestamp > oneDayAgo);
    const stats = {
      totalEvents: this.events.length,
      recentEvents: recentEvents.length,
      dailyEvents: dailyEvents.length,
      errors: this.events.filter((e) => e.type === "error").length,
      warnings: this.events.filter((e) => e.type === "message" && e.data.level === "warning").length,
      metrics: Object.fromEntries(
        Array.from(this.metrics.entries()).map(([key, values]) => [
          key,
          {
            count: values.length,
            average: values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0,
            min: values.length > 0 ? Math.min(...values) : 0,
            max: values.length > 0 ? Math.max(...values) : 0
          }
        ])
      )
    };
    return stats;
  }
  /**
   * Exporte les données de monitoring (pour analyse externe)
   */
  exportData() {
    return {
      events: this.events,
      metrics: Object.fromEntries(this.metrics),
      stats: this.getStats(),
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
}
const monitoring = MonitoringService.getInstance();

export { monitoring as m };
