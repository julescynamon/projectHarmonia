/* empty css                                    */
import { e as createAstro, c as createComponent, r as renderComponent, b as renderScript, a as renderTemplate, m as maybeRenderHead, d as addAttribute } from '../chunks/astro/server_BsvY2apF.mjs';
import 'kleur/colors';
import { $ as $$MainLayout } from '../chunks/MainLayout_BPgP8eEd.mjs';
import { c as getCartItems } from '../chunks/shop_BG2ZyLKw.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://harmonia.jules.com");
const $$Panier = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Panier;
  const session = Astro2.locals.session;
  if (!session) {
    return Astro2.redirect("/login?redirect=/panier");
  }
  const cartItems = await getCartItems(session.user.id);
  const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Votre panier", "description": "G\xE9rez les articles de votre panier" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container mx-auto px-4 py-24"> <h1 class="text-4xl font-medium mb-8">Votre panier</h1> ${cartItems.length === 0 ? renderTemplate`<div class="text-center py-12"> <p class="text-xl text-gray-600 mb-6">Votre panier est vide</p> <a href="/boutique" class="bg-primary text-white px-8 py-3 rounded-full hover:bg-primary/90 transition-colors">
Découvrir nos produits
</a> </div>` : renderTemplate`<div class="grid gap-8"> <div class="bg-white rounded-lg shadow-sm"> ${cartItems.map((item) => renderTemplate`<div class="flex items-center justify-between p-6 border-b last:border-b-0"${addAttribute(item.id, "data-item-id")}> <div class="flex items-center gap-6"> <img src="/images/default-pdf-cover.webp"${addAttribute(item.product.title, "alt")} class="w-20 h-20 object-cover rounded"> <div> <h3 class="text-lg font-medium">${item.product.title}</h3> <p class="text-gray-600">${item.product.price.toFixed(2)}€</p> </div> </div> <div class="flex items-center gap-6"> <div class="flex items-center gap-2"> <button class="update-quantity bg-gray-100 hover:bg-gray-200 p-2 rounded" data-action="decrease"${addAttribute(item.id, "data-item-id")}> <span class="sr-only">Diminuer la quantité</span> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path> </svg> </button> <span class="w-8 text-center">${item.quantity}</span> <button class="update-quantity bg-gray-100 hover:bg-gray-200 p-2 rounded" data-action="increase"${addAttribute(item.id, "data-item-id")}> <span class="sr-only">Augmenter la quantité</span> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path> </svg> </button> </div> <button class="remove-item text-red-600 hover:text-red-700"${addAttribute(item.id, "data-item-id")}> <span class="sr-only">Supprimer</span> <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path> </svg> </button> </div> </div>`)} </div> <div class="bg-white rounded-lg shadow-sm p-6"> <div class="flex justify-between items-center text-xl font-medium"> <span>Total</span> <span>${total.toFixed(2)}€</span> </div> <div class="mt-6 flex justify-end"> <a href="/checkout" class="bg-primary text-white px-8 py-3 rounded-full hover:bg-primary/90 transition-colors">
Procéder au paiement
</a> </div> </div> </div>`} </div> ` })} ${renderScript($$result, "/Users/jules/Downloads/harmonia/src/pages/panier.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/jules/Downloads/harmonia/src/pages/panier.astro", void 0);

const $$file = "/Users/jules/Downloads/harmonia/src/pages/panier.astro";
const $$url = "/panier";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Panier,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
