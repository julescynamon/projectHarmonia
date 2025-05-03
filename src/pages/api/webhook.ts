import type { APIRoute } from 'astro';
import Stripe from 'stripe';
import { createServiceClient } from '../../lib/supabase';

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16'
});

const endpointSecret = import.meta.env.STRIPE_WEBHOOK_SECRET;

// Fonction utilitaire pour logger les erreurs
function logError(phase: string, error: any) {
  // Suppression des logs d'erreur
}

function logWebhook(message: string, data?: any) {
  // Suppression des logs
}

export const POST: APIRoute = async ({ request }) => {
  logWebhook('=== Début du traitement webhook ===');
  
  try {
    const payload = await request.text();
    const sig = request.headers.get('stripe-signature');
    
  

    if (!sig) {
      throw new Error('Signature Stripe manquante');
    }

    if (!endpointSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET non défini');
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);

    } catch (err: any) {

      return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      logWebhook('Traitement de checkout.session.completed');
      const session = event.data.object as Stripe.Checkout.Session;
      
      try {
        // Get the Stripe session details
        logWebhook('Récupération des détails de la session', { sessionId: session.id });
        const stripeSession = await stripe.checkout.sessions.retrieve(session.id, {
          expand: ['line_items', 'line_items.data.price.product']
        });
        logWebhook('Détails de la session récupérés', {
          sessionId: stripeSession.id,
          customerId: stripeSession.customer,
          clientReferenceId: stripeSession.client_reference_id,
          amountTotal: stripeSession.amount_total,
          lineItemsCount: stripeSession.line_items?.data.length
        });

        if (!stripeSession.client_reference_id) {
          throw new Error('client_reference_id manquant dans la session');
        }

        const userId = stripeSession.client_reference_id;
        
        const supabase = createServiceClient();

        // Vérifier si une commande existe déjà
        const { data: existingOrder } = await supabase
          .from('orders')
          .select('id')
          .eq('stripe_session_id', session.id)
          .single();

        if (existingOrder) {

          return new Response(JSON.stringify({ received: true, existing: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        // Create the order
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert({
            user_id: userId,
            stripe_session_id: session.id,
            total_amount: stripeSession.amount_total ? stripeSession.amount_total / 100 : 0,
            status: 'completed'
          })
          .select()
          .single();

      if (orderError) {
        throw orderError;
      }


      // Get line items from the session
      logWebhook('Récupération des articles de la session');
      const lineItems = stripeSession.line_items?.data;
      logWebhook('Articles trouvés dans la session', {
        sessionId: stripeSession.id,
        lineItems: lineItems?.map(item => ({
          id: item.id,
          priceId: item.price?.id,
          productId: item.price?.product,
          quantity: item.quantity,
          amount: item.amount_total,
          productDetails: item.price?.product
        }))
      });
      
      if (!lineItems || lineItems.length === 0) {
        throw new Error('Aucun article trouvé dans la session');
      }

      // Vider le panier de l'utilisateur
      const { error: cartError } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId);

      if (cartError) {
        // On continue quand même, ce n'est pas bloquant
      }

      // Create order items
      for (const item of lineItems) {

        if (!item.price?.product) {
          continue;
        }

        // Récupérer les détails du produit Stripe
        const stripeProduct = typeof item.price.product === 'string'
          ? await stripe.products.retrieve(item.price.product)
          : item.price.product;



        // Extraire le chemin du PDF de la description
        // Utiliser un type guard pour vérifier si le produit est un produit actif avec une description
        const pdfPath = typeof stripeProduct === 'object' && 'description' in stripeProduct && stripeProduct.description
          ? stripeProduct.description.replace('Fichier PDF: ', '')
          : null;
        if (!pdfPath) {
          continue;
        }

        // Trouver le produit dans notre base de données par le pdf_path
        const { data: product, error: productError } = await supabase
          .from('products')
          .select('id, title, pdf_path')
          .eq('pdf_path', pdfPath)
          .single();

        if (productError) {
          continue;
        }

        if (product) {


          const { error: itemError } = await supabase
            .from('order_items')
            .insert({
              order_id: order.id,
              product_id: product.id,
              quantity: item.quantity || 1,
              price: item.price?.unit_amount ? item.price.unit_amount / 100 : 0
            });

          if (itemError) {
            // Erreur création article commande
          }
        } else {

        }
      }


    } catch (error) {
      logError('traitement commande', error);
      return new Response(JSON.stringify({
        error: 'Erreur traitement commande',
        details: (error as Error).message,
        timestamp: new Date().toISOString()
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  return new Response(JSON.stringify({ 
    received: true,
    timestamp: new Date().toISOString()
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
} catch (error) {
  logError('générale', error);
  return new Response(JSON.stringify({
    error: 'Erreur serveur',
    details: (error as Error).message,
    timestamp: new Date().toISOString()
  }), { 
    status: 500,
    headers: { 'Content-Type': 'application/json' }
  });
}
};
