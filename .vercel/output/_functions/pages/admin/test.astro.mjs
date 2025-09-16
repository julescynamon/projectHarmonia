/* empty css                                       */
import { e as createAstro, c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_BsvY2apF.mjs';
import 'kleur/colors';
import { $ as $$MainLayout } from '../../chunks/MainLayout_Nho3QixU.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://project-harmonia.vercel.app");
const $$Test = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Test;
  const session = Astro2.locals.session;
  console.log("[ADMIN_TEST] Session:", session?.user?.email);
  console.log("[ADMIN_TEST] URL:", Astro2.url.pathname);
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Test Admin", "description": "Page de test pour diagnostiquer les redirections" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-4xl mx-auto px-4 py-8"> <h1 class="text-3xl font-bold mb-8">Test Page Admin</h1> <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6"> <strong>✅ Succès !</strong> Vous avez accédé à la page admin de test.
</div> <div class="bg-gray-100 p-4 rounded-lg mb-6"> <h2 class="text-xl font-semibold mb-4">Informations de session :</h2> <pre class="text-sm overflow-auto">${JSON.stringify(session, null, 2)}</pre> </div> <div class="space-y-4"> <a href="/admin/blog" class="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
Tester /admin/blog
</a> <br> <a href="/mon-compte" class="inline-block px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
Retour Mon Compte
</a> </div> </div> ` })}`;
}, "/Users/jules/Downloads/harmonia/src/pages/admin/test.astro", void 0);

const $$file = "/Users/jules/Downloads/harmonia/src/pages/admin/test.astro";
const $$url = "/admin/test";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Test,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
