import { c as createClient } from '../../../chunks/index_DeVVxtlF.mjs';
import 'marked';
export { renderers } from '../../../renderers.mjs';

const supabaseUrl = "https://hvthtebjvmutuvzvttdb.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
if (!supabaseServiceKey) {
  throw new Error("SUPABASE_SERVICE_KEY est requis pour la création de profils admin");
}
const createAdminClient = () => {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false
    }
  });
};
const POST = async ({ request, locals }) => {
  try {
    const session = locals.session;
    if (!session?.user) {
      return new Response(
        JSON.stringify({ error: "Authentification requise" }),
        { status: 401 }
      );
    }
    const user = session.user;
    const adminClient = createAdminClient();
    const { data: profile, error: profileError } = await adminClient.from("profiles").select("*").eq("id", user.id).single();
    if (profileError && profileError.code !== "PGRST116") {
      console.error("Erreur lors de la récupération du profil:", profileError);
      return new Response(
        JSON.stringify({ error: "Erreur lors de la vérification du profil" }),
        { status: 500 }
      );
    }
    if (!profile) {
      const { data: newProfile, error: createError } = await adminClient.from("profiles").insert({
        id: user.id,
        email: user.email,
        role: "admin",
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      }).select().single();
      if (createError) {
        console.error("Erreur lors de la création du profil admin:", createError);
        return new Response(
          JSON.stringify({ error: "Erreur lors de la création du profil" }),
          { status: 500 }
        );
      }
    } else if (profile.role !== "admin") {
      return new Response(
        JSON.stringify({ error: "Accès refusé: droits administrateur requis" }),
        { status: 403 }
      );
    }
    const body = await request.json();
    const { title, content, excerpt, category, image, published = false } = body;
    if (!title || !content) {
      return new Response(
        JSON.stringify({ error: "Titre et contenu requis" }),
        { status: 400 }
      );
    }
    const baseSlug = title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
    let slug = baseSlug;
    let counter = 1;
    while (true) {
      const { data: existingPost } = await adminClient.from("posts").select("id").eq("slug", slug).single();
      if (!existingPost) break;
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    const insertData = {
      title,
      content,
      excerpt: excerpt || null,
      category: category || "Général",
      image: image || null,
      published,
      slug,
      author_id: user.id,
      created_at: (/* @__PURE__ */ new Date()).toISOString(),
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    const { data, error } = await adminClient.from("blog_posts").insert(insertData).select().single();
    if (error) {
      console.error("Erreur lors de la création de l'article:", error);
      return new Response(
        JSON.stringify({ error: "Erreur lors de la création de l'article" }),
        { status: 500 }
      );
    }
    return new Response(
      JSON.stringify({
        success: true,
        article: data
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur dans l'API de création d'article:", error);
    return new Response(
      JSON.stringify({ error: "Erreur interne du serveur" }),
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
