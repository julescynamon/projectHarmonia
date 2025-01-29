import { Resend } from 'resend';
import { getNewArticleEmailTemplate } from './emails/new-article-template';

const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;
const FROM_EMAIL = import.meta.env.FROM_EMAIL || 'onboarding@resend.dev';
const WEBSITE_URL = import.meta.env.WEBSITE_URL || 'http://localhost:4321';
const WEBSITE_NAME = import.meta.env.WEBSITE_NAME || 'Harmonia';
const IS_DEVELOPMENT = import.meta.env.DEV;

if (!RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not defined in environment variables');
}

if (!FROM_EMAIL) {
  throw new Error('FROM_EMAIL is not defined in environment variables');
}

const resend = new Resend(RESEND_API_KEY);

export async function sendConfirmationEmail(email: string, token: string) {
  console.log('Sending confirmation email to:', email);
  console.log('Using FROM_EMAIL:', FROM_EMAIL);
  
  if (!email || !token) {
    throw new Error('Email et token requis pour l\'envoi de l\'email de confirmation');
  }

  const confirmationUrl = `${WEBSITE_URL}/api/newsletter/confirm?token=${token}`;
  const unsubscribeUrl = `${WEBSITE_URL}/api/newsletter/unsubscribe?token=${token}`;

  try {
    // En développement, simuler l'envoi d'email si ce n'est pas l'email de test
    if (IS_DEVELOPMENT && email !== 'tyzranaima@gmail.com') {
      console.log('Mode développement : Simulation d\'envoi d\'email');
      console.log('URL de confirmation :', confirmationUrl);
      return {
        success: true,
        data: {
          id: 'simulated',
          from: FROM_EMAIL,
          to: email,
          subject: `Confirmez votre inscription à la newsletter ${WEBSITE_NAME}`
        }
      };
    }

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Confirmez votre inscription à la newsletter ${WEBSITE_NAME}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Confirmez votre inscription</h1>
          <p>Merci de votre inscription à la newsletter de ${WEBSITE_NAME} !</p>
          <p>Pour confirmer votre inscription, veuillez cliquer sur le lien ci-dessous :</p>
          <p>
            <a href="${confirmationUrl}" 
               style="display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px;">
              Confirmer mon inscription
            </a>
          </p>
          <p style="margin-top: 20px; font-size: 0.9em; color: #666;">
            Si vous n'avez pas demandé cette inscription, vous pouvez ignorer cet email.
          </p>
          <p style="margin-top: 20px; font-size: 0.8em; color: #666;">
            <a href="${unsubscribeUrl}" style="color: #666;">Se désinscrire</a>
          </p>
        </div>
      `,
      headers: {
        'X-Entity-Ref-ID': token
      }
    });

    if (error) {
      console.error('Error sending confirmation email:', error);
      throw new Error(error.message);
    }

    console.log('Confirmation email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error in sendConfirmationEmail:', error);
    throw error;
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

    // Envoyer les emails par lots de 50 pour éviter les limites de taux
    const batchSize = 50;
    const results = [];

    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);
      const batchPromises = batch.map(async ({ email }) => 
        resend.emails.send({
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
        })
      );

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
    }

    const errors = results.filter(result => result.error);
    if (errors.length > 0) {
      console.error('Errors sending some notifications:', errors);
    }

    return {
      success: true,
      data: {
        sent: results.length - errors.length,
        failed: errors.length
      }
    };
  } catch (error) {
    console.error('Error sending article notifications:', error);
    throw error;
  }
}
