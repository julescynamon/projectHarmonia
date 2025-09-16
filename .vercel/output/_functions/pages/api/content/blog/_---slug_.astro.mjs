import { g as getCollection, a as getEntry } from '../../../../chunks/_astro_content_C6mQ-x-S.mjs';
export { renderers } from '../../../../renderers.mjs';

const GET = async ({ params }) => {
  try {
    if (!params.slug) {
      const allPosts = await getCollection("blog");
      return new Response(JSON.stringify(allPosts), {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    const post = await getEntry("blog", params.slug);
    if (!post) {
      return new Response(JSON.stringify({ error: "Article non trouvé" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    return new Response(JSON.stringify(post), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Erreur serveur" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
