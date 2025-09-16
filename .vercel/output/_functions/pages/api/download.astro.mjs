import { g as getDownloadUrl } from '../../chunks/shop_BG2ZyLKw.mjs';
import '../../chunks/supabase_CXSvBnpz.mjs';
export { renderers } from '../../renderers.mjs';

const GET = async ({ request, locals }) => {
  try {
    const { session } = locals;
    if (!session?.user) {
      return new Response(JSON.stringify({ error: "Non autorisé" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    const url = new URL(request.url);
    const productId = url.searchParams.get("productId");
    const orderId = url.searchParams.get("orderId");
    if (!productId || !orderId) {
      return new Response(JSON.stringify({ error: "Paramètres manquants" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const downloadUrl = await getDownloadUrl(productId, orderId, session.user.id);
    return new Response(JSON.stringify({ url: downloadUrl }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Erreur serveur" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
