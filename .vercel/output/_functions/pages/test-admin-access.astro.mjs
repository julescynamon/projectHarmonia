/* empty css                                    */
import { e as createAstro, c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, d as addAttribute } from '../chunks/astro/server_BsvY2apF.mjs';
import 'kleur/colors';
import { $ as $$MainLayout } from '../chunks/MainLayout_Nho3QixU.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://project-harmonia.vercel.app");
const $$TestAdminAccess = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$TestAdminAccess;
  const supabase = Astro2.locals.supabase;
  const session = Astro2.locals.session;
  console.log("[TEST_ADMIN] Session:", JSON.stringify(session, null, 2));
  let testResults = [];
  try {
    const { data: profiles, error: profilesError } = await supabase.from("profiles").select("*").limit(1);
    testResults.push({
      test: "Table profiles",
      success: !profilesError,
      error: profilesError?.message,
      data: profiles?.length > 0 ? Object.keys(profiles[0]) : []
    });
    if (session?.user?.email === "tyzranaima@gmail.com") {
      testResults.push({
        test: "Utilisateur tyzranaima@gmail.com",
        success: true,
        error: null,
        data: [session.user.id, session.user.email]
      });
      testResults.push({
        test: "Profil admin",
        success: true,
        error: null,
        data: ["admin (acc\xE8s direct par email)"]
      });
    } else {
      testResults.push({
        test: "Utilisateur tyzranaima@gmail.com",
        success: false,
        error: "Utilisateur non connect\xE9 ou email diff\xE9rent",
        data: [session?.user?.email || "Non connect\xE9"]
      });
    }
    const { data: posts, error: postsError } = await supabase.from("posts").select("*").limit(1);
    testResults.push({
      test: "Table posts",
      success: !postsError,
      error: postsError?.message,
      data: posts?.length > 0 ? Object.keys(posts[0]) : []
    });
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    testResults.push({
      test: "Bucket blog-images",
      success: !bucketsError && buckets?.some((b) => b.name === "blog-images"),
      error: bucketsError?.message,
      data: buckets?.map((b) => `${b.name} (public: ${b.public})`) || []
    });
  } catch (error) {
    testResults.push({
      test: "Erreur g\xE9n\xE9rale",
      success: false,
      error: error.message,
      data: []
    });
  }
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Test Acc\xE8s Admin", "description": "Page de test pour diagnostiquer l'acc\xE8s admin" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-4xl mx-auto px-4 py-8"> <h1 class="text-3xl font-bold mb-8">Test d'Accès Admin</h1> <div class="mb-6"> <h2 class="text-xl font-semibold mb-4">Session Utilisateur</h2> <div class="bg-gray-100 p-4 rounded-lg"> <pre class="text-sm overflow-auto">${JSON.stringify(session, null, 2)}</pre> </div> </div> <div class="mb-6"> <h2 class="text-xl font-semibold mb-4">Tests de Base de Données</h2> <div class="space-y-4"> ${testResults.map((result) => renderTemplate`<div${addAttribute(`p-4 rounded-lg border ${result.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`, "class")}> <div class="flex items-center justify-between mb-2"> <h3 class="font-medium">${result.test}</h3> <span${addAttribute(`px-2 py-1 rounded text-xs font-medium ${result.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`, "class")}> ${result.success ? "\u2705 Succ\xE8s" : "\u274C \xC9chec"} </span> </div> ${result.error && renderTemplate`<p class="text-red-600 text-sm mb-2">Erreur: ${result.error}</p>`} ${result.data.length > 0 && renderTemplate`<div class="text-sm text-gray-600"> <strong>Données:</strong> ${result.data.join(", ")} </div>`} </div>`)} </div> </div> <div class="mb-6"> <h2 class="text-xl font-semibold mb-4">Actions</h2> <div class="space-x-4"> <a href="/admin/blog" class="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
Tester /admin/blog
</a> <a href="/mon-compte" class="inline-block px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
Retour Mon Compte
</a> </div> </div> </div> ` })}`;
}, "/Users/jules/Downloads/harmonia/src/pages/test-admin-access.astro", void 0);

const $$file = "/Users/jules/Downloads/harmonia/src/pages/test-admin-access.astro";
const $$url = "/test-admin-access";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$TestAdminAccess,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
