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
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Réservation - La Maison Sattvaïa</title>
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
          border-bottom: 2px solid #f44336;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #4CAF50;
          margin-bottom: 10px;
        }
        .info-icon {
          font-size: 48px;
          color: #f44336;
          margin-bottom: 20px;
        }
        .appointment-details {
          background-color: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          border-left: 4px solid #f44336;
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
        .rejection-reason {
          background-color: #ffebee;
          padding: 15px;
          border-radius: 5px;
          margin: 20px 0;
          border-left: 4px solid #f44336;
        }
        .alternative-suggestions {
          background-color: #e8f5e8;
          padding: 15px;
          border-radius: 5px;
          margin: 20px 0;
        }
        .cta-button {
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
        .cta-button:hover {
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
          background-color: #e3f2fd;
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
          <div class="logo">🌿 La Maison Sattvaïa</div>
          <div class="info-icon">ℹ️</div>
          <h1 style="color: #f44336; margin: 0;">Réservation</h1>
          <p style="color: #666; margin: 10px 0 0 0;">Information importante concernant votre demande</p>
        </div>

        <p>Bonjour <strong>${appointment.clientName}</strong>,</p>

        <p>Nous vous remercions pour votre demande de réservation. Après avoir examiné votre demande, nous devons vous informer que nous ne pouvons malheureusement pas confirmer ce créneau.</p>

        <div class="appointment-details">
          <h3 style="color: #f44336; margin-top: 0;">Détails de votre demande</h3>
          
          <div class="detail-row">
            <span class="detail-label">Service :</span>
            <span class="detail-value">${appointment.service}</span>
          </div>
          
          <div class="detail-row">
            <span class="detail-label">Date demandée :</span>
            <span class="detail-value">${formattedDate}</span>
          </div>
          
          <div class="detail-row">
            <span class="detail-label">Heure demandée :</span>
            <span class="detail-value">${appointment.time}</span>
          </div>
        </div>

        <div class="rejection-reason">
          <h4 style="margin-top: 0; color: #f44336;">📝 Raison</h4>
          <p style="margin-bottom: 0;">${rejectionReason}</p>
        </div>

        <div class="alternative-suggestions">
          <h4 style="margin-top: 0; color: #4CAF50;">💡 Alternatives suggérées</h4>
          <p style="margin-bottom: 10px;">Nous vous proposons plusieurs options :</p>
          <ul style="margin: 10px 0; padding-left: 20px;">
            <li>Consulter notre <a href="${websiteUrl}/accompagnements/reservation" style="color: #4CAF50;">calendrier de disponibilités</a> pour choisir un autre créneau</li>
            <li>Nous contacter pour discuter d'autres dates possibles</li>
            <li>Envisager une consultation à distance si cela vous convient</li>
          </ul>
        </div>

        <div style="text-align: center;">
          <a href="${websiteUrl}/accompagnements/reservation" class="cta-button">
            📅 Nouvelle Réservation
          </a>
        </div>

        <div class="contact-info">
          <h4 style="margin-top: 0; color: #2196F3;">📞 Nous sommes là pour vous aider</h4>
          <p style="margin-bottom: 5px;">Si vous souhaitez discuter d'autres options ou avez des questions :</p>
          <ul style="margin: 10px 0; padding-left: 20px;">
            <li>Envoyez-nous un email à <a href="mailto:tyzranaima@gmail.com" style="color: #2196F3;">tyzranaima@gmail.com</a></li>
            <li>Consultez notre <a href="${websiteUrl}/contact" style="color: #2196F3;">page de contact</a></li>
            <li>Nous répondrons dans les plus brefs délais</li>
          </ul>
        </div>

        <p>Nous nous excusons pour ce désagrément et espérons pouvoir vous accompagner prochainement dans votre parcours de bien-être.</p>

        <p>
          Bien cordialement,<br>
          <strong>Naima Tyzra</strong><br>
          Naturopathe & Praticienne en soins énergétiques<br>
          🌿 La Maison Sattvaïa
        </p>

        <div class="footer">
          <p>Cet email a été envoyé automatiquement. Merci de ne pas y répondre directement.</p>
          <p>© 2024 La Maison Sattvaïa - Tous droits réservés</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
