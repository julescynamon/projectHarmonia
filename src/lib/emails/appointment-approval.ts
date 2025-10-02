// src/lib/emails/appointment-approval.ts
export function getAppointmentApprovalEmailHtml({
  appointment,
  paymentUrl,
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
  paymentUrl: string;
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
            <h2 style="color: #748c69; font-size: 22px; margin: 0 0 20px 0; font-weight: 600;">Réservation Approuvée !</h2>
            
            <p style="color: #131212; margin-bottom: 20px;">Bonjour ${appointment.clientName},</p>
            
            <p style="color: #131212; margin-bottom: 20px;">Nous avons le plaisir de vous confirmer que votre demande de réservation a été <strong>approuvée</strong> !</p>
            
            <table width="100%" style="background-color: #f4f1ed; border-radius: 6px; padding: 20px; margin-bottom: 20px;">
              <tr>
                <td style="color: #748c69; padding: 5px 10px; font-weight: 600;">Service :</td>
                <td style="color: #131212; padding: 5px 10px;">${appointment.service}</td>
              </tr>
              <tr>
                <td style="color: #748c69; padding: 5px 10px; font-weight: 600;">Date :</td>
                <td style="color: #131212; padding: 5px 10px;">${formattedDate}</td>
              </tr>
              <tr>
                <td style="color: #748c69; padding: 5px 10px; font-weight: 600;">Heure :</td>
                <td style="color: #131212; padding: 5px 10px;">${appointment.time}</td>
              </tr>
            </table>
            
            <table width="100%" style="background-color: #748c69; border-radius: 6px; padding: 20px; margin-bottom: 20px;">
              <tr>
                <td style="text-align: center;">
                  <p style="color: #f4f1ed; margin: 0 0 15px 0;">Finalisez votre réservation !</p>
                  <a href="${paymentUrl}" target="_blank" style="display: inline-block; background-color: #f4f1ed; color: #748c69; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600;">💳 Procéder au Paiement</a>
                </td>
              </tr>
            </table>
            
            <p style="color: #131212; margin-bottom: 20px; font-size: 14px;"><strong>Important :</strong> Votre réservation ne sera confirmée qu'après réception du paiement. En cas de non-paiement dans les 24 heures, le créneau sera libéré pour d'autres clients.</p>
          </td>
        </tr>
        <tr>
          <td style="background-color: #ffffff; padding: 20px; text-align: center; border-top: 1px solid #f4f1ed;">
            <p style="color: #131212; margin: 5px 0; font-size: 14px;">Pour toute question ou modification, n'hésitez pas à nous contacter.</p>
            <p style="color: #131212; margin: 5px 0; font-size: 14px;">Au plaisir de vous recevoir,<br>La Maison Sattvaïa</p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
