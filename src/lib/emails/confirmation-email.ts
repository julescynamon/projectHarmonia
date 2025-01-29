export function getConfirmationEmailHtml({
  confirmationUrl,
  websiteName = "Harmonia",
  websiteUrl = "https://harmonia.com"
}: {
  confirmationUrl: string;
  websiteName?: string;
  websiteUrl?: string;
}) {
  // Date en français pour le footer
  const currentYear = new Date().getFullYear();
  
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
              <img src="${websiteUrl}/logo-light.png" 
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
