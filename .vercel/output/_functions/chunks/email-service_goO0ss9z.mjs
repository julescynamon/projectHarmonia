import { Resend } from 'resend';
import { g as getNewArticleEmailTemplate } from './new-article-template_CLeG0NyS.mjs';

function getConfirmationEmailHtml({
  confirmationUrl,
  websiteName = "La Maison Sattvaïa",
  websiteUrl = "https://la-maison-sattvaia.com"
}) {
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  return `
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="color-scheme" content="light">
        <meta name="supported-color-schemes" content="light">
        <title>Confirmez votre inscription à la newsletter ${websiteName}</title>
        <!--[if mso]>
        <noscript>
          <xml>
            <o:OfficeDocumentSettings>
              <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
          </xml>
        </noscript>
        <![endif]-->
        <style>
          :root {
            color-scheme: light;
            supported-color-schemes: light;
          }
          
          html, body {
            margin: 0 auto !important;
            padding: 0 !important;
            width: 100% !important;
            height: 100% !important;
          }
          
          * {
            -ms-text-size-adjust: 100%;
            -webkit-text-size-adjust: 100%;
          }
          
          div[style*="margin: 16px 0"] {
            margin: 0 !important;
          }
          
          #MessageViewBody, #MessageWebViewDiv {
            width: 100% !important;
          }
          
          table, td {
            mso-table-lspace: 0pt !important;
            mso-table-rspace: 0pt !important;
          }
          
          table {
            border-spacing: 0 !important;
            border-collapse: collapse !important;
            table-layout: fixed !important;
            margin: 0 auto !important;
          }
          
          img {
            -ms-interpolation-mode: bicubic;
          }
          
          a {
            text-decoration: none;
            color: #2563eb;
          }
          
          a:hover {
            text-decoration: underline;
          }
          
          @media screen and (max-width: 600px) {
            .mobile-padding {
              padding-left: 20px !important;
              padding-right: 20px !important;
            }
            .mobile-stack {
              display: block !important;
              width: 100% !important;
              max-width: 100% !important;
              direction: ltr !important;
            }
          }
        </style>
      </head>
      <body style="word-spacing:normal;background-color:#f9fafb;">
        <div style="background-color:#f9fafb; padding: 40px 20px;">
          <!--[if mso | IE]>
          <table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600">
            <tr>
              <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
          <![endif]-->
          <div style="margin:0px auto;max-width:600px;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <!-- Logo Header -->
            <div style="padding:32px 40px;text-align:center;background-color:#1e293b;">
              <img src="${websiteUrl}/logo-light.webp" 
                   alt="${websiteName}" 
                   style="width:auto;height:40px;"
                   width="auto" 
                   height="40">
            </div>
            
            <!-- Content -->
            <div style="padding:40px;background:#ffffff;">
              <h1 style="color:#1e293b;font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;font-size:24px;font-weight:700;line-height:32px;margin:0 0 24px;">
                Confirmez votre inscription
              </h1>
              
              <p style="color:#4b5563;font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;font-size:16px;line-height:24px;margin:0 0 24px;">
                Merci de votre inscription à la newsletter de ${websiteName}. Pour finaliser votre inscription et commencer à recevoir nos actualités, veuillez confirmer votre adresse email en cliquant sur le bouton ci-dessous :
              </p>

              <div style="text-align:center;margin:32px 0;">
                <a href="${confirmationUrl}" 
                   style="display:inline-block;background:#2563eb;color:#ffffff;font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;font-size:16px;font-weight:500;line-height:1;padding:16px 32px;border-radius:6px;text-decoration:none;"
                   target="_blank">
                  <!--[if mso]>&nbsp;&nbsp;&nbsp;<![endif]-->
                  Confirmer mon email
                  <!--[if mso]>&nbsp;&nbsp;&nbsp;<![endif]-->
                </a>
              </div>

              <p style="color:#6b7280;font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;font-size:14px;line-height:20px;margin:0;">
                Si le bouton ne fonctionne pas, vous pouvez copier et coller ce lien dans votre navigateur :<br>
                <a href="${confirmationUrl}" 
                   style="color:#2563eb;word-break:break-all;"
                   target="_blank">
                  ${confirmationUrl}
                </a>
              </p>
            </div>
            
            <!-- Footer -->
            <div style="padding:32px 40px;background:#f8fafc;border-top:1px solid #e2e8f0;">
              <p style="color:#64748b;font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;font-size:12px;line-height:16px;margin:0;text-align:center;">
                Si vous n'avez pas demandé à recevoir cet email, vous pouvez l'ignorer en toute sécurité.<br>
                &copy; ${currentYear} ${websiteName}. Tous droits réservés.<br>
                <a href="${websiteUrl}" 
                   style="color:#2563eb;text-decoration:underline;"
                   target="_blank">
                  Visiter notre site
                </a>
              </p>
            </div>
          </div>
          <!--[if mso | IE]>
              </td>
            </tr>
          </table>
          <![endif]-->
          
          <!-- Preview Text -->
          <div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
            Confirmez votre inscription à la newsletter ${websiteName} pour recevoir nos actualités
          </div>
        </div>
      </body>
    </html>
  `;
}

