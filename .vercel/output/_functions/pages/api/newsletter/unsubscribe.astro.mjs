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
    const email = url.searchParams.get("email");
    const token = url.searchParams.get("token");
    if (!email || !token) {
      return new Response("Paramètres manquants", { status: 400 });
    }
    const { data: subscriber, error: fetchError } = await supabase.from("newsletter_subscribers").select("*").eq("email", email).single();
    if (fetchError || !subscriber) {
      return new Response("Abonné non trouvé", { status: 400 });
    }
    const isValidToken = verifyUnsubscribeToken(email, token);
    if (!isValidToken) {
      return new Response("Token invalide", { status: 400 });
    }
    const { error: updateError } = await supabase.from("newsletter_subscribers").update({
      unsubscribed: true,
      unsubscribed_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", subscriber.id);
    if (updateError) throw updateError;
    return new Response(null, {
      status: 302,
      headers: {
        "Location": "/newsletter/unsubscribe-success"
      }
    });
  } catch (error) {
    console.error("Newsletter unsubscribe error:", error);
    return new Response("Une erreur est survenue", { status: 500 });
  }
};
function verifyUnsubscribeToken(email, token) {
  const expectedToken = Buffer.from(email + process.env.API_SECRET_KEY).toString("base64");
  return token === expectedToken;
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
