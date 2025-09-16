import { c as createClient } from '../../../chunks/index_DeVVxtlF.mjs';
export { renderers } from '../../../renderers.mjs';

const supabaseUrl = "https://hvthtebjvmutuvzvttdb.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
if (!supabaseKey) {
  throw new Error("Les variables d'environnement Supabase ne sont pas configurées.");
}
const supabase = createClient(supabaseUrl, supabaseKey);
const GET = async ({ url }) => {
  try {
    const token = url.searchParams.get("token");
    if (!token) {
      return new Response("Token manquant", { status: 400 });
    }
    const { data: subscriber, error: fetchError } = await supabase.from("newsletter_subscribers").select("*").eq("confirmation_token", token).single();
    if (fetchError || !subscriber) {
      return new Response("Token invalide", { status: 400 });
    }
    if (new Date(subscriber.token_expires_at) < /* @__PURE__ */ new Date()) {
      return new Response("Le lien de confirmation a expiré", { status: 400 });
    }
    const { error: updateError } = await supabase.from("newsletter_subscribers").update({
      confirmed: true,
      confirmed_at: (/* @__PURE__ */ new Date()).toISOString(),
      confirmation_token: null,
      token_expires_at: null
    }).eq("id", subscriber.id);
    if (updateError) throw updateError;
    return new Response(null, {
      status: 302,
      headers: {
        "Location": "/newsletter/confirmation-success"
      }
    });
  } catch (error) {
    console.error("Newsletter confirmation error:", error);
    return new Response("Une erreur est survenue", { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
