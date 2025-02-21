import { Resend } from 'resend';

console.log('Clé API Resend:', import.meta.env.RESEND_API_KEY ? 'Présente' : 'Manquante');
const resend = new Resend(import.meta.env.RESEND_API_KEY);

function generateICalendarData(appointment: {
  date: string;
  time: string;
  service: string;
  clientName: string;
  clientEmail: string;
  reason?: string;
}) {
  const startDate = new Date(`${appointment.date}T${appointment.time}`);
  const endDate = new Date(startDate.getTime() + 90 * 60000); // +90 minutes par défaut

  // Formater les dates pour iCalendar
  const formatDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Harmonia//Rendez-vous//FR',
    'BEGIN:VEVENT',
    `DTSTART:${formatDate(startDate)}`,
    `DTEND:${formatDate(endDate)}`,
    `SUMMARY:RDV ${appointment.service} - ${appointment.clientName}`,
    `DESCRIPTION:Rendez-vous avec ${appointment.clientName}\nEmail: ${appointment.clientEmail}${appointment.reason ? '\nMotif: ' + appointment.reason : ''}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  return Buffer.from(icsContent).toString('base64');
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
    console.log('Génération du fichier ICS...');
    const icsAttachment = generateICalendarData(appointment);
    console.log('Fichier ICS généré avec succès');

    // Email pour l'administrateur
    console.log('Envoi de l\'email à l\'administrateur...');
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
          ${appointment.reason ? `<li>Motif : ${appointment.reason}</li>` : ''}
        </ul>
        <p>Le rendez-vous a été automatiquement ajouté à votre calendrier.</p>
      `,
      attachments: [{
        filename: 'rendez-vous.ics',
        content: icsAttachment
      }]
    });

    console.log('Email admin envoyé:', adminEmailResult);

    // Email pour le client
    console.log('Envoi de l\'email au client...');
    const clientEmailResult = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: appointment.clientEmail,
      subject: 'Confirmation de votre rendez-vous - Harmonia',
      html: `
        <h2>Votre rendez-vous est confirmé</h2>
        <p>Bonjour ${appointment.clientName},</p>
        <p>Votre rendez-vous a bien été confirmé. Voici les détails :</p>
        <ul>
          <li>Service : ${appointment.service}</li>
          <li>Date : ${appointment.date}</li>
          <li>Heure : ${appointment.time}</li>
          <li>Durée : 1h30</li>
          ${appointment.reason ? `<li>Motif indiqué : ${appointment.reason}</li>` : ''}
        </ul>
        <p>Vous pouvez ajouter ce rendez-vous à votre calendrier en utilisant le fichier joint.</p>
        <p>Pour toute question ou modification, n'hésitez pas à nous contacter.</p>
        <p>Au plaisir de vous recevoir,<br>L'équipe Harmonia</p>
      `,
      attachments: [{
        filename: 'rendez-vous.ics',
        content: icsAttachment
      }]
    });

    console.log('Email client envoyé:', clientEmailResult);
    console.log('Toutes les notifications ont été envoyées avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'envoi des notifications:', error);
    throw error;
  }
}
