import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_BgD7W5jP.mjs';
import { manifest } from './manifest_Cb5k6Ynz.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/a-propos.astro.mjs');
const _page2 = () => import('./pages/accompagnements/accompagnement-personalise.astro.mjs');
const _page3 = () => import('./pages/accompagnements/naturopathie-animale.astro.mjs');
const _page4 = () => import('./pages/accompagnements/naturopathie-humaine.astro.mjs');
const _page5 = () => import('./pages/accompagnements/reservation.astro.mjs');
const _page6 = () => import('./pages/accompagnements/soins-energetiques-animaux.astro.mjs');
const _page7 = () => import('./pages/accompagnements/soins-energetiques-humains.astro.mjs');
const _page8 = () => import('./pages/admin/blog.astro.mjs');
const _page9 = () => import('./pages/admin/boutique.astro.mjs');
const _page10 = () => import('./pages/admin/disponibilites.astro.mjs');
const _page11 = () => import('./pages/admin/post/_id_.astro.mjs');
const _page12 = () => import('./pages/admin/test.astro.mjs');
const _page13 = () => import('./pages/api/admin/appointments/approve.astro.mjs');
const _page14 = () => import('./pages/api/admin/appointments/list.astro.mjs');
const _page15 = () => import('./pages/api/admin/appointments/reject.astro.mjs');
const _page16 = () => import('./pages/api/admin/notify.astro.mjs');
const _page17 = () => import('./pages/api/admin/products.astro.mjs');
const _page18 = () => import('./pages/api/appointments/check-availability.astro.mjs');
const _page19 = () => import('./pages/api/appointments/create.astro.mjs');
const _page20 = () => import('./pages/api/appointments/unavailable-times.astro.mjs');
const _page21 = () => import('./pages/api/appointments/webhook.astro.mjs');
const _page22 = () => import('./pages/api/auth/check-session.astro.mjs');
const _page23 = () => import('./pages/api/auth/logout.astro.mjs');
const _page24 = () => import('./pages/api/auth/signout.astro.mjs');
const _page25 = () => import('./pages/api/auth/sync-session.astro.mjs');
const _page26 = () => import('./pages/api/blog/create.astro.mjs');
const _page27 = () => import('./pages/api/blog/delete.astro.mjs');
const _page28 = () => import('./pages/api/blog/marknotified.astro.mjs');
const _page29 = () => import('./pages/api/blog/notify.astro.mjs');
const _page30 = () => import('./pages/api/blog/updatestatus.astro.mjs');
const _page31 = () => import('./pages/api/cart/add.astro.mjs');
const _page32 = () => import('./pages/api/cart/items.astro.mjs');
const _page33 = () => import('./pages/api/cart/remove.astro.mjs');
const _page34 = () => import('./pages/api/cart/update.astro.mjs');
const _page35 = () => import('./pages/api/cart.astro.mjs');
const _page36 = () => import('./pages/api/contact.astro.mjs');
const _page37 = () => import('./pages/api/content/blog/_---slug_.astro.mjs');
const _page38 = () => import('./pages/api/create-checkout-session.astro.mjs');
const _page39 = () => import('./pages/api/download.astro.mjs');
const _page40 = () => import('./pages/api/health.astro.mjs');
const _page41 = () => import('./pages/api/monitoring/client-data.astro.mjs');
const _page42 = () => import('./pages/api/monitoring/stats.astro.mjs');
const _page43 = () => import('./pages/api/newsletter/checksubscribers.astro.mjs');
const _page44 = () => import('./pages/api/newsletter/confirm.astro.mjs');
const _page45 = () => import('./pages/api/newsletter/notify.astro.mjs');
const _page46 = () => import('./pages/api/newsletter/subscribe.astro.mjs');
const _page47 = () => import('./pages/api/newsletter/unsubscribe.astro.mjs');
const _page48 = () => import('./pages/api/posts/create.astro.mjs');
const _page49 = () => import('./pages/api/posts/_id_/publish.astro.mjs');
const _page50 = () => import('./pages/api/posts/_id_/unpublish.astro.mjs');
const _page51 = () => import('./pages/api/posts/_id_.astro.mjs');
const _page52 = () => import('./pages/api/products.astro.mjs');
const _page53 = () => import('./pages/api/webhook/stripe.astro.mjs');
const _page54 = () => import('./pages/api/webhook.astro.mjs');
const _page55 = () => import('./pages/blog/categorie/_category_.astro.mjs');
const _page56 = () => import('./pages/blog/_slug_.astro.mjs');
const _page57 = () => import('./pages/blog.astro.mjs');
const _page58 = () => import('./pages/boutique/confirmation.astro.mjs');
const _page59 = () => import('./pages/boutique/_id_.astro.mjs');
const _page60 = () => import('./pages/boutique.astro.mjs');
const _page61 = () => import('./pages/cgv.astro.mjs');
const _page62 = () => import('./pages/chamanisme/reservation.astro.mjs');
const _page63 = () => import('./pages/communication-animale-chamanique.astro.mjs');
const _page64 = () => import('./pages/confirmation.astro.mjs');
const _page65 = () => import('./pages/contact.astro.mjs');
const _page66 = () => import('./pages/guidance-intuitive.astro.mjs');
const _page67 = () => import('./pages/lecture-ame/reservation.astro.mjs');
const _page68 = () => import('./pages/lecture-aura-corps-energetique.astro.mjs');
const _page69 = () => import('./pages/lecture-chemin-ame.astro.mjs');
const _page70 = () => import('./pages/lien-karmique-etres.astro.mjs');
const _page71 = () => import('./pages/login.astro.mjs');
const _page72 = () => import('./pages/mentions-legales.astro.mjs');
const _page73 = () => import('./pages/mon-compte.astro.mjs');
const _page74 = () => import('./pages/mot-de-passe-oublie.astro.mjs');
const _page75 = () => import('./pages/nettoyage-energetique.astro.mjs');
const _page76 = () => import('./pages/newsletter/confirmation-success.astro.mjs');
const _page77 = () => import('./pages/newsletter/unsubscribe-success.astro.mjs');
const _page78 = () => import('./pages/numerologie-karmique.astro.mjs');
const _page79 = () => import('./pages/panier.astro.mjs');
const _page80 = () => import('./pages/politique-confidentialite.astro.mjs');
const _page81 = () => import('./pages/register.astro.mjs');
const _page82 = () => import('./pages/reinitialiser-mot-de-passe.astro.mjs');
const _page83 = () => import('./pages/rendez-vous/confirmation.astro.mjs');
const _page84 = () => import('./pages/rituels.astro.mjs');
const _page85 = () => import('./pages/rituels-de-transmutation-energetique.astro.mjs');
const _page86 = () => import('./pages/services.astro.mjs');
const _page87 = () => import('./pages/sitemap.xml.astro.mjs');
const _page88 = () => import('./pages/soins-chamaniques-animaux.astro.mjs');
const _page89 = () => import('./pages/soins-chamaniques-humain.astro.mjs');
const _page90 = () => import('./pages/soins-chamaniques-quantiques.astro.mjs');
const _page91 = () => import('./pages/success.astro.mjs');
const _page92 = () => import('./pages/test-admin-access.astro.mjs');
const _page93 = () => import('./pages/theme-naissance-spirituelle.astro.mjs');
const _page94 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/a-propos.astro", _page1],
    ["src/pages/accompagnements/accompagnement-personalise.astro", _page2],
    ["src/pages/accompagnements/naturopathie-animale.astro", _page3],
    ["src/pages/accompagnements/naturopathie-humaine.astro", _page4],
    ["src/pages/accompagnements/reservation.astro", _page5],
    ["src/pages/accompagnements/soins-energetiques-animaux.astro", _page6],
    ["src/pages/accompagnements/soins-energetiques-humains.astro", _page7],
    ["src/pages/admin/blog/index.astro", _page8],
    ["src/pages/admin/boutique.astro", _page9],
    ["src/pages/admin/disponibilites.astro", _page10],
    ["src/pages/admin/post/[id].astro", _page11],
    ["src/pages/admin/test.astro", _page12],
    ["src/pages/api/admin/appointments/approve.ts", _page13],
    ["src/pages/api/admin/appointments/list.ts", _page14],
    ["src/pages/api/admin/appointments/reject.ts", _page15],
    ["src/pages/api/admin/notify.ts", _page16],
    ["src/pages/api/admin/products.ts", _page17],
    ["src/pages/api/appointments/check-availability.ts", _page18],
    ["src/pages/api/appointments/create.ts", _page19],
    ["src/pages/api/appointments/unavailable-times.ts", _page20],
    ["src/pages/api/appointments/webhook.ts", _page21],
    ["src/pages/api/auth/check-session.ts", _page22],
    ["src/pages/api/auth/logout.ts", _page23],
    ["src/pages/api/auth/signout.ts", _page24],
    ["src/pages/api/auth/sync-session.ts", _page25],
    ["src/pages/api/blog/create.ts", _page26],
    ["src/pages/api/blog/delete.ts", _page27],
    ["src/pages/api/blog/markNotified.ts", _page28],
    ["src/pages/api/blog/notify.ts", _page29],
    ["src/pages/api/blog/updateStatus.ts", _page30],
    ["src/pages/api/cart/add.ts", _page31],
    ["src/pages/api/cart/items.ts", _page32],
    ["src/pages/api/cart/remove.ts", _page33],
    ["src/pages/api/cart/update.ts", _page34],
    ["src/pages/api/cart/index.ts", _page35],
    ["src/pages/api/contact.ts", _page36],
    ["src/pages/api/content/blog/[...slug].ts", _page37],
    ["src/pages/api/create-checkout-session.ts", _page38],
    ["src/pages/api/download.ts", _page39],
    ["src/pages/api/health.ts", _page40],
    ["src/pages/api/monitoring/client-data.ts", _page41],
    ["src/pages/api/monitoring/stats.ts", _page42],
    ["src/pages/api/newsletter/checkSubscribers.ts", _page43],
    ["src/pages/api/newsletter/confirm.ts", _page44],
    ["src/pages/api/newsletter/notify.ts", _page45],
    ["src/pages/api/newsletter/subscribe.ts", _page46],
    ["src/pages/api/newsletter/unsubscribe.ts", _page47],
    ["src/pages/api/posts/create.ts", _page48],
    ["src/pages/api/posts/[id]/publish.ts", _page49],
    ["src/pages/api/posts/[id]/unpublish.ts", _page50],
    ["src/pages/api/posts/[id].ts", _page51],
    ["src/pages/api/products.ts", _page52],
    ["src/pages/api/webhook/stripe.ts", _page53],
    ["src/pages/api/webhook.ts", _page54],
    ["src/pages/blog/categorie/[category].astro", _page55],
    ["src/pages/blog/[slug].astro", _page56],
    ["src/pages/blog/index.astro", _page57],
    ["src/pages/boutique/confirmation.astro", _page58],
    ["src/pages/boutique/[id].astro", _page59],
    ["src/pages/boutique/index.astro", _page60],
    ["src/pages/cgv.astro", _page61],
    ["src/pages/chamanisme/reservation.astro", _page62],
    ["src/pages/communication-animale-chamanique.astro", _page63],
    ["src/pages/confirmation.astro", _page64],
    ["src/pages/contact.astro", _page65],
    ["src/pages/guidance-intuitive.astro", _page66],
    ["src/pages/lecture-ame/reservation.astro", _page67],
    ["src/pages/lecture-aura-corps-energetique.astro", _page68],
    ["src/pages/lecture-chemin-ame.astro", _page69],
    ["src/pages/lien-karmique-etres.astro", _page70],
    ["src/pages/login.astro", _page71],
    ["src/pages/mentions-legales.astro", _page72],
    ["src/pages/mon-compte.astro", _page73],
    ["src/pages/mot-de-passe-oublie.astro", _page74],
    ["src/pages/nettoyage-energetique.astro", _page75],
    ["src/pages/newsletter/confirmation-success.astro", _page76],
    ["src/pages/newsletter/unsubscribe-success.astro", _page77],
    ["src/pages/numerologie-karmique.astro", _page78],
    ["src/pages/panier.astro", _page79],
    ["src/pages/politique-confidentialite.astro", _page80],
    ["src/pages/register.astro", _page81],
    ["src/pages/reinitialiser-mot-de-passe.astro", _page82],
    ["src/pages/rendez-vous/confirmation.astro", _page83],
    ["src/pages/rituels.astro", _page84],
    ["src/pages/rituels-de-transmutation-energetique.astro", _page85],
    ["src/pages/services.astro", _page86],
    ["src/pages/sitemap.xml.ts", _page87],
    ["src/pages/soins-chamaniques-animaux.astro", _page88],
    ["src/pages/soins-chamaniques-humain.astro", _page89],
    ["src/pages/soins-chamaniques-quantiques.astro", _page90],
    ["src/pages/success.astro", _page91],
    ["src/pages/test-admin-access.astro", _page92],
    ["src/pages/theme-naissance-spirituelle.astro", _page93],
    ["src/pages/index.astro", _page94]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./_noop-actions.mjs'),
    middleware: () => import('./_astro-internal_middleware.mjs')
});
const _args = {
    "middlewareSecret": "082cc6f9-364b-4602-b337-45c5ee5e0cc1",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
