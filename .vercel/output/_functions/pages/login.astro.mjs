/* empty css                                    */
import { e as createAstro, c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_BsvY2apF.mjs';
import 'kleur/colors';
import { $ as $$MainLayout } from '../chunks/MainLayout_Nho3QixU.mjs';
import { $ as $$AuthForm } from '../chunks/AuthForm_zSuhnZm0.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://project-harmonia.vercel.app");
const $$Login = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Login;
  const session = Astro2.locals.session;
  if (session) {
    const returnTo = Astro2.url.searchParams.get("returnTo");
    return Astro2.redirect(returnTo || "/mon-compte");
  }
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Connexion", "description": "Connectez-vous \xE0 votre compte pour acc\xE9der \xE0 vos achats.", "data-astro-cid-sgpqyurt": true }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<section class="relative min-h-screen flex items-center justify-center overflow-hidden hero-section" data-astro-cid-sgpqyurt> <!-- Background avec image et overlay --> <div class="absolute inset-0" data-astro-cid-sgpqyurt> <img src="/images/contact-hero.webp" alt="Connexion La Maison Sattvaïa" class="w-full h-full object-cover scale-110 transform motion-safe:animate-subtle-zoom" data-astro-cid-sgpqyurt> <div class="absolute inset-0 bg-gradient-to-r from-ebony/80 via-ebony/60 to-ebony/40" data-astro-cid-sgpqyurt></div> </div> <!-- Contenu principal centré --> <div class="container mx-auto px-4 relative z-10 flex flex-col justify-center min-h-screen" data-astro-cid-sgpqyurt> <div class="max-w-5xl mx-auto text-center" data-astro-cid-sgpqyurt> <!-- En-tête centré --> <div class="motion-safe:animate-fade-in" data-astro-cid-sgpqyurt> <div class="inline-block mb-8" data-astro-cid-sgpqyurt> <span class="bg-gradient-to-r from-sage to-gold bg-clip-text text-transparent font-slogan text-xl font-semibold uppercase tracking-wider" data-astro-cid-sgpqyurt>
Accès à votre espace
</span> </div> <h1 class="font-heading text-4xl md:text-5xl lg:text-6xl mb-8 leading-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="400" data-astro-cid-sgpqyurt>
Bienvenue dans votre <span class="text-sage" data-astro-cid-sgpqyurt>espace personnel</span> </h1> <p class="font-slogan text-xl md:text-2xl mb-12 text-white/90 leading-relaxed max-w-4xl mx-auto drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)] italic" data-aos="fade-up" data-aos-duration="800" data-aos-delay="600" data-astro-cid-sgpqyurt>
"Reconnectez-vous à votre chemin de bien-être et accédez à vos accompagnements personnalisés."
</p> </div> </div> </div> <!-- Transition brush effect --> <div class="absolute bottom-0 left-0 w-full z-30" data-astro-cid-sgpqyurt> <div class="absolute inset-0 bg-gradient-to-b from-transparent to-cream" data-astro-cid-sgpqyurt></div> <svg width="100%" height="80" viewBox="0 0 1200 80" preserveAspectRatio="none" class="w-full h-auto" data-astro-cid-sgpqyurt> <path d="M0,80 C300,20 600,60 1200,40 L1200,80 Z" fill="#faf9f7" data-astro-cid-sgpqyurt></path> </svg> </div> </section>  <section class="py-20 md:py-32 bg-gradient-to-b from-cream to-white relative overflow-hidden" data-astro-cid-sgpqyurt> <!-- Éléments décoratifs --> <div class="absolute top-0 left-0 w-72 h-72 bg-sage/5 rounded-full blur-3xl" data-astro-cid-sgpqyurt></div> <div class="absolute bottom-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" data-astro-cid-sgpqyurt></div> <div class="absolute inset-0 bg-geometric-pattern opacity-3" data-astro-cid-sgpqyurt></div> <div class="container mx-auto px-4 relative" data-astro-cid-sgpqyurt> <!-- En-tête section --> <div class="text-center max-w-4xl mx-auto mb-16" data-aos="fade-up" data-aos-duration="1000" data-astro-cid-sgpqyurt> <div class="inline-block mb-6" data-astro-cid-sgpqyurt> <span class="bg-gradient-to-r from-sage to-gold bg-clip-text text-transparent font-slogan text-lg font-semibold uppercase tracking-wider" data-astro-cid-sgpqyurt>
Connexion
</span> </div> <h2 class="font-heading text-4xl md:text-5xl lg:text-6xl text-ebony mb-8 leading-tight" data-astro-cid-sgpqyurt>
Accédez à votre <span class="text-sage" data-astro-cid-sgpqyurt>espace</span> </h2> <p class="font-slogan text-xl text-eucalyptus leading-relaxed" data-astro-cid-sgpqyurt>
Connectez-vous pour accéder à vos commandes et accompagnements personnalisés
</p> </div> <!-- Formulaire centré --> <div class="max-w-md mx-auto" data-aos="fade-up" data-aos-offset="50" data-aos-duration="1000" data-astro-cid-sgpqyurt> <div class="bg-white/90 backdrop-blur-sm rounded-3xl p-8 lg:p-12 shadow-xl border border-sage/10 hover:shadow-2xl transition-all duration-500" data-astro-cid-sgpqyurt> ${renderComponent($$result2, "AuthForm", $$AuthForm, { "type": "login", "data-astro-cid-sgpqyurt": true })} </div> </div> </div> </section> ` })} `;
}, "/Users/jules/Downloads/harmonia/src/pages/login.astro", void 0);

const $$file = "/Users/jules/Downloads/harmonia/src/pages/login.astro";
const $$url = "/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
