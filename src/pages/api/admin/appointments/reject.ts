// src/pages/api/admin/appointments/reject.ts
import type { APIRoute } from 'astro';
import { sendAppointmentRejectionEmail } from '../../../../lib/email-service';

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

    // Vérification du rôle admin avec fallback pour l'admin principal
    const { data: profile, error: profileError } = await locals.supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    // Vérification spéciale pour l'admin principal (tyzranaima@gmail.com)
    const isMainAdmin = session.user.email === 'tyzranaima@gmail.com';

    if (!isMainAdmin && (profileError || !profile || profile.role !== 'admin')) {
      return new Response(
        JSON.stringify({ error: 'Accès refusé' }),
        { status: 403 }
      );
    }

    // Récupération des données de la requête
    const { appointmentId, rejectionReason } = await request.json();

    if (!appointmentId) {
      return new Response(
        JSON.stringify({ error: 'ID de réservation manquant' }),
        { status: 400 }
      );
    }

    if (!rejectionReason) {
      return new Response(
        JSON.stringify({ error: 'Motif de refus manquant' }),
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
        JSON.stringify({ error: 'Cette réservation ne peut pas être refusée' }),
        { status: 400 }
      );
    }

    // Mise à jour du statut de la réservation
    const { error: updateError } = await locals.supabase
      .from('appointments')
      .update({ 
        status: 'refused',
        rejection_reason: rejectionReason,
        rejected_at: new Date().toISOString()
      })
      .eq('id', appointmentId);

    if (updateError) {
      console.error('Erreur lors de la mise à jour:', updateError);
      return new Response(
        JSON.stringify({ error: 'Erreur lors de la mise à jour de la réservation' }),
        { status: 500 }
      );
    }

    // Envoi de l'email de refus
    try {
      await sendAppointmentRejectionEmail({
        clientName: appointment.client_name,
        clientEmail: appointment.client_email,
        date: appointment.date,
        time: appointment.time,
        service: appointment.services?.title || 'Consultation',
        rejectionReason: rejectionReason
      });
    } catch (emailError) {
      console.error('Erreur lors de l\'envoi de l\'email:', emailError);
      // On continue même si l'email échoue
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Réservation refusée avec succès'
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error('Erreur lors du refus:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur interne du serveur' }),
      { status: 500 }
    );
  }
};
