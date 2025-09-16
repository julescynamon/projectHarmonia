export const prerender = false;

// src/pages/api/monitoring/client-data.ts
import type { APIRoute } from 'astro';
import { monitoring } from '../../../lib/monitoring';
import { logger } from '../../../lib/logger';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const clientData = await request.json();
    
    // Log des données reçues
    logger.info('📊 Données de monitoring côté client reçues', {
      eventsCount: clientData.events?.length || 0,
      metricsCount: Object.keys(clientData.metrics || {}).length,
      stats: clientData.stats,
    });

    // Traiter les événements d'erreur
    if (clientData.events) {
      const errors = clientData.events.filter((event: any) => event.data.name === 'error');
      const warnings = clientData.events.filter((event: any) => event.data.name === 'warning');

      // Capturer les erreurs côté serveur
      errors.forEach((errorEvent: any) => {
        monitoring.captureError(new Error(errorEvent.data.message || 'Erreur côté client'), {
          userId: locals?.user?.id,
          action: 'client_error',
          metadata: {
            type: errorEvent.data.type,
            url: errorEvent.data.url,
            userAgent: errorEvent.data.userAgent,
            timestamp: new Date(errorEvent.timestamp).toISOString(),
          }
        });
      });

      // Capturer les avertissements
      warnings.forEach((warningEvent: any) => {
        monitoring.captureMessage(warningEvent.data.message || 'Avertissement côté client', 'warning', {
          userId: locals?.user?.id,
          action: 'client_warning',
          metadata: {
            type: warningEvent.data.type,
            url: warningEvent.data.url,
            userAgent: warningEvent.data.userAgent,
            timestamp: new Date(warningEvent.timestamp).toISOString(),
          }
        });
      });
    }

    // Traiter les métriques
    if (clientData.metrics) {
      Object.entries(clientData.metrics).forEach(([name, values]) => {
        if (Array.isArray(values) && values.length > 0) {
          const average = values.reduce((a: number, b: number) => a + b, 0) / values.length;
          monitoring.captureMetric(`client_${name}`, average, {
            source: 'client',
            count: values.length.toString(),
          });
        }
      });
    }

    // Capturer un événement de réception
    monitoring.captureEvent('client_data_received', {
      eventsCount: clientData.events?.length || 0,
      metricsCount: Object.keys(clientData.metrics || {}).length,
      hasErrors: clientData.stats?.errors > 0,
      hasWarnings: clientData.stats?.warnings > 0,
    }, {
      userId: locals?.user?.id,
      action: 'client_monitoring_sync',
    });

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Données de monitoring reçues avec succès',
      processed: {
        events: clientData.events?.length || 0,
        metrics: Object.keys(clientData.metrics || {}).length,
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    logger.error('Erreur lors du traitement des données de monitoring côté client:', error);
    
    monitoring.captureError(error as Error, {
      userId: locals?.user?.id,
      action: 'client_data_processing_error',
      metadata: {
        endpoint: '/api/monitoring/client-data',
      }
    });

    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Erreur lors du traitement des données' 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}; 