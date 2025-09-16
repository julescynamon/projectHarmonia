/* empty css                                       */
import { e as createAstro, c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_BsvY2apF.mjs';
import 'kleur/colors';
import { $ as $$MainLayout } from '../../chunks/MainLayout_BPgP8eEd.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://harmonia.jules.com");
const $$Confirmation = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Confirmation;
  const sessionId = Astro2.url.searchParams.get("session_id");
  let appointment;
  let service;
  if (sessionId) {
    const supabase = Astro2.locals.supabase;
    const { data: appointmentData } = await supabase.from("appointments").select("*").eq("stripe_session_id", sessionId).single();
    if (appointmentData) {
      appointment = appointmentData;
      const { data: serviceData } = await supabase.from("services").select("*").eq("id", appointment.service_id).single();
      service = serviceData;
    }
  }
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Confirmation de rendez-vous", "description": "Confirmation de votre rendez-vous" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="pt-24"> <section class="py-20 bg-sage/5"> <div class="container mx-auto px-4"> <div class="max-w-2xl mx-auto"> ${appointment && service ? renderTemplate`<div class="bg-white rounded-lg shadow-lg p-8 text-center"> <span class="material-icons text-6xl text-eucalyptus mb-6">check_circle</span> <h1 class="font-heading text-3xl text-ebony mb-6">
Rendez-vous confirmé !
</h1> <div class="space-y-4 mb-8"> <p class="text-eucalyptus">
Merci ${appointment.client_name}, votre rendez-vous a été confirmé.
</p> <div class="border-t border-b border-sage/20 py-4 space-y-2"> <p> <span class="font-semibold">Service :</span> ${service.title} </p> <p> <span class="font-semibold">Date :</span> ${appointment.date} </p> <p> <span class="font-semibold">Heure :</span> ${appointment.time} </p> <p> <span class="font-semibold">Prix :</span> ${service.price}€
</p> </div> <p class="text-sm text-eucalyptus">
Un email de confirmation vous a été envoyé à ${appointment.client_email} </p> </div> <a href="/" class="inline-block bg-eucalyptus text-white px-8 py-3 rounded-lg hover:bg-eucalyptus/90 transition-colors">
Retour à l'accueil
</a> </div>` : renderTemplate`<div class="text-center"> <h1 class="font-heading text-3xl text-ebony mb-6">
Une erreur est survenue
</h1> <p class="text-eucalyptus mb-8">
Nous n'avons pas pu trouver votre rendez-vous. Veuillez réessayer ou nous contacter.
</p> <a href="/rendez-vous" class="inline-block bg-eucalyptus text-white px-8 py-3 rounded-lg hover:bg-eucalyptus/90 transition-colors">
Retour à la prise de rendez-vous
</a> </div>`} </div> </div> </section> </div> ` })}`;
}, "/Users/jules/Downloads/harmonia/src/pages/rendez-vous/confirmation.astro", void 0);

const $$file = "/Users/jules/Downloads/harmonia/src/pages/rendez-vous/confirmation.astro";
const $$url = "/rendez-vous/confirmation";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Confirmation,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
