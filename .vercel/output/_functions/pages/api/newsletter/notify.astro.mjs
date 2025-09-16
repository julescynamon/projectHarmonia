import { c as createClient } from '../../../chunks/index_DeVVxtlF.mjs';
import { e as sendNewArticleNotification } from '../../../chunks/email-service_goO0ss9z.mjs';
export { renderers } from '../../../renderers.mjs';

const supabaseUrl = "https://hvthtebjvmutuvzvttdb.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
if (!supabaseKey) {
  throw new Error("Configuration Supabase incomplète");
}
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
const POST = async ({ request }) => {
  try {
    const authHeader = request.headers.get("x-api-key");
    if (authHeader !== process.env.API_SECRET_KEY) {
      return new Response(JSON.stringify({
        success: false,
        message: "Non autorisé"
      }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    const article = await request.json();
    if (!article.title || !article.slug) {
      return new Response(JSON.stringify({
        success: false,
        message: "Informations de l'article manquantes"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { data: subscribers, error: queryError } = await supabase.from("newsletter_subscribers").select("email").eq("confirmed", true).eq("unsubscribed", false);
    if (queryError) {
      console.error("Erreur lors de la récupération des abonnés:", queryError);
      throw new Error("Erreur lors de la récupération des abonnés");
    }
    if (!subscribers || subscribers.length === 0) {
      return new Response(JSON.stringify({
        success: true,
        message: "Aucun abonné à notifier"
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    const result = await sendNewArticleNotification(subscribers, article);
    return new Response(JSON.stringify({
      success: true,
      message: `Notifications envoyées à ${result.data.sent} abonnés`,
      data: result.data
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi des notifications:", error);
    return new Response(JSON.stringify({
      success: false,
      message: "Erreur lors de l'envoi des notifications"
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
