import { e as createAstro, c as createComponent, m as maybeRenderHead, r as renderComponent, a as renderTemplate, d as addAttribute, ak as Fragment, b as renderScript, h as renderHead, g as renderSlot } from './astro/server_BsvY2apF.mjs';
import 'kleur/colors';
/* empty css                                                    */
import 'clsx';

const $$Astro$3 = createAstro("https://harmonia.jules.com");
const $$AuthButton = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$AuthButton;
  const session = Astro2.locals.session;
  const isAuthenticated = !!session;
  const commonButtonClasses = "font-slogan text-sm tracking-wide transition-colors duration-200 flex items-center gap-2 logout-button";
  return renderTemplate`${maybeRenderHead()}<div class="flex items-center justify-center" data-astro-cid-gtq3mqs7> ${isAuthenticated ? renderTemplate`${renderComponent($$result, "Fragment", Fragment, { "data-astro-cid-gtq3mqs7": true }, { "default": ($$result2) => renderTemplate` <a href="/mon-compte"${addAttribute(`${commonButtonClasses}`, "class")} aria-label="Mon compte" data-astro-cid-gtq3mqs7> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6" data-astro-cid-gtq3mqs7> <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" data-astro-cid-gtq3mqs7></path> </svg> </a> <form action="/api/auth/signout" method="POST" class="inline-block" onsubmit="
          localStorage.clear();
          sessionStorage.clear();
          document.cookie.split(';').forEach(function(c) {
            document.cookie = c.trim().split('=')[0] + '=;' + 'expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/';
          });
          return true;
        " data-astro-cid-gtq3mqs7> <button type="submit"${addAttribute(`${commonButtonClasses}`, "class")} data-astro-cid-gtq3mqs7>
Déconnexion
</button> </form> ` })}` : renderTemplate`<a href="/login"${addAttribute(`${commonButtonClasses}`, "class")} data-astro-cid-gtq3mqs7>
Connexion
</a>`} </div> `;
}, "/Users/jules/Downloads/harmonia/src/components/navigation/AuthButton.astro", void 0);

