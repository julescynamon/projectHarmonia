/* empty css                                    */
import { e as createAstro, c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_BsvY2apF.mjs';
import 'kleur/colors';
import { $ as $$MainLayout } from '../chunks/MainLayout_BPgP8eEd.mjs';
import { $ as $$AuthForm } from '../chunks/AuthForm_fs03rmiV.mjs';
/* empty css                                    */
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://harmonia.jules.com");
const $$Register = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Register;
  const supabase = Astro2.locals.supabase;
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    return Astro2.redirect("/boutique");
  }
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Inscription", "description": "Cr\xE9ez votre compte pour acc\xE9der \xE0 la boutique.", "data-astro-cid-qraosrxq": true }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<section class="relative min-h-screen flex items-center justify-center overflow-hidden hero-section" data-astro-cid-qraosrxq> <!-- Background avec image et overlay --> <div class="absolute inset-0" data-astro-cid-qraosrxq> <img src="/images/contact-hero.webp" alt="Inscription La Maison Sattvaïa" class="w-full h-full object-cover scale-110 transform motion-safe:animate-subtle-zoom" data-astro-cid-qraosrxq> <div class="absolute inset-0 bg-gradient-to-r from-ebony/80 via-ebony/60 to-ebony/40" data-astro-cid-qraosrxq></div> </div> <!-- Contenu principal centré --> <div class="container mx-auto px-4 relative z-10 flex flex-col justify-center min-h-screen" data-astro-cid-qraosrxq> <div class="max-w-5xl mx-auto text-center" data-astro-cid-qraosrxq> <!-- En-tête centré --> <div class="motion-safe:animate-fade-in" data-astro-cid-qraosrxq> <div class="inline-block mb-8" data-astro-cid-qraosrxq> <span class="bg-gradient-to-r from-sage to-gold bg-clip-text text-transparent font-slogan text-xl font-semibold uppercase tracking-wider" data-astro-cid-qraosrxq>
Rejoignez notre communauté
</span> </div> <h1 class="font-heading text-4xl md:text-5xl lg:text-6xl mb-8 leading-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="400" data-astro-cid-qraosrxq>
Commencez votre <span class="text-sage" data-astro-cid-qraosrxq>chemin</span> vers l'harmonie
</h1> <p class="font-slogan text-xl md:text-2xl mb-12 text-white/90 leading-relaxed max-w-4xl mx-auto drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)] italic" data-aos="fade-up" data-aos-duration="800" data-aos-delay="600" data-astro-cid-qraosrxq>
"Créez votre compte et accédez à nos accompagnements personnalisés et à notre boutique de bien-être."
</p> </div> </div> </div> <!-- Transition brush effect --> <div class="absolute bottom-0 left-0 w-full z-30" data-astro-cid-qraosrxq> <div class="absolute inset-0 bg-gradient-to-b from-transparent to-cream" data-astro-cid-qraosrxq></div> <svg width="100%" height="80" viewBox="0 0 1200 80" preserveAspectRatio="none" class="w-full h-auto" data-astro-cid-qraosrxq> <path d="M0,80 C300,20 600,60 1200,40 L1200,80 Z" fill="#faf9f7" data-astro-cid-qraosrxq></path> </svg> </div> </section>  <section class="py-20 md:py-32 bg-gradient-to-b from-cream to-white relative overflow-hidden" data-astro-cid-qraosrxq> <!-- Éléments décoratifs --> <div class="absolute top-0 left-0 w-72 h-72 bg-sage/5 rounded-full blur-3xl" data-astro-cid-qraosrxq></div> <div class="absolute bottom-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" data-astro-cid-qraosrxq></div> <div class="absolute inset-0 bg-geometric-pattern opacity-3" data-astro-cid-qraosrxq></div> <div class="container mx-auto px-4 relative" data-astro-cid-qraosrxq> <!-- En-tête section --> <div class="text-center max-w-4xl mx-auto mb-16" data-aos="fade-up" data-aos-duration="1000" data-astro-cid-qraosrxq> <div class="inline-block mb-6" data-astro-cid-qraosrxq> <span class="bg-gradient-to-r from-sage to-gold bg-clip-text text-transparent font-slogan text-lg font-semibold uppercase tracking-wider" data-astro-cid-qraosrxq>
Inscription
</span> </div> <h2 class="font-heading text-4xl md:text-5xl lg:text-6xl text-ebony mb-8 leading-tight" data-astro-cid-qraosrxq>
Créez votre <span class="text-sage" data-astro-cid-qraosrxq>compte</span> </h2> <p class="font-slogan text-xl text-eucalyptus leading-relaxed" data-astro-cid-qraosrxq>
Rejoignez La Maison Sattvaïa et accédez à nos accompagnements personnalisés
</p> </div> <!-- Formulaire centré --> <div class="max-w-md mx-auto" data-aos="fade-up" data-aos-offset="50" data-aos-duration="1000" data-astro-cid-qraosrxq> <div class="bg-white/90 backdrop-blur-sm rounded-3xl p-8 lg:p-12 shadow-xl border border-sage/10 hover:shadow-2xl transition-all duration-500" data-astro-cid-qraosrxq> ${renderComponent($$result2, "AuthForm", $$AuthForm, { "type": "register", "data-astro-cid-qraosrxq": true })} </div> </div> </div> </section> ` })} `;
}, "/Users/jules/Downloads/harmonia/src/pages/register.astro", void 0);

const $$file = "/Users/jules/Downloads/harmonia/src/pages/register.astro";
const $$url = "/register";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Register,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
