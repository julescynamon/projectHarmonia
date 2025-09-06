import { Resend } from 'resend';

// Vérifier la clé API Resend
const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;

if (!RESEND_API_KEY) {
  console.error('ATTENTION: La clé API Resend n\'est pas configurée!');
}

const resend = new Resend(RESEND_API_KEY);

function generateCalendarLinks(appointment: {
  date: string;
  time: string;
  service: string;
  clientName: string;
  clientEmail: string;
  reason?: string;
}) {
  const startDate = new Date(`${appointment.date}T${appointment.time}`);
  const endDate = new Date(startDate.getTime() + 90 * 60000); // +90 minutes par défaut

  const formatDateForGoogle = (date: Date) => {
    return date.toISOString().replace(/[:-]/g, '').replace(/\.\d{3}/, '');
  };



  const text = `RDV ${appointment.service} - ${appointment.clientName}`;
  const details = `Rendez-vous avec ${appointment.clientName}\nEmail: ${appointment.clientEmail}${appointment.reason ? '\nMotif: ' + appointment.reason : ''}`;
  const location = 'Cabinet La Maison Sattvaïa';

  // Lien Google Calendar
  const googleParams = new URLSearchParams({
    action: 'TEMPLATE',
    text: text,
    details: details,
    location: location,
    dates: `${formatDateForGoogle(startDate)}/${formatDateForGoogle(endDate)}`,
  });
  const googleLink = `https://calendar.google.com/calendar/render?${googleParams.toString()}`;



  return { googleLink };
}

export async function sendAppointmentNotification(
  appointment: {
    date: string;
    time: string;
    service: string;
    clientName: string;
    clientEmail: string;
  }
) {
  try {
    if (!RESEND_API_KEY) {
      throw new Error('Clé API Resend manquante. Impossible d\'envoyer les emails.');
    }

    const { googleLink, } = generateCalendarLinks(appointment);

    // Email pour l'administrateur
    const adminEmailResult = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'tyzranaima@gmail.com',
      subject: 'Nouveau rendez-vous',
      html: `
        <h2>Nouveau rendez-vous confirmé</h2>
        <p>Un nouveau rendez-vous a été pris pour :</p>
        <ul>
          <li>Date : ${appointment.date}</li>
          <li>Heure : ${appointment.time}</li>
          <li>Service : ${appointment.service}</li>
          <li>Client : ${appointment.clientName}</li>
          <li>Email : ${appointment.clientEmail}</li>
        </ul>
        ${appointment.reason ? `
        <h3>Motif de la consultation :</h3>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
          <p style="margin: 0;">${appointment.reason}</p>
        </div>
        ` : ''}
        <p>Ajouter à votre calendrier :</p>
        <ul>
          <li><a href="${googleLink}" target="_blank">Ajouter à Google Calendar</a></li>
        </ul>
      `
    });

    if (adminEmailResult.error) {
      throw new Error('Echec de l\'envoi de l\'email admin');
    }
    // Email pour le client
    const clientEmailResult = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: appointment.clientEmail,
      subject: 'Confirmation de votre rendez-vous - La Maison Sattvaïa',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">e>
        </head>
        <body style="margin: 0; padding: 20px; background-color: #f4f1ed; font-family: Arial, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto;">
            <tr>
              <td style="background-color: #a8b5a3; padding: 20px; text-align: center;">
                <img src="https://raw.githubusercontent.com/julescynamon/projectHarmonia/main/public/images/logo.png" alt="La Maison Sattvaïa" width="120" style="display: block; margin: 0 auto;">
              </td>
            </tr>
            <tr>
              <td style="background-color: #ffffff; padding: 30px;">
                <h2 style="color: #748c69; font-size: 22px; margin: 0 0 20px 0; font-weight: 600;">Votre rendez-vous est confirmé</h2>
                
                <p style="color: #131212; margin-bottom: 20px;">Bonjour ${appointment.clientName},</p>
                
                <p style="color: #131212; margin-bottom: 20px;">Nous sommes ravis de vous confirmer votre rendez-vous. Voici les détails :</p>
                
                <table width="100%" style="background-color: #f4f1ed; border-radius: 6px; padding: 20px; margin-bottom: 20px;">
                  <tr>
                    <td style="color: #748c69; padding: 5px 10px; font-weight: 600;">Service :</td>
                    <td style="color: #131212; padding: 5px 10px;">${appointment.service}</td>
                  </tr>
                  <tr>
                    <td style="color: #748c69; padding: 5px 10px; font-weight: 600;">Date :</td>
                    <td style="color: #131212; padding: 5px 10px;">${appointment.date}</td>
                  </tr>
                  <tr>
                    <td style="color: #748c69; padding: 5px 10px; font-weight: 600;">Heure :</td>
                    <td style="color: #131212; padding: 5px 10px;">${appointment.time}</td>
                  </tr>
                </table>
                
                <table width="100%" style="background-color: #748c69; border-radius: 6px; padding: 20px; margin-bottom: 20px;">
                  <tr>
                    <td style="text-align: center;">
                      <p style="color: #f4f1ed; margin: 0 0 15px 0;">Ne manquez pas votre rendez-vous !</p>
                      <a href="${googleLink}" target="_blank" style="display: inline-block; background-color: #f4f1ed; color: #748c69; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600;">Ajouter à Google Calendar</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="background-color: #ffffff; padding: 20px; text-align: center; border-top: 1px solid #f4f1ed;">
                <p style="color: #131212; margin: 5px 0; font-size: 14px;">Pour toute question ou modification, n'hésitez pas à nous contacter.</p>
                <p style="color: #131212; margin: 5px 0; font-size: 14px;">Au plaisir de vous recevoir,<br>L'équipe La Maison Sattvaïa</p>
              </td>
            </tr>
          </table>
        </body>
        </body>
        </html>
      `
    });

    if (clientEmailResult.error) {
      console.error('Erreur lors de l\'envoi de l\'email client:', clientEmailResult.error);
      throw new Error('Echec de l\'envoi de l\'email client');
    }
  } catch (error) {
    console.error('Erreur lors de l\'envoi des notifications:', error);
    throw error;
  }
}
