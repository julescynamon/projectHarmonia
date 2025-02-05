import type { APIRoute } from 'astro';
import { createServerClient } from '../../../lib/supabase';
import Stripe from 'stripe';
import { Resend } from 'resend';

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16'
});

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
  console.log('Webhook Stripe reçu');
  const payload = await request.text();
  console.log('Payload reçu:', payload);
  const sig = request.headers.get('stripe-signature') || '';
  console.log('Signature Stripe:', sig);

  let event;

  try {
    console.log('Vérification de la signature avec la clé:', import.meta.env.STRIPE_WEBHOOK_SECRET);
    event = stripe.webhooks.constructEvent(
      payload,
      sig,
      import.meta.env.STRIPE_WEBHOOK_SECRET || ''
    );
    console.log('Événement Stripe construit:', event.type);
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Webhook signature verification failed' }),
      { status: 400 }
    );
  }

  if (event.type === 'checkout.session.completed') {
    console.log('Session de paiement complétée');
    const session = event.data.object;
    console.log('Session ID:', session.id);
    const supabase = createServerClient();

    console.log('Mise à jour du statut du rendez-vous...');
    // Mettre à jour le statut du rendez-vous
    const { data: appointment, error } = await supabase
      .from('appointments')
      .update({ status: 'confirmed' })
      .eq('stripe_session_id', session.id)
      .select()
      .single();

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
    console.log('Rendez-vous mis à jour:', appointment);

    console.log('Récupération des informations du service...');
    // Récupérer les informations du service
    const { data: service, error: serviceError } = await supabase
      .from('services')
      .select('*')
      .eq('id', appointment.service_id)
      .single();

    if (serviceError) {
      console.error('Erreur lors de la récupération du service:', serviceError);
      return new Response(
        JSON.stringify({ 
          error: 'Error getting service details',
          details: serviceError.message
        }),
        { status: 500 }
      );
    }
    console.log('Service trouvé:', service);

    // Envoyer l'email de confirmation
    console.log('Envoi de l\'email de confirmation...');
    console.log('Email FROM:', import.meta.env.FROM_EMAIL);
    console.log('Email TO:', appointment.client_email);
    try {
      await resend.emails.send({
      from: import.meta.env.FROM_EMAIL,
      to: appointment.client_email,
      subject: 'Confirmation de votre rendez-vous chez Harmonia',
      html: `
        <h1>Confirmation de votre rendez-vous</h1>
        <p>Bonjour ${appointment.client_name},</p>
        <p>Votre rendez-vous a été confirmé :</p>
        <ul>
          <li>Service : ${service.title}</li>
          <li>Date : ${appointment.date}</li>
          <li>Heure : ${appointment.time}</li>
          <li>Prix : ${service.price}€</li>
        </ul>
        <p>Merci de votre confiance !</p>
        <p>L'équipe Harmonia</p>
      `,
    });
    console.log('Email envoyé avec succès');
    } catch (emailError) {
      console.error('Erreur lors de l\'envoi de l\'email:', emailError);
      return new Response(
        JSON.stringify({ 
          error: 'Error sending confirmation email',
          details: emailError instanceof Error ? emailError.message : String(emailError)
        }),
        { status: 500 }
      );
    }
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
}
