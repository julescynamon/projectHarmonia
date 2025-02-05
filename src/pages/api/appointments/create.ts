import type { APIRoute } from 'astro';
import { createServerClient } from '../../../lib/supabase';
import Stripe from 'stripe';

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16'
});

export const POST: APIRoute = async ({ request }) => {
  try {
    console.log('Début de la création du rendez-vous');
    const body = await request.json();
    console.log('Corps de la requête:', body);
    const { date, time, serviceId, email, name } = body;
    const supabase = createServerClient();

    console.log('Vérification de la disponibilité...');
    // Vérifier à nouveau la disponibilité
    const { data: existingAppointments, error: availabilityError } = await supabase
      .from('appointments')
      .select('*')
      .eq('date', date)
      .eq('time', time)
      .eq('status', 'confirmed');

    if (existingAppointments && existingAppointments.length > 0) {
      return new Response(
        JSON.stringify({ error: 'Ce créneau n\'est plus disponible' }),
        { status: 400 }
      );
    }

    if (availabilityError) {
      console.error('Erreur lors de la vérification de disponibilité:', availabilityError);
    }

    console.log('Récupération des informations du service...');
    // Récupérer les informations du service
    const { data: service, error: serviceError } = await supabase
      .from('services')
      .select('*')
      .eq('id', serviceId)
      .single();

    if (!service) {
      return new Response(
        JSON.stringify({ error: 'Service non trouvé' }),
        { status: 404 }
      );
    }

    if (serviceError) {
      console.error('Erreur lors de la récupération du service:', serviceError);
      return new Response(
        JSON.stringify({ error: 'Erreur lors de la récupération du service' }),
        { status: 500 }
      );
    }

    console.log('Création de la session Stripe...');
    console.log('Service trouvé:', service);

    // Créer la session Stripe
    console.log('Tentative de création de la session Stripe avec les données suivantes:', {
      email,
      service_title: service.title,
      price: service.price
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: service.title,
              description: `Rendez-vous le ${date} à ${time}`,
            },
            unit_amount: service.price * 100, // Stripe utilise les centimes
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${import.meta.env.PUBLIC_SITE_URL}/rendez-vous/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${import.meta.env.PUBLIC_SITE_URL}/rendez-vous`,
      customer_email: email,
    });

    console.log('Session Stripe créée avec succès:', session.id);

    // Créer le rendez-vous temporaire
    console.log('Création du rendez-vous temporaire...');
    const { data: appointment, error } = await supabase
      .from('appointments')
      .insert([
        {
          date,
          time,
          service_id: serviceId,
          client_email: email,
          client_name: name,
          status: 'pending',
          stripe_session_id: session.id,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Erreur Supabase lors de la création du rendez-vous:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Erreur lors de la création du rendez-vous',
          details: error.message,
          code: error.code
        }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({
        checkoutUrl: session.url,
        appointmentId: appointment.id,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors de la création du rendez-vous:', error);
    let errorMessage = 'Erreur lors de la création du rendez-vous';
    let errorDetails = '';

    if (error instanceof Error) {
      errorDetails = error.message;
      // Si c'est une erreur Stripe
      if ('type' in error) {
        const stripeError = error as any;
        errorMessage = `Erreur Stripe: ${stripeError.type}`;
        errorDetails = stripeError.message;
      }
    } else {
      errorDetails = String(error);
    }

    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: errorDetails
      }),
      { status: 500 }
    );
  }
}
