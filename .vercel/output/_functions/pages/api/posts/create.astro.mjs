import { c as createClient } from '../../../chunks/index_DeVVxtlF.mjs';
import '../../../chunks/supabase-client_DdgYuUwa.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request, locals }) => {
  console.log("POST /api/posts/create appelé");
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
    console.log("Création de l'article...");
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
    const generateSlug = (title) => {
      return title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim().replace(/^-|-$/g, "");
    };
    const baseSlug = generateSlug(postData.title);
    console.log("Slug de base généré:", baseSlug);
    let finalSlug = baseSlug;
    let counter = 1;
    while (true) {
      const { data: existingPost } = await supabaseAdmin.from("posts").select("id").eq("slug", finalSlug).single();
      if (!existingPost) {
        break;
      }
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }
    console.log("Slug final:", finalSlug);
    const { data: newPost, error: createError } = await supabaseAdmin.from("posts").insert({
      ...postData,
      slug: finalSlug,
      author_id: session.user.id
    }).select().single();
    if (createError) {
      console.error("Erreur lors de la création:", createError);
      return new Response(JSON.stringify({
        success: false,
        error: createError.message
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    console.log("Article créé avec succès:", newPost);
    const response = { success: true, data: newPost };
    if (response.success) {
      return new Response(JSON.stringify(response), {
        status: 201,
        headers: { "Content-Type": "application/json" }
      });
    } else {
      return new Response(JSON.stringify(response), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
  } catch (error) {
    console.error("Erreur lors de la création de l'article:", error);
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
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
