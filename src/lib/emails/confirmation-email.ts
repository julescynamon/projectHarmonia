export function getConfirmationEmailHtml({
  confirmationUrl,
  websiteName = "La Maison Sattvaïa",
  websiteUrl = "https://la-maison-sattvaia.com"
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
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=Lora:wght@400;500&family=Raleway:wght@300;400&display=swap" rel="stylesheet">
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
            .mobile-text {
              font-size: 16px !important;
              line-height: 24px !important;
            }
            .mobile-title {
              font-size: 28px !important;
              line-height: 34px !important;
            }
          }
        </style>
      </head>
      <body style="word-spacing:normal;background-color:#F4F1ED;font-family:'Lora',serif;line-height:1.6;color:#131212;">
        <div style="background-color:#F4F1ED; padding: 40px 20px;">
          <!--[if mso | IE]>
          <table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600">
            <tr>
              <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
          <![endif]-->
          <div style="margin:0px auto;max-width:600px;background:#ffffff;border-radius:15px;overflow:hidden;box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            
            <!-- Header avec couleur sage -->
            <div style="padding:40px;text-align:center;background-color:#A8B5A3;">
              <h1 style="font-family:'Playfair Display',serif;color:#ffffff;margin:0;font-size:32px;font-weight:600;letter-spacing:0.02em;line-height:1.3;">
                ${websiteName}
              </h1>
              <p style="font-family:'Raleway',sans-serif;color:#ffffff;margin:8px 0 0 0;font-size:14px;font-weight:300;letter-spacing:0.03em;opacity:0.9;">
                Votre guide vers le bien-être naturel
              </p>
            </div>
            
            <!-- Content -->
            <div style="padding:40px;background:#ffffff;">
              <h2 style="color:#131212;font-family:'Playfair Display',serif;font-size:32px;font-weight:600;line-height:1.3;margin:0 0 24px;text-align:center;letter-spacing:0.02em;" class="mobile-title">
                Confirmez votre inscription
              </h2>
              
              <p style="color:#131212;font-family:'Lora',serif;font-size:18px;line-height:28px;margin:0 0 32px;text-align:center;" class="mobile-text">
                Merci de votre inscription à la newsletter de ${websiteName}. Pour finaliser votre inscription et commencer à recevoir mes conseils bien-être, veuillez confirmer votre adresse email.
              </p>

              <div style="text-align:center;margin:40px 0;">
                <a href="${confirmationUrl}" 
                   style="display:inline-block;background-color:#D4A373;color:#ffffff;font-family:'Raleway',sans-serif;font-size:16px;font-weight:400;line-height:1;padding:16px 32px;border-radius:30px;text-decoration:none;transition:all 0.3s ease-in-out;letter-spacing:0.05em;text-transform:uppercase;"
                   target="_blank">
                  <!--[if mso]>&nbsp;&nbsp;&nbsp;<![endif]-->
                  Confirmer mon email
                  <!--[if mso]>&nbsp;&nbsp;&nbsp;<![endif]-->
                </a>
              </div>

              <div style="background-color:#FAF7F2;padding:24px;border-radius:8px;margin:32px 0;">
                <p style="color:#748C69;font-family:'Lora',serif;font-size:14px;line-height:20px;margin:0;text-align:center;">
                  Si le bouton ne fonctionne pas, vous pouvez copier et coller ce lien dans votre navigateur :
                </p>
                <p style="margin:8px 0 0 0;text-align:center;">
                  <a href="${confirmationUrl}" 
                     style="color:#748C69;font-family:'Lora',serif;font-size:12px;word-break:break-all;text-decoration:underline;"
                     target="_blank">
                    ${confirmationUrl}
                  </a>
                </p>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="padding:32px 40px;background-color:#F4F1ED;border-top:1px solid #A8B5A3;">
              <div style="text-align:center;margin-bottom:20px;">
                <div style="width:60px;height:2px;background-color:#D4A373;margin:0 auto 16px;"></div>
              </div>
              
              <p style="color:#748C69;font-family:'Raleway',sans-serif;font-size:12px;line-height:18px;margin:0 0 8px 0;text-align:center;font-weight:300;">
                Si vous n'avez pas demandé à recevoir cet email, vous pouvez l'ignorer en toute sécurité.
              </p>
              
              <p style="color:#748C69;font-family:'Raleway',sans-serif;font-size:12px;line-height:18px;margin:0;text-align:center;font-weight:300;">
                &copy; ${currentYear} ${websiteName}. Tous droits réservés.
              </p>
              
              <div style="text-align:center;margin-top:16px;">
                <a href="${websiteUrl}" 
                   style="color:#748C69;font-family:'Raleway',sans-serif;font-size:12px;text-decoration:underline;font-weight:400;"
                   target="_blank">
                  Visiter mon site web
                </a>
              </div>
            </div>
          </div>
          <!--[if mso | IE]>
              </td>
            </tr>
          </table>
          <![endif]-->
          
          <!-- Preview Text -->
          <div style="display:none;font-size:1px;color:#F4F1ED;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
            Confirmez votre inscription à la newsletter ${websiteName} pour recevoir mes conseils bien-être naturel
          </div>
        </div>
      </body>
    </html>
  `;
}
