// src/pages/api/admin/appointments/approve.ts
import type { APIRoute } from 'astro';
import Stripe from 'stripe';

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // Vérification de l'authentification admin
    const session = locals.session;
    if (!session?.user?.id) {
      return new Response(
        JSON.stringify({ error: 'Non autorisé' }),
        { status: 401 }
      );
    }

    // Vérification du rôle admin
    const { data: profile, error: profileError } = await locals.supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profileError || !profile || profile.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Accès refusé' }),
        { status: 403 }
      );
    }

    // Récupération des données de la requête
    const { appointmentId, adminNotes } = await request.json();

    if (!appointmentId) {
      return new Response(
        JSON.stringify({ error: 'ID de réservation requis' }),
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
      .eq('status', 'pending_approval')
      .single();

    if (appointmentError || !appointment) {
      return new Response(
        JSON.stringify({ error: 'Réservation non trouvée ou déjà traitée' }),
        { status: 404 }
      );
    }

    // Vérification de la disponibilité du créneau
    const { data: conflictingAppointments, error: conflictError } = await locals.supabase
      .from('appointments')
      .select('id')
      .eq('date', appointment.date)
      .eq('time', appointment.time)
      .in('status', ['pending', 'confirmed'])
      .neq('id', appointmentId);

    if (conflictError) {
      console.error('Erreur lors de la vérification des conflits:', conflictError);
      return new Response(
        JSON.stringify({ error: 'Erreur lors de la vérification de disponibilité' }),
        { status: 500 }
      );
    }

    if (conflictingAppointments && conflictingAppointments.length > 0) {
      return new Response(
        JSON.stringify({ error: 'Ce créneau n\'est plus disponible' }),
        { status: 409 }
      );
    }

    // Création de la session Stripe
    const sessionConfig = {
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: appointment.services.title,
              description: `Réservation du ${appointment.date} à ${appointment.time}`,
            },
            unit_amount: Math.round(parseFloat(appointment.services.price) * 100), // Stripe utilise les centimes
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${import.meta.env.WEBSITE_URL}/accompagnements/reservation?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${import.meta.env.WEBSITE_URL}/accompagnements/reservation?cancelled=true`,
      metadata: {
        appointment_id: appointmentId,
        client_email: appointment.client_email,
        client_name: appointment.client_name,
      },
    };

    const stripeSession = await stripe.checkout.sessions.create(sessionConfig);

    // Mise à jour du statut de la réservation
    const { error: updateError } = await locals.supabase
      .from('appointments')
      .update({
        status: 'pending',
        stripe_session_id: stripeSession.id,
        admin_notes: adminNotes || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', appointmentId);

    if (updateError) {
      console.error('Erreur lors de la mise à jour:', updateError);
      return new Response(
        JSON.stringify({ error: 'Erreur lors de la mise à jour de la réservation' }),
        { status: 500 }
      );
    }

    // Envoi de l'email de confirmation au client
    try {
      const { sendAppointmentApprovalEmail } = await import('../../../lib/email-service');
      await sendAppointmentApprovalEmail({
        appointment: {
          id: appointment.id,
          date: appointment.date,
          time: appointment.time,
          service: appointment.services.title,
          clientName: appointment.client_name,
          clientEmail: appointment.client_email,
        },
        paymentUrl: stripeSession.url,
      });
    } catch (emailError) {
      console.error('Erreur lors de l\'envoi de l\'email:', emailError);
      // Ne pas faire échouer la requête si l'email échoue
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Réservation approuvée avec succès',
        paymentUrl: stripeSession.url,
        appointmentId: appointment.id,
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
