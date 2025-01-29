import { Resend } from 'resend';
import { getConfirmationEmailHtml } from './emails/confirmation-email';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

const FROM_EMAIL = import.meta.env.FROM_EMAIL || 'newsletter@harmonia.com';
const WEBSITE_URL = import.meta.env.WEBSITE_URL || 'https://harmonia.com';
const WEBSITE_NAME = import.meta.env.WEBSITE_NAME || 'Harmonia';

export async function sendConfirmationEmail(email: string, token: string) {
  const confirmationUrl = `${WEBSITE_URL}/api/newsletter/confirm?token=${token}`;
  
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Confirmez votre inscription à la newsletter ${WEBSITE_NAME}`,
      html: getConfirmationEmailHtml({
        confirmationUrl,
        websiteName: WEBSITE_NAME,
        websiteUrl: WEBSITE_URL,
      }),
    });

    if (error) {
      console.error('Error sending confirmation email:', error);
      throw error;
    }

    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
    throw error;
  }
}
