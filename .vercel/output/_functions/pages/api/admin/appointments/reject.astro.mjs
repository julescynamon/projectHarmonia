import { a as sendAppointmentRejectionEmail } from '../../../../chunks/email-service_goO0ss9z.mjs';
export { renderers } from '../../../../renderers.mjs';

const POST = async ({ request, locals }) => {
  try {
    const session = locals.session;
    if (!session?.user?.id) {
      return new Response(
        JSON.stringify({ error: "Non autorisé" }),
        { status: 401 }
      );
    }
    const { data: profile, error: profileError } = await locals.supabase.from("profiles").select("role").eq("id", session.user.id).single();
    const isMainAdmin = session.user.email === "tyzranaima@gmail.com";
    if (!isMainAdmin && (profileError || !profile || profile.role !== "admin")) {
      return new Response(
        JSON.stringify({ error: "Accès refusé" }),
        { status: 403 }
      );
    }
    const { appointmentId, rejectionReason } = await request.json();
    if (!appointmentId) {
      return new Response(
        JSON.stringify({ error: "ID de réservation manquant" }),
        { status: 400 }
      );
    }
    if (!rejectionReason) {
      return new Response(
        JSON.stringify({ error: "Motif de refus manquant" }),
        { status: 400 }
      );
    }
    const { data: appointment, error: appointmentError } = await locals.supabase.from("appointments").select(`
        *,
        services (
          title,
          price
        )
      `).eq("id", appointmentId).single();
    if (appointmentError || !appointment) {
      return new Response(
        JSON.stringify({ error: "Réservation non trouvée" }),
        { status: 404 }
      );
    }
    if (appointment.status !== "pending_approval") {
      return new Response(
        JSON.stringify({ error: "Cette réservation ne peut pas être refusée" }),
        { status: 400 }
      );
    }
    const { error: updateError } = await locals.supabase.from("appointments").update({
      status: "refused",
      rejection_reason: rejectionReason,
      rejected_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", appointmentId);
    if (updateError) {
      console.error("Erreur lors de la mise à jour:", updateError);
      return new Response(
        JSON.stringify({ error: "Erreur lors de la mise à jour de la réservation" }),
        { status: 500 }
      );
    }
    try {
      await sendAppointmentRejectionEmail({
        clientName: appointment.client_name,
        clientEmail: appointment.client_email,
        date: appointment.date,
        time: appointment.time,
        service: appointment.services?.title || "Consultation",
        rejectionReason
      });
    } catch (emailError) {
      console.error("Erreur lors de l'envoi de l'email:", emailError);
    }
    return new Response(
      JSON.stringify({
        success: true,
        message: "Réservation refusée avec succès"
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors du refus:", error);
    return new Response(
      JSON.stringify({ error: "Erreur interne du serveur" }),
      { status: 500 }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
