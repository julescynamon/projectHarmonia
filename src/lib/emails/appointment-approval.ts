// src/lib/emails/appointment-approval.ts
export function getAppointmentApprovalEmailHtml({
  appointment,
  paymentUrl,
  websiteUrl = 'https://harmonia-naturo.com'
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
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Réservation approuvée - Harmonia</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f9f9f9;
        }
        .container {
          background-color: white;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #4CAF50;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #4CAF50;
          margin-bottom: 10px;
        }
        .success-icon {
          font-size: 48px;
          color: #4CAF50;
          margin-bottom: 20px;
        }
        .appointment-details {
          background-color: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          border-left: 4px solid #4CAF50;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          padding: 5px 0;
        }
        .detail-label {
          font-weight: bold;
          color: #555;
        }
        .detail-value {
          color: #333;
        }
        .payment-button {
          display: inline-block;
          background-color: #4CAF50;
          color: white;
          padding: 15px 30px;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
          margin: 20px 0;
          text-align: center;
        }
        .payment-button:hover {
          background-color: #45a049;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          text-align: center;
          color: #666;
          font-size: 14px;
        }
        .contact-info {
          background-color: #e8f5e8;
          padding: 15px;
          border-radius: 5px;
          margin: 20px 0;
        }
        @media (max-width: 600px) {
          .container {
            padding: 20px;
          }
          .detail-row {
            flex-direction: column;
          }
          .detail-label {
            margin-bottom: 5px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🌿 Harmonia</div>
          <div class="success-icon">✅</div>
          <h1 style="color: #4CAF50; margin: 0;">Réservation Approuvée !</h1>
          <p style="color: #666; margin: 10px 0 0 0;">Votre demande a été acceptée</p>
        </div>

        <p>Bonjour <strong>${appointment.clientName}</strong>,</p>

        <p>Nous avons le plaisir de vous confirmer que votre demande de réservation a été <strong>approuvée</strong> !</p>

        <div class="appointment-details">
          <h3 style="color: #4CAF50; margin-top: 0;">Détails de votre rendez-vous</h3>
          
          <div class="detail-row">
            <span class="detail-label">Service :</span>
            <span class="detail-value">${appointment.service}</span>
          </div>
          
          <div class="detail-row">
            <span class="detail-label">Date :</span>
            <span class="detail-value">${formattedDate}</span>
          </div>
          
          <div class="detail-row">
            <span class="detail-label">Heure :</span>
            <span class="detail-value">${appointment.time}</span>
          </div>
          
          <div class="detail-row">
            <span class="detail-label">Format :</span>
            <span class="detail-value">Visioconférence</span>
          </div>
        </div>

        <div style="text-align: center;">
          <p><strong>Pour finaliser votre réservation, veuillez procéder au paiement :</strong></p>
          
          <a href="${paymentUrl}" class="payment-button">
            💳 Procéder au Paiement
          </a>
          
          <p style="font-size: 14px; color: #666; margin-top: 10px;">
            Ce lien de paiement est valable pendant 24 heures.
          </p>
        </div>

        <div class="contact-info">
          <h4 style="margin-top: 0; color: #4CAF50;">📞 Besoin d'aide ?</h4>
          <p style="margin-bottom: 5px;">Si vous avez des questions ou rencontrez des difficultés :</p>
          <ul style="margin: 10px 0; padding-left: 20px;">
            <li>Consultez notre <a href="${websiteUrl}/contact" style="color: #4CAF50;">page de contact</a></li>
            <li>Envoyez-nous un email à <a href="mailto:tyzranaima@gmail.com" style="color: #4CAF50;">tyzranaima@gmail.com</a></li>
          </ul>
        </div>

        <p><strong>Important :</strong> Votre réservation ne sera confirmée qu'après réception du paiement. En cas de non-paiement dans les 24 heures, le créneau sera libéré pour d'autres clients.</p>

        <p>Nous nous réjouissons de vous accompagner dans votre parcours de bien-être !</p>

        <p>
          Bien cordialement,<br>
          <strong>Naima Tyzra</strong><br>
          Naturopathe & Praticienne en soins énergétiques<br>
          🌿 Harmonia
        </p>

        <div class="footer">
          <p>Cet email a été envoyé automatiquement. Merci de ne pas y répondre directement.</p>
          <p>© 2024 Harmonia - Tous droits réservés</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
