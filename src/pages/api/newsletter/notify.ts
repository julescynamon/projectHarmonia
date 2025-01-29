import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { sendNewArticleNotification } from '../../../lib/email-service';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Configuration Supabase incomplète');
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export const POST: APIRoute = async ({ request }) => {
  try {
    // Vérifier que la requête vient bien de notre système
    const authHeader = request.headers.get('x-api-key');
    if (authHeader !== import.meta.env.API_SECRET_KEY) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Non autorisé'
      }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Récupérer les informations de l'article
    const article = await request.json();
    
    if (!article.title || !article.slug) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Informations de l\'article manquantes'
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Récupérer tous les abonnés confirmés
    const { data: subscribers, error: queryError } = await supabase
      .from('newsletter_subscribers')
      .select('email')
      .eq('confirmed', true)
      .eq('unsubscribed', false);

    if (queryError) {
      console.error('Erreur lors de la récupération des abonnés:', queryError);
      throw new Error('Erreur lors de la récupération des abonnés');
    }

    if (!subscribers || subscribers.length === 0) {
      return new Response(JSON.stringify({
        success: true,
        message: 'Aucun abonné à notifier'
      }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Envoyer les notifications
    const result = await sendNewArticleNotification(subscribers, article);

    return new Response(JSON.stringify({
      success: true,
      message: `Notifications envoyées à ${result.data.sent} abonnés`,
      data: result.data
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erreur lors de l\'envoi des notifications:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Erreur lors de l\'envoi des notifications'
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
