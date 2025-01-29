import type { AstroIntegration } from "astro";
import { watch } from "fs";
import path from "path";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

// Charger les variables d'environnement
dotenv.config();

interface BlogPost {
  id: string;
  slug: string;
  data: {
    title: string;
    description: string;
    image?: string;
    status: "draft" | "published";
    category?: string;
  };
}

let lastNotifiedPosts = new Set<string>();

const colors = {
  sage: '#748C69',
  darkSage: '#65815E',
  lightGray: '#f8f9fa',
  borderGray: '#e5e7eb',
  textDark: '#111827',
  textMedium: '#4b5563',
  textLight: '#6b7280'
};

async function getNewArticleEmailTemplate({
  article,
  websiteUrl,
  unsubscribeUrl,
}: {
  article: {
    title: string;
    description: string;
    url: string;
    image?: string;
    category?: string;
  };
  websiteUrl: string;
  unsubscribeUrl: string;
}) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
      </head>
      <body style="margin: 0; padding: 0; background-color: ${colors.lightGray}; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="min-width: 100%; background-color: ${colors.lightGray};">
          <tr>
            <td align="center" style="padding: 20px 0;">
              <table width="600" border="0" cellspacing="0" cellpadding="0" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
                <!-- En-tête avec logo -->
                <tr>
                  <td align="center" style="padding: 32px 40px; background-color: ${colors.lightGray}; border-bottom: 1px solid ${colors.borderGray};">
                    <img src="https://via.placeholder.com/200x50/748C69/FFFFFF?text=Harmonia" 
                         alt="Harmonia"
                         style="height: 40px; width: auto;"
                    />
                  </td>
                </tr>

                <!-- Image de couverture -->
                <tr>
                  <td style="position: relative;">
                    <img src="${article.image || 'https://via.placeholder.com/600x300/748C69/FFFFFF?text=Image+Article'}" 
                         alt="Image de couverture"
                         width="600"
                         style="width: 100%; height: auto; display: block; border: 0;"
                    />
                  </td>
                </tr>

                <!-- Contenu -->
                <tr>
                  <td style="padding: 40px;">
                    <h1 style="margin: 0 0 16px 0; color: ${colors.textDark}; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 24px; line-height: 32px; font-weight: 600;">
                      ${article.title}
                    </h1>
                    
                    <p style="margin: 0 0 24px 0; color: ${colors.textMedium}; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 16px; line-height: 24px;">
                      ${article.description}
                    </p>

                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center">
                          <table border="0" cellspacing="0" cellpadding="0">
                            <tr>
                              <td align="center" style="border-radius: 6px; background-color: ${colors.sage};">
                                <a href="${article.url}" 
                                   style="display: inline-block; padding: 14px 32px; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 16px; color: white; text-decoration: none; border-radius: 6px; font-weight: 500; background-color: ${colors.sage};"
                                >
                                  Lire l'article
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Pied de page -->
                <tr>
                  <td style="padding: 32px 40px; background-color: ${colors.lightGray}; border-top: 1px solid ${colors.borderGray};">
                    <p style="margin: 0 0 16px 0; color: ${colors.textLight}; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; line-height: 20px; text-align: center;">
                      Vous recevez cet email car vous êtes abonné(e) à la newsletter d'Harmonia.
                    </p>
                    <p style="margin: 0; text-align: center;">
                      <a href="${unsubscribeUrl}" 
                         style="color: ${colors.textLight}; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; text-decoration: underline;"
                      >
                        Se désinscrire
                      </a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

export default function blogNotifications(): AstroIntegration {
  let resend: Resend;
  let supabase: ReturnType<typeof createClient>;

  return {
    name: "blog-notifications",
    hooks: {
      "astro:config:setup": ({ updateConfig }) => {
        // Initialiser Resend et Supabase une seule fois
        const resendApiKey = process.env.RESEND_API_KEY;
        if (!resendApiKey) {
          console.error("RESEND_API_KEY is not configured");
          return;
        }

        resend = new Resend(resendApiKey);

        const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

        if (!supabaseUrl || !supabaseKey) {
          console.error("Supabase configuration is missing");
          return;
        }

        supabase = createClient(supabaseUrl, supabaseKey);
      },

      "astro:server:setup": async ({ server }) => {
        if (!resend || !supabase) {
          console.error("Resend or Supabase not initialized");
          return;
        }

        const contentDir = path.join(process.cwd(), "src/content/blog");
        const fromEmail = process.env.FROM_EMAIL || "onboarding@resend.dev";
        const websiteUrl = process.env.WEBSITE_URL || "http://localhost:4321";
        const websiteName = process.env.WEBSITE_NAME || "Harmonia";

        async function handlePostUpdate(post: BlogPost) {
          if (
            post.data.status !== "published" ||
            lastNotifiedPosts.has(post.slug)
          ) {
            return;
          }

          try {
            // Récupérer les abonnés confirmés
            const { data: subscribers, error } = await supabase
              .from("newsletter_subscribers")
              .select("email")
              .eq("confirmed", true)
              .eq("unsubscribed", false);

            if (error) throw error;
            if (!subscribers?.length) return;

            console.log(
              `Sending notifications for new article: ${post.data.title}`
            );

            // En développement, n'envoyer qu'à l'email de test
            const isDev = process.env.NODE_ENV === "development";
            const testEmail = "tyzranaima@gmail.com";

            const emailsToNotify = isDev
              ? subscribers.filter((s) => s.email === testEmail)
              : subscribers;

            // Envoyer les notifications par lots
            const batchSize = 50;
            for (let i = 0; i < emailsToNotify.length; i += batchSize) {
              const batch = emailsToNotify.slice(i, i + batchSize);
              await Promise.all(
                batch.map(async (subscriber: { email: string }) =>
                  resend.emails.send({
                    from: fromEmail,
                    to: subscriber.email,
                    subject: `Nouvel article sur ${websiteName} : ${post.data.title}`,
                    html: await getNewArticleEmailTemplate({
                      article: {
                        title: post.data.title,
                        description: post.data.description,
                        url: `${websiteUrl}/blog/${post.slug}`,
                        image: post.data.image,
                        category: post.data.category
                      },
                      websiteUrl: websiteUrl,
                      unsubscribeUrl: `${websiteUrl}/api/newsletter/unsubscribe?email=${encodeURIComponent(subscriber.email)}`
                    })
                  })
                )
              );
            }

            lastNotifiedPosts.add(post.slug);
            console.log(`✓ Notifications sent for: ${post.data.title}`);
          } catch (error) {
            console.error(
              `Error sending notifications for ${post.data.title}:`,
              error
            );
          }
        }

        // Surveiller les changements dans le dossier des articles
        watch(contentDir, { recursive: true }, async (eventType, filename) => {
          if (!filename || !filename.endsWith(".md")) return;

          try {
            // Utiliser l'API Astro pour charger le contenu
            const response = await fetch(
              `${websiteUrl}/api/content/blog/${filename.replace(".md", "")}`
            );
            if (!response.ok) return;

            const post = await response.json();
            if (post) {
              await handlePostUpdate(post);
            }
          } catch (error) {
            console.error("Error processing blog post update:", error);
          }
        });

        // Vérifier les articles existants au démarrage
        try {
          const response = await fetch(`${websiteUrl}/api/content/blog`);
          if (response.ok) {
            const posts = await response.json();
            for (const post of posts) {
              await handlePostUpdate(post);
            }
          }
        } catch (error) {
          console.error("Error checking existing posts:", error);
        }
      },
    },
  };
}
