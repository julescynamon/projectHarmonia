import { m as monitoring } from '../../../chunks/monitoring_CEn0FETp.mjs';
import { a as logger } from '../../../chunks/logger_NznGTdCm.mjs';
export { renderers } from '../../../renderers.mjs';

const statsHandler = async ({ request, locals }) => {
  try {
    const stats = monitoring.getStats();
    const exportData = monitoring.exportData();
    logger.info("📊 Statistiques de monitoring demandées", {
      userId: locals?.user?.id,
      totalEvents: stats.totalEvents,
      recentEvents: stats.recentEvents
    });
    return new Response(JSON.stringify({
      success: true,
      stats,
      exportData,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate"
      }
    });
  } catch (error) {
    logger.error("Erreur lors de la récupération des statistiques:", error);
    monitoring.captureError(error, {
      userId: locals?.user?.id,
      action: "get_monitoring_stats",
      metadata: {
        endpoint: "/api/monitoring/stats"
      }
    });
    return new Response(JSON.stringify({
      success: false,
      error: "Erreur lors de la récupération des statistiques"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};
const GET = statsHandler;

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
