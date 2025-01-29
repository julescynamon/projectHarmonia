import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { sendConfirmationEmail } from '../../../lib/email-service';

// Vérification de la présence des variables d'environnement requises
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Les variables d\'environnement Supabase ne sont pas configurées.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

const subscribeSchema = z.object({
  email: z.string().email("L'adresse email n'est pas valide"),
  consent: z.boolean().refine((val) => val === true, {
    message: "Vous devez accepter les conditions d'utilisation"
  })
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { email, consent } = subscribeSchema.parse(body);

    // Vérifier si l'email existe déjà
    const { data: existingSubscriber } = await supabase
      .from('newsletter_subscribers')
      .select('id, confirmed')
      .eq('email', email)
      .single();

    if (existingSubscriber) {
      if (existingSubscriber.confirmed) {
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Cette adresse email est déjà inscrite à la newsletter.'
          }),
          { status: 400 }
        );
      } else {
        // Renvoyer l'email de confirmation si non confirmé
        const token = crypto.randomUUID();
        await sendConfirmationEmail(email, token);
        return new Response(
          JSON.stringify({
            success: true,
            message: 'Un nouvel email de confirmation vous a été envoyé.'
          })
        );
      }
    }

    // Générer un token de confirmation unique
    const confirmationToken = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // Le token expire après 24h

    // Insérer le nouvel abonné
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert([
        {
          email,
          confirmation_token: confirmationToken,
          token_expires_at: expiresAt.toISOString(),
          confirmed: false,
          consent_timestamp: new Date().toISOString(),
        }
      ]);

    if (error) throw error;

    // Envoyer l'email de confirmation
    await sendConfirmationEmail(email, confirmationToken);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Merci ! Veuillez confirmer votre inscription en cliquant sur le lien envoyé par email.'
      })
    );

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          success: false,
          message: error.errors[0].message
        }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({
        success: false,
        message: 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.'
      }),
      { status: 500 }
    );
  }
};
