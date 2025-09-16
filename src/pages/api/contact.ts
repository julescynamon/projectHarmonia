export const prerender = false;

import type { APIRoute } from 'astro';
import { sendContactEmail } from '../../lib/email-service';
import { validateContactForm, sanitizeContactData } from '../../lib/validation';
import type { ContactFormData } from '../../lib/validation';

export const POST: APIRoute = async ({ request }) => {
  try {
    // Vérification de la méthode
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Méthode non autorisée' }), {
        status: 405,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Vérification du Content-Type
    const contentType = request.headers.get('Content-Type');
    if (!contentType?.includes('application/json')) {
      return new Response(JSON.stringify({ error: 'Content-Type doit être application/json' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    const body = await request.json();
    const data = body as ContactFormData;

    // Validation et nettoyage des données
    const sanitizedData = sanitizeContactData(data);
    const errors = validateContactForm(sanitizedData);
    
    if (errors.length > 0) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Données invalides',
          errors 
        }),
        { status: 400 }
      );
    }

    // Envoi de l'email
    try {
      await sendContactEmail(sanitizedData);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Message envoyé avec succès' 
        }),
        { status: 200 }
      );
    } catch (emailError) {
      console.error('Erreur lors de l\'envoi de l\'email:', emailError);
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Erreur lors de l\'envoi du message' 
        }),
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Erreur dans l\'API contact:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Erreur interne du serveur' 
      }),
      { status: 500 }
    );
  }
}; 