import type { APIRoute } from 'astro';
import { createServiceClient } from '../../lib/supabase';
import Stripe from 'stripe';
import { monitorApi } from '../../middleware/performance';
import { monitoring } from '../../lib/monitoring';

interface HealthCheck {
  status: 'OK' | 'FAIL';
  message?: string;
  timestamp: string;
}

interface HealthResponse {
  overall: 'OK' | 'FAIL';
  services: {
    supabase: HealthCheck;
    stripe: HealthCheck;
  };
  timestamp: string;
}

// Fonction pour vérifier la connexion Supabase
async function checkSupabase(): Promise<HealthCheck> {
  const transaction = monitoring.startTransaction('health_check_supabase', 'db.query', {
    action: 'health_check',
    metadata: { service: 'supabase' }
  });

  try {
    const supabase = createServiceClient();
    
    // Test simple de connexion en récupérant une ligne de la table profiles
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
    
    if (error) {
      monitoring.captureSupabaseError(error, 'health_check', {
        action: 'health_check',
        metadata: { service: 'supabase' }
      });
      
      return {
        status: 'FAIL',
        message: `Erreur Supabase: ${error.message}`,
        timestamp: new Date().toISOString()
      };
    }
    
    if (transaction) {
      transaction.setTag('service', 'supabase');
      transaction.setTag('status', 'success');
      transaction.finish();
    }
    
    return {
      status: 'OK',
      message: 'Connexion Supabase réussie',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    monitoring.captureError(error as Error, {
      action: 'health_check',
      metadata: { service: 'supabase' }
    });
    
    if (transaction) {
      transaction.setTag('service', 'supabase');
      transaction.setTag('status', 'error');
      transaction.finish();
    }
    
    return {
      status: 'FAIL',
      message: `Erreur de connexion Supabase: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
      timestamp: new Date().toISOString()
    };
  }
}

// Fonction pour vérifier l'API Stripe
async function checkStripe(): Promise<HealthCheck> {
  const transaction = monitoring.startTransaction('health_check_stripe', 'http.client', {
    action: 'health_check',
    metadata: { service: 'stripe' }
  });

  try {
    const stripeSecretKey = import.meta.env.STRIPE_SECRET_KEY;
    
    if (!stripeSecretKey) {
      monitoring.captureMessage('Clé secrète Stripe non configurée', 'error', {
        action: 'health_check',
        metadata: { service: 'stripe' }
      });
      
      return {
        status: 'FAIL',
        message: 'Clé secrète Stripe non configurée',
        timestamp: new Date().toISOString()
      };
    }
    
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    });
    
    // Test simple de l'API Stripe en récupérant la liste des produits
    await stripe.products.list({ limit: 1 });
    
    if (transaction) {
      transaction.setTag('service', 'stripe');
      transaction.setTag('status', 'success');
      transaction.finish();
    }
    
    return {
      status: 'OK',
      message: 'API Stripe accessible',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    monitoring.captureStripeError(error, 'health_check', {
      action: 'health_check',
      metadata: { service: 'stripe' }
    });
    
    if (transaction) {
      transaction.setTag('service', 'stripe');
      transaction.setTag('status', 'error');
      transaction.finish();
    }
    
    return {
      status: 'FAIL',
      message: `Erreur API Stripe: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
      timestamp: new Date().toISOString()
    };
  }
}

const healthCheckHandler = async ({ request, locals }: { request: Request; locals: any }) => {
  const transaction = monitoring.startTransaction('health_check', 'http.server', {
    userId: locals?.user?.id,
    action: 'health_check',
    metadata: { endpoint: '/api/health' }
  });

  try {
    const timestamp = new Date().toISOString();
    
    // Effectuer les vérifications en parallèle
    const [supabaseCheck, stripeCheck] = await Promise.all([
      checkSupabase(),
      checkStripe()
    ]);
    
    // Déterminer le statut global
    const overall = (supabaseCheck.status === 'OK' && stripeCheck.status === 'OK') ? 'OK' : 'FAIL';
    
    const healthResponse: HealthResponse = {
      overall,
      services: {
        supabase: supabaseCheck,
        stripe: stripeCheck
      },
      timestamp
    };
    
    // Retourner le code HTTP approprié
    const statusCode = overall === 'OK' ? 200 : 500;
    
    if (transaction) {
      transaction.setTag('overall_status', overall);
      transaction.setTag('supabase_status', supabaseCheck.status);
      transaction.setTag('stripe_status', stripeCheck.status);
      transaction.finish();
    }
    
    return new Response(JSON.stringify(healthResponse, null, 2), {
      status: statusCode,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
    });
  } catch (error) {
    monitoring.captureError(error as Error, {
      userId: locals?.user?.id,
      action: 'health_check',
      metadata: { endpoint: '/api/health' }
    });
    
    if (transaction) {
      transaction.setTag('status', 'error');
      transaction.finish();
    }
    
    const errorResponse = {
      overall: 'FAIL' as const,
      error: 'Erreur interne du serveur',
      message: error instanceof Error ? error.message : 'Erreur inconnue',
      timestamp: new Date().toISOString()
    };
    
    return new Response(JSON.stringify(errorResponse, null, 2), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
    });
  }
};

export const GET = monitorApi(healthCheckHandler); 