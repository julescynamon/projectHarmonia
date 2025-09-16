/* empty css                                       */
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_BsvY2apF.mjs';
import 'kleur/colors';
import { $ as $$BlogPostLayout } from '../../chunks/BlogPostLayout_D3h7-NRD.mjs';
export { renderers } from '../../renderers.mjs';

const $$ConfirmationSuccess = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$BlogPostLayout, { "title": "Inscription confirm\xE9e", "description": "Confirmation de votre inscription \xE0 la newsletter", "image": "/images/default-newsletter.webp", "category": "Newsletter", "date": (/* @__PURE__ */ new Date()).toISOString() }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-2xl mx-auto px-4 py-16 text-center"> <h1 class="text-3xl font-bold mb-6">
Inscription confirmée !
</h1> <p class="text-lg mb-8">
Merci d'avoir confirmé votre inscription à notre newsletter. 
      Vous recevrez désormais nos actualités directement dans votre boîte mail.
</p> <a href="/" class="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-colors">
Retour à l'accueil
</a> </div> ` })}`;
}, "/Users/jules/Downloads/harmonia/src/pages/newsletter/confirmation-success.astro", void 0);

const $$file = "/Users/jules/Downloads/harmonia/src/pages/newsletter/confirmation-success.astro";
const $$url = "/newsletter/confirmation-success";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ConfirmationSuccess,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
