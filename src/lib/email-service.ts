import { Resend } from 'resend';
import { getNewArticleEmailTemplate } from './emails/new-article-template';

const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;
const FROM_EMAIL = import.meta.env.FROM_EMAIL || 'onboarding@resend.dev';
const WEBSITE_URL = import.meta.env.WEBSITE_URL || 'http://localhost:4321';
const WEBSITE_NAME = import.meta.env.WEBSITE_NAME || 'Harmonia';
const IS_DEVELOPMENT = import.meta.env.DEV;

if (!RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY n\'est pas définie dans les variables d\'environnement');
}

if (!FROM_EMAIL) {
  throw new Error('FROM_EMAIL is not defined in environment variables');
}

const resend = new Resend(RESEND_API_KEY);

// Classe d'erreur personnalisée pour les emails
class EmailServiceError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: any
  ) {
    super(message);
    this.name = 'EmailServiceError';
  }
}

// Types d'erreurs possibles
const ERROR_CODES = {
  INVALID_INPUT: 'INVALID_INPUT',
  RESEND_API_ERROR: 'RESEND_API_ERROR',
  RATE_LIMIT: 'RATE_LIMIT',
  NETWORK_ERROR: 'NETWORK_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
} as const;

export async function sendConfirmationEmail(email: string, token: string) {
  try {
    if (!RESEND_API_KEY) {
      throw new EmailServiceError('RESEND_API_KEY non configurée', 'CONFIG_ERROR');
    }

    const confirmationUrl = `${WEBSITE_URL}/newsletter/confirm?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`;

    const emailData = {
      from: FROM_EMAIL,
      to: [email],
      subject: `Confirmez votre inscription à la newsletter ${WEBSITE_NAME}`,
      html: getConfirmationEmailTemplate({
        email,
        confirmationUrl,
        websiteName: WEBSITE_NAME,
        websiteUrl: WEBSITE_URL
      })
    };

    // En mode développement, simuler l'envoi
    if (IS_DEVELOPMENT) {
      return {
        success: true,
        message: 'Email de confirmation simulé (mode développement)',
        data: { id: 'dev-simulation' }
      };
    }

    const result = await resend.emails.send(emailData);

    if (result.error) {
      throw new EmailServiceError(
        `Erreur lors de l'envoi de l'email de confirmation: ${result.error.message}`,
        'SEND_ERROR',
        result.error
      );
    }

    return {
      success: true,
      message: 'Email de confirmation envoyé avec succès',
      data: result.data
    };

  } catch (error) {
    if (error instanceof EmailServiceError) {
      throw error;
    }

    throw new EmailServiceError(
      `Erreur inattendue lors de l'envoi de l'email de confirmation: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
      'UNKNOWN_ERROR',
      error
    );
  }
}

export async function sendNewArticleNotification(
  subscribers: Array<{ email: string }>,
  article: {
    title: string;
    description: string;
    slug: string;
    coverImage?: string;
    category?: string;
  }
) {
  console.log(`Sending article notification to ${subscribers.length} subscribers`);
  const articleUrl = `${WEBSITE_URL}/blog/${article.slug}`;
  
  try {
    if (IS_DEVELOPMENT) {
      console.log('Mode développement : Simulation d\'envoi des notifications');
      console.log('URL de l\'article :', articleUrl);
      return {
        success: true,
        data: {
          id: 'simulated-batch',
          recipientCount: subscribers.length
        }
      };
    }

    if (!subscribers.length) {
      throw new EmailServiceError(
        'Aucun abonné à notifier',
        ERROR_CODES.INVALID_INPUT
      );
    }

    // Envoyer les emails par lots de 50 pour éviter les limites de taux
    const batchSize = 50;
    const results = [];
    const errors = [];

    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);
      const batchPromises = batch.map(async ({ email }) => {
        try {
          return await resend.emails.send({
            from: FROM_EMAIL,
            to: email,
            subject: `Nouvel article sur ${WEBSITE_NAME} : ${article.title}`,
            html: await getNewArticleEmailTemplate({
              article: {
                title: article.title,
                description: article.description,
                url: articleUrl,
                image: article.coverImage,
                category: article.category || 'blog'
              },
              websiteUrl: WEBSITE_URL,
              unsubscribeUrl: `${WEBSITE_URL}/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}`
            })
          });
        } catch (error) {
          errors.push({ email, error });
          return { error };
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
    }

    const failedEmails = errors.map(({ email }) => email);
    if (errors.length > 0) {
      console.error('Errors sending some notifications:', errors);
      
      // Si tous les emails ont échoué
      if (errors.length === subscribers.length) {
        throw new EmailServiceError(
          'Échec de l\'envoi des notifications à tous les abonnés',
          ERROR_CODES.RESEND_API_ERROR,
          { errors, failedEmails }
        );
      }
      
      // Si certains emails ont échoué
      return {
        success: true,
        data: {
          sent: results.length - errors.length,
          failed: errors.length,
          failedEmails,
          partialFailure: true
        }
      };
    }

    return {
      success: true,
      data: {
        sent: results.length,
        failed: 0
      }
    };
  } catch (error) {
    console.error('Error sending article notifications:', error);
    
    // Si c'est déjà une EmailServiceError, on la relance
    if (error instanceof EmailServiceError) {
      throw error;
    }
    
    // Sinon, on crée une nouvelle erreur avec le type approprié
    if (error instanceof Error) {
      if (error.message.includes('network') || error.message.includes('timeout')) {
        throw new EmailServiceError(
          'Erreur de connexion lors de l\'envoi des notifications',
          ERROR_CODES.NETWORK_ERROR,
          error
        );
      }
    }
    
    throw new EmailServiceError(
      'Une erreur inattendue s\'est produite lors de l\'envoi des notifications',
      ERROR_CODES.UNKNOWN_ERROR,
      error
    );
  }
}

export interface EmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Types
interface ContactEmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Validation des données
function validateEmailData(data: ContactEmailData): void {
  if (!data.name || data.name.length < 2) {
    throw new Error('Le nom est invalide');
  }
  if (!data.email || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(data.email)) {
    throw new Error('L\'email est invalide');
  }
  if (!data.subject) {
    throw new Error('Le sujet est requis');
  }
  if (!data.message || data.message.length < 10 || data.message.length > 1000) {
    throw new Error('Le message doit contenir entre 10 et 1000 caractères');
  }
}

// Nettoyage des données
function sanitizeEmailData(data: ContactEmailData): ContactEmailData {
  return {
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    subject: data.subject.trim(),
    message: data.message.trim()
  };
}

export async function sendContactEmail(data: ContactEmailData) {
  try {
    // Validation et nettoyage des données
    validateEmailData(data);
    const sanitizedData = sanitizeEmailData(data);

    // Envoi de l'email
    const { data: result, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'tyzranaima@gmail.com',
      subject: `Nouveau message de contact : ${sanitizedData.subject}`,
      text: `
Nom : ${sanitizedData.name}
Email : ${sanitizedData.email}
Sujet : ${sanitizedData.subject}

Message :
${sanitizedData.message}
      `,
      replyTo: sanitizedData.email,
    });

    if (error) {
      throw new Error(`Erreur lors de l'envoi de l'email: ${error.message}`);
    }

    return result;
  } catch (error) {
    // Log de l'erreur pour le débogage
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    
    // Relancer l'erreur avec un message plus générique pour l'utilisateur
    throw new Error('Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer plus tard.');
  }
}
