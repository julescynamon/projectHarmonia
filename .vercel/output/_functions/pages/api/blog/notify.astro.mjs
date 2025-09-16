import { Resend } from 'resend';
import { s as supabase } from '../../../chunks/supabase_CXSvBnpz.mjs';
import { g as getNewArticleEmailTemplate } from '../../../chunks/new-article-template_CLeG0NyS.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request }) => {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    if (!process.env.RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Configuration Resend manquante" }),
        { status: 500 }
      );
    }
    const body = await request.json();
    const { slug } = body;
    if (!slug) {
      return new Response(
        JSON.stringify({ error: "Slug de l'article requis" }),
        { status: 400 }
      );
    }
    const { data: article, error: articleError } = await supabase.from("posts").select("*").eq("slug", slug).single();
    if (articleError || !article) {
      return new Response(
        JSON.stringify({ error: "Article non trouvé" }),
        { status: 404 }
      );
    }
    if (!article.published) {
      return new Response(
        JSON.stringify({ error: "Article non publié" }),
        { status: 400 }
      );
    }
    if (article.notification_sent) {
      return new Response(
        JSON.stringify({ error: "Notifications déjà envoyées pour cet article" }),
        { status: 400 }
      );
    }
    const { data: subscribers, error: subscribersError } = await supabase.from("newsletter_subscribers").select("email").eq("confirmed", true).eq("unsubscribed", false);
    if (subscribersError) {
      console.error("Erreur lors de la récupération des abonnés:", subscribersError);
      return new Response(
        JSON.stringify({ error: "Erreur lors de la récupération des abonnés" }),
        { status: 500 }
      );
    }
    if (!subscribers || subscribers.length === 0) {
      return new Response(
        JSON.stringify({ message: "Aucun abonné à notifier" }),
        { status: 200 }
      );
    }
    const articleUrl = `${process.env.WEBSITE_URL}/blog/${slug}`;
    const fromEmail = process.env.FROM_EMAIL || "notifications@la-maison-sattvaia.com";
    const websiteName = process.env.WEBSITE_NAME || "La Maison Sattvaïa";
    const emailPromises = subscribers.map(async (subscriber) => {
      const html = await getNewArticleEmailTemplate({
        article: {
          title: article.title,
          description: article.excerpt || "",
          url: articleUrl,
          category: article.category || "Général"
        },
        websiteUrl: process.env.WEBSITE_URL || "https://la-maison-sattvaia.com",
        unsubscribeUrl: `${process.env.WEBSITE_URL}/api/newsletter/unsubscribe?email=${encodeURIComponent(subscriber.email)}`
      });
      return resend.emails.send({
        from: fromEmail,
        to: [subscriber.email],
        subject: `Nouvel article : ${article.title}`,
        html
      });
    });
    const results = await Promise.allSettled(emailPromises);
    const successCount = results.filter(
      (result) => result.status === "fulfilled" && !result.value.error
    ).length;
    const errorCount = results.length - successCount;
    const { error: updateError } = await supabase.from("posts").update({ notification_sent: true }).eq("slug", slug);
    if (updateError) {
      console.error("Erreur lors de la mise à jour du statut de notification:", updateError);
    }
    return new Response(
      JSON.stringify({
        success: true,
        message: `Notifications envoyées: ${successCount}/${subscribers.length} succès`,
        data: {
          notifiedCount: successCount,
          errorCount,
          totalSubscribers: subscribers.length
        }
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de l'envoi des notifications:", error);
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
