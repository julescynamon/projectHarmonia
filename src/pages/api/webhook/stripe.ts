import type { APIRoute } from 'astro';
import Stripe from 'stripe';
import { supabase } from '../../../lib/supabase';

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16'
});

const endpointSecret = import.meta.env.STRIPE_WEBHOOK_SECRET;

export const POST: APIRoute = async ({ request }) => {
  const payload = await request.text();
  const sig = request.headers.get('stripe-signature');

  if (!sig || !endpointSecret) {
    return new Response('Signature ou secret manquant', { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (err) {
    console.error('Erreur de signature webhook:', err);
    return new Response('Signature invalide', { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    try {
      // Récupérer les détails de la session et les données du panier
      const { data: cartItems } = await supabase
        .from('cart_items')
        .select('product_id, quantity')
        .eq('user_id', session.client_reference_id);
      
      // Créer la commande
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: session.client_reference_id,
          stripe_session_id: session.id,
          total_amount: session.amount_total ? session.amount_total / 100 : 0,
          status: 'completed'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      if (!cartItems || cartItems.length === 0) throw new Error('Panier introuvable');

      // Créer les items de la commande
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: 0 // Le prix sera mis à jour ci-dessous
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Mettre à jour les prix des items de la commande
      const { data: products } = await supabase
        .from('products')
        .select('id, price')
        .in('id', cartItems.map(item => item.product_id));

      if (products) {
        const priceMap = Object.fromEntries(products.map(p => [p.id, p.price]));
        await Promise.all(orderItems.map(async (item) => {
          await supabase
            .from('order_items')
            .update({ price: priceMap[item.product_id] || 0 })
            .eq('order_id', order.id)
            .eq('product_id', item.product_id);
        }));
      }

      // Vider le panier de l'utilisateur
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', session.client_reference_id);

      return new Response(JSON.stringify({ orderId: order.id }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Erreur de traitement webhook:', error);
      return new Response('Erreur de traitement', { status: 500 });
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
