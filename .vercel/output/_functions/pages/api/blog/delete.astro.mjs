import '../../../chunks/supabase_CXSvBnpz.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request, locals }) => {
  try {
    console.log("=== Début de la requête POST /api/blog/delete ===");
    const { id } = await request.json();
    console.log("ID de l'article à supprimer:", id);
    const session = locals.session;
    if (!session?.user) {
      console.error("Session utilisateur non trouvée");
      return new Response(JSON.stringify({ error: "Session invalide" }), {
        status: 401
      });
    }
    const supabase2 = locals.supabase;
    const { error } = await supabase2.from("posts").delete().eq("id", id);
    if (error) {
      throw error;
    }
    return new Response(JSON.stringify({ success: true }), {
      status: 200
    });
  } catch (error) {
    console.error("Erreur lors de la suppression:", error);
    return new Response(JSON.stringify({ error: "Erreur serveur" }), {
      status: 500
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
