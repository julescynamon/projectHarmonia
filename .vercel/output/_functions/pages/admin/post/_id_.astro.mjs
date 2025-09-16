/* empty css                                          */
import { e as createAstro, c as createComponent, r as renderComponent, a as renderTemplate, d as addAttribute, f as defineScriptVars, m as maybeRenderHead } from '../../../chunks/astro/server_BsvY2apF.mjs';
import 'kleur/colors';
import { $ as $$AdminLayout, P as PostEditor } from '../../../chunks/PostEditor_BY4zybDc.mjs';
import { s as supabase } from '../../../chunks/supabase_CXSvBnpz.mjs';
export { renderers } from '../../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://harmonia.jules.com");
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  const { id } = Astro2.params;
  const session = Astro2.locals.session;
  if (!session?.user?.id) {
    return Astro2.redirect("/login?returnTo=/admin/post/" + id);
  }
  const { data: profile, error: profileError } = await supabase.from("profiles").select("role").eq("id", session.user.id).single();
  const isMainAdmin = session.user.email === "tyzranaima@gmail.com";
  if (!isMainAdmin && (profileError || !profile || profile.role !== "admin")) {
    return Astro2.redirect("/mon-compte");
  }
  const { data: post, error } = await supabase.from("posts").select("*").eq("id", id).eq("author_id", session.user.id).single();
  if (error || !post) {
    return Astro2.redirect("/admin/blog");
  }
  const initialData = {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt || "",
    cover_url: post.cover_url || "",
    cover_alt: post.cover_alt || "",
    content: post.content,
    tags: post.tags || [],
    seo_title: post.seo_title || "",
    seo_description: post.seo_description || "",
    status: post.status,
    published_at: post.published_at,
    author_id: post.author_id,
    created_at: post.created_at,
    updated_at: post.updated_at
  };
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": `\xC9diter : ${post.title}` }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([" ", `<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"> <div class="mb-8"> <div class="flex items-center justify-between"> <div> <h1 class="text-3xl font-bold text-gray-900">\xC9diter l'article</h1> <p class="mt-2 text-sm text-gray-700">
Modifiez votre article avec l'\xE9diteur TipTap
</p> </div> <div class="flex items-center space-x-4"> <a href="/admin/blog" class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sage">
\u2190 Retour \xE0 la liste
</a> `, " </div> </div> </div> <!-- \xC9diteur d'article --> ", " <script>(function(){", "\n      console.log('Script de la page Astro charg\xE9');\n      console.log('ID de l\\'article:', postId);\n      console.log('User ID:', userId);\n      \n      // \xC9couter les \xE9v\xE9nements personnalis\xE9s du composant PostEditor\n      window.addEventListener('postSave', async (event) => {\n        console.log('\xC9v\xE9nement postSave re\xE7u:', event.detail);\n        \n        const { postData, action } = event.detail;\n        \n        try {\n          console.log('Envoi de la requ\xEAte de sauvegarde \xE0 l\\'API...');\n          const response = await fetch(`/api/posts/${postId}`, {\n            method: 'PUT',\n            headers: {\n              'Content-Type': 'application/json',\n            },\n            body: JSON.stringify({\n              ...postData,\n              author_id: userId\n            })\n          });\n          \n          console.log('Response status:', response.status);\n          const responseData = await response.json();\n          console.log('Response data:', responseData);\n          \n          if (!response.ok) {\n            throw new Error(`Erreur ${response.status}: ${responseData.error || 'Erreur inconnue'}`);\n          }\n          \n          alert('Article sauvegard\xE9 en brouillon !');\n        } catch (error) {\n          console.error('Erreur lors de la sauvegarde:', error);\n          alert('Une erreur est survenue lors de la sauvegarde: ' + error.message);\n        }\n      });\n\n      window.addEventListener('postPublish', async (event) => {\n        console.log('\xC9v\xE9nement postPublish re\xE7u:', event.detail);\n        \n        const { postData, action } = event.detail;\n        \n        try {\n          console.log('Envoi de la requ\xEAte \xE0 l\\'API...');\n          const response = await fetch(`/api/posts/${postId}`, {\n            method: 'PUT',\n            headers: {\n              'Content-Type': 'application/json',\n            },\n            body: JSON.stringify({\n              ...postData,\n              author_id: userId\n            })\n          });\n          \n          console.log('Response status:', response.status);\n          const responseData = await response.json();\n          console.log('Response data:', responseData);\n          \n          if (!response.ok) {\n            throw new Error(`Erreur ${response.status}: ${responseData.error || 'Erreur inconnue'}`);\n          }\n          \n          alert('Article publi\xE9 avec succ\xE8s !');\n          // Rediriger vers la liste des articles\n          window.location.href = '/admin/blog';\n        } catch (error) {\n          console.error('Erreur lors de la publication:', error);\n          alert('Une erreur est survenue lors de la publication: ' + error.message);\n        }\n      });\n      \n      // Test de l'\xE9v\xE9nement\n      console.log('Listener d\\'\xE9v\xE9nement postPublish configur\xE9');\n    })();<\/script> <!-- Informations sur l'article --> <div class=\"mt-8 bg-gray-50 rounded-lg p-6\"> <h3 class=\"text-lg font-medium text-gray-900 mb-4\">Informations sur l'article</h3> <div class=\"grid grid-cols-1 md:grid-cols-2 gap-6 text-sm\"> <div> <p class=\"text-gray-600\"> <span class=\"font-medium\">Statut :</span> <span", "> ", ' </span> </p> <p class="text-gray-600 mt-2"> <span class="font-medium">Cr\xE9\xE9 le :</span> <span class="ml-2">', "</span> </p> ", ' </div> <div> <p class="text-gray-600"> <span class="font-medium">Slug :</span> <span class="ml-2 font-mono text-xs bg-gray-200 px-2 py-1 rounded"> ', ' </span> </p> <p class="text-gray-600 mt-2"> <span class="font-medium">Derni\xE8re modification :</span> <span class="ml-2">', "</span> </p> </div> </div> </div> </div> "], [" ", `<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"> <div class="mb-8"> <div class="flex items-center justify-between"> <div> <h1 class="text-3xl font-bold text-gray-900">\xC9diter l'article</h1> <p class="mt-2 text-sm text-gray-700">
Modifiez votre article avec l'\xE9diteur TipTap
</p> </div> <div class="flex items-center space-x-4"> <a href="/admin/blog" class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sage">
\u2190 Retour \xE0 la liste
</a> `, " </div> </div> </div> <!-- \xC9diteur d'article --> ", " <script>(function(){", "\n      console.log('Script de la page Astro charg\xE9');\n      console.log('ID de l\\\\'article:', postId);\n      console.log('User ID:', userId);\n      \n      // \xC9couter les \xE9v\xE9nements personnalis\xE9s du composant PostEditor\n      window.addEventListener('postSave', async (event) => {\n        console.log('\xC9v\xE9nement postSave re\xE7u:', event.detail);\n        \n        const { postData, action } = event.detail;\n        \n        try {\n          console.log('Envoi de la requ\xEAte de sauvegarde \xE0 l\\\\'API...');\n          const response = await fetch(\\`/api/posts/\\${postId}\\`, {\n            method: 'PUT',\n            headers: {\n              'Content-Type': 'application/json',\n            },\n            body: JSON.stringify({\n              ...postData,\n              author_id: userId\n            })\n          });\n          \n          console.log('Response status:', response.status);\n          const responseData = await response.json();\n          console.log('Response data:', responseData);\n          \n          if (!response.ok) {\n            throw new Error(\\`Erreur \\${response.status}: \\${responseData.error || 'Erreur inconnue'}\\`);\n          }\n          \n          alert('Article sauvegard\xE9 en brouillon !');\n        } catch (error) {\n          console.error('Erreur lors de la sauvegarde:', error);\n          alert('Une erreur est survenue lors de la sauvegarde: ' + error.message);\n        }\n      });\n\n      window.addEventListener('postPublish', async (event) => {\n        console.log('\xC9v\xE9nement postPublish re\xE7u:', event.detail);\n        \n        const { postData, action } = event.detail;\n        \n        try {\n          console.log('Envoi de la requ\xEAte \xE0 l\\\\'API...');\n          const response = await fetch(\\`/api/posts/\\${postId}\\`, {\n            method: 'PUT',\n            headers: {\n              'Content-Type': 'application/json',\n            },\n            body: JSON.stringify({\n              ...postData,\n              author_id: userId\n            })\n          });\n          \n          console.log('Response status:', response.status);\n          const responseData = await response.json();\n          console.log('Response data:', responseData);\n          \n          if (!response.ok) {\n            throw new Error(\\`Erreur \\${response.status}: \\${responseData.error || 'Erreur inconnue'}\\`);\n          }\n          \n          alert('Article publi\xE9 avec succ\xE8s !');\n          // Rediriger vers la liste des articles\n          window.location.href = '/admin/blog';\n        } catch (error) {\n          console.error('Erreur lors de la publication:', error);\n          alert('Une erreur est survenue lors de la publication: ' + error.message);\n        }\n      });\n      \n      // Test de l'\xE9v\xE9nement\n      console.log('Listener d\\\\'\xE9v\xE9nement postPublish configur\xE9');\n    })();<\/script> <!-- Informations sur l'article --> <div class=\"mt-8 bg-gray-50 rounded-lg p-6\"> <h3 class=\"text-lg font-medium text-gray-900 mb-4\">Informations sur l'article</h3> <div class=\"grid grid-cols-1 md:grid-cols-2 gap-6 text-sm\"> <div> <p class=\"text-gray-600\"> <span class=\"font-medium\">Statut :</span> <span", "> ", ' </span> </p> <p class="text-gray-600 mt-2"> <span class="font-medium">Cr\xE9\xE9 le :</span> <span class="ml-2">', "</span> </p> ", ' </div> <div> <p class="text-gray-600"> <span class="font-medium">Slug :</span> <span class="ml-2 font-mono text-xs bg-gray-200 px-2 py-1 rounded"> ', ' </span> </p> <p class="text-gray-600 mt-2"> <span class="font-medium">Derni\xE8re modification :</span> <span class="ml-2">', "</span> </p> </div> </div> </div> </div> "])), maybeRenderHead(), post.status === "published" && renderTemplate`<a${addAttribute(`/blog/${post.slug}`, "href")} target="_blank" rel="noopener noreferrer" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-sage hover:bg-sage-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sage">
Voir l'article
</a>`, renderComponent($$result2, "PostEditor", PostEditor, { "client:load": true, "initialData": initialData, "postId": id, "userId": session.user.id, "onSave": async (postData) => {
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...postData,
          author_id: session.user.id
        })
      });
      if (!response.ok) throw new Error("Erreur lors de la sauvegarde");
      alert("Article sauvegard\xE9 en brouillon");
    } catch (error2) {
      console.error("Erreur:", error2);
      alert("Une erreur est survenue lors de la sauvegarde");
    }
  }, "onPublish": async (postData) => {
    console.log("onPublish appel\xE9 avec:", postData);
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...postData,
          author_id: session.user.id
        })
      });
      console.log("Response status:", response.status);
      const responseData = await response.json();
      console.log("Response data:", responseData);
      if (!response.ok) throw new Error("Erreur lors de la publication");
      alert("Article publi\xE9 avec succ\xE8s !");
      window.location.href = "/admin/blog";
    } catch (error2) {
      console.error("Erreur:", error2);
      alert("Une erreur est survenue lors de la publication");
    }
  }, "client:component-hydration": "load", "client:component-path": "/Users/jules/Downloads/harmonia/src/components/admin/PostEditor.jsx", "client:component-export": "default" }), defineScriptVars({ postId: id, userId: session.user.id }), addAttribute(`ml-2 px-2 py-1 rounded-full text-xs font-medium ${post.status === "published" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`, "class"), post.status === "published" ? "Publi\xE9" : "Brouillon", new Date(post.created_at).toLocaleDateString("fr-FR"), post.published_at && renderTemplate`<p class="text-gray-600 mt-2"> <span class="font-medium">Publié le :</span> <span class="ml-2">${new Date(post.published_at).toLocaleDateString("fr-FR")}</span> </p>`, post.slug, new Date(post.updated_at).toLocaleDateString("fr-FR")) })}`;
}, "/Users/jules/Downloads/harmonia/src/pages/admin/post/[id].astro", void 0);

const $$file = "/Users/jules/Downloads/harmonia/src/pages/admin/post/[id].astro";
const $$url = "/admin/post/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
