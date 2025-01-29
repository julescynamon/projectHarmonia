import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(import.meta.env.RESEND_API_KEY);
const fromEmail = import.meta.env.FROM_EMAIL || 'onboarding@resend.dev';
const websiteUrl = import.meta.env.WEBSITE_URL || 'http://localhost:4321';
const websiteName = import.meta.env.WEBSITE_NAME || 'Harmonia';

// Configuration Supabase
const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL!,
  import.meta.env.SUPABASE_SERVICE_KEY!
);

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json().catch(() => ({}));
    const { slug } = body;

    if (!slug) {
      return new Response(JSON.stringify({ error: 'Slug manquant dans la requête' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Récupérer l'article
    let allPosts;
    try {
      allPosts = await getCollection('blog');
    } catch (error) {
      console.error('Erreur lors de la récupération des articles:', error);
      return new Response(JSON.stringify({ error: 'Erreur lors de la récupération des articles' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const post = allPosts.find(post => post.slug === slug);
    
    if (!post) {
      return new Response(JSON.stringify({ error: 'Article non trouvé' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Vérifier si l'article est publié
    if (post.data.status !== 'published') {
      return new Response(JSON.stringify({ error: 'Article non publié' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Récupérer les abonnés confirmés
    let subscribers;
    try {
      const { data: subscribersData, error: queryError } = await supabase
        .from('newsletter_subscribers')
        .select('email')
        .eq('confirmed', true)
        .eq('unsubscribed', false);

      if (queryError) throw queryError;
      subscribers = subscribersData;
    } catch (error) {
      console.error('Erreur lors de la récupération des abonnés:', error);
      return new Response(JSON.stringify({ error: 'Erreur lors de la récupération des abonnés' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!subscribers || subscribers.length === 0) {
      return new Response(JSON.stringify({ message: 'Aucun abonné à notifier' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // En développement, n'envoyer qu'à l'email de test
    const isDev = import.meta.env.DEV;
    const testEmail = 'tyzranaima@gmail.com';
    
    const emailsToNotify = isDev
      ? subscribers.filter(s => s.email === testEmail)
      : subscribers;

    // Construire l'URL complète de l'article
    const articleUrl = new URL(`/blog/${post.slug}`, websiteUrl).toString();
    const imageUrl = post.data.image ? new URL(post.data.image, websiteUrl).toString() : null;

    // Envoyer les notifications par lots
    const batchSize = 50;
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < emailsToNotify.length; i += batchSize) {
      const batch = emailsToNotify.slice(i, i + batchSize);
      
      const results = await Promise.allSettled(
        batch.map(({ email }) =>
          resend.emails.send({
            from: fromEmail,
            to: email,
            subject: `Nouvel article sur ${websiteName} : ${post.data.title}`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h1>Nouveau sur ${websiteName}</h1>
                ${imageUrl ? `
                  <img src="${imageUrl}" 
                       alt="Image de couverture pour ${post.data.title}"
                       style="max-width: 100%; height: auto; margin: 20px 0;"
                  />
                ` : ''}
                <h2>${post.data.title}</h2>
                <p>${post.data.description}</p>
                <p>
                  <a href="${articleUrl}" 
                     style="display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px;">
                    Lire l'article
                  </a>
                </p>
                <p style="margin-top: 20px; font-size: 0.8em; color: #666;">
                  <a href="${new URL(`/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}`, websiteUrl)}" 
                     style="color: #666;">
                    Se désinscrire
                  </a>
                </p>
              </div>
            `,
          }).catch(error => {
            console.error(`Erreur d'envoi à ${email}:`, error);
            throw error;
          })
        )
      );

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          successCount++;
          console.log(`✓ Email envoyé à ${batch[index].email}`);
        } else {
          errorCount++;
          console.error(`× Erreur d'envoi à ${batch[index].email}:`, result.reason);
        }
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Notifications envoyées avec succès. Succès: ${successCount}, Erreurs: ${errorCount}`
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Erreur lors de l\'envoi des notifications:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Erreur lors de l\'envoi des notifications',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
