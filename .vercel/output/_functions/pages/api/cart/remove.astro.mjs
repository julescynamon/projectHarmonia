import { c as createClient } from '../../../chunks/index_DeVVxtlF.mjs';
export { renderers } from '../../../renderers.mjs';

const supabaseUrl = "https://hvthtebjvmutuvzvttdb.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2dGh0ZWJqdm11dHV2enZ0dGRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY2OTM5NTgsImV4cCI6MjA1MjI2OTk1OH0.gpI9njtvd6Mu_0wTnwfvtx0bFpUDNexuzwu3hgOGDdY";
const POST = async ({ request, locals }) => {
  const session = locals.session;
  if (!session) {
    return new Response(
      JSON.stringify({ message: "Authentification requise" }),
      { status: 401 }
    );
  }
  try {
    const { itemId } = await request.json();
    if (!itemId) {
      return new Response(
        JSON.stringify({ message: "ID de l'article manquant" }),
        { status: 400 }
      );
    }
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
    const { data: cartItem } = await supabase.from("cart_items").select().eq("id", itemId).eq("user_id", session.user.id).single();
    if (!cartItem) {
      return new Response(
        JSON.stringify({ message: "Article non trouvé" }),
        { status: 404 }
      );
    }
    const { error } = await supabase.from("cart_items").delete().eq("id", itemId).eq("user_id", session.user.id);
    if (error) throw error;
    return new Response(
      JSON.stringify({ message: "Article supprimé du panier" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la suppression de l'article:", error);
    return new Response(
      JSON.stringify({ message: "Erreur lors de la suppression de l'article" }),
      { status: 500 }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
