/* empty css                                       */
import { c as createComponent, r as renderComponent, b as renderScript, a as renderTemplate, m as maybeRenderHead, d as addAttribute } from '../../chunks/astro/server_BsvY2apF.mjs';
import 'kleur/colors';
import { $ as $$MainLayout } from '../../chunks/MainLayout_BPgP8eEd.mjs';
import { $ as $$Button } from '../../chunks/Button_SIIWVcck.mjs';
import { $ as $$Card } from '../../chunks/Card_CmPKRykx.mjs';
export { renderers } from '../../renderers.mjs';

const $$Reservation = createComponent(async ($$result, $$props, $$slots) => {
  const seo = {
    title: "R\xE9server une lecture d'\xE2me - Naima Tyzra",
    description: "Prenez rendez-vous pour une lecture d'\xE2me personnalis\xE9e et d\xE9couvrez votre chemin de vie, vos missions d'\xE2me et votre potentiel spirituel."
  };
  const services = [
    {
      id: "lecture-ame-complete",
      title: "Lecture d'\xC2me Compl\xE8te",
      duration: "1h30",
      price: "140\u20AC",
      description: "Lecture compl\xE8te de votre \xE2me : missions, chemin de vie et potentiel spirituel",
      icon: "psychology"
    },
    {
      id: "lecture-ame-thematique",
      title: "Lecture d'\xC2me Th\xE9matique",
      duration: "1h",
      price: "100\u20AC",
      description: "Lecture cibl\xE9e sur un aspect sp\xE9cifique de votre \xE2me ou de votre vie",
      icon: "lightbulb"
    },
    {
      id: "lecture-karmique",
      title: "Lecture Karmique",
      duration: "1h30",
      price: "130\u20AC",
      description: "Exploration de vos vies pass\xE9es et de leurs influences sur votre pr\xE9sent",
      icon: "history"
    },
    {
      id: "guidance-spirituelle",
      title: "Guidance Spirituelle",
      duration: "1h",
      price: "90\u20AC",
      description: "Accompagnement spirituel personnalis\xE9 pour votre \xE9volution",
      icon: "self_improvement"
    },
    {
      id: "lecture-ame-couple",
      title: "Lecture d'\xC2me Couple",
      duration: "2h",
      price: "180\u20AC",
      description: "Lecture pour comprendre la dynamique spirituelle de votre couple",
      icon: "favorite"
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
      title: "Choisissez votre lecture d'\xE2me",
      description: "S\xE9lectionnez le type de lecture qui correspond \xE0 vos besoins.",
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
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": seo.title, "description": seo.description }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="pt-24"> <!-- Hero Section --> <section class="py-20 bg-gradient-to-b from-cream to-white relative overflow-hidden"> <div class="absolute inset-0 bg-nature-pattern opacity-5"></div> <div class="container mx-auto px-4 relative z-10"> <div class="max-w-4xl mx-auto text-center" data-aos="fade-up"> <h1 class="font-heading text-4xl md:text-5xl lg:text-6xl text-ebony mb-6">
Réserver votre lecture d'âme
</h1> <p class="font-slogan text-lg md:text-xl text-eucalyptus mb-8">
Prenez rendez-vous pour une lecture d'âme personnalisée et découvrez votre essence profonde.
</p> </div> </div> </section> <!-- Étapes de réservation --> <section class="py-16 bg-white"> <div class="container mx-auto px-4"> <div class="max-w-6xl mx-auto"> <h2 class="font-heading text-3xl md:text-4xl text-ebony text-center mb-12">
Comment réserver votre lecture d'âme
</h2> <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8"> ${steps.map((step, index) => renderTemplate`${renderComponent($$result2, "Card", $$Card, { "class": "text-center p-6" }, { "default": async ($$result3) => renderTemplate` <div class="mb-4"> <div class="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4"> <span class="text-2xl">${step.icon}</span> </div> <div class="w-8 h-8 bg-gold text-white rounded-full flex items-center justify-center mx-auto text-sm font-bold"> ${index + 1} </div> </div> <h3 class="font-heading text-xl text-ebony mb-3">${step.title}</h3> <p class="text-eucalyptus">${step.description}</p> ` })}`)} </div> </div> </div> </section> <!-- Services disponibles --> <section class="py-16 bg-cream"> <div class="container mx-auto px-4"> <div class="max-w-6xl mx-auto"> <h2 class="font-heading text-3xl md:text-4xl text-ebony text-center mb-12">
Nos lectures d'âme disponibles
</h2> <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8"> ${services.map((service) => renderTemplate`${renderComponent($$result2, "Card", $$Card, { "class": "p-6 hover:shadow-lg transition-shadow duration-300" }, { "default": async ($$result3) => renderTemplate` <div class="mb-4"> <div class="w-12 h-12 bg-sage/10 rounded-lg flex items-center justify-center mb-4"> <span class="text-xl">${service.icon}</span> </div> <h3 class="font-heading text-xl text-ebony mb-2">${service.title}</h3> <p class="text-eucalyptus mb-4">${service.description}</p> </div> <div class="flex justify-between items-center mb-4"> <span class="text-gold font-bold text-lg">${service.price}</span> <span class="text-eucalyptus text-sm">${service.duration}</span> </div> ` })}`)} </div> </div> </div> </section> <!-- Formulaire de réservation --> <section class="py-16 bg-white"> <div class="container mx-auto px-4"> <div class="max-w-4xl mx-auto"> <h2 class="font-heading text-3xl md:text-4xl text-ebony text-center mb-12">
Réserver votre créneau
</h2> ${renderComponent($$result2, "Card", $$Card, { "class": "p-8" }, { "default": async ($$result3) => renderTemplate` <form id="appointmentForm" class="space-y-6"> <!-- Sélection du service --> <div> <label class="block text-ebony font-medium mb-3">Choisissez votre lecture d'âme</label> <div class="grid md:grid-cols-2 gap-4"> ${services.map((service) => renderTemplate`<label class="flex items-center p-4 border border-sage/20 rounded-lg cursor-pointer hover:bg-sage/5 transition-colors"> <input type="radio" name="service"${addAttribute(service.id, "value")} class="mr-3" required> <div> <div class="font-medium text-ebony">${service.title}</div> <div class="text-sm text-eucalyptus">${service.price} - ${service.duration}</div> </div> </label>`)} </div> </div> <!-- Date --> <div> <label for="date" class="block text-ebony font-medium mb-3">Date souhaitée</label> <input type="date" id="date" name="date" required${addAttribute((/* @__PURE__ */ new Date()).toISOString().split("T")[0], "min")} class="w-full p-3 border border-sage/20 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"> </div> <!-- Horaires --> <div> <label class="block text-ebony font-medium mb-3">Horaire souhaité</label> <div class="grid grid-cols-3 md:grid-cols-6 gap-3" id="timeSlots"> ${timeSlots.map((time) => renderTemplate`<label class="flex items-center justify-center p-3 border border-sage/20 rounded-lg cursor-pointer hover:bg-sage/5 transition-colors"> <input type="radio" name="time"${addAttribute(time, "value")} class="mr-2" required> <span class="text-sm">${time}</span> </label>`)} </div> </div> <!-- Informations personnelles --> <div class="grid md:grid-cols-2 gap-6"> <div> <label for="name" class="block text-ebony font-medium mb-3">Nom complet</label> <input type="text" id="name" name="name" required class="w-full p-3 border border-sage/20 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"> </div> <div> <label for="email" class="block text-ebony font-medium mb-3">Email</label> <input type="email" id="email" name="email" required class="w-full p-3 border border-sage/20 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"> </div> </div> <div> <label for="reason" class="block text-ebony font-medium mb-3">Motif de consultation (optionnel)</label> <textarea id="reason" name="reason" rows="4" placeholder="Décrivez brièvement vos besoins ou questions..." class="w-full p-3 border border-sage/20 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"></textarea> </div> <div class="text-center"> ${renderComponent($$result3, "Button", $$Button, { "type": "submit", "variant": "primary", "size": "lg", "class": "w-full md:w-auto" }, { "default": async ($$result4) => renderTemplate`
Confirmer ma réservation
` })} </div> </form> ` })} </div> </div> </section> </div> ` })} ${renderScript($$result, "/Users/jules/Downloads/harmonia/src/pages/lecture-ame/reservation.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/jules/Downloads/harmonia/src/pages/lecture-ame/reservation.astro", void 0);

const $$file = "/Users/jules/Downloads/harmonia/src/pages/lecture-ame/reservation.astro";
const $$url = "/lecture-ame/reservation";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Reservation,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
