/* empty css                                       */
import { e as createAstro, c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, g as renderSlot } from '../../chunks/astro/server_BsvY2apF.mjs';
import 'kleur/colors';
import { $ as $$MainLayout } from '../../chunks/MainLayout_BPgP8eEd.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://harmonia.jules.com");
const $$SimpleLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$SimpleLayout;
  const { title, description } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": title, "description": description }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main> ${renderSlot($$result2, $$slots["default"])} </main> ` })}`;
}, "/Users/jules/Downloads/harmonia/src/layouts/SimpleLayout.astro", void 0);

const $$UnsubscribeSuccess = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$SimpleLayout, { "title": "D\xE9sinscription confirm\xE9e", "description": "Page de confirmation de d\xE9sinscription \xE0 la newsletter" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-2xl mx-auto px-4 py-16 text-center"> <h1 class="text-3xl font-bold mb-6">
Désinscription confirmée
</h1> <p class="text-lg mb-8">
Vous avez été désinscrit de notre newsletter avec succès. 
      Nous ne vous enverrons plus d'emails.
</p> <p class="text-gray-400 mb-8">
Si c'était une erreur, vous pouvez toujours vous réinscrire depuis notre site.
</p> <a href="/" class="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-colors">
Retour à l'accueil
</a> </div> ` })}`;
}, "/Users/jules/Downloads/harmonia/src/pages/newsletter/unsubscribe-success.astro", void 0);

const $$file = "/Users/jules/Downloads/harmonia/src/pages/newsletter/unsubscribe-success.astro";
const $$url = "/newsletter/unsubscribe-success";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$UnsubscribeSuccess,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
