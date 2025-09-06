import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { supabase } from '../../../lib/supabase';
import { getNewArticleEmailTemplate } from '../../../lib/emails/new-article-template';

export const POST: APIRoute = async ({ request }) => {
  try {
    const resend = new Resend(import.meta.env.RESEND_API_KEY);
    
    if (!import.meta.env.RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Configuration Resend manquante' }),
        { status: 500 }
      );
    }

    const body = await request.json();
    const { slug } = body;

    if (!slug) {
      return new Response(
        JSON.stringify({ error: 'Slug de l\'article requis' }),
        { status: 400 }
      );
    }

    // Récupérer l'article
    const { data: article, error: articleError } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .single();

    if (articleError || !article) {
      return new Response(
        JSON.stringify({ error: 'Article non trouvé' }),
        { status: 404 }
      );
    }

    if (!article.published) {
      return new Response(
        JSON.stringify({ error: 'Article non publié' }),
        { status: 400 }
      );
    }

    if (article.notification_sent) {
      return new Response(
        JSON.stringify({ error: 'Notifications déjà envoyées pour cet article' }),
        { status: 400 }
      );
    }

    // Récupérer les abonnés confirmés
    const { data: subscribers, error: subscribersError } = await supabase
      .from('newsletter_subscribers')
      .select('email')
      .eq('confirmed', true)
      .eq('unsubscribed', false);

    if (subscribersError) {
      console.error('Erreur lors de la récupération des abonnés:', subscribersError);
      return new Response(
        JSON.stringify({ error: 'Erreur lors de la récupération des abonnés' }),
        { status: 500 }
      );
    }

    if (!subscribers || subscribers.length === 0) {
      return new Response(
        JSON.stringify({ message: 'Aucun abonné à notifier' }),
        { status: 200 }
      );
    }

    // Configuration de l'email
    const articleUrl = `${import.meta.env.WEBSITE_URL}/blog/${slug}`;
    const fromEmail = import.meta.env.FROM_EMAIL || 'notifications@la-maison-sattvaia.com';
    const websiteName = import.meta.env.WEBSITE_NAME || 'La Maison Sattvaïa';

    // Envoyer les notifications
    const emailPromises = subscribers.map(async subscriber => {
      const html = await getNewArticleEmailTemplate({
        article: {
          title: article.title,
          description: article.excerpt || '',
          url: articleUrl,
          category: article.category || 'Général'
        },
        websiteUrl: import.meta.env.WEBSITE_URL || 'https://la-maison-sattvaia.com',
        unsubscribeUrl: `${import.meta.env.WEBSITE_URL}/api/newsletter/unsubscribe?email=${encodeURIComponent(subscriber.email)}`
      });
      
      return resend.emails.send({
        from: fromEmail,
        to: [subscriber.email],
        subject: `Nouvel article : ${article.title}`,
        html
      });
    });

    const results = await Promise.allSettled(emailPromises);
    
    // Compter les succès et erreurs
    const successCount = results.filter(result => 
      result.status === 'fulfilled' && !result.value.error
    ).length;
    
    const errorCount = results.length - successCount;

    // Marquer l'article comme notifié
    const { error: updateError } = await supabase
      .from('posts')
      .update({ notification_sent: true })
      .eq('slug', slug);

    if (updateError) {
      console.error('Erreur lors de la mise à jour du statut de notification:', updateError);
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
    console.error('Erreur lors de l\'envoi des notifications:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur interne du serveur' }),
      { status: 500 }
    );
  }
};
