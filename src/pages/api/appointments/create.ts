import type { APIRoute } from 'astro';
import { createServerClient } from '../../../lib/supabase';
import Stripe from 'stripe';

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16'
});

export async function POST({ request }) {
  try {
    const body = await request.json();
    const { date, time, serviceId, email, name, reason } = body;
    const supabase = createServerClient();
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



    // Créer la session Stripe


    const sessionConfig = {
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: service.title,
              description: `Rendez-vous le ${date} à ${time}`,
            },
            unit_amount: service.price * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${import.meta.env.PUBLIC_SITE_URL}/rendez-vous/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${import.meta.env.PUBLIC_SITE_URL}/rendez-vous`,
      customer_email: email,
      metadata: {
        appointment_date: date,
        appointment_time: time,
        service_id: serviceId,
        client_name: name,
        client_email: email,
        reason: reason || ''
      }
    };
    
    const session = await stripe.checkout.sessions.create(sessionConfig);

    const appointmentData = {
      date,
      time,
      service_id: serviceId,
      client_email: email,
      client_name: name,
      status: 'pending',
      stripe_session_id: session.id
    };
    
    const { data: appointment, error } = await supabase
      .from('appointments')
      .insert(appointmentData)
      .select()
      .single();
    
    if (error) {
      console.error('Erreur Supabase lors de la création du rendez-vous:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Erreur lors de la création du rendez-vous',
          details: error.message || 'Erreur inconnue',
          code: error.code || 'UNKNOWN'
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
