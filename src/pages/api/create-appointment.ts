import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { checkAvailability } from '../../lib/availability';
import { sendAppointmentNotification } from '../../lib/notifications';

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY
);

const SERVICES_PRICES = {
  consultation: {
    amount: 9000, // 90€ en centimes
    name: 'Consultation Naturopathie'
  },
  suivi: {
    amount: 7500, // 75€ en centimes
    name: 'Suivi Nutritionnel'
  },
  phyto: {
    amount: 8000, // 80€ en centimes
    name: 'Consultation Phytothérapie'
  },
  massage: {
    amount: 8500, // 85€ en centimes
    name: 'Massage Bien-être'
  }
};

export const post: APIRoute = async ({ request }) => {
  console.log('API create-appointment appelée');
  try {
    const data = await request.json();
    const { date, time, service, clientName, clientEmail } = data;
    console.log('Données reçues:', { date, time, service, clientName, clientEmail });

    // Vérifier une dernière fois la disponibilité
    const isAvailable = await checkAvailability(date, time);
    if (!isAvailable) {
      return new Response(JSON.stringify({
        error: 'Ce créneau n\'est plus disponible'
      }), { status: 400 });
    }

    // Créer la session Stripe
    console.log('Création de la session Stripe...');
    const serviceDetails = SERVICES_PRICES[service];
    if (!serviceDetails) {
      console.log('Service invalide:', service);
      return new Response(JSON.stringify({
        error: 'Service invalide'
      }), { status: 400 });
    }

    console.log('Configuration de la session Stripe...');
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `${serviceDetails.name} - ${date} ${time}`,
            },
            unit_amount: serviceDetails.amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:3000/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:3000/rendez-vous`,
      metadata: {
        date,
        time,
        service,
        clientName,
        clientEmail
      }
    });

    console.log('Session Stripe créée:', session.id);

    // Créer le rendez-vous temporaire dans Supabase
    console.log('Création du rendez-vous temporaire dans Supabase...');
    const { error: appointmentError } = await supabase
      .from('appointments_pending')
      .insert([{
        date,
        time,
        service,
        client_name: clientName,
        client_email: clientEmail,
        stripe_session_id: session.id,
        expires_at: new Date(Date.now() + 30 * 60000).toISOString() // 30 minutes
      }]);

    if (appointmentError) {
      console.error('Erreur lors de la création du rendez-vous temporaire:', appointmentError);
      return new Response(JSON.stringify({
        error: 'Erreur lors de la création du rendez-vous'
      }), { status: 500 });
    }

    console.log('Redirection vers Stripe:', session.url);
    return new Response(JSON.stringify({
      url: session.url
    }), { status: 200 });

  } catch (error) {
    console.error('Erreur lors de la création du rendez-vous:', error);
    return new Response(JSON.stringify({
      error: 'Erreur lors de la création du rendez-vous'
    }), { status: 500 });
  }
};
