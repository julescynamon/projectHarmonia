import { c as createClient } from '../../../chunks/index_DeVVxtlF.mjs';
import '../../../chunks/supabase-client_DdgYuUwa.mjs';
import { s as supabase } from '../../../chunks/supabase_CXSvBnpz.mjs';
export { renderers } from '../../../renderers.mjs';

const PUT = async ({ request, params, locals }) => {
  console.log("PUT /api/posts/[id] appelé");
  try {
    const session = locals.session;
    console.log("Session:", { hasSession: !!session, userId: session?.user?.id });
    if (!session?.user?.id) {
      console.log("Non authentifié");
      return new Response(JSON.stringify({
        success: false,
        error: "Non authentifié"
      }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { id } = params;
    console.log("ID de l'article:", id);
    if (!id) {
      console.log("ID de l'article manquant");
      return new Response(JSON.stringify({
        success: false,
        error: "ID de l'article requis"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const postData = await request.json();
    console.log("Données reçues:", {
      title: postData.title,
      status: postData.status,
      hasContent: !!postData.content
    });
    if (!postData.title || !postData.content) {
      console.log("Données invalides:", { hasTitle: !!postData.title, hasContent: !!postData.content });
      return new Response(JSON.stringify({
        success: false,
        error: "Titre et contenu requis"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    console.log("Vérification de l'appartenance de l'article...");
    const { data: existingPost, error: fetchError } = await supabase.from("posts").select("author_id").eq("id", id).single();
    if (fetchError || !existingPost) {
      console.log("Article non trouvé:", { error: fetchError, existingPost });
      return new Response(JSON.stringify({
        success: false,
        error: "Article non trouvé"
      }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    console.log("Article trouvé, author_id:", existingPost.author_id, "session.user.id:", session.user.id);
    if (existingPost.author_id !== session.user.id) {
      console.log("Non autorisé: l'article n'appartient pas à l'utilisateur");
      return new Response(JSON.stringify({
        success: false,
        error: "Non autorisé"
      }), {
        status: 403,
        headers: { "Content-Type": "application/json" }
      });
    }
    console.log("Mise à jour de l'article...");
    const supabaseUrl = "https://hvthtebjvmutuvzvttdb.supabase.co";
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Configuration Supabase manquante");
      return new Response(JSON.stringify({
        success: false,
        error: "Configuration Supabase manquante"
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    const { data: updatedPost, error: updateError } = await supabaseAdmin.from("posts").update({
      ...postData,
      author_id: session.user.id,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", id).select().single();
    if (updateError) {
      console.error("Erreur lors de la mise à jour:", updateError);
      return new Response(JSON.stringify({
        success: false,
        error: updateError.message
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    console.log("Article mis à jour avec succès:", updatedPost);
    return new Response(JSON.stringify({
      success: true,
      data: updatedPost
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'article:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Erreur interne du serveur: " + (error instanceof Error ? error.message : "Erreur inconnue")
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const DELETE = async ({ params, locals }) => {
  try {
    console.log("DELETE endpoint appelé avec params:", params);
    const session = locals.session;
    console.log("Session utilisateur:", {
      hasSession: !!session,
      userId: session?.user?.id,
      email: session?.user?.email
    });
    if (!session?.user?.id) {
      return new Response(JSON.stringify({
        success: false,
        error: "Non authentifié"
      }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { id } = params;
    console.log("ID de l'article à supprimer:", id);
    if (!id) {
      return new Response(JSON.stringify({
        success: false,
        error: "ID de l'article requis"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const supabaseUrl = "https://hvthtebjvmutuvzvttdb.supabase.co";
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(JSON.stringify({
        success: false,
        error: "Configuration Supabase manquante"
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    console.log("Recherche de l'article dans la base de données...");
    const { data: existingPost, error: fetchError } = await supabaseAdmin.from("posts").select("author_id").eq("id", id).single();
    if (fetchError || !existingPost) {
      console.log("Article non trouvé ou erreur:", fetchError);
      return new Response(JSON.stringify({
        success: false,
        error: "Article non trouvé"
      }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    console.log("Article trouvé, author_id:", existingPost.author_id, "session.user.id:", session.user.id);
    if (existingPost.author_id && existingPost.author_id !== session.user.id) {
      console.log("Non autorisé: l'article n'appartient pas à l'utilisateur");
      return new Response(JSON.stringify({
        success: false,
        error: "Non autorisé"
      }), {
        status: 403,
        headers: { "Content-Type": "application/json" }
      });
    }
    console.log("Suppression de l'article avec le client admin...");
    const { error: deleteError } = await supabaseAdmin.from("posts").delete().eq("id", id);
    if (deleteError) {
      console.error("Erreur lors de la suppression:", deleteError);
      return new Response(JSON.stringify({
        success: false,
        error: "Erreur lors de la suppression: " + deleteError.message
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    console.log("Article supprimé avec succès");
    return new Response(JSON.stringify({
      success: true,
      message: "Article supprimé avec succès"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'article:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Erreur interne du serveur"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE,
  PUT
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
