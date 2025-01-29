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
    const token = url.searchParams.get('token');
    
    if (!token) {
      return new Response('Token manquant', { status: 400 });
    }

    // Récupérer l'inscription correspondant au token
    const { data: subscriber, error: fetchError } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .eq('confirmation_token', token)
      .single();

    if (fetchError || !subscriber) {
      return new Response('Token invalide', { status: 400 });
    }

    // Vérifier si le token n'a pas expiré
    if (new Date(subscriber.token_expires_at) < new Date()) {
      return new Response('Le lien de confirmation a expiré', { status: 400 });
    }

    // Confirmer l'inscription
    const { error: updateError } = await supabase
      .from('newsletter_subscribers')
      .update({
        confirmed: true,
        confirmed_at: new Date().toISOString(),
        confirmation_token: null,
        token_expires_at: null
      })
      .eq('id', subscriber.id);

    if (updateError) throw updateError;

    // Rediriger vers une page de confirmation
    return new Response(null, {
      status: 302,
      headers: {
        'Location': '/newsletter/confirmation-success'
      }
    });

  } catch (error) {
    console.error('Newsletter confirmation error:', error);
    return new Response('Une erreur est survenue', { status: 500 });
  }
};
