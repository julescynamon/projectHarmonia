import Stripe from 'stripe';
import { Resend } from 'resend';
import { s as sendAppointmentNotification } from '../../../chunks/notifications_Dm37Eisy.mjs';
export { renderers } from '../../../renderers.mjs';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16"
});
new Resend(process.env.RESEND_API_KEY);
const POST = async ({ request, locals }) => {
  const payload = await request.text();
  const sig = request.headers.get("stripe-signature") || "";
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Webhook signature verification failed" }),
      { status: 400 }
    );
  }
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const supabase = locals.supabase;
    const { data: existingAppointment, error: checkError } = await supabase.from("appointments").select("*, services(title)").eq("stripe_session_id", session.id).single();
    if (checkError || !existingAppointment) {
      console.error("Rendez-vous non trouvé:", checkError);
      return new Response(JSON.stringify({ error: "Rendez-vous non trouvé" }), { status: 404 });
    }
    const { data: conflictingAppointments, error: conflictError } = await supabase.from("appointments").select("*").eq("date", existingAppointment.date).eq("time", existingAppointment.time).eq("status", "confirmed").neq("id", existingAppointment.id);
    if (conflictError) {
      console.error("Erreur lors de la vérification des conflits:", conflictError);
      return new Response(JSON.stringify({ error: "Erreur lors de la vérification des conflits" }), { status: 500 });
    }
    if (conflictingAppointments && conflictingAppointments.length > 0) {
      console.error("Conflit de créneau détecté, annulation du paiement");
      return new Response(JSON.stringify({ error: "Conflit de créneau détecté" }), { status: 409 });
    }
    const { data: appointment, error } = await supabase.from("appointments").update({
      status: "confirmed",
      reason: session.metadata?.reason || null
    }).eq("stripe_session_id", session.id).select("*, services(title)").single();
    if (error || !appointment) {
      console.error("Erreur lors de la mise à jour du rendez-vous:", error);
      return new Response(JSON.stringify({ error: "Erreur lors de la mise à jour du rendez-vous" }), { status: 500 });
    }
    try {
      await sendAppointmentNotification({
        date: appointment.date,
        time: appointment.time,
        service: appointment.services.title,
        clientName: appointment.client_name,
        clientEmail: appointment.client_email,
        reason: appointment.reason
      });
    } catch (error2) {
      console.error("Erreur lors de l'envoi des notifications:", error2);
    }
    if (error) {
      console.error("Erreur lors de la mise à jour du rendez-vous:", error);
      return new Response(
        JSON.stringify({
          error: "Error updating appointment",
          details: error.message
        }),
        { status: 500 }
      );
    }
  }
  return new Response(JSON.stringify({ received: true }), { status: 200 });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
