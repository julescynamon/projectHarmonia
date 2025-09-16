import { c as createClient } from '../../chunks/index_DeVVxtlF.mjs';
export { renderers } from '../../renderers.mjs';

const supabaseUrl = "https://hvthtebjvmutuvzvttdb.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2dGh0ZWJqdm11dHV2enZ0dGRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY2OTM5NTgsImV4cCI6MjA1MjI2OTk1OH0.gpI9njtvd6Mu_0wTnwfvtx0bFpUDNexuzwu3hgOGDdY";
const GET = async ({ locals }) => {
  const session = locals.session;
  if (!session) {
    return new Response(
      JSON.stringify({ message: "Authentification requise" }),
      { status: 401 }
    );
  }
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      },
      global: {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      }
    });
    const { data, error } = await supabase.from("cart_items").select(`
        id,
        quantity,
        products (
          id,
          title,
          price,
          pdf_path
        )
      `).eq("user_id", session.user.id).returns();
    if (error) throw error;
    const items = data.map((item) => ({
      id: item.id,
      product_id: item.products.id,
      title: item.products.title,
      price: item.products.price,
      quantity: item.quantity,
      image: item.products.pdf_path
    }));
    return new Response(
      JSON.stringify({ items }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
          "Expires": "0"
        }
      }
    );
  } catch (error) {
    console.error("Erreur lors de la récupération du panier:", error);
    return new Response(
      JSON.stringify({ message: "Erreur lors de la récupération du panier" }),
      { status: 500 }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
