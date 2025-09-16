export const prerender = false;

import type { APIRoute } from 'astro';
import Stripe from 'stripe';
import { Resend } from 'resend';
import { sendAppointmentNotification } from '../../../lib/notifications';

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16'
});

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request, locals }) => {

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
    const supabase = locals.supabase;

    // Vérifier si le rendez-vous existe et n'est pas déjà confirmé
    const { data: existingAppointment, error: checkError } = await supabase
      .from('appointments')
      .select('*, services(title)')
      .eq('stripe_session_id', session.id)
      .single();

    if (checkError || !existingAppointment) {
      console.error('Rendez-vous non trouvé:', checkError);
      return new Response(JSON.stringify({ error: 'Rendez-vous non trouvé' }), { status: 404 });
    }

    // Vérifier si le créneau n'est pas déjà pris par un autre rendez-vous confirmé
    const { data: conflictingAppointments, error: conflictError } = await supabase
      .from('appointments')
      .select('*')
      .eq('date', existingAppointment.date)
      .eq('time', existingAppointment.time)
      .eq('status', 'confirmed')
      .neq('id', existingAppointment.id);

    if (conflictError) {
      console.error('Erreur lors de la vérification des conflits:', conflictError);
      return new Response(JSON.stringify({ error: 'Erreur lors de la vérification des conflits' }), { status: 500 });
    }

    if (conflictingAppointments && conflictingAppointments.length > 0) {
      console.error('Conflit de créneau détecté, annulation du paiement');
      // Ici on pourrait annuler le paiement Stripe si nécessaire
      return new Response(JSON.stringify({ error: 'Conflit de créneau détecté' }), { status: 409 });
    }

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
