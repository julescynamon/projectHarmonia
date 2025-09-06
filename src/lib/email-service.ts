import { Resend } from 'resend';
import { getConfirmationEmailHtml } from './emails/confirmation-email';
import { getNewArticleEmailTemplate } from './emails/new-article-template';
import { getAppointmentNotificationEmailHtml } from './emails/appointment-notification';
import { getAppointmentConfirmationEmailHtml } from './emails/appointment-confirmation';
import { getAppointmentApprovalEmailHtml } from './emails/appointment-approval';
import { getAppointmentRejectionEmailHtml } from './emails/appointment-rejection';

// Configuration
const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;
const FROM_EMAIL = import.meta.env.FROM_EMAIL || 'notifications@la-maison-sattvaia.com';
const WEBSITE_URL = import.meta.env.WEBSITE_URL || 'https://la-maison-sattvaia.com';
const WEBSITE_NAME = import.meta.env.WEBSITE_NAME || 'La Maison Sattvaïa';
const IS_DEVELOPMENT = import.meta.env.NODE_ENV === 'development';

// Initialisation de Resend
const resend = new Resend(RESEND_API_KEY);

// Classe d'erreur personnalisée
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

// Fonction pour envoyer l'email de confirmation newsletter
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
      html: getConfirmationEmailHtml({
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

// Fonction pour envoyer les notifications d'articles
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
    
    if (error instanceof EmailServiceError) {
      throw error;
    }
    
    throw new EmailServiceError(
      `Erreur inattendue lors de l'envoi des notifications d'article: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
      ERROR_CODES.UNKNOWN_ERROR,
      error
    );
  }
}

// Fonction pour envoyer l'email de notification admin pour une réservation
export async function sendAppointmentNotificationEmail({
  appointment,
  service,
  adminEmail = 'tyzranaima@gmail.com'
}: {
  appointment: {
    id: string;
    date: string;
    time: string;
    client_name: string;
    client_email: string;
    reason?: string;
  };
  service: {
    title: string;
    price: number;
    duration: string;
  };
  adminEmail?: string;
}) {
  try {
    if (!RESEND_API_KEY) {
      throw new EmailServiceError('RESEND_API_KEY non configurée', 'CONFIG_ERROR');
    }

    const emailHtml = getAppointmentNotificationEmailHtml({
      appointment,
      service,
      adminEmail,
      websiteUrl: WEBSITE_URL
    });

    const emailData = {
      from: FROM_EMAIL,
      to: [adminEmail],
      subject: `Nouvelle demande de réservation - ${appointment.client_name}`,
      html: emailHtml
    };

    // En mode développement, simuler l'envoi
    if (IS_DEVELOPMENT) {
      console.log('Mode développement : Email de notification admin simulé');
      console.log('Destinataire:', adminEmail);
      console.log('Client:', appointment.client_name);
      return {
        success: true,
        message: 'Email de notification admin simulé (mode développement)',
        data: { id: 'dev-simulation' }
      };
    }

    const result = await resend.emails.send(emailData);

    if (result.error) {
      throw new EmailServiceError(
        `Erreur lors de l'envoi de l'email de notification admin: ${result.error.message}`,
        'SEND_ERROR',
        result.error
      );
    }

    return {
      success: true,
      message: 'Email de notification admin envoyé avec succès',
      data: result.data
    };

  } catch (error) {
    if (error instanceof EmailServiceError) {
      throw error;
    }

    throw new EmailServiceError(
      `Erreur inattendue lors de l'envoi de l'email de notification admin: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
      'UNKNOWN_ERROR',
      error
    );
  }
}

