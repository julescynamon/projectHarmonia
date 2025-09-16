/* empty css                                       */
import { e as createAstro, c as createComponent, r as renderComponent, a as renderTemplate, f as defineScriptVars, m as maybeRenderHead } from '../../chunks/astro/server_BsvY2apF.mjs';
import 'kleur/colors';
import { $ as $$AdminLayout, P as PostEditor } from '../../chunks/PostEditor_BY4zybDc.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { s as supabase } from '../../chunks/supabase-client_DdgYuUwa.mjs';
export { renderers } from '../../renderers.mjs';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
    search: "",
    page: 1,
    limit: 10
  });
  const handleEditPost = (post) => {
    console.log("handleEditPost appelé pour:", post);
    window.location.href = `/admin/post/${post.id}`;
  };
  const handleDeletePost = async (postId) => {
    console.log("handleDeletePost appelé pour:", postId);
    try {
      console.log("Envoi de la requête DELETE vers:", `/api/posts/${postId}`);
      const response = await fetch(`/api/posts/${postId}`, {
        method: "DELETE"
      });
      console.log("Réponse reçue:", response.status, response.statusText);
      if (!response.ok) throw new Error("Erreur lors de la suppression");
      alert("Article supprimé avec succès");
      await loadPosts();
    } catch (error2) {
      console.error("Erreur:", error2);
      alert("Une erreur est survenue lors de la suppression");
    }
  };
  const handlePublishPost = async (postId) => {
    console.log("handlePublishPost appelé pour:", postId);
    try {
      const response = await fetch(`/api/posts/${postId}/publish`, {
        method: "POST"
      });
      if (!response.ok) throw new Error("Erreur lors de la publication");
      alert("Article publié avec succès");
      window.location.reload();
    } catch (error2) {
      console.error("Erreur:", error2);
      alert("Une erreur est survenue lors de la publication");
    }
  };
  const handleUnpublishPost = async (postId) => {
    console.log("handleUnpublishPost appelé pour:", postId);
    try {
      const response = await fetch(`/api/posts/${postId}/unpublish`, {
        method: "POST"
      });
      if (!response.ok) throw new Error("Erreur lors de la mise en brouillon");
      alert("Article mis en brouillon");
      window.location.reload();
    } catch (error2) {
      console.error("Erreur:", error2);
      alert("Une erreur est survenue lors de la mise en brouillon");
    }
  };
  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Chargement des articles depuis Supabase...");
      const timestamp = Date.now();
      const { data: posts2, error: error2 } = await supabase.from("posts").select("*").order("created_at", { ascending: false });
      if (error2) {
        console.error("Erreur lors du chargement:", error2);
        setError("Erreur lors du chargement des articles: " + error2.message);
      } else {
        console.log("Articles récupérés:", posts2?.length || 0, "articles");
        console.log("IDs des articles:", posts2?.map((p) => p.id) || []);
        setPosts(posts2 || []);
      }
    } catch (err) {
      setError("Erreur lors du chargement des articles: " + err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadPosts();
  }, [filters]);
  const formatDate = (dateString) => {
    if (!dateString) return "Non publié";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };
  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { label: "Brouillon", class: "bg-gray-100 text-gray-800" },
      published: { label: "Publié", class: "bg-green-100 text-green-800" }
    };
    const config = statusConfig[status] || statusConfig.draft;
    return /* @__PURE__ */ jsx(
      "span",
      {
        className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.class}`,
        children: config.label
      }
    );
  };
  if (loading) {
    return /* @__PURE__ */ jsxs("div", { className: "flex justify-center items-center py-8", children: [
      /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-sage" }),
      /* @__PURE__ */ jsx("span", { className: "ml-2 text-gray-600", children: "Chargement des articles..." })
    ] });
  }
  if (error) {
    return /* @__PURE__ */ jsx("div", { className: "bg-red-50 border border-red-200 rounded-md p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex", children: [
      /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx(
        "svg",
        {
          className: "h-5 w-5 text-red-400",
          viewBox: "0 0 20 20",
          fill: "currentColor",
          children: /* @__PURE__ */ jsx(
            "path",
            {
              fillRule: "evenodd",
              d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z",
              clipRule: "evenodd"
            }
          )
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { className: "ml-3", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium text-red-800", children: "Erreur" }),
        /* @__PURE__ */ jsx("div", { className: "mt-2 text-sm text-red-700", children: error }),
        /* @__PURE__ */ jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsx(
          "button",
          {
            onClick: loadPosts,
            className: "bg-red-100 text-red-800 px-3 py-2 rounded-md text-sm font-medium hover:bg-red-200",
            children: "Réessayer"
          }
        ) })
      ] })
    ] }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg", children: [
    /* @__PURE__ */ jsx("div", { className: "p-6 border-b border-gray-200", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4", children: [
      /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          placeholder: "Rechercher dans les articles...",
          value: filters.search,
          onChange: (e) => setFilters((prev) => ({
            ...prev,
            search: e.target.value,
            page: 1
          })),
          className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage"
        }
      ) }),
      /* @__PURE__ */ jsx("div", { className: "sm:w-48", children: /* @__PURE__ */ jsxs(
        "select",
        {
          value: filters.status,
          onChange: (e) => setFilters((prev) => ({
            ...prev,
            status: e.target.value,
            page: 1
          })),
          className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage",
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Tous les statuts" }),
            /* @__PURE__ */ jsx("option", { value: "draft", children: "Brouillons" }),
            /* @__PURE__ */ jsx("option", { value: "published", children: "Publiés" })
          ]
        }
      ) })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: posts.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "p-8 text-center text-gray-500", children: [
      /* @__PURE__ */ jsx(
        "svg",
        {
          className: "mx-auto h-12 w-12 text-gray-400",
          fill: "none",
          viewBox: "0 0 24 24",
          stroke: "currentColor",
          children: /* @__PURE__ */ jsx(
            "path",
            {
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: 2,
              d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            }
          )
        }
      ),
      /* @__PURE__ */ jsx("h3", { className: "mt-2 text-sm font-medium text-gray-900", children: "Aucun article trouvé" }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-500", children: filters.search || filters.status ? "Essayez de modifier vos filtres." : "Commencez par créer votre premier article." })
    ] }) : /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-gray-300", children: [
      /* @__PURE__ */ jsx("thead", { className: "bg-gray-50", children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx(
          "th",
          {
            scope: "col",
            className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
            children: "Article"
          }
        ),
        /* @__PURE__ */ jsx(
          "th",
          {
            scope: "col",
            className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
            children: "Statut"
          }
        ),
        /* @__PURE__ */ jsx(
          "th",
          {
            scope: "col",
            className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
            children: "Date"
          }
        ),
        /* @__PURE__ */ jsx(
          "th",
          {
            scope: "col",
            className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
            children: "Actions"
          }
        )
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: posts.map((post) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50", children: [
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
          post.cover_url && /* @__PURE__ */ jsx(
            "img",
            {
              src: post.cover_url,
              alt: post.cover_alt || post.title,
              className: "h-12 w-12 rounded-lg object-cover mr-4"
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-900 truncate", children: post.title }),
            post.excerpt && /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 truncate", children: post.excerpt }),
            post.tags && post.tags.length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-1 mt-1", children: [
              post.tags.slice(0, 3).map((tag, index) => /* @__PURE__ */ jsx(
                "span",
                {
                  className: "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800",
                  children: tag
                },
                index
              )),
              post.tags.length > 3 && /* @__PURE__ */ jsxs("span", { className: "text-xs text-gray-500", children: [
                "+",
                post.tags.length - 3
              ] })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: getStatusBadge(post.status) }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { children: [
            "Côté: ",
            formatDate(post.created_at)
          ] }),
          post.published_at && /* @__PURE__ */ jsxs("div", { children: [
            "Publié: ",
            formatDate(post.published_at)
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => handleEditPost(post),
              className: "text-sage hover:text-sage-600",
              title: "Modifier",
              children: "✏️"
            }
          ),
          post.status === "draft" ? /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => handlePublishPost(post.id),
              className: "text-green-600 hover:text-green-800",
              title: "Publier",
              children: "📤"
            }
          ) : /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => handleUnpublishPost(post.id),
              className: "text-yellow-600 hover:text-yellow-800",
              title: "Mettre en brouillon",
              children: "📥"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => handleDeletePost(post.id),
              className: "text-red-600 hover:text-red-800",
              title: "Supprimer",
              children: "🗑️"
            }
          )
        ] }) })
      ] }, post.id)) })
    ] }) })
  ] });
};

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://harmonia.jules.com");
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const supabase = Astro2.locals.supabase;
  const session = Astro2.locals.session;
  if (!session?.user?.id) {
    console.error("[ADMIN_BLOG] Pas de session, redirection vers /login");
    return Astro2.redirect("/login?returnTo=/admin/blog");
  }
  const isMainAdmin = session.user.email === "tyzranaima@gmail.com";
  if (isMainAdmin) {
    console.log("[ADMIN_BLOG] Acc\xE8s admin principal autoris\xE9 pour:", session.user.email);
  } else {
    const { data: profile, error: profileError } = await supabase.from("profiles").select("role").eq("id", session.user.id).maybeSingle();
    const isAdmin = !profileError && profile && profile.role === "admin";
    if (!isAdmin) {
      console.error("[ADMIN_BLOG] Utilisateur non admin, redirection vers /mon-compte");
      return Astro2.redirect("/mon-compte");
    }
  }
  const { data: posts } = await supabase.from("posts").select("*").eq("author_id", session.user.id).order("created_at", { ascending: false });
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Gestion des articles" }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([" ", `<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"> <div class="mb-8"> <h1 class="text-3xl font-bold text-gray-900">Gestion des articles</h1> <p class="mt-2 text-sm text-gray-700">Cr\xE9ez, modifiez et supprimez les articles du blog avec l'\xE9diteur TipTap.</p> </div> <!-- \xC9diteur d'article --> <div class="space-y-6 bg-white shadow-sm ring-1 ring-gray-900/5 p-6 rounded-lg mb-8"> <h2 class="text-xl font-semibold text-gray-900 mb-4">Cr\xE9er un nouvel article</h2> <script>(function(){`, "\n        window.currentUserId = userId;\n      })();<\/script> ", ' </div> <!-- Liste des articles --> <div class="space-y-6"> <h2 class="text-xl font-semibold text-gray-900">Vos articles</h2> ', " </div> </div> "])), maybeRenderHead(), defineScriptVars({ userId: session.user.id }), renderComponent($$result2, "PostEditor", PostEditor, { "client:load": true, "onSave": async (postData) => {
    try {
      const userId = session.user.id;
      const response = await fetch("/api/posts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...postData,
          author_id: userId
        })
      });
      if (!response.ok) throw new Error("Erreur lors de la sauvegarde");
      alert("Article sauvegard\xE9 en brouillon");
      window.location.reload();
    } catch (error) {
      console.error("Erreur:", error);
      alert("Une erreur est survenue lors de la sauvegarde");
    }
  }, "onPublish": async (postData) => {
    try {
      const userId = session.user.id;
      const response = await fetch("/api/posts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...postData,
          author_id: userId
        })
      });
      if (!response.ok) throw new Error("Erreur lors de la publication");
      alert("Article publi\xE9 avec succ\xE8s !");
      window.location.reload();
    } catch (error) {
      console.error("Erreur:", error);
      alert("Une erreur est survenue lors de la publication");
    }
  }, "client:component-hydration": "load", "client:component-path": "/Users/jules/Downloads/harmonia/src/components/admin/PostEditor.jsx", "client:component-export": "default" }), renderComponent($$result2, "PostList", PostList, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/jules/Downloads/harmonia/src/components/admin/PostList.jsx", "client:component-export": "default" })) })}`;
}, "/Users/jules/Downloads/harmonia/src/pages/admin/blog/index.astro", void 0);

const $$file = "/Users/jules/Downloads/harmonia/src/pages/admin/blog/index.astro";
const $$url = "/admin/blog";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
