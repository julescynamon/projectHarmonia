import Stripe from 'stripe';
import { s as sendAppointmentApprovalEmail } from '../../../../chunks/email-service_goO0ss9z.mjs';
export { renderers } from '../../../../renderers.mjs';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
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
    const { appointmentId } = await request.json();
    if (!appointmentId) {
      return new Response(
        JSON.stringify({ error: "ID de réservation manquant" }),
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
        JSON.stringify({ error: "Cette réservation ne peut pas être approuvée" }),
        { status: 400 }
      );
    }
    const sessionStripe = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: appointment.services?.title || "Consultation",
              description: `Réservation du ${appointment.date} à ${appointment.time}`
            },
            unit_amount: Math.round((appointment.services?.price || 0) * 100)
            // Conversion en centimes
          },
          quantity: 1
        }
      ],
      mode: "payment",
      success_url: `${"http://localhost:4321"}/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${"http://localhost:4321"}/rendez-vous`,
      metadata: {
        appointmentId: appointment.id,
        clientEmail: appointment.client_email,
        clientName: appointment.client_name
      }
    });
    const { error: updateError } = await locals.supabase.from("appointments").update({
      status: "pending",
      stripe_session_id: sessionStripe.id,
      approved_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", appointmentId);
    if (updateError) {
      console.error("Erreur lors de la mise à jour:", updateError);
      return new Response(
        JSON.stringify({ error: "Erreur lors de la mise à jour de la réservation" }),
        { status: 500 }
      );
    }
    try {
      await sendAppointmentApprovalEmail({
        clientName: appointment.client_name,
        clientEmail: appointment.client_email,
        date: appointment.date,
        time: appointment.time,
        service: appointment.services?.title || "Consultation",
        paymentUrl: sessionStripe.url,
        price: appointment.services?.price || 0
      });
    } catch (emailError) {
      console.error("Erreur lors de l'envoi de l'email:", emailError);
    }
    return new Response(
      JSON.stringify({
        success: true,
        message: "Réservation approuvée avec succès",
        paymentUrl: sessionStripe.url
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de l'approbation:", error);
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
