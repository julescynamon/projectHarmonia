export function getAppointmentNotificationEmailHtml({
  appointment,
  service,
  adminEmail = 'naima@harmonia-naturo.com'
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
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nouvelle demande de réservation - Harmonia</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #a8b5a3;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .content {
          background-color: #f9f9f9;
          padding: 30px;
          border-radius: 0 0 8px 8px;
        }
        .appointment-details {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          border-left: 4px solid #a8b5a3;
        }
        .button {
          display: inline-block;
          background-color: #a8b5a3;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          margin: 10px 5px;
        }
        .button:hover {
          background-color: #8fa08a;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          font-size: 14px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Nouvelle demande de réservation</h1>
        <p>Une nouvelle demande de réservation a été soumise</p>
      </div>
      
      <div class="content">
        <h2>Détails de la réservation</h2>
        
        <div class="appointment-details">
          <h3>Informations client</h3>
          <p><strong>Nom :</strong> ${appointment.client_name}</p>
          <p><strong>Email :</strong> ${appointment.client_email}</p>
          
          <h3>Détails du rendez-vous</h3>
          <p><strong>Service :</strong> ${service.title}</p>
          <p><strong>Date :</strong> ${formattedDate}</p>
          <p><strong>Heure :</strong> ${appointment.time}</p>
          <p><strong>Durée :</strong> ${service.duration}</p>
          <p><strong>Prix :</strong> ${service.price}€</p>
          
          ${appointment.reason ? `
          <h3>Motif de consultation</h3>
          <p style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; font-style: italic;">
            ${appointment.reason}
          </p>
          ` : ''}
        </div>
        
        <h3>Actions requises</h3>
        <p>Veuillez examiner cette demande et prendre une décision :</p>
        
        <a href="mailto:${appointment.client_email}?subject=Confirmation de réservation - ${formattedDate} ${appointment.time}" class="button">
          Répondre au client
        </a>
        
        <p style="margin-top: 20px; font-size: 14px; color: #666;">
          <strong>ID de réservation :</strong> ${appointment.id}
        </p>
      </div>
      
      <div class="footer">
        <p>Cet email a été envoyé automatiquement par le système de réservation Harmonia.</p>
        <p>Pour toute question, contactez l'équipe technique.</p>
      </div>
    </body>
    </html>
  `;
}
