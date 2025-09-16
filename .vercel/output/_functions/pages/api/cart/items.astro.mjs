import { a as createServiceClient } from '../../../chunks/supabase_CXSvBnpz.mjs';
export { renderers } from '../../../renderers.mjs';

const GET = async ({ locals }) => {
  const session = locals.session;
  if (!session?.user) {
    return new Response(
      JSON.stringify({ error: "Non autorisé" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }
  try {
    const supabase = createServiceClient(session.access_token);
    const query = supabase.from("cart_items").select(`
        id,
        quantity,
        product_id,
        products (id, title, price, pdf_path)
      `).eq("user_id", session.user.id);
    const { data: cartItems, error } = await query.returns();
    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }
    if (!cartItems || cartItems.length === 0) {
      return new Response(
        JSON.stringify({ items: [] }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
    const items = cartItems.map((item) => {
      const productData = item.products;
      return {
        id: item.id,
        product_id: productData.id,
        title: productData.title,
        price: productData.price,
        quantity: item.quantity,
        image: productData.pdf_path,
        product: productData
      };
    });
    return new Response(
      JSON.stringify({ items }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Erreur lors de la récupération du panier:", error);
    return new Response(
      JSON.stringify({ error: "Erreur lors de la récupération du panier" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
