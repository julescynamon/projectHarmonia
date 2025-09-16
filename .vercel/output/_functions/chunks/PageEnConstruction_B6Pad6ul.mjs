import { e as createAstro, c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from './astro/server_BsvY2apF.mjs';
import 'kleur/colors';
import { $ as $$MainLayout } from './MainLayout_Nho3QixU.mjs';
import { $ as $$Button } from './Button_CHyoFLrn.mjs';
/* empty css                                                    */

const $$Astro = createAstro("https://project-harmonia.vercel.app");
const $$PageEnConstruction = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$PageEnConstruction;
  const {
    title,
    description,
    serviceType,
    contactMessage = "N'h\xE9sitez pas \xE0 nous contacter pour plus d'informations sur ce service."
  } = Astro2.props;
  const seo = {
    title: `${title} - Naima Tyzra`,
    description
  };
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": seo.title, "description": seo.description, "data-astro-cid-lwmdc3no": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="pt-24" data-astro-cid-lwmdc3no> <!-- Hero Section --> <section class="py-20 bg-gradient-to-b from-cream to-white relative overflow-hidden" data-astro-cid-lwmdc3no> <!-- Image de fond --> <div class="absolute inset-0 bg-cover bg-center bg-no-repeat" style="background-image: url('/images/philosophie-sattvaia.webp');" data-astro-cid-lwmdc3no></div> <div class="container mx-auto px-4 relative z-10" data-astro-cid-lwmdc3no> <div class="max-w-4xl mx-auto text-center" data-aos="fade-up" data-astro-cid-lwmdc3no> <div class="mb-8" data-astro-cid-lwmdc3no> <div class="inline-flex items-center justify-center w-20 h-20 bg-gold/10 rounded-full mb-6" data-astro-cid-lwmdc3no> <svg class="w-10 h-10 text-gold" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-astro-cid-lwmdc3no> <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" data-astro-cid-lwmdc3no></path> </svg> </div> </div> <h1 class="font-heading text-4xl md:text-5xl lg:text-6xl text-white mb-6 drop-shadow-lg" data-astro-cid-lwmdc3no> ${title} </h1> <div class="bg-white/20 backdrop-blur-md rounded-2xl p-8 mb-8 border border-white/30 shadow-xl" data-astro-cid-lwmdc3no> <div class="flex items-center justify-center mb-4" data-astro-cid-lwmdc3no> <div class="flex space-x-1" data-astro-cid-lwmdc3no> <div class="w-2 h-2 bg-gold rounded-full animate-pulse" data-astro-cid-lwmdc3no></div> <div class="w-2 h-2 bg-gold rounded-full animate-pulse" style="animation-delay: 0.2s" data-astro-cid-lwmdc3no></div> <div class="w-2 h-2 bg-gold rounded-full animate-pulse" style="animation-delay: 0.4s" data-astro-cid-lwmdc3no></div> </div> </div> <h2 class="font-heading text-2xl md:text-3xl text-white mb-4 drop-shadow-md" data-astro-cid-lwmdc3no>
Page en cours de construction
</h2> <p class="font-slogan text-lg text-white/90 mb-6 drop-shadow-sm" data-astro-cid-lwmdc3no>
Nous travaillons actuellement sur cette page pour vous offrir une expérience complète et détaillée.
</p> <p class="text-base text-white/80 mb-8 drop-shadow-sm" data-astro-cid-lwmdc3no> ${contactMessage} </p> </div> <div class="flex flex-col sm:flex-row gap-4 justify-center items-center" data-aos="fade-up" data-aos-delay="100" data-astro-cid-lwmdc3no> ${renderComponent($$result2, "Button", $$Button, { "href": "/contact", "variant": "primary", "class": "w-full sm:w-auto", "data-astro-cid-lwmdc3no": true }, { "default": ($$result3) => renderTemplate`
Nous contacter
` })} ${renderComponent($$result2, "Button", $$Button, { "href": "/", "variant": "secondary", "class": "w-full sm:w-auto", "data-astro-cid-lwmdc3no": true }, { "default": ($$result3) => renderTemplate`
Retour à l'accueil
` })} </div> </div> </div> </section> </div> ` })} `;
}, "/Users/jules/Downloads/harmonia/src/components/ui/PageEnConstruction.astro", void 0);

export { $$PageEnConstruction as $ };