// Fonction pour envoyer l'email de confirmation client pour une réservation
export async function sendAppointmentConfirmationEmail({
  appointment,
  service,
  contactEmail = 'naima@la-maison-sattvaia.com'
}: {
  appointment: {
    id: string;
    date: string;
    time: string;
    client_name: string;
    client_email: string;
    reason?: string;
  };
  service: {
    title: string;
    price: number;
    duration: string;
  };
  contactEmail?: string;
}) {
  try {
    if (!RESEND_API_KEY) {
      throw new EmailServiceError('RESEND_API_KEY non configurée', 'CONFIG_ERROR');
    }

    const emailHtml = getAppointmentConfirmationEmailHtml({
      appointment,
      service,
      contactEmail,
      websiteUrl: WEBSITE_URL
    });

    const emailData = {
      from: FROM_EMAIL,
      to: [appointment.client_email],
      subject: 'Confirmation de votre demande de réservation - La Maison Sattvaïa',
      html: emailHtml
    };

    // En mode développement, simuler l'envoi
    if (IS_DEVELOPMENT) {
      console.log('Mode développement : Email de confirmation client simulé');
      console.log('Destinataire:', appointment.client_email);
      console.log('Client:', appointment.client_name);
      return {
        success: true,
        message: 'Email de confirmation client simulé (mode développement)',
        data: { id: 'dev-simulation' }
      };
    }

    const result = await resend.emails.send(emailData);

    if (result.error) {
      throw new EmailServiceError(
        `Erreur lors de l'envoi de l'email de confirmation client: ${result.error.message}`,
        'SEND_ERROR',
        result.error
      );
    }

    return {
      success: true,
      message: 'Email de confirmation client envoyé avec succès',
      data: result.data
    };

  } catch (error) {
    if (error instanceof EmailServiceError) {
      throw error;
    }

    throw new EmailServiceError(
      `Erreur inattendue lors de l'envoi de l'email de confirmation client: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
      'UNKNOWN_ERROR',
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

// Fonction pour envoyer l'email d'approbation avec lien de paiement
export async function sendAppointmentApprovalEmail({
  clientName,
  clientEmail,
  date,
  time,
  service,
  paymentUrl,
  price
}: {
  clientName: string;
  clientEmail: string;
  date: string;
  time: string;
  service: string;
  paymentUrl: string;
  price: number;
}) {
  try {
    if (!RESEND_API_KEY) {
      throw new EmailServiceError('RESEND_API_KEY non configurée', 'CONFIG_ERROR');
    }

    // Lecture du template HTML
    const fs = await import('fs/promises');
    const path = await import('path');
    const templatePath = path.join(process.cwd(), 'src', 'emails', 'appointment-approved.html');
    let emailHtml = await fs.readFile(templatePath, 'utf-8');

    // Remplacement des variables
    emailHtml = emailHtml
      .replace(/{{clientName}}/g, clientName)
      .replace(/{{clientEmail}}/g, clientEmail)
      .replace(/{{date}}/g, date)
      .replace(/{{time}}/g, time)
      .replace(/{{service}}/g, service)
      .replace(/{{paymentUrl}}/g, paymentUrl)
      .replace(/{{price}}/g, price.toString());

    const emailData = {
      from: FROM_EMAIL,
      to: [clientEmail],
      subject: 'Réservation approuvée - Procédez au paiement - La Maison Sattvaïa',
      html: emailHtml
    };

    // En mode développement, simuler l'envoi
    if (IS_DEVELOPMENT) {
      console.log('Mode développement : Email d\'approbation client simulé');
      console.log('Destinataire:', clientEmail);
      console.log('Lien de paiement:', paymentUrl);
      return {
        success: true,
        message: 'Email d\'approbation client simulé (mode développement)',
        data: { id: 'dev-simulation' }
      };
    }

    const result = await resend.emails.send(emailData);

    if (result.error) {
      throw new EmailServiceError(
        `Erreur lors de l'envoi de l'email d'approbation: ${result.error.message}`,
        'SEND_ERROR',
        result.error
      );
    }

    return {
      success: true,
      message: 'Email d\'approbation envoyé avec succès',
      data: result.data
    };

  } catch (error) {
    if (error instanceof EmailServiceError) {
      throw error;
    }

    throw new EmailServiceError(
      `Erreur inattendue lors de l'envoi de l'email d'approbation: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
      'UNKNOWN_ERROR',
      error
    );
  }
}

// Fonction pour envoyer l'email de refus
export async function sendAppointmentRejectionEmail({
  clientName,
  clientEmail,
  date,
  time,
  service,
  rejectionReason
}: {
  clientName: string;
  clientEmail: string;
  date: string;
  time: string;
  service: string;
  rejectionReason: string;
}) {
  try {
    if (!RESEND_API_KEY) {
      throw new EmailServiceError('RESEND_API_KEY non configurée', 'CONFIG_ERROR');
    }

    // Lecture du template HTML
    const fs = await import('fs/promises');
    const path = await import('path');
    const templatePath = path.join(process.cwd(), 'src', 'emails', 'appointment-rejected.html');
    let emailHtml = await fs.readFile(templatePath, 'utf-8');

    // Remplacement des variables
    emailHtml = emailHtml
      .replace(/{{clientName}}/g, clientName)
      .replace(/{{clientEmail}}/g, clientEmail)
      .replace(/{{date}}/g, date)
      .replace(/{{time}}/g, time)
      .replace(/{{service}}/g, service)
      .replace(/{{rejectionReason}}/g, rejectionReason)
      .replace(/{{siteUrl}}/g, 'https://la-maison-sattvaia.com');

    const emailData = {
      from: FROM_EMAIL,
      to: [clientEmail],
      subject: 'Information concernant votre demande de réservation - La Maison Sattvaïa',
      html: emailHtml
    };

    // En mode développement, simuler l'envoi
    if (IS_DEVELOPMENT) {
      console.log('Mode développement : Email de refus client simulé');
      console.log('Destinataire:', clientEmail);
      console.log('Raison du refus:', rejectionReason);
      return {
        success: true,
        message: 'Email de refus client simulé (mode développement)',
        data: { id: 'dev-simulation' }
      };
    }

    const result = await resend.emails.send(emailData);

    if (result.error) {
      throw new EmailServiceError(
        `Erreur lors de l'envoi de l'email de refus: ${result.error.message}`,
        'SEND_ERROR',
        result.error
      );
    }

    return {
      success: true,
      message: 'Email de refus envoyé avec succès',
      data: result.data
    };

  } catch (error) {
    if (error instanceof EmailServiceError) {
      throw error;
    }

    throw new EmailServiceError(
      `Erreur inattendue lors de l'envoi de l'email de refus: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
      'UNKNOWN_ERROR',
      error
    );
  }
}
