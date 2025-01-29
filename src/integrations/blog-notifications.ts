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
  };
}

let lastNotifiedPosts = new Set<string>();

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
                batch.map((subscriber: { email: string }) =>
                  resend.emails.send({
                    from: fromEmail,
                    to: subscriber.email,
                    subject: `Nouvel article sur ${websiteName} : ${post.data.title}`,
                    html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                      <h1>Nouveau sur ${websiteName}</h1>
                      ${
                        post.data.image
                          ? `
                        <img src="${websiteUrl}${post.data.image}" 
                             alt="Image de couverture pour ${post.data.title}"
                             style="max-width: 100%; height: auto; margin: 20px 0;"
                        />
                      `
                          : ""
                      }
                      <h2>${post.data.title}</h2>
                      <p>${post.data.description}</p>
                      <p>
                        <a href="${websiteUrl}/blog/${post.slug}" 
                           style="display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px;">
                          Lire l'article
                        </a>
                      </p>
                      <p style="margin-top: 20px; font-size: 0.8em; color: #666;">
                        <a href="${websiteUrl}/api/newsletter/unsubscribe?email=${encodeURIComponent(
                      subscriber.email
                    )}" 
                           style="color: #666;">
                          Se désinscrire
                        </a>
                      </p>
                    </div>
                  `,
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
