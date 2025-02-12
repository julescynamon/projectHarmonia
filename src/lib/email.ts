import { Resend } from 'resend';

interface EmailConfig {
  resendApiKey: string;
  fromEmail: string;
  websiteUrl: string;
  websiteName: string;
}

const createResendClient = (config: EmailConfig) => new Resend(config.resendApiKey);

const createEmailTemplate = (confirmationUrl: string, config: EmailConfig) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmation de changement d'email</title>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=Lora:wght@400;500&family=Raleway:wght@300;400&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Lora', serif;
      line-height: 1.6;
      color: #1C1C1C;
      background-color: #F4F1ED;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    .header {
      text-align: center;
      padding: 40px 0;
      background-color: #A8B5A3;
    }
    .header h1 {
      font-family: 'Playfair Display', serif;
      color: white;
      margin: 0;
      font-size: 32px;
      letter-spacing: 0.02em;
    }
    .content {
      background-color: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin: 20px 0;
    }
    .button {
      display: inline-block;
      background-color: #D4A373;
      color: white;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 30px;
      font-family: 'Raleway', sans-serif;
      font-weight: 400;
      margin: 20px 0;
      text-align: center;
    }
    .footer {
      text-align: center;
      color: #748C69;
      font-size: 14px;
      margin-top: 40px;
      font-family: 'Raleway', sans-serif;
    }
    .logo {
      font-family: 'Playfair Display', serif;
      font-size: 24px;
      color: #748C69;
      text-decoration: none;
      letter-spacing: 0.03em;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Confirmation de changement d'email</h1>
    </div>
    <div class="content">
      <p>Bonjour,</p>
      <p>Vous avez demandé à changer votre adresse email sur <strong>${config.websiteName}</strong>.</p>
      <p>Pour confirmer ce changement, veuillez cliquer sur le bouton ci-dessous :</p>
      <p style="text-align: center;">
        <a href="${confirmationUrl}" class="button">Confirmer mon email</a>
      </p>
      <p style="font-size: 14px; color: #666;">Si le bouton ne fonctionne pas, vous pouvez copier et coller le lien suivant dans votre navigateur :</p>
      <p style="font-size: 14px; color: #666; word-break: break-all;">${confirmationUrl}</p>
      <p>Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email en toute sécurité.</p>
    </div>
    <div class="footer">
      <a href="${config.websiteUrl}" class="logo">${config.websiteName}</a>
      <p>Votre boutique de partitions numériques</p>
    </div>
  </div>
</body>
</html>
`;

export const sendEmailChangeConfirmation = async (
  to: string,
  confirmationUrl: string,
  config: EmailConfig
) => {
  try {
    const resend = createResendClient(config);
    const { data, error } = await resend.emails.send({
      from: config.fromEmail,
      to: to,
      subject: `${config.websiteName} - Confirmation de changement d'email`,
      html: createEmailTemplate(confirmationUrl, config),
    });

    if (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    throw error;
  }
};
