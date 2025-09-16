/* empty css                                    */
import { e as createAstro, c as createComponent, h as renderHead, r as renderComponent, ak as Fragment, a as renderTemplate } from '../chunks/astro/server_BsvY2apF.mjs';
import 'kleur/colors';
import { c as createClient } from '../chunks/index_DeVVxtlF.mjs';
import Stripe from 'stripe';
import { s as sendAppointmentNotification } from '../chunks/notifications_Dm37Eisy.mjs';
/* empty css                                        */
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://harmonia.jules.com");
const $$Confirmation = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Confirmation;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const supabase = createClient(
    "https://hvthtebjvmutuvzvttdb.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2dGh0ZWJqdm11dHV2enZ0dGRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY2OTM5NTgsImV4cCI6MjA1MjI2OTk1OH0.gpI9njtvd6Mu_0wTnwfvtx0bFpUDNexuzwu3hgOGDdY"
  );
  const sessionId = Astro2.url.searchParams.get("session_id");
  if (!sessionId) {
    return Astro2.redirect("/rendez-vous");
  }
  let error = null;
  let success = false;
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      error = "Configuration du paiement invalide";
      return;
    }
    let session;
    try {
      session = await stripe.checkout.sessions.retrieve(sessionId);
    } catch (stripeError) {
      error = "Impossible de vérifier le paiement";
      return;
    }
    if (session.payment_status !== "paid") {
      error = "Le paiement n'a pas été effectué";
      return;
    }
    const { data: appointment, error: appointmentError } = await supabase.from("appointments").select("*, services(title)").eq("stripe_session_id", sessionId).single();
    if (appointmentError || !appointment) {
      error = "Rendez-vous non trouvé";
      return;
    }
    if (!appointment.date || !appointment.time || !appointment.client_name || !appointment.client_email) {
      error = "Données de rendez-vous incomplètes";
      return;
    }
    const { error: updateError } = await supabase.from("appointments").update({ status: "confirmed" }).eq("stripe_session_id", sessionId);
    if (updateError) {
      error = "Erreur lors de la confirmation du rendez-vous";
      return;
    }
    let serviceName = "Service non spécifié";
    if (appointment.services && appointment.services.title) {
      serviceName = appointment.services.title;
    } else if (appointment.service_id) {
      serviceName = appointment.service_id;
    }
    console.log("Appointment data:", {
      appointment,
      services: appointment.services,
      service_id: appointment.service_id,
      serviceName
    });
    await sendAppointmentNotification({
      date: appointment.date,
      time: appointment.time,
      service: serviceName,
      clientName: appointment.client_name,
      clientEmail: appointment.client_email
    });
    success = true;
  } catch (e) {
    console.error("Erreur dans confirmation.astro:", e);
    error = "Une erreur est survenue lors de la confirmation du rendez-vous";
  }
  if (!error) {
    error = null;
  }
  return renderTemplate`<html lang="fr" data-astro-cid-6c2vp7u3> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Confirmation de réservation - La Maison Sattvaïa</title>${renderHead()}</head> <body data-astro-cid-6c2vp7u3> <div class="container" data-astro-cid-6c2vp7u3> ${success ? renderTemplate`${renderComponent($$result, "Fragment", Fragment, { "data-astro-cid-6c2vp7u3": true }, { "default": async ($$result2) => renderTemplate` <h1 class="success" data-astro-cid-6c2vp7u3>Merci pour votre réservation !</h1> <p data-astro-cid-6c2vp7u3>Votre rendez-vous a été confirmé. Vous recevrez bientôt un email de confirmation avec tous les détails.</p> <a href="/" class="btn" data-astro-cid-6c2vp7u3>Retour à l'accueil</a> ` })}` : renderTemplate`${renderComponent($$result, "Fragment", Fragment, { "data-astro-cid-6c2vp7u3": true }, { "default": async ($$result2) => renderTemplate` <h1 class="error" data-astro-cid-6c2vp7u3>Une erreur est survenue</h1> <p data-astro-cid-6c2vp7u3>${error ? error : "Nous n'avons pas pu trouver votre rendez-vous. Veuillez réessayer ou nous contacter."}</p> <a href="/rendez-vous" class="btn" data-astro-cid-6c2vp7u3>Retour à la prise de rendez-vous</a> ` })}`} </div> </body></html>`;
}, "/Users/jules/Downloads/harmonia/src/pages/confirmation.astro", void 0);
const $$file = "/Users/jules/Downloads/harmonia/src/pages/confirmation.astro";
const $$url = "/confirmation";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Confirmation,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
