import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const resend = new Resend(import.meta.env.RESEND_API_KEY);
const fromEmail = 'onboarding@resend.dev';
const websiteUrl = 'http://localhost:4321';

export const POST: APIRoute = async ({ request }) => {
  try {
    console.log('Début de la requête de notification');
    console.log('Clé API Resend:', import.meta.env.RESEND_API_KEY ? 'Présente' : 'Manquante');
    
    const { slug } = await request.json();
    console.log('Slug reçu:', slug);

    if (!slug) {
      console.log('Erreur: Slug manquant');
      return new Response(JSON.stringify({ error: 'Slug manquant dans la requête' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Lire directement le fichier pour avoir les données les plus récentes
    const filePath = path.join(process.cwd(), 'src', 'content', 'blog', `${slug}.md`);
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const { data: frontmatter } = matter(fileContent);

    console.log('Article trouvé:', {
      title: frontmatter.title,
      status: frontmatter.status,
      notificationSent: frontmatter.notificationSent
    });

    // Vérifier si l'article est publié
    if (frontmatter.status !== 'published') {
      console.log('Erreur: Article non publié');
      return new Response(JSON.stringify({ error: 'Article non publié' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Vérifier si l'article a déjà été notifié
    if (frontmatter.notificationSent) {
      console.log('Erreur: Article déjà notifié');
      return new Response(JSON.stringify({ error: 'Notification déjà envoyée pour cet article' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // En développement, envoyer uniquement à l'email de test
    const testEmail = 'tyzranaima@gmail.com';

    try {
      console.log('Configuration de l\'email:', {
        from: fromEmail,
        to: testEmail,
        subject: `Nouvel article : ${frontmatter.title}`
      });

      const result = await resend.emails.send({
        from: fromEmail,
        to: testEmail,
        subject: `Nouvel article : ${frontmatter.title}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; background-color: #f9fafb;">
              <div style="font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; margin-top: 20px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
                <!-- En-tête avec logo -->
                <div style="text-align: center; padding: 20px; background-color: #f8f9fa; border-bottom: 1px solid #e5e7eb;">
                  <img src="${websiteUrl}/images/logo.svg" 
                       alt="Harmonia"
                       style="height: 40px; margin: 0 auto;"
                  />
                </div>

                <!-- Image de couverture -->
                ${frontmatter.image
                  ? `
                  <div style="position: relative;">
                    <img src="${websiteUrl}${frontmatter.image}" 
                         alt="Image de couverture pour ${frontmatter.title}"
                         style="width: 100%; height: auto; object-fit: cover;"
                    />
                    <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 100%);"></div>
                  </div>
                  `
                  : ''
                }

                <!-- Contenu -->
                <div style="padding: 32px;">
                  <h1 style="margin: 0 0 16px 0; color: #111827; font-size: 24px; font-weight: 600;">
                    ${frontmatter.title}
                  </h1>
                  
                  <p style="margin: 0 0 24px 0; color: #4b5563; font-size: 16px; line-height: 1.625;">
                    ${frontmatter.description}
                  </p>

                  <div style="text-align: center; margin-top: 32px;">
                    <a href="${websiteUrl}/blog/${slug}" 
                       style="display: inline-block; padding: 12px 24px; background-color: #65815E; color: white; text-decoration: none; border-radius: 6px; font-weight: 500; transition: background-color 0.2s ease-in-out;"
                    >
                      Lire l'article
                    </a>
                  </div>
                </div>

                <!-- Pied de page -->
                <div style="padding: 24px; background-color: #f8f9fa; border-top: 1px solid #e5e7eb; text-align: center;">
                  <p style="margin: 0 0 16px 0; color: #6b7280; font-size: 14px;">
                    Vous recevez cet email car vous êtes abonné(e) à la newsletter d'Harmonia.
                  </p>
                  <a href="${websiteUrl}/api/newsletter/unsubscribe?email=${encodeURIComponent(testEmail)}" 
                     style="color: #6b7280; text-decoration: underline; font-size: 14px;"
                  >
                    Se désinscrire
                  </a>
                </div>
              </div>
            </body>
          </html>
        `,
      });

      console.log('Résultat de l\'envoi:', result);

      // Si l'email est envoyé avec succès, marquer l'article comme notifié
      console.log('Mise à jour du statut de notification...');
      const updatedFileContent = matter.stringify(matter(fileContent).content, {
        ...frontmatter,
        notificationSent: true
      });
      await fs.writeFile(filePath, updatedFileContent);
      console.log('Statut de notification mis à jour');

      return new Response(JSON.stringify({ 
        success: true,
        message: 'Notification envoyée avec succès',
        emailResult: result
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });

    } catch (error) {
      console.error('Erreur détaillée lors de l\'envoi de l\'email:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        error
      });
      
      return new Response(JSON.stringify({ 
        error: 'Erreur lors de l\'envoi de l\'email',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

  } catch (error) {
    console.error('Erreur générale:', error);
    return new Response(JSON.stringify({ error: 'Erreur lors du traitement de la requête' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
