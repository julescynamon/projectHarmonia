// src/pages/api/admin/appointments/reject.ts
import type { APIRoute } from 'astro';

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
    const { appointmentId, rejectionReason, adminNotes } = await request.json();

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
          title
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

    // Mise à jour du statut de la réservation
    const { error: updateError } = await locals.supabase
      .from('appointments')
      .update({
        status: 'refused',
        admin_notes: adminNotes || null,
        rejection_reason: rejectionReason || null,
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

    // Envoi de l'email de refus au client
    try {
      const { sendAppointmentRejectionEmail } = await import('../../../lib/email-service');
      await sendAppointmentRejectionEmail({
        appointment: {
          id: appointment.id,
          date: appointment.date,
          time: appointment.time,
          service: appointment.services.title,
          clientName: appointment.client_name,
          clientEmail: appointment.client_email,
        },
        rejectionReason: rejectionReason || 'Aucune raison spécifiée',
      });
    } catch (emailError) {
      console.error('Erreur lors de l\'envoi de l\'email:', emailError);
      // Ne pas faire échouer la requête si l'email échoue
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Réservation refusée avec succès',
        appointmentId: appointment.id,
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