const $$Astro$2 = createAstro("https://harmonia.jules.com");
const $$CartIcon = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$CartIcon;
  Astro2.locals.session;
  return renderTemplate`${maybeRenderHead()}<div class="relative inline-block"> <button id="cartButton" class="p-2 text-ebony hover:text-gold transition-colors duration-200" aria-label="Ouvrir le panier"> <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path> </svg> <span id="cartCount" class="absolute -top-2 -right-2 bg-sage text-white text-xs w-5 h-5 flex items-center justify-center rounded-full opacity-0 invisible font-medium shadow-sm transform transition-all duration-300 scale-100"></span> </button> </div> ${renderScript($$result, "/Users/jules/Downloads/harmonia/src/components/shop/CartIcon.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/jules/Downloads/harmonia/src/components/shop/CartIcon.astro", void 0);

const $$Navigation = createComponent(($$result, $$props, $$slots) => {
  const navLinks = [
    { href: "/", text: "Accueil" },
    {
      text: "Accompagnements",
      href: "#",
      // Lien parent qui ne navigue pas directement
      submenu: [
        { href: "/accompagnements/naturopathie-humaine", text: "Naturopathie humaine" },
        { href: "/accompagnements/naturopathie-animale", text: "Naturopathie animale" },
        { href: "/accompagnements/soins-energetiques-humains", text: "Soins \xE9nerg\xE9tiques humains" },
        { href: "/accompagnements/soins-energetiques-animaux", text: "Soins \xE9nerg\xE9tiques animaux" },
        { href: "/accompagnements/accompagnement-personalise", text: "Accompagnement personalis\xE9" },
        { href: "/accompagnements/reservation", text: "\u2192 R\xE9server un accompagnement" }
      ]
    },
    {
      text: "Voie Chamanique",
      href: "#",
      // Lien parent qui ne navigue pas directement
      submenu: [
        { href: "/soins-chamaniques-humain", text: "Soin chamanique humain" },
        { href: "/soins-chamaniques-quantiques", text: "Soin chamanique quantique" },
        { href: "/soins-chamaniques-animaux", text: "Soin chamanique animaux" },
        { href: "/communication-animale-chamanique", text: "Communication animale chamanique" },
        { href: "/rituels-de-transmutation-energetique", text: "Rituels de transmutation \xE9nerg\xE9tique" },
        { href: "/nettoyage-energetique", text: "Nettoyage \xE9nerg\xE9tique des lieux" },
        { href: "/rituels", text: "Rituels" },
        { href: "/chamanisme/reservation", text: "\u2192 R\xE9server un soin chamanique" }
      ]
    },
    {
      text: "Lecture d'\xE2me",
      href: "#",
      // Lien parent qui ne navigue pas directement
      submenu: [
        { href: "/numerologie-karmique", text: "Num\xE9rologie karmique" },
        { href: "/lecture-chemin-ame", text: "Lecture de chemin d'\xE2me" },
        { href: "/lecture-aura-corps-energetique", text: "Lecture d'aura et du corps \xE9nerg\xE9tique" },
        { href: "/theme-naissance-spirituelle", text: "Th\xE8me de naissance spirituelle" },
        { href: "/lien-karmique-etres", text: "Lien karmique entre les \xEAtres" },
        { href: "/guidance-intuitive", text: "Guidance intuitive" },
        { href: "/lecture-ame/reservation", text: "\u2192 R\xE9server une lecture d'\xE2me" }
      ]
    },
    { href: "/blog", text: "Blog" },
    { href: "/a-propos", text: "\xC0 propos" },
    { href: "/contact", text: "Contact" }
  ];
  return renderTemplate`${maybeRenderHead()}<nav class="fixed w-full z-50 top-0 transition-all duration-300" id="mainNav"> <div class="container mx-auto px-4 py-2"> <div class="xl:bg-white/10 xl:backdrop-blur-md xl:rounded-full xl:shadow-sm xl:px-4 xl:max-w-6xl xl:mx-auto"> <div class="flex items-center h-16 xl:h-20 xl:justify-between"> <!-- Logo (Gauche) --> <a href="/" class="flex-shrink-0 min-w-0"> <img src="/images/logo.svg" alt="Naima Tyzra" class="h-12 w-auto"> </a> <!-- Navigation Desktop (Centrée) --> <div class="hidden xl:flex items-center space-x-4 xl:flex-grow xl:justify-center min-w-0"> ${navLinks.map((link) => link.submenu ? renderTemplate`<div class="relative group" tabindex="0"> <a${addAttribute(link.href, "href")} class="font-slogan text-sm tracking-wide text-ebony hover:text-gold transition-colors duration-200 flex items-center" aria-haspopup="true" aria-expanded="false"> ${link.text} <svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path></svg> </a> <div class="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20"> <div class="py-2"> ${link.submenu.map((subItem) => renderTemplate`<a${addAttribute(subItem.href, "href")} class="block px-4 py-2 text-sm text-ebony hover:bg-gold/10 hover:text-gold transition-colors duration-200"> ${subItem.text} </a>`)} </div> </div> </div>` : renderTemplate`<a${addAttribute(link.href, "href")} class="font-slogan text-sm tracking-wide text-ebony hover:text-gold transition-colors duration-200"> ${link.text} </a>`)} </div> <!-- Actions de droite Desktop --> <div class="hidden xl:flex items-center space-x-3 min-w-0"> <div class="flex items-center gap-4"> ${renderComponent($$result, "CartIcon", $$CartIcon, {})} ${renderComponent($$result, "AuthButton", $$AuthButton, {})} </div> </div> <!-- Actions Mobile (visible uniquement sur mobile) --> <div class="xl:hidden flex items-center gap-4 ml-auto"> ${renderComponent($$result, "CartIcon", $$CartIcon, {})} <button type="button" class="p-2 text-ebony hover:text-gold transition-colors duration-200" aria-label="Menu" aria-expanded="false" id="menuButton"> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path> </svg> </button> </div> </div> </div> </div> <!-- Overlay Menu Mobile --> <div class="fixed inset-0 bg-cream/95 backdrop-blur-sm transition-all duration-300 transform translate-x-full xl:hidden" id="mobileMenu"> <div class="container mx-auto px-4 py-8"> <div class="flex justify-end"> <button type="button" class="p-2 text-ebony hover:text-gold transition-colors duration-200" aria-label="Fermer le menu" id="closeMenuButton"> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path> </svg> </button> </div> <div class="flex flex-col space-y-4 mt-8"> ${navLinks.map((link) => renderTemplate`<div class="mobile-nav-item"> <a${addAttribute(link.submenu ? "#" : link.href, "href")} class="font-slogan text-lg text-ebony hover:text-gold transition-colors duration-200 flex items-center justify-between cursor-pointer"${addAttribute(link.submenu ? "false" : void 0, "aria-expanded")}${addAttribute(link.submenu ? "true" : void 0, "aria-haspopup")}> ${link.text} ${link.submenu && renderTemplate`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-4 h-4 transform transition-transform duration-200"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path> </svg>`} </a> ${link.submenu && renderTemplate`<div class="mobile-submenu overflow-hidden transition-[max-height] duration-300 ease-in-out" style="max-height: 0;" role="menu"> <div class="pl-4 mt-2 space-y-2"> ${link.submenu.map((subItem) => renderTemplate`<a${addAttribute(subItem.href, "href")} class="block text-base text-ebony hover:text-gold transition-colors duration-200" role="menuitem"> ${subItem.text} </a>`)} </div> </div>`} </div>`)} <!-- Boutons d'action dans le menu mobile --> <div class="w-full border-t border-gray-200 pt-6 flex flex-col items-center gap-4"> ${renderComponent($$result, "AuthButton", $$AuthButton, {})} </div> </div> </div> </div> </nav> ${renderScript($$result, "/Users/jules/Downloads/harmonia/src/components/Navigation.astro?astro&type=script&index=0&lang.ts")} `;
}, "/Users/jules/Downloads/harmonia/src/components/Navigation.astro", void 0);

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  const links = {
    information: [
      { href: "/a-propos", label: "\xC0 Propos" },
      { href: "/blog", label: "Blog" },
      { href: "/contact", label: "Contact" }
    ],
    legal: [
      { href: "/mentions-legales", label: "Mentions L\xE9gales" },
      { href: "/politique-confidentialite", label: "Politique de Confidentialit\xE9" },
      { href: "/cgv", label: "CGV" }
    ]
  };
  const contact = {
    address: "30760 Salazac",
    email: "tyzranaima@gmail.com",
    phone: "07 67 22 97 43"};
  return renderTemplate`${maybeRenderHead()}<footer class="relative w-full z-10 overflow-hidden" data-astro-cid-sz7xmlte> <!-- Arrière-plan sophistiqué avec dégradé --> <div class="absolute inset-0 bg-gradient-to-br from-cream via-sage/5 to-gold/10" data-astro-cid-sz7xmlte></div> <!-- Éléments décoratifs flous comme dans les autres sections --> <div class="absolute top-0 left-0 w-96 h-96 bg-sage/20 rounded-full blur-3xl" data-astro-cid-sz7xmlte></div> <div class="absolute bottom-0 right-0 w-80 h-80 bg-gold/20 rounded-full blur-3xl" data-astro-cid-sz7xmlte></div> <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cream/30 rounded-full blur-3xl" data-astro-cid-sz7xmlte></div> <!-- Motif géométrique subtil --> <div class="absolute inset-0 bg-geometric-pattern opacity-3" data-astro-cid-sz7xmlte></div> <div class="container mx-auto px-4 relative z-30" data-astro-cid-sz7xmlte> <!-- Section principale avec espacement harmonisé --> <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 pt-20 pb-12 items-stretch" data-astro-cid-sz7xmlte> <!-- À propos avec design premium --> <div class="flex flex-col" data-aos="fade-up" data-aos-duration="800" data-aos-delay="100" data-astro-cid-sz7xmlte> <div class="relative flex-1 flex flex-col" data-astro-cid-sz7xmlte> <!-- Cadre décoratif subtil --> <div class="absolute -inset-2 bg-gradient-to-r from-sage/10 to-gold/10 rounded-2xl blur-lg" data-astro-cid-sz7xmlte></div> <div class="relative bg-white/40 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/30 flex-1 flex flex-col justify-center" data-astro-cid-sz7xmlte> <div class="mb-6" data-astro-cid-sz7xmlte> <img src="/images/logo.svg" alt="La Maison Sattvaïa" class="h-14 w-auto mx-auto" data-astro-cid-sz7xmlte> </div> <p class="text-ebony text-sm leading-relaxed text-center" data-astro-cid-sz7xmlte>
Un espace né d'un chemin de vie pour guider humains et animaux vers l'harmonie du corps, de l'énergie et de l'âme.
</p> </div> </div> </div> <!-- Information avec animation --> <div class="flex flex-col" data-aos="fade-up" data-aos-duration="800" data-aos-delay="200" data-astro-cid-sz7xmlte> <div class="relative flex-1 flex flex-col" data-astro-cid-sz7xmlte> <div class="absolute -inset-2 bg-gradient-to-r from-sage/10 to-gold/10 rounded-2xl blur-lg" data-astro-cid-sz7xmlte></div> <div class="relative bg-white/40 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/30 flex-1 flex flex-col justify-center" data-astro-cid-sz7xmlte> <h3 class="font-heading text-xl text-ebony mb-6 text-center" data-astro-cid-sz7xmlte>Information</h3> <ul class="space-y-3" data-astro-cid-sz7xmlte> ${links.information.map(({ href, label }) => renderTemplate`<li data-astro-cid-sz7xmlte> <a${addAttribute(href, "href")} class="group flex items-center text-ebony hover:text-sage transition-all duration-300 text-sm" data-astro-cid-sz7xmlte> <span class="w-2 h-2 bg-gold rounded-full mr-3 group-hover:bg-sage transition-colors duration-300" data-astro-cid-sz7xmlte></span> <span class="group-hover:translate-x-1 transition-transform duration-300" data-astro-cid-sz7xmlte>${label}</span> </a> </li>`)} </ul> </div> </div> </div> <!-- Contact avec design premium --> <div class="flex flex-col" data-aos="fade-up" data-aos-duration="800" data-aos-delay="300" data-astro-cid-sz7xmlte> <div class="relative flex-1 flex flex-col" data-astro-cid-sz7xmlte> <div class="absolute -inset-2 bg-gradient-to-r from-sage/10 to-gold/10 rounded-2xl blur-lg" data-astro-cid-sz7xmlte></div> <div class="relative bg-white/40 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/30 flex-1 flex flex-col justify-center" data-astro-cid-sz7xmlte> <h3 class="font-heading text-xl text-ebony mb-6 text-center" data-astro-cid-sz7xmlte>Contact</h3> <ul class="space-y-4" data-astro-cid-sz7xmlte> <li class="flex items-start gap-3 text-ebony text-sm" data-astro-cid-sz7xmlte> <span class="material-icons text-gold text-lg mt-0.5" data-astro-cid-sz7xmlte>location_on</span> <span class="leading-relaxed" data-astro-cid-sz7xmlte>${contact.address}</span> </li> <li data-astro-cid-sz7xmlte> <a${addAttribute(`mailto:${contact.email}`, "href")} class="group flex items-center gap-3 text-ebony hover:text-sage transition-all duration-300 text-sm" data-astro-cid-sz7xmlte> <span class="material-icons text-gold group-hover:text-sage transition-colors duration-300" data-astro-cid-sz7xmlte>email</span> <span class="group-hover:translate-x-1 transition-transform duration-300" data-astro-cid-sz7xmlte>${contact.email}</span> </a> </li> <li data-astro-cid-sz7xmlte> <a${addAttribute(`tel:${contact.phone.replace(/\s/g, "")}`, "href")} class="group flex items-center gap-3 text-ebony hover:text-sage transition-all duration-300 text-sm" data-astro-cid-sz7xmlte> <span class="material-icons text-gold group-hover:text-sage transition-colors duration-300" data-astro-cid-sz7xmlte>phone</span> <span class="group-hover:translate-x-1 transition-transform duration-300" data-astro-cid-sz7xmlte>${contact.phone}</span> </a> </li> </ul> </div> </div> </div> </div> <!-- Séparateur élégant --> <div class="relative py-8" data-astro-cid-sz7xmlte> <div class="absolute inset-0 flex items-center" data-astro-cid-sz7xmlte> <div class="w-full border-t border-gradient-to-r from-transparent via-sage/30 to-transparent" data-astro-cid-sz7xmlte></div> </div> <div class="relative flex justify-center" data-astro-cid-sz7xmlte> <div class="w-16 h-1 bg-gradient-to-r from-gold to-sage rounded-full" data-astro-cid-sz7xmlte></div> </div> </div> <!-- Section bas de page avec design harmonisé --> <div class="py-8 flex flex-col md:flex-row justify-between items-center gap-6" data-aos="fade-up" data-aos-duration="600" data-aos-delay="500" data-astro-cid-sz7xmlte> <div class="text-center md:text-left" data-astro-cid-sz7xmlte> <p class="text-ebony text-sm font-medium" data-astro-cid-sz7xmlte>
&copy; ${currentYear} La Maison Sattvaïa. Tous droits réservés.
</p> <p class="text-ebony/70 text-xs mt-1" data-astro-cid-sz7xmlte>
Un espace d'harmonie et de guérison
</p> </div> <ul class="flex flex-wrap justify-center md:justify-end gap-6 text-sm" data-astro-cid-sz7xmlte> ${links.legal.map(({ href, label }) => renderTemplate`<li data-astro-cid-sz7xmlte> <a${addAttribute(href, "href")} class="text-ebony/70 hover:text-sage transition-colors duration-300 text-xs" data-astro-cid-sz7xmlte> ${label} </a> </li>`)} </ul> </div> </div> </footer> `;
}, "/Users/jules/Downloads/harmonia/src/components/Footer.astro", void 0);

