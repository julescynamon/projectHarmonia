import type { APIRoute } from 'astro';
import { sendContactEmail } from '../../lib/email-service';
import { validateContactForm, sanitizeContactData } from '../../lib/validation';

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

    // Récupération et validation des données
    const data = await request.json();
    console.log('Données reçues:', data);

    const sanitizedData = sanitizeContactData(data);
    console.log('Données nettoyées:', sanitizedData);

    const errors = validateContactForm(sanitizedData);
    if (errors.length > 0) {
      console.log('Erreurs de validation:', errors);
      return new Response(JSON.stringify({ errors }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Envoi de l'email
    console.log('Tentative d\'envoi de l\'email...');
    await sendContactEmail(sanitizedData);
    console.log('Email envoyé avec succès');

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Erreur API contact:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Erreur lors de l\'envoi du message',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      }), 
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}; 