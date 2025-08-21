// src/pages/api/monitoring/stats.ts
import type { APIRoute } from 'astro';
import { monitoring } from '../../../lib/monitoring';
import { logger } from '../../../lib/logger';

const statsHandler = async ({ request, locals }: { request: Request; locals: any }) => {
  try {
    const stats = monitoring.getStats();
    const exportData = monitoring.exportData();

    // Log de la demande de statistiques
    logger.info('📊 Statistiques de monitoring demandées', {
      userId: locals?.user?.id,
      totalEvents: stats.totalEvents,
      recentEvents: stats.recentEvents,
    });

    return new Response(JSON.stringify({
      success: true,
      stats,
      exportData,
      timestamp: new Date().toISOString(),
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });

  } catch (error) {
    logger.error('Erreur lors de la récupération des statistiques:', error);
    
    monitoring.captureError(error as Error, {
      userId: locals?.user?.id,
      action: 'get_monitoring_stats',
      metadata: {
        endpoint: '/api/monitoring/stats',
      }
    });

    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Erreur lors de la récupération des statistiques' 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

export const GET = statsHandler; 