const $$Astro$1 = createAstro("https://harmonia.jules.com");
const $$Cart = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Cart;
  Astro2.locals.session;
  return renderTemplate`${maybeRenderHead()}<div id="cart" class="fixed inset-y-0 right-0 w-full max-w-md bg-cart shadow-lg transform translate-x-full transition-transform duration-300 ease-in-out z-[100]" style="pointer-events: auto;" data-astro-cid-dso3ylux> <div class="h-full flex flex-col" data-astro-cid-dso3ylux> <div class="p-6 border-b" data-astro-cid-dso3ylux> <div class="flex items-center justify-between" data-astro-cid-dso3ylux> <h2 class="text-2xl font-medium" data-astro-cid-dso3ylux>Panier</h2> <button id="closeCart" class="text-gray-600 hover:text-gray-800" aria-label="Fermer le panier" data-astro-cid-dso3ylux> <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-dso3ylux> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-astro-cid-dso3ylux></path> </svg> </button> </div> </div> <!-- Message d'erreur --> <div id="cartError" class="invisible bg-red-50 text-red-500 p-4 text-sm" data-astro-cid-dso3ylux>
Une erreur est survenue
</div> <!-- Indicateur de chargement --> <div id="cartLoading" class="invisible flex justify-center items-center p-4" data-astro-cid-dso3ylux> <svg class="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-astro-cid-dso3ylux> <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" data-astro-cid-dso3ylux></circle> <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" data-astro-cid-dso3ylux></path> </svg> </div> <div class="flex-1 overflow-y-auto p-6" data-astro-cid-dso3ylux> <div id="cartItems" class="space-y-6" data-astro-cid-dso3ylux> <!-- Les articles du panier seront injectés ici via JavaScript --> </div> <!-- Message panier vide --> <div id="emptyCart" class="hidden text-center py-8 text-gray-600" data-astro-cid-dso3ylux> <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-4 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-dso3ylux> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" data-astro-cid-dso3ylux></path> </svg> <p data-astro-cid-dso3ylux>Votre panier est vide</p> </div> </div> <div class="p-6 border-t" data-astro-cid-dso3ylux> <div class="flex items-center justify-between mb-4" data-astro-cid-dso3ylux> <span class="text-lg font-medium" data-astro-cid-dso3ylux>Total</span> <span id="cartTotal" class="text-2xl font-semibold" data-astro-cid-dso3ylux>0,00 €</span> </div> <button id="checkout" class="w-full btn-validation text-white px-6 py-3 rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled data-astro-cid-dso3ylux>
Valider la commande
</button> </div> </div> </div> ${renderScript($$result, "/Users/jules/Downloads/harmonia/src/components/shop/Cart.astro?astro&type=script&index=0&lang.ts")} `;
}, "/Users/jules/Downloads/harmonia/src/components/shop/Cart.astro", void 0);