function getAppointmentNotificationEmailHtml({
  appointment,
  service,
  adminEmail = "tyzranaima@gmail.com",
  websiteUrl = "https://la-maison-sattvaia.com"
}) {
  const formattedDate = new Date(appointment.date).toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nouvelle demande de réservation - La Maison Sattvaïa</title>
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
          ` : ""}
        </div>
        
        <h3>Actions requises</h3>
        <p>Veuillez examiner cette demande et prendre une décision :</p>
        
        <div style="margin: 20px 0;">
          <a href="${websiteUrl}/admin/disponibilites" class="button" style="background-color: #4CAF50; margin-right: 10px;">
            📅 Gérer les disponibilités
          </a>
          
          <a href="mailto:${appointment.client_email}?subject=Confirmation de réservation - ${formattedDate} ${appointment.time}" class="button">
            📧 Répondre au client
          </a>
        </div>
        
        <p style="margin-top: 20px; font-size: 14px; color: #666;">
          <strong>ID de réservation :</strong> ${appointment.id}
        </p>
      </div>
      
      <div class="footer">
        <p>Cet email a été envoyé automatiquement par le système de réservation La Maison Sattvaïa.</p>
        <p>Pour toute question, contactez l'équipe technique.</p>
      </div>
    </body>
    </html>
  `;
}

