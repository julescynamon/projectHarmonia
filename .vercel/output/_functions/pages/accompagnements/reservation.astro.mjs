/* empty css                                       */
import { c as createComponent, r as renderComponent, b as renderScript, a as renderTemplate, m as maybeRenderHead, d as addAttribute } from '../../chunks/astro/server_BsvY2apF.mjs';
import 'kleur/colors';
import { $ as $$MainLayout } from '../../chunks/MainLayout_BPgP8eEd.mjs';
import { $ as $$Button } from '../../chunks/Button_SIIWVcck.mjs';
export { renderers } from '../../renderers.mjs';

const $$Reservation = createComponent(async ($$result, $$props, $$slots) => {
  const seo = {
    title: "R\xE9server un accompagnement - Naima Tyzra",
    description: "Prenez rendez-vous pour un accompagnement personnalis\xE9 en naturopathie humaine et animale, soins \xE9nerg\xE9tiques et suivi nutritionnel."
  };
  const services = [
    {
      id: "naturopathie-humaine-premiere",
      title: "Naturopathie Humaine \u2013 Premi\xE8re consultation",
      duration: "1h30-2h",
      price: "150\u20AC",
      description: "Bilan complet et plan personnalis\xE9 pour r\xE9\xE9quilibrer votre sant\xE9 de fa\xE7on naturelle et durable.",
      icon: "eco",
      category: "naturopathie-humaine"
    },
    {
      id: "naturopathie-humaine-suivi",
      title: "Naturopathie Humaine \u2013 Suivi",
      duration: "1h",
      price: "60\u20AC",
      description: "Accompagnement r\xE9gulier pour ajuster votre hygi\xE8ne de vie et maintenir vos progr\xE8s.",
      icon: "trending_up",
      category: "naturopathie-humaine"
    },
    {
      id: "naturopathie-animale-premiere",
      title: "Naturopathie Animale \u2013 Premi\xE8re consultation",
      duration: "1h \xE0 2h",
      price: "80\u20AC",
      description: "Bilan global et solutions naturelles adapt\xE9es pour am\xE9liorer la vitalit\xE9 et le bien-\xEAtre de votre compagnon.",
      icon: "pets",
      category: "naturopathie-animale"
    },
    {
      id: "naturopathie-animale-suivi",
      title: "Naturopathie Animale \u2013 Suivi",
      duration: "1h",
      price: "50\u20AC",
      description: "Suivi personnalis\xE9 pour accompagner votre animal dans la dur\xE9e et ajuster son \xE9quilibre naturel.",
      icon: "healing",
      category: "naturopathie-animale"
    },
    {
      id: "soins-energetiques-humains",
      title: "Soins \xC9nerg\xE9tiques Humains",
      duration: "1h",
      price: "90\u20AC",
      description: "Harmonisation \xE9nerg\xE9tique pour lib\xE9rer les blocages et retrouver paix, vitalit\xE9 et \xE9quilibre.",
      icon: "self_improvement",
      category: "soins-energetiques"
    },
    {
      id: "soins-energetiques-animaux",
      title: "Soins \xC9nerg\xE9tiques Animaux",
      duration: "1h",
      price: "70\u20AC",
      description: "Soin \xE9nerg\xE9tique adapt\xE9 pour apaiser, r\xE9\xE9quilibrer et soutenir la sant\xE9 globale de votre animal.",
      icon: "spa",
      category: "soins-energetiques"
    },
    {
      id: "accompagnement-personnalise",
      title: "Accompagnement Personnalis\xE9",
      duration: "1h",
      price: "70\u20AC",
      description: "S\xE9ance de guidance & coaching de vie pour clarifier vos choix, d\xE9passer vos blocages et avancer avec confiance.",
      icon: "psychology",
      category: "accompagnement"
    }
  ];
  const timeSlots = [
    "09:00",
    "10:30",
    "12:00",
    "14:00",
    "15:30",
    "17:00"
  ];
  const steps = [
    {
      title: "Choisissez votre accompagnement",
      description: "S\xE9lectionnez le type d'accompagnement qui correspond \xE0 vos besoins.",
      icon: "assignment"
    },
    {
      title: "S\xE9lectionnez une date",
      description: "Choisissez le jour qui vous convient le mieux dans le calendrier.",
      icon: "calendar_today"
    },
    {
      title: "Choisissez un horaire",
      description: "S\xE9lectionnez l'horaire qui vous arrange parmi les cr\xE9neaux disponibles.",
      icon: "schedule"
    },
    {
      title: "Confirmez votre rendez-vous",
      description: "Remplissez vos informations et validez votre r\xE9servation.",
      icon: "check_circle"
    }
  ];
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": seo.title, "description": seo.description }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div> <!-- Hero Section --> <section class="relative min-h-screen flex items-center justify-center overflow-hidden pb-16 hero-section"> <!-- Background avec image et overlay --> <div class="absolute inset-0"> <img src="/images/heroResa.webp" alt="" class="w-full h-full object-cover"> <div class="absolute inset-0 bg-gradient-to-r from-ebony/70 via-ebony/50 to-ebony/30"></div> </div> <!-- Contenu principal centré --> <div class="container mx-auto px-4 relative z-10 flex flex-col justify-center min-h-screen"> <div class="max-w-4xl mx-auto text-center"> <!-- En-tête centré --> <div class="motion-safe:animate-fade-in"> <h1 class="font-heading text-4xl md:text-5xl lg:text-6xl mb-8 leading-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="600">
Réserver votre
<span class="block text-sage mt-10 typewriter-text text-2xl md:text-3xl lg:text-4xl" id="hero-typewriter">accompagnement personnalisé</span> </h1> <p class="font-body text-xl mb-10 text-white/90 leading-relaxed max-w-3xl mx-auto drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)] italic" data-aos="fade-up" data-aos-duration="800" data-aos-delay="800">
"Prenez le temps de vous occuper de vous, c'est le moment de transformer votre vie"
</p> </div> <!-- Informations pratiques en petites bulles --> <div class="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12" data-aos="fade-up" data-aos-duration="800" data-aos-delay="1000"> <!-- Bulle 1: Format --> <div class="group relative overflow-hidden rounded-xl backdrop-blur-sm transition-all duration-500 hover:transform hover:scale-105 w-44 h-32"> <div class="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 border border-white/20 rounded-xl"></div> <div class="relative p-6 text-center flex flex-col justify-center items-center h-full"> <div class="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center mb-4"> <span class="material-icons text-white text-lg">video_call</span> </div> <p class="font-heading text-lg text-white mb-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] leading-tight">
À distance
</p> <p class="text-white/90 text-xs uppercase tracking-wider font-medium leading-tight px-1">
Visioconférence
</p> </div> </div> <!-- Bulle 2: Accompagnement --> <div class="group relative overflow-hidden rounded-xl backdrop-blur-sm transition-all duration-500 hover:transform hover:scale-105 w-44 h-32"> <div class="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 border border-white/20 rounded-xl"></div> <div class="relative p-6 text-center flex flex-col justify-center items-center h-full"> <div class="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center mb-4"> <span class="material-icons text-white text-lg">psychology</span> </div> <p class="font-heading text-lg text-white mb-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] leading-tight">
Personnalisé
</p> <p class="text-white/90 text-xs uppercase tracking-wider font-medium leading-tight px-1">
Sur mesure
</p> </div> </div> <!-- Bulle 3: Réservation --> <div class="group relative overflow-hidden rounded-xl backdrop-blur-sm transition-all duration-500 hover:transform hover:scale-105 w-44 h-32"> <div class="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 border border-white/20 rounded-xl"></div> <div class="relative p-6 text-center flex flex-col justify-center items-center h-full"> <div class="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center mb-4"> <span class="material-icons text-white text-lg">schedule</span> </div> <p class="font-heading text-lg text-white mb-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] leading-tight">
Simple
</p> <p class="text-white/90 text-xs uppercase tracking-wider font-medium leading-tight px-1">
En quelques clics
</p> </div> </div> </div> </div> </div> </section> <!-- Étapes de réservation --> <section class="py-28 bg-gradient-to-br from-white via-cream to-sage/5 relative overflow-hidden"> <!-- Éléments décoratifs en arrière-plan --> <div class="absolute inset-0 opacity-10"> <div class="absolute top-20 right-10 w-2 h-2 bg-sage rounded-full animate-pulse"></div> <div class="absolute bottom-40 left-20 w-1 h-1 bg-gold rounded-full animate-bounce"></div> <div class="absolute top-1/2 right-1/4 w-3 h-3 bg-eucalyptus rounded-full animate-ping"></div> </div> <div class="container mx-auto px-4 relative z-10"> <div class="max-w-6xl mx-auto"> <!-- Titre principal --> <div class="text-center mb-16" data-aos="fade-up"> <h2 class="font-heading text-4xl md:text-5xl lg:text-6xl text-ebony mb-6"> <span class="bg-gradient-to-r from-sage via-eucalyptus to-gold bg-clip-text text-transparent">
Comment réserver
</span> <br> <span class="text-ebony">votre accompagnement</span> </h2> <div class="w-32 h-1 bg-gradient-to-r from-sage to-gold mx-auto rounded-full mb-8"></div> <p class="font-body text-xl text-ebony/80 max-w-3xl mx-auto leading-relaxed">
Un processus simple et intuitif pour prendre rendez-vous en quelques étapes.
</p> </div> <!-- Grille d'étapes --> <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8"> ${steps.map((step, index) => renderTemplate`<div class="group" data-aos="fade-up"${addAttribute(200 + index * 100, "data-aos-delay")}> <div class="bg-white/90 backdrop-blur-sm rounded-2xl p-6 lg:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-sage/10 h-full text-center"> <div class="mb-6"> <div class="w-16 h-16 bg-gradient-to-br from-sage/20 to-eucalyptus/20 rounded-full flex items-center justify-center mx-auto mb-4"> <span class="material-icons text-sage text-2xl">${step.icon}</span> </div> <div class="w-8 h-8 bg-gradient-to-r from-sage to-gold text-white rounded-full flex items-center justify-center mx-auto text-sm font-bold"> ${index + 1} </div> </div> <h3 class="font-heading text-xl lg:text-2xl text-ebony mb-4">${step.title}</h3> <p class="font-body text-ebony/80 leading-relaxed text-sm lg:text-base">${step.description}</p> </div> </div>`)} </div> </div> </div> </section> <!-- Services disponibles --> <section class="py-16 bg-gradient-to-br from-cream via-white to-sage/5 relative overflow-hidden"> <!-- Éléments décoratifs --> <div class="absolute top-0 left-0 w-72 h-72 bg-sage/5 rounded-full blur-3xl"></div> <div class="absolute bottom-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl"></div> <div class="absolute inset-0 opacity-3"> <img src="/images/sacred-geometry.svg" alt="Geometric pattern" class="w-full h-full object-cover bg-gradient-to-r from-sage/20 to-gold/20 bg-clip-content"> </div> <!-- Éléments décoratifs en arrière-plan --> <div class="absolute inset-0 opacity-10"> <div class="absolute top-20 right-10 w-2 h-2 bg-sage rounded-full animate-pulse"></div> <div class="absolute bottom-40 left-20 w-1 h-1 bg-gold rounded-full animate-bounce"></div> <div class="absolute top-1/2 right-1/4 w-3 h-3 bg-eucalyptus rounded-full animate-ping"></div> </div> <div class="container mx-auto px-4 relative z-10"> <div class="max-w-6xl mx-auto"> <h2 class="font-heading text-3xl md:text-4xl text-ebony text-center mb-12">
Nos accompagnements disponibles
</h2> <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8"> ${services.map((service) => renderTemplate`<div class="group" data-aos="fade-up" data-aos-delay="200"${addAttribute(`service-card-${service.id}`, "id")}> <div class="bg-white/90 backdrop-blur-sm rounded-2xl p-6 lg:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-sage/10 h-full"> <div class="flex items-center space-x-4 mb-4"> <div class="bg-gradient-to-br from-sage/20 to-eucalyptus/20 p-3 rounded-full"> <span class="material-icons text-sage text-2xl">${service.icon}</span> </div> <div class="bg-sage text-white px-3 py-1 rounded-full text-sm font-slogan uppercase tracking-wider"> ${service.category === "naturopathie-humaine" ? "Humaine" : service.category === "naturopathie-animale" ? "Animale" : service.category === "soins-energetiques" ? "\xC9nerg\xE9tique" : "Accompagnement"} </div> </div> <h3 class="font-heading text-xl lg:text-2xl text-ebony mb-4">${service.title}</h3> <p class="font-body text-ebony leading-relaxed text-sm lg:text-base mb-6"> ${service.description} </p> <div class="flex justify-between items-center mb-6"> <span class="text-gold font-bold text-xl">${service.price}</span> <span class="text-eucalyptus text-sm font-medium">⏱️ ${service.duration}</span> </div> ${renderComponent($$result2, "Button", $$Button, { "href": "#reservation-form", "variant": "primary", "size": "md", "class": "w-full bg-gradient-to-r from-sage to-eucalyptus hover:from-eucalyptus hover:to-sage transition-all duration-300", "data-service": service.id }, { "default": async ($$result3) => renderTemplate` <span class="material-icons mr-2">calendar_today</span>
Réserver
` })} </div> </div>`)} </div> </div> </div> </section> <!-- Formulaire de réservation --> <section id="reservation-form" class="py-28 bg-gradient-to-br from-cream via-white to-sage/5 relative overflow-hidden"> <!-- Éléments décoratifs en arrière-plan --> <div class="absolute inset-0 opacity-10"> <div class="absolute top-10 left-10 w-32 h-32 bg-sage rounded-full blur-3xl animate-pulse"></div> <div class="absolute bottom-10 right-10 w-24 h-24 bg-gold rounded-full blur-2xl animate-bounce"></div> </div> <div class="container mx-auto px-4 relative z-10"> <div class="max-w-4xl mx-auto"> <!-- Titre principal --> <div class="text-center mb-16" data-aos="fade-up"> <h2 class="font-heading text-4xl md:text-5xl lg:text-6xl text-ebony mb-6"> <span class="bg-gradient-to-r from-sage via-eucalyptus to-gold bg-clip-text text-transparent">
Réserver votre créneau
</span> </h2> <div class="w-32 h-1 bg-gradient-to-r from-sage to-gold mx-auto rounded-full mb-8"></div> <p class="font-body text-xl text-ebony/80 max-w-3xl mx-auto leading-relaxed">
Remplissez le formulaire ci-dessous pour confirmer votre rendez-vous.
</p> </div> <div class="bg-white/90 backdrop-blur-sm rounded-2xl p-8 lg:p-12 shadow-xl border border-sage/10"> <form id="appointmentForm" class="space-y-8"> <!-- Sélection du service --> <div> <label class="block text-ebony font-medium mb-4 text-lg">Choisissez votre accompagnement</label> <div class="grid md:grid-cols-2 gap-4"> ${services.map((service) => renderTemplate`<label class="group flex items-center p-6 border-2 border-sage/20 rounded-xl cursor-pointer hover:bg-sage/5 hover:border-sage/40 transition-all duration-300 bg-white/50 backdrop-blur-sm"> <input type="radio" name="service"${addAttribute(service.id, "value")} class="mr-4" required> <div class="flex items-center space-x-4"> <div class="bg-gradient-to-br from-sage/20 to-eucalyptus/20 p-3 rounded-full group-hover:scale-110 transition-transform duration-300"> <span class="material-icons text-sage text-xl">${service.icon}</span> </div> <div> <div class="font-heading text-lg text-ebony mb-1">${service.title}</div> <div class="text-sm text-eucalyptus font-medium">${service.price} - ${service.duration}</div> </div> </div> </label>`)} </div> </div> <!-- Date --> <div> <label for="date" class="block text-ebony font-medium mb-4 text-lg">Date souhaitée</label> <input type="date" id="date" name="date" required class="w-full p-4 border-2 border-sage/20 rounded-xl focus:ring-2 focus:ring-sage focus:border-sage transition-all duration-300 bg-white/50 backdrop-blur-sm"> </div> <!-- Horaires --> <div> <label class="block text-ebony font-medium mb-4 text-lg">Horaire souhaité</label> <div class="grid grid-cols-3 md:grid-cols-6 gap-4" id="timeSlots"> ${timeSlots.map((time) => renderTemplate`<label class="group flex items-center justify-center p-4 border-2 border-sage/20 rounded-xl cursor-pointer hover:bg-sage/5 hover:border-sage/40 transition-all duration-300 bg-white/50 backdrop-blur-sm relative"> <input type="radio" name="time"${addAttribute(time, "value")} class="mr-2" required> <span class="text-sm font-medium group-hover:scale-110 transition-transform duration-300">${time}</span> <div class="time-slot-status hidden absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full shadow-sm">
Indisponible
</div> </label>`)} </div> </div> <!-- Informations personnelles --> <div class="grid md:grid-cols-2 gap-6"> <div> <label for="name" class="block text-ebony font-medium mb-4 text-lg">Nom complet</label> <input type="text" id="name" name="name" required class="w-full p-4 border-2 border-sage/20 rounded-xl focus:ring-2 focus:ring-sage focus:border-sage transition-all duration-300 bg-white/50 backdrop-blur-sm"> </div> <div> <label for="email" class="block text-ebony font-medium mb-4 text-lg">Email</label> <input type="email" id="email" name="email" required class="w-full p-4 border-2 border-sage/20 rounded-xl focus:ring-2 focus:ring-sage focus:border-sage transition-all duration-300 bg-white/50 backdrop-blur-sm"> </div> </div> <div> <label for="reason" class="block text-ebony font-medium mb-4 text-lg">Motif de consultation (optionnel)</label> <textarea id="reason" name="reason" rows="4" placeholder="Décrivez brièvement vos besoins ou questions..." class="w-full p-4 border-2 border-sage/20 rounded-xl focus:ring-2 focus:ring-sage focus:border-sage transition-all duration-300 bg-white/50 backdrop-blur-sm resize-none"></textarea> </div> <div class="text-center pt-6"> ${renderComponent($$result2, "Button", $$Button, { "type": "submit", "variant": "primary", "size": "lg", "class": "w-full md:w-auto bg-gradient-to-r from-sage to-eucalyptus hover:from-eucalyptus hover:to-sage transition-all duration-300 transform hover:scale-105" }, { "default": async ($$result3) => renderTemplate` <span class="material-icons mr-2">check_circle</span>
Confirmer ma réservation
` })} </div> </form> </div> </div> </div> </section> </div> ` })} ${renderScript($$result, "/Users/jules/Downloads/harmonia/src/pages/accompagnements/reservation.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/jules/Downloads/harmonia/src/pages/accompagnements/reservation.astro", void 0);

const $$file = "/Users/jules/Downloads/harmonia/src/pages/accompagnements/reservation.astro";
const $$url = "/accompagnements/reservation";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Reservation,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