const $$Astro = createAstro("https://harmonia.jules.com");
const $$MainLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$MainLayout;
  const {
    title,
    description,
    image = "/images/social-share.webp"
  } = Astro2.props;
  const canonicalURL = new URL(Astro2.url.pathname, Astro2.site);
  return renderTemplate`<html lang="fr" class="scroll-smooth"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title}</title><meta name="description"${addAttribute(description, "content")}><link rel="canonical"${addAttribute(canonicalURL, "href")}><!-- Open Graph / Facebook --><meta property="og:type" content="website"><meta property="og:url"${addAttribute(canonicalURL, "content")}><meta property="og:title"${addAttribute(title, "content")}><meta property="og:description"${addAttribute(description, "content")}><meta property="og:image"${addAttribute(new URL(image, Astro2.site), "content")}><meta property="og:site_name" content="Naima Tyzra - Naturopathe"><meta property="og:locale" content="fr_FR"><!-- Twitter --><meta property="twitter:card" content="summary_large_image"><meta property="twitter:url"${addAttribute(canonicalURL, "content")}><meta property="twitter:title"${addAttribute(title, "content")}><meta property="twitter:description"${addAttribute(description, "content")}><meta property="twitter:image"${addAttribute(new URL(image, Astro2.site), "content")}><meta property="twitter:site" content="@NaimaTyzra"><meta property="twitter:creator" content="@NaimaTyzra"><!-- Other meta tags --><meta name="author" content="Naima Tyzra"><meta name="robots" content="index, follow"><meta name="keywords" content="naturopathie, santé naturelle, bien-être"><meta name="theme-color" content="#4A6741"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="preload" href="/fonts/PlayfairDisplay-Regular.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="/fonts/Raleway-Regular.woff2" as="font" type="font/woff2" crossorigin><link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"><link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap" rel="stylesheet">${renderHead()}</head> <body class="min-h-screen flex flex-col  text-ebony overflow-x-hidden"> ${renderComponent($$result, "Navigation", $$Navigation, {})} <main class="w-full overflow-x-hidden"> ${renderSlot($$result, $$slots["default"])} </main> ${renderComponent($$result, "Footer", $$Footer, {})} ${renderComponent($$result, "Cart", $$Cart, {})} ${renderScript($$result, "/Users/jules/Downloads/harmonia/src/layouts/MainLayout.astro?astro&type=script&index=0&lang.ts")} </body> </html> `;
}, "/Users/jules/Downloads/harmonia/src/layouts/MainLayout.astro", void 0);

export { $$MainLayout as $, $$Cart as a };