function getAppointmentConfirmationEmailHtml({
  appointment,
  service,
  contactEmail = "naima@la-maison-sattvaia.com",
  websiteUrl = "https://la-maison-sattvaia.com"
}) {
  const formattedDate = new Date(appointment.date).toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmation de votre demande de réservation - La Maison Sattvaïa</title>
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
          ` : ""}
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
        La Maison Sattvaïa</p>
      </div>
    </body>
    </html>
  `;
}

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || "notifications@la-maison-sattvaia.com";
const WEBSITE_URL = process.env.WEBSITE_URL || "https://la-maison-sattvaia.com";
const WEBSITE_NAME = process.env.WEBSITE_NAME || "La Maison Sattvaïa";
const IS_DEVELOPMENT = process.env.NODE_ENV === "development";
const resend = new Resend(RESEND_API_KEY);
class EmailServiceError extends Error {
  constructor(message, code, details) {
    super(message);
    this.code = code;
    this.details = details;
    this.name = "EmailServiceError";
  }
}
const ERROR_CODES = {
  INVALID_INPUT: "INVALID_INPUT",
  RESEND_API_ERROR: "RESEND_API_ERROR",
  RATE_LIMIT: "RATE_LIMIT",
  NETWORK_ERROR: "NETWORK_ERROR",
  UNKNOWN_ERROR: "UNKNOWN_ERROR"
};
async function sendConfirmationEmail(email, token) {
  try {
    if (!RESEND_API_KEY) {
      throw new EmailServiceError("RESEND_API_KEY non configurée", "CONFIG_ERROR");
    }
    const confirmationUrl = `${WEBSITE_URL}/newsletter/confirm?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`;
    const emailData = {
      from: FROM_EMAIL,
      to: [email],
      subject: `Confirmez votre inscription à la newsletter ${WEBSITE_NAME}`,
      html: getConfirmationEmailHtml({
        confirmationUrl,
        websiteName: WEBSITE_NAME,
        websiteUrl: WEBSITE_URL
      })
    };
    if (IS_DEVELOPMENT) {
      return {
        success: true,
        message: "Email de confirmation simulé (mode développement)",
        data: { id: "dev-simulation" }
      };
    }
    const result = await resend.emails.send(emailData);
    if (result.error) {
      throw new EmailServiceError(
        `Erreur lors de l'envoi de l'email de confirmation: ${result.error.message}`,
        "SEND_ERROR",
        result.error
      );
    }
    return {
      success: true,
      message: "Email de confirmation envoyé avec succès",
      data: result.data
    };
  } catch (error) {
    if (error instanceof EmailServiceError) {
      throw error;
    }
    throw new EmailServiceError(
      `Erreur inattendue lors de l'envoi de l'email de confirmation: ${error instanceof Error ? error.message : "Erreur inconnue"}`,
      "UNKNOWN_ERROR",
      error
    );
  }
}
async function sendNewArticleNotification(subscribers, article) {
  const articleUrl = `${WEBSITE_URL}/blog/${article.slug}`;
  try {
    if (IS_DEVELOPMENT) {
      console.log("Mode développement : Simulation d'envoi des notifications");
      console.log("URL de l'article :", articleUrl);
      return {
        success: true,
        data: {
          id: "simulated-batch",
          recipientCount: subscribers.length
        }
      };
    }
    if (!subscribers.length) {
      throw new EmailServiceError(
        "Aucun abonné à notifier",
        ERROR_CODES.INVALID_INPUT
      );
    }
    const batchSize = 50;
    const results = [];
    const errors = [];
    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);
      const batchPromises = batch.map(async ({ email }) => {
        try {
          return await resend.emails.send({
            from: FROM_EMAIL,
            to: email,
            subject: `Nouvel article sur ${WEBSITE_NAME} : ${article.title}`,
            html: await getNewArticleEmailTemplate({
              article: {
                title: article.title,
                description: article.description,
                url: articleUrl,
                image: article.coverImage,
                category: article.category || "blog"
              },
              websiteUrl: WEBSITE_URL,
              unsubscribeUrl: `${WEBSITE_URL}/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}`
            })
          });
        } catch (error) {
          errors.push({ email, error });
          return { error };
        }
      });
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
    }
    const failedEmails = errors.map(({ email }) => email);
    if (errors.length > 0) {
      console.error("Errors sending some notifications:", errors);
      if (errors.length === subscribers.length) {
        throw new EmailServiceError(
          "Échec de l'envoi des notifications à tous les abonnés",
          ERROR_CODES.RESEND_API_ERROR,
          { errors, failedEmails }
        );
      }
      return {
        success: true,
        data: {
          sent: results.length - errors.length,
          failed: errors.length,
          failedEmails,
          partialFailure: true
        }
      };
    }
    return {
      success: true,
      data: {
        sent: results.length,
        failed: 0
      }
    };
  } catch (error) {
    console.error("Error sending article notifications:", error);
    if (error instanceof EmailServiceError) {
      throw error;
    }
    throw new EmailServiceError(
      `Erreur inattendue lors de l'envoi des notifications d'article: ${error instanceof Error ? error.message : "Erreur inconnue"}`,
      ERROR_CODES.UNKNOWN_ERROR,
      error
    );
  }
}
async function sendAppointmentNotificationEmail({
  appointment,
  service,
  adminEmail = "tyzranaima@gmail.com"
}) {
  try {
    if (!RESEND_API_KEY) {
      throw new EmailServiceError("RESEND_API_KEY non configurée", "CONFIG_ERROR");
    }
    const emailHtml = getAppointmentNotificationEmailHtml({
      appointment,
      service,
      adminEmail,
      websiteUrl: WEBSITE_URL
    });
    const emailData = {
      from: FROM_EMAIL,
      to: [adminEmail],
      subject: `Nouvelle demande de réservation - ${appointment.client_name}`,
      html: emailHtml
    };
    if (IS_DEVELOPMENT) {
      console.log("Mode développement : Email de notification admin simulé");
      console.log("Destinataire:", adminEmail);
      console.log("Client:", appointment.client_name);
      return {
        success: true,
        message: "Email de notification admin simulé (mode développement)",
        data: { id: "dev-simulation" }
      };
    }
    const result = await resend.emails.send(emailData);
    if (result.error) {
      throw new EmailServiceError(
        `Erreur lors de l'envoi de l'email de notification admin: ${result.error.message}`,
        "SEND_ERROR",
        result.error
      );
    }
    return {
      success: true,
      message: "Email de notification admin envoyé avec succès",
      data: result.data
    };
  } catch (error) {
    if (error instanceof EmailServiceError) {
      throw error;
    }
    throw new EmailServiceError(
      `Erreur inattendue lors de l'envoi de l'email de notification admin: ${error instanceof Error ? error.message : "Erreur inconnue"}`,
      "UNKNOWN_ERROR",
      error
    );
  }
}
async function sendAppointmentConfirmationEmail({
  appointment,
  service,
  contactEmail = "naima@la-maison-sattvaia.com"
}) {
  try {
    if (!RESEND_API_KEY) {
      throw new EmailServiceError("RESEND_API_KEY non configurée", "CONFIG_ERROR");
    }
    const emailHtml = getAppointmentConfirmationEmailHtml({
      appointment,
      service,
      contactEmail,
      websiteUrl: WEBSITE_URL
    });
    const emailData = {
      from: FROM_EMAIL,
      to: [appointment.client_email],
      subject: "Confirmation de votre demande de réservation - La Maison Sattvaïa",
      html: emailHtml
    };
    if (IS_DEVELOPMENT) {
      console.log("Mode développement : Email de confirmation client simulé");
      console.log("Destinataire:", appointment.client_email);
      console.log("Client:", appointment.client_name);
      return {
        success: true,
        message: "Email de confirmation client simulé (mode développement)",
        data: { id: "dev-simulation" }
      };
    }
    const result = await resend.emails.send(emailData);
    if (result.error) {
      throw new EmailServiceError(
        `Erreur lors de l'envoi de l'email de confirmation client: ${result.error.message}`,
        "SEND_ERROR",
        result.error
      );
    }
    return {
      success: true,
      message: "Email de confirmation client envoyé avec succès",
      data: result.data
    };
  } catch (error) {
    if (error instanceof EmailServiceError) {
      throw error;
    }
    throw new EmailServiceError(
      `Erreur inattendue lors de l'envoi de l'email de confirmation client: ${error instanceof Error ? error.message : "Erreur inconnue"}`,
      "UNKNOWN_ERROR",
      error
    );
  }
}
function validateEmailData(data) {
  if (!data.name || data.name.length < 2) {
    throw new Error("Le nom est invalide");
  }
  if (!data.email || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(data.email)) {
    throw new Error("L'email est invalide");
  }
  if (!data.subject) {
    throw new Error("Le sujet est requis");
  }
  if (!data.message || data.message.length < 10 || data.message.length > 1e3) {
    throw new Error("Le message doit contenir entre 10 et 1000 caractères");
  }
}
function sanitizeEmailData(data) {
  return {
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    subject: data.subject.trim(),
    message: data.message.trim()
  };
}
async function sendContactEmail(data) {
  try {
    validateEmailData(data);
    const sanitizedData = sanitizeEmailData(data);
    const { data: result, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "tyzranaima@gmail.com",
      subject: `Nouveau message de contact : ${sanitizedData.subject}`,
      text: `
Nom : ${sanitizedData.name}
Email : ${sanitizedData.email}
Sujet : ${sanitizedData.subject}

Message :
${sanitizedData.message}
      `,
      replyTo: sanitizedData.email
    });
    if (error) {
      throw new Error(`Erreur lors de l'envoi de l'email: ${error.message}`);
    }
    return result;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    throw new Error("Une erreur est survenue lors de l'envoi du message. Veuillez réessayer plus tard.");
  }
}
async function sendAppointmentApprovalEmail({
  clientName,
  clientEmail,
  date,
  time,
  service,
  paymentUrl,
  price
}) {
  try {
    if (!RESEND_API_KEY) {
      throw new EmailServiceError("RESEND_API_KEY non configurée", "CONFIG_ERROR");
    }
    const fs = await import('fs/promises');
    const path = await import('path');
    const templatePath = path.join(process.cwd(), "src", "emails", "appointment-approved.html");
    let emailHtml = await fs.readFile(templatePath, "utf-8");
    emailHtml = emailHtml.replace(/{{clientName}}/g, clientName).replace(/{{clientEmail}}/g, clientEmail).replace(/{{date}}/g, date).replace(/{{time}}/g, time).replace(/{{service}}/g, service).replace(/{{paymentUrl}}/g, paymentUrl).replace(/{{price}}/g, price.toString());
    const emailData = {
      from: FROM_EMAIL,
      to: [clientEmail],
      subject: "Réservation approuvée - Procédez au paiement - La Maison Sattvaïa",
      html: emailHtml
    };
    if (IS_DEVELOPMENT) {
      console.log("Mode développement : Email d'approbation client simulé");
      console.log("Destinataire:", clientEmail);
      console.log("Lien de paiement:", paymentUrl);
      return {
        success: true,
        message: "Email d'approbation client simulé (mode développement)",
        data: { id: "dev-simulation" }
      };
    }
    const result = await resend.emails.send(emailData);
    if (result.error) {
      throw new EmailServiceError(
        `Erreur lors de l'envoi de l'email d'approbation: ${result.error.message}`,
        "SEND_ERROR",
        result.error
      );
    }
    return {
      success: true,
      message: "Email d'approbation envoyé avec succès",
      data: result.data
    };
  } catch (error) {
    if (error instanceof EmailServiceError) {
      throw error;
    }
    throw new EmailServiceError(
      `Erreur inattendue lors de l'envoi de l'email d'approbation: ${error instanceof Error ? error.message : "Erreur inconnue"}`,
      "UNKNOWN_ERROR",
      error
    );
  }
}
async function sendAppointmentRejectionEmail({
  clientName,
  clientEmail,
  date,
  time,
  service,
  rejectionReason
}) {
  try {
    if (!RESEND_API_KEY) {
      throw new EmailServiceError("RESEND_API_KEY non configurée", "CONFIG_ERROR");
    }
    const fs = await import('fs/promises');
    const path = await import('path');
    const templatePath = path.join(process.cwd(), "src", "emails", "appointment-rejected.html");
    let emailHtml = await fs.readFile(templatePath, "utf-8");
    emailHtml = emailHtml.replace(/{{clientName}}/g, clientName).replace(/{{clientEmail}}/g, clientEmail).replace(/{{date}}/g, date).replace(/{{time}}/g, time).replace(/{{service}}/g, service).replace(/{{rejectionReason}}/g, rejectionReason).replace(/{{siteUrl}}/g, "https://la-maison-sattvaia.com");
    const emailData = {
      from: FROM_EMAIL,
      to: [clientEmail],
      subject: "Information concernant votre demande de réservation - La Maison Sattvaïa",
      html: emailHtml
    };
    if (IS_DEVELOPMENT) {
      console.log("Mode développement : Email de refus client simulé");
      console.log("Destinataire:", clientEmail);
      console.log("Raison du refus:", rejectionReason);
      return {
        success: true,
        message: "Email de refus client simulé (mode développement)",
        data: { id: "dev-simulation" }
      };
    }
    const result = await resend.emails.send(emailData);
    if (result.error) {
      throw new EmailServiceError(
        `Erreur lors de l'envoi de l'email de refus: ${result.error.message}`,
        "SEND_ERROR",
        result.error
      );
    }
    return {
      success: true,
      message: "Email de refus envoyé avec succès",
      data: result.data
    };
  } catch (error) {
    if (error instanceof EmailServiceError) {
      throw error;
    }
    throw new EmailServiceError(
      `Erreur inattendue lors de l'envoi de l'email de refus: ${error instanceof Error ? error.message : "Erreur inconnue"}`,
      "UNKNOWN_ERROR",
      error
    );
  }
}

export { sendAppointmentRejectionEmail as a, sendAppointmentNotificationEmail as b, sendAppointmentConfirmationEmail as c, sendContactEmail as d, sendNewArticleNotification as e, sendConfirmationEmail as f, sendAppointmentApprovalEmail as s };
