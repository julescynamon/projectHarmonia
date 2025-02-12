import type { APIRoute } from 'astro';
import Stripe from 'stripe';

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16'
});

export const POST: APIRoute = async ({ request, locals }) => {
  const session = locals.session;
  if (!session?.user) {
    return new Response(
      JSON.stringify({ error: 'Non autorisé' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }
  try {
    const body = await request.json();
    console.log('Request body:', body);
    const { items } = body;
    console.log('Items reçus:', items);

    // Vérifier que chaque item a les données du produit
    console.log('Checking items validity...');
    const validItems = items.filter(item => {
      const isValid = item.product && item.quantity > 0;
      if (!isValid) {
        console.log('Invalid item:', item);
      }
      return isValid;
    });
    console.log('Valid items:', validItems);

    if (!items || !Array.isArray(items) || items.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Panier invalide' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (validItems.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Panier invalide ou vide' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: validItems.map((item: any) => ({
          price_data: {
            currency: 'eur',
            product_data: {
              name: item.product.title,
              description: `Fichier PDF: ${item.product.pdf_path}`,
            },
            unit_amount: Math.round(item.product.price * 100), // Conversion en centimes
          },
          quantity: item.quantity,
      })),
      mode: 'payment',
      client_reference_id: session.user.id,
      success_url: `${import.meta.env.PUBLIC_SITE_URL || 'http://localhost:4321'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${import.meta.env.PUBLIC_SITE_URL || 'http://localhost:4321'}/boutique`,
    });

    return new Response(
      JSON.stringify({ url: stripeSession.url }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Erreur Stripe:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur lors du traitement du paiement' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}