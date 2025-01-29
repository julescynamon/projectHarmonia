import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { sendConfirmationEmail } from '../../../lib/email-service';

// Vérification de la présence des variables d'environnement requises
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Variables d\'environnement manquantes:', { 
    hasUrl: !!supabaseUrl, 
    hasKey: !!supabaseKey 
  });
  throw new Error('Configuration Supabase incomplète');
}

// Type pour la table newsletter_subscribers
type NewsletterSubscriber = {
  id: string;
  email: string;
  confirmed: boolean;
  confirmation_token: string | null;
  token_expires_at: string | null;
  confirmed_at: string | null;
  unsubscribed: boolean;
  unsubscribed_at: string | null;
  consent_timestamp: string;
  created_at: string;
  updated_at: string;
};

const supabase = createClient<{ newsletter_subscribers: NewsletterSubscriber }>(
  supabaseUrl,
  supabaseKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

const subscribeSchema = z.object({
  email: z.string().email("L'adresse email n'est pas valide"),
  consent: z.boolean().refine((val) => val === true, {
    message: "Vous devez accepter les conditions d'utilisation"
  })
});

export const POST: APIRoute = async ({ request }) => {
  try {
    // Validation du corps de la requête
    const body = await request.json();
    const { email, consent } = subscribeSchema.parse(body);

    // Vérification de l'existence de l'email
    const { data: existingSubscriber, error: queryError } = await supabase
      .from('newsletter_subscribers')
      .select('id, confirmed')
      .eq('email', email.toLowerCase());

    // On ignore l'erreur PGRST116 car elle signifie simplement qu'aucun enregistrement n'a été trouvé
    if (queryError && queryError.code !== 'PGRST116') {
      console.error('Erreur de requête Supabase:', queryError);
      throw new Error('Erreur lors de la vérification de l\'email');
    }

    // Si l'email existe déjà et est confirmé
    if (existingSubscriber && existingSubscriber.length > 0 && existingSubscriber[0].confirmed) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Cette adresse email est déjà inscrite à la newsletter.'
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Génération du token
    const confirmationToken = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    // Insertion ou mise à jour
    const { error: upsertError } = await supabase
      .from('newsletter_subscribers')
      .upsert(
        {
          email: email.toLowerCase(),
          confirmation_token: confirmationToken,
          token_expires_at: expiresAt.toISOString(),
          confirmed: false,
          consent_timestamp: new Date().toISOString(),
          unsubscribed: false,
          unsubscribed_at: null
        },
        {
          onConflict: 'email',
          ignoreDuplicates: false
        }
      );

    if (upsertError) {
      console.error('Erreur d\'insertion Supabase:', upsertError);
      throw new Error('Erreur lors de l\'enregistrement de l\'inscription');
    }

    // Envoi de l'email
    await sendConfirmationEmail(email, confirmationToken);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Merci ! Veuillez confirmer votre inscription en cliquant sur le lien envoyé par email.'
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Erreur complète:', error);

    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          success: false,
          message: error.errors[0].message
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: false,
        message: 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
