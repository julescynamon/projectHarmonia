import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

// Vérification de la présence des variables d'environnement requises
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Les variables d\'environnement Supabase ne sont pas configurées.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export const GET: APIRoute = async ({ url }) => {
  try {
    const email = url.searchParams.get('email');
    const token = url.searchParams.get('token');
    
    if (!email || !token) {
      return new Response('Paramètres manquants', { status: 400 });
    }

    // Vérifier que l'email et le token correspondent
    const { data: subscriber, error: fetchError } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .eq('email', email)
      .single();

    if (fetchError || !subscriber) {
      return new Response('Abonné non trouvé', { status: 400 });
    }

    // Vérifier le token de désinscription (à implémenter selon votre logique de sécurité)
    const isValidToken = verifyUnsubscribeToken(email, token);
    if (!isValidToken) {
      return new Response('Token invalide', { status: 400 });
    }

    // Soft delete de l'abonné
    const { error: updateError } = await supabase
      .from('newsletter_subscribers')
      .update({
        unsubscribed: true,
        unsubscribed_at: new Date().toISOString()
      })
      .eq('id', subscriber.id);

    if (updateError) throw updateError;

    // Rediriger vers une page de confirmation
    return new Response(null, {
      status: 302,
      headers: {
        'Location': '/newsletter/unsubscribe-success'
      }
    });

  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    return new Response('Une erreur est survenue', { status: 500 });
  }
};

function verifyUnsubscribeToken(email: string, token: string): boolean {
  // TODO: Implémenter votre logique de vérification du token
  // Par exemple, vous pouvez utiliser un HMAC du email avec une clé secrète
  return true;
}
