import type { APIRoute } from 'astro';
import { createServerClient } from '../../../lib/supabase';
import Stripe from 'stripe';
import { Resend } from 'resend';
import { sendAppointmentNotification } from '../../../lib/notifications';

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16'
});

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {

  const payload = await request.text();
  const sig = request.headers.get('stripe-signature') || '';;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      sig,
      import.meta.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Webhook signature verification failed' }),
      { status: 400 }
    );
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const supabase = createServerClient();


    // Mettre à jour le statut du rendez-vous

    const { data: appointment, error } = await supabase
      .from('appointments')
      .update({ 
        status: 'confirmed',
        reason: session.metadata?.reason || null
      })
      .eq('stripe_session_id', session.id)
      .select('*, services(title)')
      .single();


    if (error || !appointment) {
      console.error('Erreur lors de la mise à jour du rendez-vous:', error);
      return new Response(JSON.stringify({ error: 'Erreur lors de la mise à jour du rendez-vous' }), { status: 500 });
    }

    // Envoyer les notifications
    try {
      await sendAppointmentNotification({
        date: appointment.date,
        time: appointment.time,
        service: appointment.services.title,
        clientName: appointment.client_name,
        clientEmail: appointment.client_email,
        reason: appointment.reason
      });
    } catch (error) {
      console.error('Erreur lors de l\'envoi des notifications:', error);
      // On continue même si l'envoi des notifications échoue
    }

    if (error) {
      console.error('Erreur lors de la mise à jour du rendez-vous:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Error updating appointment',
          details: error.message
        }),
        { status: 500 }
      );
    }

    // Les notifications sont déjà envoyées via sendAppointmentNotification
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
}
