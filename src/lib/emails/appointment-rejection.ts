// src/lib/emails/appointment-rejection.ts
export function getAppointmentRejectionEmailHtml({
  appointment,
  rejectionReason,
  websiteUrl = 'https://la-maison-sattvaia.com'
}: {
  appointment: {
    id: string;
    date: string;
    time: string;
    service: string;
    clientName: string;
    clientEmail: string;
  };
  rejectionReason: string;
  websiteUrl?: string;
}) {
  const formattedDate = new Date(appointment.date).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 20px; background-color: #f4f1ed; font-family: Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto;">
        <tr>
          <td style="background-color: #a8b5a3; padding: 20px; text-align: center;">
            <img src="https://raw.githubusercontent.com/julescynamon/projectHarmonia/main/public/images/logo.webp" alt="La Maison Sattvaïa" width="120" style="display: block; margin: 0 auto;">
          </td>
        </tr>
        <tr>
          <td style="background-color: #ffffff; padding: 30px;">
            <h2 style="color: #748c69; font-size: 22px; margin: 0 0 20px 0; font-weight: 600;">Information concernant votre réservation</h2>
            
            <p style="color: #131212; margin-bottom: 20px;">Bonjour ${appointment.clientName},</p>
            
            <p style="color: #131212; margin-bottom: 20px;">Je vous remercie pour votre demande de réservation. Après examen, je dois malheureusement vous informer que je ne peux pas confirmer ce créneau.</p>
            
            <table width="100%" style="background-color: #f4f1ed; border-radius: 6px; padding: 20px; margin-bottom: 20px;">
              <tr>
                <td style="color: #748c69; padding: 5px 10px; font-weight: 600;">Service :</td>
                <td style="color: #131212; padding: 5px 10px;">${appointment.service}</td>
              </tr>
              <tr>
                <td style="color: #748c69; padding: 5px 10px; font-weight: 600;">Date demandée :</td>
                <td style="color: #131212; padding: 5px 10px;">${formattedDate}</td>
              </tr>
              <tr>
                <td style="color: #748c69; padding: 5px 10px; font-weight: 600;">Heure demandée :</td>
                <td style="color: #131212; padding: 5px 10px;">${appointment.time}</td>
              </tr>
            </table>
            
            <table width="100%" style="background-color: #ffebee; border-radius: 6px; padding: 20px; margin-bottom: 20px;">
              <tr>
                <td>
                  <h4 style="margin-top: 0; color: #d32f2f;">📝 Raison</h4>
                  <p style="color: #131212; margin-bottom: 0;">${rejectionReason}</p>
                </td>
              </tr>
            </table>
            
            <table width="100%" style="background-color: #748c69; border-radius: 6px; padding: 20px; margin-bottom: 20px;">
              <tr>
                <td style="text-align: center;">
                  <p style="color: #f4f1ed; margin: 0 0 15px 0;">Nouvelle réservation</p>
                  <a href="${websiteUrl}/accompagnements/reservation" target="_blank" style="display: inline-block; background-color: #f4f1ed; color: #748c69; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600;">📅 Nouvelle Réservation</a>
                </td>
              </tr>
            </table>
            
            <p style="color: #131212; margin-bottom: 20px; font-size: 14px;">Je m'excuse pour ce désagrément et espère pouvoir vous accompagner prochainement dans votre parcours de bien-être.</p>
          </td>
        </tr>
        <tr>
          <td style="background-color: #ffffff; padding: 20px; text-align: center; border-top: 1px solid #f4f1ed;">
            <p style="color: #131212; margin: 5px 0; font-size: 14px;">Pour toute question ou modification, n'hésitez pas à me contacter.</p>
            <p style="color: #131212; margin: 5px 0; font-size: 14px;">Au plaisir de vous recevoir,<br>La Maison Sattvaïa</p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
