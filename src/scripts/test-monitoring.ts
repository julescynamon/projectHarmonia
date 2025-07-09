// src/scripts/test-monitoring.ts
// Script pour tester le système de monitoring personnalisé

import { monitoring } from '../lib/monitoring';
import { logger } from '../lib/logger';

async function testMonitoring() {
  logger.info('🧪 Démarrage des tests de monitoring personnalisé...');

  try {
    // Test 1: Capture d'un message d'information
    logger.info('Test 1: Capture d\'un message d\'information');
    monitoring.captureMessage('Test de monitoring - message info', 'info', {
      action: 'test_monitoring',
      metadata: { test_type: 'info_message' }
    });

    // Test 2: Capture d'un message d'avertissement
    logger.info('Test 2: Capture d\'un message d\'avertissement');
    monitoring.captureMessage('Test de monitoring - message warning', 'warning', {
      action: 'test_monitoring',
      metadata: { test_type: 'warning_message' }
    });

    // Test 3: Capture d'une erreur simulée
    logger.info('Test 3: Capture d\'une erreur simulée');
    const testError = new Error('Erreur de test pour le monitoring');
    monitoring.captureError(testError, {
      action: 'test_monitoring',
      metadata: { test_type: 'simulated_error' }
    });

    // Test 4: Test de transaction
    logger.info('Test 4: Test de transaction');
    const transaction = monitoring.startTransaction('test_transaction', 'test.operation', {
      action: 'test_monitoring',
      metadata: { test_type: 'transaction_test' }
    });

    if (transaction) {
      // Simuler un délai
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Ajouter un span
      const span = monitoring.addSpan('test_span', 'test.suboperation', {
        test_data: 'données de test'
      });

      if (span) {
        await new Promise(resolve => setTimeout(resolve, 50));
        span.finish();
      }

      transaction.setTag('test_result', 'success');
      transaction.finish();
    }

    // Test 5: Test de performance API simulée
    logger.info('Test 5: Test de performance API simulée');
    monitoring.captureApiPerformance(
      'https://api.example.com/test',
      'GET',
      1500, // 1.5 secondes
      200,
      {
        action: 'test_monitoring',
        metadata: { test_type: 'api_performance' }
      }
    );

    // Test 6: Test d'erreur Supabase simulée
    logger.info('Test 6: Test d\'erreur Supabase simulée');
    const supabaseError = {
      message: 'Erreur de connexion à la base de données',
      code: 'PGRST301',
      details: 'Connection timeout'
    };
    monitoring.captureSupabaseError(supabaseError, 'test_query', {
      action: 'test_monitoring',
      metadata: { test_type: 'supabase_error' }
    });

    // Test 7: Test d'erreur Stripe simulée
    logger.info('Test 7: Test d\'erreur Stripe simulée');
    const stripeError = {
      message: 'Card declined',
      type: 'card_error',
      code: 'card_declined',
      decline_code: 'insufficient_funds'
    };
    monitoring.captureStripeError(stripeError, 'test_payment', {
      action: 'test_monitoring',
      metadata: { test_type: 'stripe_error' }
    });

    // Test 8: Test de métriques multiples
    logger.info('Test 8: Test de métriques multiples');
    const multiTransaction = monitoring.startTransaction('multi_metrics_test', 'test.multi', {
      action: 'test_monitoring',
      metadata: { test_type: 'multi_metrics' }
    });

    if (multiTransaction) {
      // Simuler plusieurs opérations
      const operations = ['op1', 'op2', 'op3'];
      
      for (const op of operations) {
        const opSpan = monitoring.addSpan(`operation_${op}`, 'test.operation', {
          operation_name: op,
          operation_index: operations.indexOf(op)
        });

        if (opSpan) {
          await new Promise(resolve => setTimeout(resolve, 100));
          opSpan.finish();
        }
      }

      multiTransaction.setTag('operations_count', operations.length.toString());
      multiTransaction.setTag('test_result', 'success');
      multiTransaction.finish();
    }

    // Test 9: Test de métriques personnalisées
    logger.info('Test 9: Test de métriques personnalisées');
    monitoring.captureMetric('custom_metric', 42, {
      test_type: 'custom_metric',
      value_type: 'number'
    });

    // Test 10: Test d'événements personnalisés
    logger.info('Test 10: Test d\'événements personnalisés');
    monitoring.captureEvent('test_event', {
      event_type: 'test',
      timestamp: new Date().toISOString(),
      data: { test: true }
    }, {
      action: 'test_monitoring',
      metadata: { test_type: 'custom_event' }
    });

    // Test 11: Test de transaction lente (pour tester les alertes)
    logger.info('Test 11: Test de transaction lente');
    const slowTransaction = monitoring.startTransaction('slow_transaction', 'test.slow', {
      action: 'test_monitoring',
      metadata: { test_type: 'slow_transaction' }
    });

    if (slowTransaction) {
      await new Promise(resolve => setTimeout(resolve, 1100)); // Plus d'1 seconde
      slowTransaction.finish();
    }

    // Test 12: Test de transaction très lente (pour tester les alertes critiques)
    logger.info('Test 12: Test de transaction très lente');
    const verySlowTransaction = monitoring.startTransaction('very_slow_transaction', 'test.very_slow', {
      action: 'test_monitoring',
      metadata: { test_type: 'very_slow_transaction' }
    });

    if (verySlowTransaction) {
      await new Promise(resolve => setTimeout(resolve, 5100)); // Plus de 5 secondes
      verySlowTransaction.finish();
    }

    // Test 13: Afficher les statistiques
    logger.info('Test 13: Affichage des statistiques');
    const stats = monitoring.getStats();
    console.log('📊 Statistiques de monitoring:', JSON.stringify(stats, null, 2));

    // Test 14: Exporter les données
    logger.info('Test 14: Export des données');
    const exportData = monitoring.exportData();
    console.log('📦 Données exportées:', {
      eventsCount: exportData.events.length,
      metricsCount: Object.keys(exportData.metrics).length,
      stats: exportData.stats,
    });

    logger.info('✅ Tous les tests de monitoring ont été exécutés avec succès !');
    logger.info('📊 Vérifiez les logs pour voir les résultats du monitoring.');

  } catch (error) {
    logger.error('❌ Erreur lors des tests de monitoring:', error);
    monitoring.captureError(error as Error, {
      action: 'test_monitoring',
      metadata: { test_type: 'test_execution_error' }
    });
  }
}

// Exécuter les tests si le script est appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  testMonitoring()
    .then(() => {
      logger.info('🏁 Tests terminés');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('💥 Erreur lors de l\'exécution des tests:', error);
      process.exit(1);
    });
}

export { testMonitoring }; 