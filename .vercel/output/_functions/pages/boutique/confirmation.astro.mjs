/* empty css                                       */
import { e as createAstro, c as createComponent, r as renderComponent, a as renderTemplate, d as addAttribute, m as maybeRenderHead } from '../../chunks/astro/server_BsvY2apF.mjs';
import 'kleur/colors';
import { $ as $$MainLayout } from '../../chunks/MainLayout_BPgP8eEd.mjs';
import { s as supabase } from '../../chunks/supabase_CXSvBnpz.mjs';
export { renderers } from '../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://harmonia.jules.com");
const $$Confirmation = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Confirmation;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return Astro2.redirect("/login");
  }
  const { searchParams } = Astro2.url;
  const sessionId = searchParams.get("session_id");
  let orderId;
  if (sessionId) {
    const { data } = await supabase.from("orders").select("id").eq("stripe_session_id", sessionId).eq("user_id", user.id).single();
    if (data) {
      orderId = data.id;
    }
  }
  let order;
  let orderItems;
  let success = false;
  if (orderId) {
    try {
      const { data: orderData } = await supabase.from("orders").select("*, order_items(*, products(*))").eq("id", orderId).eq("user_id", user.id).single();
      if (orderData) {
        order = orderData;
        orderItems = orderData.order_items;
        success = true;
      }
    } catch (error) {
      console.error("Error retrieving order:", error);
    }
  }
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Confirmation de commande", "description": "Confirmation de votre commande et acc\xE8s \xE0 vos t\xE9l\xE9chargements" }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([" ", '<div class="pt-24"> <section class="py-20"> <div class="container mx-auto px-4"> <div class="max-w-2xl mx-auto"> ', " </div> </div> </section> </div> <script>\nfunction showDebug(message, data) {\n  const debugDiv = document.getElementById('debug-output') || (() => {\n    const div = document.createElement('div');\n    div.id = 'debug-output';\n    div.style.position = 'fixed';\n    div.style.bottom = '20px';\n    div.style.right = '20px';\n    div.style.backgroundColor = 'white';\n    div.style.padding = '10px';\n    div.style.border = '1px solid black';\n    div.style.maxHeight = '200px';\n    div.style.overflowY = 'auto';\n    div.style.zIndex = '9999';\n    document.body.appendChild(div);\n    return div;\n  })();\n  \n  const line = document.createElement('div');\n  line.textContent = `${new Date().toLocaleTimeString()} - ${message}: ${JSON.stringify(data)}`;\n  debugDiv.appendChild(line);\n  debugDiv.scrollTop = debugDiv.scrollHeight;\n}\n\nasync function downloadFile(productId, orderId) {\n  showDebug('T\xE9l\xE9chargement demand\xE9 pour', { productId, orderId });\n  try {\n    showDebug('Envoi de la requ\xEAte', {});\n    const response = await fetch(`/api/download?productId=${productId}&orderId=${orderId}`);\n    showDebug('R\xE9ponse re\xE7ue', { status: response.status });\n    if (!response.ok) {\n      const errorText = await response.text();\n      showDebug('Erreur serveur', { error: errorText });\n      throw new Error('Erreur lors du t\xE9l\xE9chargement');\n    }\n    \n    const data = await response.json();\n    showDebug('Donn\xE9es re\xE7ues', data);\n    const { url } = data;\n    if (!url) throw new Error('URL de t\xE9l\xE9chargement non disponible');\n\n    // Ouvrir dans un nouvel onglet\n    window.open(url, '_blank');\n  } catch (error) {\n    showDebug('Erreur', { message: error.message });\n    alert('Une erreur est survenue lors du t\xE9l\xE9chargement. Veuillez r\xE9essayer.');\n  }\n}\n\n// Rendre la fonction disponible globalement\nwindow.downloadFile = downloadFile;\n<\/script> "], [" ", '<div class="pt-24"> <section class="py-20"> <div class="container mx-auto px-4"> <div class="max-w-2xl mx-auto"> ', " </div> </div> </section> </div> <script>\nfunction showDebug(message, data) {\n  const debugDiv = document.getElementById('debug-output') || (() => {\n    const div = document.createElement('div');\n    div.id = 'debug-output';\n    div.style.position = 'fixed';\n    div.style.bottom = '20px';\n    div.style.right = '20px';\n    div.style.backgroundColor = 'white';\n    div.style.padding = '10px';\n    div.style.border = '1px solid black';\n    div.style.maxHeight = '200px';\n    div.style.overflowY = 'auto';\n    div.style.zIndex = '9999';\n    document.body.appendChild(div);\n    return div;\n  })();\n  \n  const line = document.createElement('div');\n  line.textContent = \\`\\${new Date().toLocaleTimeString()} - \\${message}: \\${JSON.stringify(data)}\\`;\n  debugDiv.appendChild(line);\n  debugDiv.scrollTop = debugDiv.scrollHeight;\n}\n\nasync function downloadFile(productId, orderId) {\n  showDebug('T\xE9l\xE9chargement demand\xE9 pour', { productId, orderId });\n  try {\n    showDebug('Envoi de la requ\xEAte', {});\n    const response = await fetch(\\`/api/download?productId=\\${productId}&orderId=\\${orderId}\\`);\n    showDebug('R\xE9ponse re\xE7ue', { status: response.status });\n    if (!response.ok) {\n      const errorText = await response.text();\n      showDebug('Erreur serveur', { error: errorText });\n      throw new Error('Erreur lors du t\xE9l\xE9chargement');\n    }\n    \n    const data = await response.json();\n    showDebug('Donn\xE9es re\xE7ues', data);\n    const { url } = data;\n    if (!url) throw new Error('URL de t\xE9l\xE9chargement non disponible');\n\n    // Ouvrir dans un nouvel onglet\n    window.open(url, '_blank');\n  } catch (error) {\n    showDebug('Erreur', { message: error.message });\n    alert('Une erreur est survenue lors du t\xE9l\xE9chargement. Veuillez r\xE9essayer.');\n  }\n}\n\n// Rendre la fonction disponible globalement\nwindow.downloadFile = downloadFile;\n<\/script> "])), maybeRenderHead(), success ? renderTemplate`<div class="text-center" data-aos="fade-up"> <div class="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6"> <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path> </svg> </div> <h1 class="text-4xl font-medium mb-4">Merci pour votre commande !</h1> <p class="text-gray-600 mb-8">
Votre commande a été confirmée. Vous pouvez télécharger vos fichiers ci-dessous.
</p> <div class="bg-gray-50 rounded-lg p-6 text-left mb-8"> <h2 class="font-medium text-lg mb-4">Vos téléchargements</h2> <div class="space-y-4"> ${orderItems?.map((item) => renderTemplate`<div class="flex items-center gap-4 p-4 bg-white rounded-lg"> <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path> </svg> <div> <h3 class="font-medium">${item.products.title}</h3> <button class="text-primary hover:text-primary/80 text-sm"${addAttribute(`downloadFile('${item.product_id}', '${orderId}')`, "onclick")}>
Télécharger
</button> </div> </div>`)} </div> </div> <a href="/boutique" class="inline-block bg-primary text-white px-8 py-3 rounded-full hover:bg-primary/90 transition-colors">
Retour à la boutique
</a> </div>` : renderTemplate`<div class="text-center" data-aos="fade-up"> <div class="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6"> <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path> </svg> </div> <h1 class="text-4xl font-medium mb-4">Une erreur est survenue</h1> <p class="text-gray-600 mb-8">
Nous n'avons pas pu trouver votre commande. Veuillez réessayer ou nous contacter si le problème persiste.
</p> <a href="/boutique" class="inline-block bg-primary text-white px-8 py-3 rounded-full hover:bg-primary/90 transition-colors">
Retour à la boutique
</a> </div>`) })}`;
}, "/Users/jules/Downloads/harmonia/src/pages/boutique/confirmation.astro", void 0);

const $$file = "/Users/jules/Downloads/harmonia/src/pages/boutique/confirmation.astro";
const $$url = "/boutique/confirmation";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Confirmation,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
