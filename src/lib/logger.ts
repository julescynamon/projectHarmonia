// src/lib/logger.ts
import pino from 'pino';
import { createClient } from '@supabase/supabase-js';

// Types pour les logs
export interface LogContext {
  userId?: string;
  sessionId?: string;
  requestId?: string;
  userAgent?: string;
  ip?: string;
  path?: string;
  method?: string;
  [key: string]: any;
}

export interface LogLevel {
  level: 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';
}

// Configuration du logger
const isDevelopment = import.meta.env?.DEV || process.env.NODE_ENV === 'development';
const isProduction = import.meta.env?.PROD || process.env.NODE_ENV === 'production';

// Configuration de base de Pino
const baseConfig = {
  level: isDevelopment ? 'debug' : 'info',
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level: (label: string) => {
      return { level: label };
    },
  },
  serializers: {
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
    err: pino.stdSerializers.err,
  },
};

// Configuration pour le développement (avec pretty printing)
const devConfig = {
  ...baseConfig,
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  },
};

// Configuration pour la production (JSON structuré)
const prodConfig = {
  ...baseConfig,
  level: 'info',
};

// Créer le logger principal
export const logger = pino(isDevelopment ? devConfig : prodConfig);

// Logger spécialisé pour les erreurs critiques
export const errorLogger = pino({
  ...baseConfig,
  level: 'error',
  name: 'error-logger',
});

// Logger pour les événements de sécurité
export const securityLogger = pino({
  ...baseConfig,
  level: 'warn',
  name: 'security-logger',
});

// Logger pour les transactions Stripe
export const stripeLogger = pino({
  ...baseConfig,
  level: 'info',
  name: 'stripe-logger',
});

// Logger pour les événements Supabase
export const supabaseLogger = pino({
  ...baseConfig,
  level: 'info',
  name: 'supabase-logger',
});

// Fonction utilitaire pour créer un logger avec contexte
export function createContextLogger(context: LogContext) {
  return logger.child(context);
}

// Fonction pour logger les erreurs avec contexte enrichi
export function logError(error: Error, context: LogContext = {}) {
  const errorLog = {
    ...context,
    error: {
      message: error.message,
      stack: error.stack,
      name: error.name,
    },
    timestamp: new Date().toISOString(),
  };

  errorLogger.error(errorLog);
  
  // En production, on peut aussi envoyer vers un service externe
  if (isProduction) {
    // TODO: Intégration avec service externe (Logtail, Sentry, etc.)
    console.error('Erreur critique:', errorLog);
  }
}

// Fonction pour logger les événements de sécurité
export function logSecurityEvent(event: string, context: LogContext = {}) {
  const securityLog = {
    ...context,
    event,
    timestamp: new Date().toISOString(),
  };

  securityLogger.warn(securityLog);
}

// Fonction pour logger les transactions Stripe
export function logStripeEvent(event: string, data: any, context: LogContext = {}) {
  const stripeLog = {
    ...context,
    event,
    data: {
      id: data.id,
      type: data.type,
      amount: data.amount,
      currency: data.currency,
      status: data.status,
    },
    timestamp: new Date().toISOString(),
  };

  stripeLogger.info(stripeLog);
}

// Fonction pour logger les événements Supabase
export function logSupabaseEvent(event: string, data: any, context: LogContext = {}) {
  const supabaseLog = {
    ...context,
    event,
    data: {
      table: data.table,
      action: data.action,
      recordId: data.record?.id,
    },
    timestamp: new Date().toISOString(),
  };

  supabaseLogger.info(supabaseLog);
}

// Middleware pour capturer automatiquement les requêtes
export function createRequestLogger() {
  return (req: any, res: any, next: any) => {
    const startTime = Date.now();
    const requestId = Math.random().toString(36).substring(7);
    
    const requestContext: LogContext = {
      requestId,
      method: req.method,
      path: req.url,
      userAgent: req.headers['user-agent'],
      ip: req.ip || req.connection.remoteAddress,
    };

    const requestLogger = createContextLogger(requestContext);
    
    requestLogger.info({
      message: 'Requête entrante',
      method: req.method,
      url: req.url,
    });

    // Capturer la réponse
    const originalSend = res.send;
    res.send = function(data: any) {
      const duration = Date.now() - startTime;
      
      requestLogger.info({
        message: 'Requête terminée',
        statusCode: res.statusCode,
        duration: `${duration}ms`,
      });

      return originalSend.call(this, data);
    };

    next();
  };
}

// Fonction pour exporter les logs vers Supabase (optionnel)
export async function exportLogsToSupabase(logs: any[]) {
  try {
    const supabase = createClient(
      import.meta.env.PUBLIC_SUPABASE_URL,
      import.meta.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Créer une table de logs si elle n'existe pas
    // Note: Cette table devrait être créée via une migration Supabase
    const { error } = await supabase
      .from('application_logs')
      .insert(logs);

    if (error) {
      logger.error('Erreur lors de l\'export des logs vers Supabase:', error);
    }
  } catch (error) {
    logger.error('Erreur lors de l\'export des logs:', error);
  }
}

// Fonction pour nettoyer les anciens logs (à exécuter périodiquement)
export async function cleanupOldLogs(daysToKeep: number = 30) {
  try {
    const supabase = createClient(
      import.meta.env.PUBLIC_SUPABASE_URL,
      import.meta.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const { error } = await supabase
      .from('application_logs')
      .delete()
      .lt('timestamp', cutoffDate.toISOString());

    if (error) {
      logger.error('Erreur lors du nettoyage des logs:', error);
    } else {
      logger.info(`Logs antérieurs à ${cutoffDate.toISOString()} supprimés`);
    }
  } catch (error) {
    logger.error('Erreur lors du nettoyage des logs:', error);
  }
}

export default logger; 