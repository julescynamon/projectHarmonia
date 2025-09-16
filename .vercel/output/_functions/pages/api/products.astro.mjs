import { a as getProducts } from '../../chunks/shop_BG2ZyLKw.mjs';
import { m as monitoring } from '../../chunks/monitoring_CEn0FETp.mjs';
export { renderers } from '../../renderers.mjs';

const productsHandler = async ({ request, locals }) => {
  const transaction = monitoring.startTransaction("get_products", "http.server", {
    userId: locals?.user?.id,
    action: "get_products",
    metadata: {
      endpoint: "/api/products",
      url: request.url
    }
  });
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const paramsSpan = monitoring.addSpan("parse_parameters", "http.server", {
      category: searchParams.get("category"),
      search: searchParams.get("q"),
      sort: searchParams.get("sort"),
      hasMinPrice: !!searchParams.get("minPrice"),
      hasMaxPrice: !!searchParams.get("maxPrice")
    });
    const products = await getProducts({
      category: searchParams.get("category") || void 0,
      search: searchParams.get("q") || void 0,
      sort: searchParams.get("sort") || "newest",
      minPrice: searchParams.get("minPrice") ? parseFloat(searchParams.get("minPrice")) : null,
      maxPrice: searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")) : null
    });
    if (paramsSpan) {
      paramsSpan.finish();
    }
    if (transaction) {
      transaction.setTag("products_count", products.length);
      transaction.setTag("has_filters", !!(searchParams.get("category") || searchParams.get("q") || searchParams.get("minPrice") || searchParams.get("maxPrice")));
      transaction.finish();
    }
    return new Response(JSON.stringify(products), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        // Ajouter des en-têtes de cache pour optimiser les performances
        "Cache-Control": "public, max-age=10"
        // Cache pendant 10 secondes
      }
    });
  } catch (error) {
    monitoring.captureError(error, {
      userId: locals?.user?.id,
      action: "get_products",
      metadata: {
        endpoint: "/api/products",
        url: request.url
      }
    });
    if (transaction) {
      transaction.setTag("status", "error");
      transaction.finish();
    }
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};
const GET = productsHandler;

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
