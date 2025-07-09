// src/lib/log-export.ts
import { logger } from './logger';

// Interface pour les services d'export de logs
export interface LogExportService {
  name: string;
  sendLogs(logs: any[]): Promise<void>;
  sendLog(log: any): Promise<void>;
}

// Configuration pour les services d'export
export interface LogExportConfig {
  enabled: boolean;
  batchSize?: number;
  flushInterval?: number; // en millisecondes
  services: LogExportService[];
}

// Service d'export vers Logtail
export class LogtailService implements LogExportService {
  name = 'logtail';
  private apiKey: string;
  private endpoint: string;

  constructor(apiKey: string, endpoint: string = 'https://in.logtail.com') {
    this.apiKey = apiKey;
    this.endpoint = endpoint;
  }

  async sendLogs(logs: any[]): Promise<void> {
    try {
      const response = await fetch(`${this.endpoint}/logs`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logs),
      });

      if (!response.ok) {
        throw new Error(`Logtail API error: ${response.status} ${response.statusText}`);
      }

      logger.debug(`Logs envoyés vers Logtail: ${logs.length} entrées`);
    } catch (error) {
      logger.error('Erreur lors de l\'envoi vers Logtail:', error);
      throw error;
    }
  }

  async sendLog(log: any): Promise<void> {
    await this.sendLogs([log]);
  }
}

// Service d'export vers Supabase (table de logs)
export class SupabaseLogService implements LogExportService {
  name = 'supabase';
  private supabase: any;

  constructor(supabaseClient: any) {
    this.supabase = supabaseClient;
  }

  async sendLogs(logs: any[]): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('application_logs')
        .insert(logs);

      if (error) {
        throw new Error(`Supabase error: ${error.message}`);
      }

      logger.debug(`Logs envoyés vers Supabase: ${logs.length} entrées`);
    } catch (error) {
      logger.error('Erreur lors de l\'envoi vers Supabase:', error);
      throw error;
    }
  }

  async sendLog(log: any): Promise<void> {
    await this.sendLogs([log]);
  }
}

// Service d'export vers un webhook personnalisé
export class WebhookLogService implements LogExportService {
  name = 'webhook';
  private webhookUrl: string;
  private headers: Record<string, string>;

  constructor(webhookUrl: string, headers: Record<string, string> = {}) {
    this.webhookUrl = webhookUrl;
    this.headers = {
      'Content-Type': 'application/json',
      ...headers,
    };
  }

  async sendLogs(logs: any[]): Promise<void> {
    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({ logs }),
      });

      if (!response.ok) {
        throw new Error(`Webhook error: ${response.status} ${response.statusText}`);
      }

      logger.debug(`Logs envoyés vers webhook: ${logs.length} entrées`);
    } catch (error) {
      logger.error('Erreur lors de l\'envoi vers webhook:', error);
      throw error;
    }
  }

  async sendLog(log: any): Promise<void> {
    await this.sendLogs([log]);
  }
}

// Gestionnaire principal d'export de logs
export class LogExporter {
  private config: LogExportConfig;
  private logBuffer: any[] = [];
  private flushTimer: NodeJS.Timeout | null = null;

  constructor(config: LogExportConfig) {
    this.config = config;
    this.setupFlushTimer();
  }

  private setupFlushTimer(): void {
    if (this.config.flushInterval && this.config.enabled) {
      this.flushTimer = setInterval(() => {
        this.flush();
      }, this.config.flushInterval);
    }
  }

  async addLog(log: any): Promise<void> {
    if (!this.config.enabled) {
      return;
    }

    this.logBuffer.push({
      ...log,
      timestamp: new Date().toISOString(),
    });

    // Flush si le buffer est plein
    if (this.config.batchSize && this.logBuffer.length >= this.config.batchSize) {
      await this.flush();
    }
  }

  async flush(): Promise<void> {
    if (this.logBuffer.length === 0) {
      return;
    }

    const logsToSend = [...this.logBuffer];
    this.logBuffer = [];

    // Envoyer vers tous les services configurés
    const promises = this.config.services.map(async (service) => {
      try {
        await service.sendLogs(logsToSend);
      } catch (error) {
        logger.error(`Erreur lors de l'envoi vers ${service.name}:`, error);
      }
    });

    await Promise.allSettled(promises);
  }

  async shutdown(): Promise<void> {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }

    await this.flush();
  }
}

// Configuration par défaut
export function createDefaultLogExporter(): LogExporter {
  const services: LogExportService[] = [];

  // Ajouter Logtail si configuré
  if (import.meta.env?.LOGTAIL_API_KEY || process.env.LOGTAIL_API_KEY) {
    services.push(new LogtailService(import.meta.env?.LOGTAIL_API_KEY || process.env.LOGTAIL_API_KEY || ''));
  }

  // Ajouter Supabase si configuré
  if ((import.meta.env?.PUBLIC_SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL) && 
      (import.meta.env?.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)) {
    // Note: Il faudrait importer le client Supabase ici
    // services.push(new SupabaseLogService(supabaseClient));
  }

  // Ajouter webhook si configuré
  if (import.meta.env?.LOG_WEBHOOK_URL || process.env.LOG_WEBHOOK_URL) {
    const webhookUrl = import.meta.env?.LOG_WEBHOOK_URL || process.env.LOG_WEBHOOK_URL || '';
    const headers: Record<string, string> = {};
    if (import.meta.env?.LOG_WEBHOOK_AUTH || process.env.LOG_WEBHOOK_AUTH) {
      headers['Authorization'] = import.meta.env?.LOG_WEBHOOK_AUTH || process.env.LOG_WEBHOOK_AUTH || '';
    }
    services.push(new WebhookLogService(webhookUrl, headers));
  }

  const config: LogExportConfig = {
    enabled: services.length > 0,
    batchSize: 10,
    flushInterval: 5000, // 5 secondes
    services,
  };

  return new LogExporter(config);
}

// Instance globale de l'exporteur de logs
export const logExporter = createDefaultLogExporter();

// Fonction utilitaire pour envoyer un log immédiatement
export async function sendLogImmediately(log: any): Promise<void> {
  await logExporter.addLog(log);
  await logExporter.flush();
} 