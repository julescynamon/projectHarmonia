/* empty css                                    */
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, d as addAttribute } from '../chunks/astro/server_BsvY2apF.mjs';
import 'kleur/colors';
import { $ as $$MainLayout } from '../chunks/MainLayout_Nho3QixU.mjs';
import { p as pageSEO } from '../chunks/seo_DE79S3-Q.mjs';
import { $ as $$Button } from '../chunks/Button_CHyoFLrn.mjs';
import { $ as $$Card } from '../chunks/Card_D6yxF1_R.mjs';
export { renderers } from '../renderers.mjs';

const $$Services = createComponent(($$result, $$props, $$slots) => {
  const seo = pageSEO.services;
  const services = [
    {
      id: "consultation",
      title: "Consultation Naturopathie",
      description: "Un bilan complet de votre vitalit\xE9 et un accompagnement personnalis\xE9 pour retrouver votre \xE9quilibre naturel.",
      icon: "eco",
      features: [
        "Bilan de vitalit\xE9 approfondi",
        "Plan d'action personnalis\xE9",
        "Suivi et ajustements",
        "Conseils pratiques"
      ],
      price: "90\u20AC",
      duration: "1h30"
    },
    {
      id: "nutrition",
      title: "Suivi Nutritionnel",
      description: "Un accompagnement sur-mesure pour une alimentation saine et adapt\xE9e \xE0 vos besoins sp\xE9cifiques.",
      icon: "restaurant",
      features: [
        "Analyse des habitudes alimentaires",
        "Plan alimentaire personnalis\xE9",
        "Conseils et recettes",
        "Suivi r\xE9gulier"
      ],
      price: "75\u20AC",
      duration: "1h"
    },
    {
      id: "phyto",
      title: "Phytoth\xE9rapie",
      description: "D\xE9couvrez les bienfaits des plantes m\xE9dicinales pour soutenir votre sant\xE9 de mani\xE8re naturelle.",
      icon: "spa",
      features: [
        "S\xE9lection de plantes adapt\xE9es",
        "Conseils d'utilisation",
        "Pr\xE9parations personnalis\xE9es",
        "Suivi des effets"
      ],
      price: "80\u20AC",
      duration: "1h"
    },
    {
      id: "massage",
      title: "Massages Bien-\xEAtre",
      description: "Des techniques de massage holistiques pour d\xE9tendre corps et esprit.",
      icon: "self_improvement",
      features: [
        "Massage personnalis\xE9",
        "Techniques vari\xE9es",
        "Ambiance relaxante",
        "Conseils post-massage"
      ],
      price: "85\u20AC",
      duration: "1h"
    }
  ];
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": seo.title, "description": seo.description }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="pt-24"> <!-- Hero Section --> <section class="py-20 bg-transition relative overflow-hidden"> <!-- Motifs de fond --> <div class="container mx-auto px-4"> <div class="max-w-3xl mx-auto text-center" data-aos="fade-up"> <h1 class="font-heading text-4xl md:text-5xl lg:text-6xl text-ebony mb-6">
Mes Services
</h1> <p class="font-slogan text-lg md:text-xl text-eucalyptus mb-8">
Une approche holistique et personnalisée pour votre bien-être, combinant sagesse ancestrale et méthodes modernes.
</p> ${renderComponent($$result2, "Button", $$Button, { "href": "#consultation", "variant": "primary", "size": "lg" }, { "default": ($$result3) => renderTemplate`
Découvrir mes prestations
` })} </div> </div> </section> <!-- Services Section --> <section class="py-20 bg-transition"> <div class="container mx-auto px-4"> <div class="grid md:grid-cols-2 gap-12"> ${services.map((service, index) => renderTemplate`<div${addAttribute(service.id, "id")} data-aos="fade-up"${addAttribute(index * 100, "data-aos-delay")}> ${renderComponent($$result2, "Card", $$Card, { "variant": "hover", "class": "h-full" }, { "default": ($$result3) => renderTemplate` <div class="p-8"> <!-- En-tête --> <div class="flex items-start gap-6 mb-6"> <div class="w-16 h-16 rounded-full bg-transition flex items-center justify-center shrink-0"> <span class="material-icons text-3xl text-eucalyptus">${service.icon}</span> </div> <div> <h2 class="font-heading text-2xl text-ebony mb-2">${service.title}</h2> <p class="text-eucalyptus">${service.description}</p> </div> </div> <!-- Caractéristiques --> <ul class="space-y-3 mb-8"> ${service.features.map((feature) => renderTemplate`<li class="flex items-center gap-3"> <span class="material-icons text-gold text-sm">check_circle</span> <span class="text-eucalyptus">${feature}</span> </li>`)} </ul> <!-- Prix et durée --> <div class="flex items-center justify-between mb-8"> <div> <p class="font-heading text-3xl text-ebony">${service.price}</p> <p class="text-sm text-eucalyptus">par séance</p> </div> <div class="text-right"> <p class="font-heading text-xl text-ebony">${service.duration}</p> <p class="text-sm text-eucalyptus">durée moyenne</p> </div> </div> <!-- CTA --> ${renderComponent($$result3, "Button", $$Button, { "href": "/rendez-vous", "variant": "primary", "class": "w-full" }, { "default": ($$result4) => renderTemplate`
Prendre rendez-vous
` })} </div> ` })} </div>`)} </div> </div> </section> <!-- FAQ Section --> <section class="py-20 bg-transition relative overflow-hidden"> <!-- Motifs de fond --> <div class="absolute inset-0 bg-geometric-pattern opacity-5 rotate-180"></div> <div class="container mx-auto px-4"> <div class="max-w-3xl mx-auto"> <h2 class="font-heading text-3xl md:text-4xl text-ebony mb-12 text-center">
Questions Fréquentes
</h2> <div class="space-y-6"> ${[
    {
      question: "Comment se d\xE9roule une premi\xE8re consultation ?",
      answer: "La premi\xE8re consultation d\xE9bute par un bilan complet de votre \xE9tat de sant\xE9. Nous discutons de vos objectifs et \xE9tablissons ensemble un plan d'action personnalis\xE9."
    },
    {
      question: "Les consultations sont-elles rembours\xE9es ?",
      answer: "Les consultations peuvent \xEAtre partiellement prises en charge par certaines mutuelles. N'h\xE9sitez pas \xE0 vous renseigner aupr\xE8s de votre assurance."
    },
    {
      question: "Proposez-vous des consultations \xE0 distance ?",
      answer: "Oui, je propose des consultations en visioconf\xE9rence pour les personnes ne pouvant pas se d\xE9placer au cabinet."
    }
  ].map((item) => renderTemplate`${renderComponent($$result2, "Card", $$Card, { "variant": "feature" }, { "default": ($$result3) => renderTemplate` <div class="p-6"> <h3 class="font-heading text-xl text-ebony mb-3">${item.question}</h3> <p class="text-eucalyptus">${item.answer}</p> </div> ` })}`)} </div> </div> </div> </section> <!-- CTA Section --> <section class="py-20"> <div class="container mx-auto px-4"> <div class="max-w-3xl mx-auto text-center"> <h2 class="font-heading text-3xl md:text-4xl text-ebony mb-6">
Prêt à commencer votre parcours bien-être ?
</h2> <p class="text-eucalyptus mb-8">
Prenez rendez-vous dès maintenant pour une consultation personnalisée.
</p> <div class="flex flex-col sm:flex-row gap-4 justify-center"> ${renderComponent($$result2, "Button", $$Button, { "href": "/rendez-vous", "size": "lg" }, { "default": ($$result3) => renderTemplate`
Prendre rendez-vous
` })} ${renderComponent($$result2, "Button", $$Button, { "href": "/contact", "variant": "outline", "size": "lg" }, { "default": ($$result3) => renderTemplate`
Me contacter
` })} </div> </div> </div> </section> </div> ` })}`;
}, "/Users/jules/Downloads/harmonia/src/pages/services.astro", void 0);

const $$file = "/Users/jules/Downloads/harmonia/src/pages/services.astro";
const $$url = "/services";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Services,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
