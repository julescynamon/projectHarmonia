export function getAppointmentConfirmationEmailHtml({
  appointment,
  service,
  contactEmail = 'naima@harmonia-naturo.com',
  websiteUrl = 'https://harmonia-naturo.com'
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
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmation de votre demande de réservation - Harmonia</title>
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
        .status-pending {
          background-color: #fff3cd;
          border: 1px solid #ffeaa7;
          color: #856404;
          padding: 15px;
          border-radius: 6px;
          margin: 20px 0;
        }
        .contact-info {
          background-color: #e8f5e8;
          border: 1px solid #c3e6c3;
          padding: 15px;
          border-radius: 6px;
          margin: 20px 0;
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
        <h1>Demande de réservation reçue</h1>
        <p>Merci pour votre confiance, ${appointment.client_name}</p>
      </div>
      
      <div class="content">
        <h2>Votre demande a été enregistrée</h2>
        
        <div class="status-pending">
          <h3>⏳ Statut : En attente de validation</h3>
          <p>Votre demande de réservation a été reçue et est actuellement en cours d'examen. 
          Nous vous contacterons dans les plus brefs délais pour confirmer votre rendez-vous.</p>
        </div>
        
        <div class="appointment-details">
          <h3>Détails de votre demande</h3>
          <p><strong>Service :</strong> ${service.title}</p>
          <p><strong>Date souhaitée :</strong> ${formattedDate}</p>
          <p><strong>Heure souhaitée :</strong> ${appointment.time}</p>
          <p><strong>Durée :</strong> ${service.duration}</p>
          <p><strong>Prix :</strong> ${service.price}€</p>
          
          ${appointment.reason ? `
          <h3>Motif de consultation</h3>
          <p style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; font-style: italic;">
            ${appointment.reason}
          </p>
          ` : ''}
        </div>
        
        <div class="contact-info">
          <h3>📧 Prochaines étapes</h3>
          <p>Une fois votre demande validée, vous recevrez :</p>
          <ul>
            <li>Une confirmation de votre rendez-vous</li>
            <li>Un lien de paiement sécurisé</li>
            <li>Les informations pratiques pour votre séance</li>
          </ul>
        </div>
        
        <h3>Questions ou modifications ?</h3>
        <p>Si vous souhaitez modifier votre demande ou avez des questions, n'hésitez pas à nous contacter :</p>
        <p><strong>Email :</strong> <a href="mailto:${contactEmail}">${contactEmail}</a></p>
        <p><strong>Site web :</strong> <a href="${websiteUrl}">${websiteUrl}</a></p>
        
        <p style="margin-top: 20px; font-size: 14px; color: #666;">
          <strong>Référence de votre demande :</strong> ${appointment.id}
        </p>
      </div>
      
      <div class="footer">
        <p>Cet email confirme la réception de votre demande de réservation.</p>
        <p>Merci de votre patience et de votre confiance.</p>
        <p><strong>Naima Tyzra</strong><br>
        Naturopathe & Praticienne en soins énergétiques<br>
        Harmonia</p>
      </div>
    </body>
    </html>
  `;
}
