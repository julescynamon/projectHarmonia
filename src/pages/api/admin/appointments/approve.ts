export const prerender = false;

// src/pages/api/admin/appointments/approve.ts
import type { APIRoute } from 'astro';
import Stripe from 'stripe';
import { sendAppointmentApprovalEmail } from '../../../../lib/email-service';

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY);

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // Vérification de l'authentification admin
    const user = locals.user;
    if (!user?.id) {
      return new Response(
        JSON.stringify({ error: 'Non autorisé' }),
        { status: 401 }
      );
    }

    // Vérification du rôle admin avec fallback pour l'admin principal
    const { data: profile, error: profileError } = await locals.supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    // Vérification spéciale pour l'admin principal (tyzranaima@gmail.com)
    const isMainAdmin = user.email === 'tyzranaima@gmail.com';

    if (!isMainAdmin && (profileError || !profile || profile.role !== 'admin')) {
      return new Response(
        JSON.stringify({ error: 'Accès refusé' }),
        { status: 403 }
      );
    }

    // Récupération des données de la requête
    const { appointmentId } = await request.json();

    if (!appointmentId) {
      return new Response(
        JSON.stringify({ error: 'ID de réservation manquant' }),
        { status: 400 }
      );
    }

    // Récupération de la réservation
    const { data: appointment, error: appointmentError } = await locals.supabase
      .from('appointments')
      .select(`
        *,
        services (
          title,
          price
        )
      `)
      .eq('id', appointmentId)
      .single();

    if (appointmentError || !appointment) {
      return new Response(
        JSON.stringify({ error: 'Réservation non trouvée' }),
        { status: 404 }
      );
    }

    // Vérification que la réservation est en attente d'approbation
    if (appointment.status !== 'pending_approval') {
      return new Response(
        JSON.stringify({ error: 'Cette réservation ne peut pas être approuvée' }),
        { status: 400 }
      );
    }

    const rawPrice = appointment.services?.price;
    const servicePrice =
      typeof rawPrice === 'number' ? rawPrice : Number(rawPrice);
    const isFreeService =
      !Number.isNaN(servicePrice) && servicePrice === 0;

    if (isFreeService) {
      const { error: freeUpdateError } = await locals.supabase
        .from('appointments')
        .update({
          status: 'confirmed',
          approved_at: new Date().toISOString(),
        })
        .eq('id', appointmentId);

      if (freeUpdateError) {
        console.error('Erreur lors de la mise à jour (offre gratuite):', freeUpdateError);
        return new Response(
          JSON.stringify({ error: 'Erreur lors de la mise à jour de la réservation' }),
          { status: 500 }
        );
      }

      try {
        await sendAppointmentApprovalEmail({
          clientName: appointment.client_name,
          clientEmail: appointment.client_email,
          clientPhone: appointment.client_phone,
          date: appointment.date,
          time: appointment.time,
          service: appointment.services?.title || 'Consultation',
          paymentUrl: '',
          price: 0,
          isFree: true,
        });
      } catch (emailError) {
        console.error("Erreur lors de l'envoi de l'email:", emailError);
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Réservation gratuite confirmée (sans paiement)',
          paymentUrl: null,
          isFreeBooking: true,
        }),
        { status: 200 }
      );
    }

    // Création de la session Stripe (prestations payantes)
    const sessionStripe = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: appointment.services?.title || 'Consultation',
              description: `Réservation du ${appointment.date} à ${appointment.time}`,
            },
            unit_amount: Math.round(servicePrice * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${import.meta.env.PUBLIC_SITE_URL}/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${import.meta.env.PUBLIC_SITE_URL}/rendez-vous`,
      metadata: {
        appointmentId: appointment.id,
        clientEmail: appointment.client_email,
        clientName: appointment.client_name,
      },
    });

    const { error: updateError } = await locals.supabase
      .from('appointments')
      .update({
        status: 'pending',
        stripe_session_id: sessionStripe.id,
        approved_at: new Date().toISOString(),
      })
      .eq('id', appointmentId);

    if (updateError) {
      console.error('Erreur lors de la mise à jour:', updateError);
      return new Response(
        JSON.stringify({ error: 'Erreur lors de la mise à jour de la réservation' }),
        { status: 500 }
      );
    }

    try {
      await sendAppointmentApprovalEmail({
        clientName: appointment.client_name,
        clientEmail: appointment.client_email,
        clientPhone: appointment.client_phone,
        date: appointment.date,
        time: appointment.time,
        service: appointment.services?.title || 'Consultation',
        paymentUrl: sessionStripe.url,
        price: servicePrice,
        isFree: false,
      });
    } catch (emailError) {
      console.error("Erreur lors de l'envoi de l'email:", emailError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Réservation approuvée avec succès',
        paymentUrl: sessionStripe.url,
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error('Erreur lors de l\'approbation:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur interne du serveur' }),
      { status: 500 }
    );
  }
};
