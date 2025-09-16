import { a as createServiceClient } from '../../../chunks/supabase_CXSvBnpz.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request, locals }) => {
  const session = locals.session;
  if (!session?.user?.id) {
    return new Response(
      JSON.stringify({ message: "Authentification requise" }),
      { status: 401 }
    );
  }
  const supabase = createServiceClient(session.access_token);
  try {
    const { productId } = await request.json();
    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!productId || !UUID_REGEX.test(productId)) {
      return new Response(
        JSON.stringify({ message: "ID du produit invalide" }),
        { status: 400 }
      );
    }
    const { data: product, error: productError } = await supabase.from("products").select("pdf_path").eq("id", productId).single();
    if (productError) throw productError;
    const { data: existingItem, error: selectError } = await supabase.from("cart_items").select().eq("user_id", session.user.id).eq("product_id", productId).single();
    if (selectError && selectError.code !== "PGRST116") {
      throw selectError;
    }
    if (product?.pdf_path && existingItem) {
      return new Response(
        JSON.stringify({ message: "Ce PDF est déjà dans votre panier" }),
        { status: 400 }
      );
    }
    if (!product?.pdf_path && existingItem) {
      const { error: updateError } = await supabase.from("cart_items").update({ quantity: existingItem.quantity + 1 }).eq("id", existingItem.id);
      if (updateError) throw updateError;
    } else {
      const { data: testData, error: testError } = await supabase.from("cart_items").select("id").limit(1);
      const { data: insertData, error: insertError } = await supabase.from("cart_items").insert({
        user_id: session.user.id,
        product_id: productId,
        quantity: 1
      }).select();
      if (insertError) {
        console.error("Détails de l'erreur d'insertion:", {
          code: insertError.code,
          message: insertError.message,
          details: insertError.details,
          hint: insertError.hint
        });
        throw insertError;
      }
    }
    return new Response(
      JSON.stringify({ message: "Produit ajouté au panier" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de l'ajout au panier:", error);
    return new Response(
      JSON.stringify({ message: "Erreur lors de l'ajout au panier" }),
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
