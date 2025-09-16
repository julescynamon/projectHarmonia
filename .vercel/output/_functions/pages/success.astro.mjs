/* empty css                                    */
import { e as createAstro, c as createComponent, r as renderComponent, b as renderScript, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_BsvY2apF.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_CUdCZsD4.mjs';
import { s as supabase } from '../chunks/service-role_dH4Azpbt.mjs';
import Stripe from 'stripe';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://project-harmonia.vercel.app");
const $$Success = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Success;
  const session = Astro2.locals.session;
  if (!session?.user) {
    return Astro2.redirect("/connexion");
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16"
  });
  const sessionId = Astro2.url.searchParams.get("session_id");
  if (!sessionId) {
    return Astro2.redirect("/boutique");
  }
  try {
    const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);
    if (stripeSession.payment_status !== "paid") {
      return Astro2.redirect("/boutique");
    }
  } catch (error) {
    console.error("Erreur lors de la vérification de la session Stripe:", error);
    return Astro2.redirect("/boutique");
  }
  const { error: cartError } = await supabase.from("cart_items").delete().eq("user_id", session.user.id);
  if (cartError) {
    console.error("Erreur lors de la suppression du panier:", cartError);
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Commande confirmée | La Maison Sattvaïa" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="min-h-screen bg-gradient-to-br from-primary/5 via-white to-cream"> <div class="container mx-auto px-4 py-16 sm:py-20 md:py-24"> <div class="max-w-3xl mx-auto"> <div class="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 sm:p-12 md:p-16 relative overflow-hidden border border-eucalyptus/10">  <div class="absolute -top-32 -right-32 w-64 h-64 bg-eucalyptus/20 rounded-full blur-3xl animate-pulse"></div> <div class="absolute -bottom-32 -left-32 w-64 h-64 bg-eucalyptus/30 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s"></div> <div class="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.8),transparent)] pointer-events-none"></div> <div class="relative text-center">  <div class="mb-12 relative"> <div class="absolute inset-0 animate-ping bg-eucalyptus/20 rounded-full opacity-25" style="animation-duration: 3s;"></div> <div class="absolute inset-0 animate-pulse bg-eucalyptus/30 rounded-full" style="animation-duration: 2s;"></div> <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 mx-auto text-eucalyptus transform transition-all duration-700 hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" class="animate-draw"></path> </svg> </div>  <div class="space-y-8"> <div class="space-y-4"> <h1 class="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-eucalyptus to-primary-600 bg-clip-text text-transparent animate-fade-in font-heading">
Merci pour votre commande !
</h1> <div class="h-1 w-32 bg-gradient-to-r from-eucalyptus to-primary-600 mx-auto rounded-full transform transition-all duration-500 hover:scale-x-110"></div> </div> <div class="space-y-6 text-gray-600"> <p class="text-lg sm:text-xl max-w-xl mx-auto font-medium leading-relaxed">
Votre paiement a été confirmé avec succès.
</p> <p class="text-base sm:text-lg text-gray-500 max-w-lg mx-auto leading-relaxed">
Vous pouvez maintenant accéder à vos guides depuis votre compte et commencer votre voyage vers l'harmonie.
</p> </div>  <div class="pt-10"> <div class="flex flex-col sm:flex-row gap-6 justify-center max-w-lg mx-auto"> <a href="/mon-compte" class="group relative px-8 py-4 bg-eucalyptus text-white rounded-full inline-flex items-center justify-center gap-3 transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-eucalyptus focus:ring-offset-2"> <span class="text-lg font-medium">Voir ma commande</span> <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path> </svg> </a> <a href="/boutique" class="group btn-secondary px-6 sm:px-8 py-3 rounded-full inline-flex items-center justify-center gap-2 hover:bg-gray-100 hover:scale-105 transition-all duration-300"> <span>Découvrir d'autres guides</span> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path> </svg> </a> </div> </div> </div> </div> </div> </div> </div> </main> ` })} ${renderScript($$result, "/Users/jules/Downloads/harmonia/src/pages/success.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/jules/Downloads/harmonia/src/pages/success.astro", void 0);
const $$file = "/Users/jules/Downloads/harmonia/src/pages/success.astro";
const $$url = "/success";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Success,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
