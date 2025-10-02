// scripts/test-resend-config.ts
import { Resend } from 'resend';

// Configuration depuis les variables d'environnement
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || 'notifications@maisonsattvaia.fr';
const TEST_EMAIL = process.env.TEST_EMAIL || 'naima@maisonsattvaia.fr';

console.log('🔍 Diagnostic de la configuration Resend...\n');

// Vérification des variables d'environnement
console.log('📋 Variables d\'environnement :');
console.log(`   RESEND_API_KEY: ${RESEND_API_KEY ? '✅ Configurée' : '❌ Manquante'}`);
console.log(`   FROM_EMAIL: ${FROM_EMAIL}`);
console.log(`   TEST_EMAIL: ${TEST_EMAIL}\n`);

if (!RESEND_API_KEY) {
  console.error('❌ RESEND_API_KEY n\'est pas configurée !');
  console.log('💡 Ajoutez votre clé API Resend dans vos variables d\'environnement.');
  process.exit(1);
}

// Initialisation de Resend
const resend = new Resend(RESEND_API_KEY);

async function testResendConfiguration() {
  try {
    console.log('🧪 Test de l\'API Resend...');
    
    // Test 1: Vérifier la validité de la clé API
    console.log('   1. Vérification de la clé API...');
    
    // Test 2: Envoyer un email de test
    console.log('   2. Envoi d\'un email de test...');
    
    const testEmailData = {
      from: FROM_EMAIL,
      to: [TEST_EMAIL],
      subject: '🧪 Test de configuration Resend - La Maison Sattvaïa',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2d5a27;">Test de configuration Resend</h2>
          <p>Ceci est un email de test pour vérifier la configuration Resend.</p>
          <div style="background: #f0f8f0; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <strong>Détails du test :</strong><br>
            • Heure d'envoi : ${new Date().toLocaleString('fr-FR')}<br>
            • Email expéditeur : ${FROM_EMAIL}<br>
            • Email destinataire : ${TEST_EMAIL}
          </div>
          <p>Si vous recevez cet email, la configuration Resend fonctionne correctement ! 🎉</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 12px;">
            Email automatique généré par le script de test de La Maison Sattvaïa
          </p>
        </div>
      `,
      text: `
Test de configuration Resend - La Maison Sattvaïa

Ceci est un email de test pour vérifier la configuration Resend.

Détails du test :
• Heure d'envoi : ${new Date().toLocaleString('fr-FR')}
• Email expéditeur : ${FROM_EMAIL}
• Email destinataire : ${TEST_EMAIL}

Si vous recevez cet email, la configuration Resend fonctionne correctement !
      `
    };

    const result = await resend.emails.send(testEmailData);

    if (result.error) {
      console.error('❌ Erreur lors de l\'envoi :', result.error);
      console.log('\n🔍 Détails de l\'erreur :');
      console.log(JSON.stringify(result.error, null, 2));
      return false;
    }

    console.log('✅ Email de test envoyé avec succès !');
    console.log(`   ID de l'email : ${result.data?.id}`);
    console.log(`   Destinataire : ${TEST_EMAIL}`);
    console.log(`   Expéditeur : ${FROM_EMAIL}\n`);

    console.log('📧 Vérifiez votre boîte email (et les spams) pour confirmer la réception.');
    
    return true;

  } catch (error) {
    console.error('❌ Erreur lors du test :', error);
    
    if (error instanceof Error) {
      console.log('\n🔍 Message d\'erreur :', error.message);
      
      // Analyser les erreurs courantes
      if (error.message.includes('Invalid API key')) {
        console.log('💡 La clé API Resend semble invalide. Vérifiez votre clé API.');
      } else if (error.message.includes('Domain not verified')) {
        console.log('💡 Le domaine n\'est pas vérifié dans Resend. Vérifiez la configuration DNS.');
      } else if (error.message.includes('Rate limit')) {
        console.log('💡 Limite de taux atteinte. Attendez avant de réessayer.');
      }
    }
    
    return false;
  }
}

async function checkDomainConfiguration() {
  console.log('🌐 Vérification de la configuration du domaine...');
  
  try {
    // Extraire le domaine de FROM_EMAIL
    const domain = FROM_EMAIL.split('@')[1];
    console.log(`   Domaine détecté : ${domain}`);
    
    // Note: L'API Resend ne permet pas de vérifier directement les domaines
    // mais nous pouvons donner des conseils
    console.log('\n📝 Configuration DNS requise pour OVH :');
    console.log('   SPF : v=spf1 include:_spf.resend.com ~all');
    console.log('   DKIM : Ajoutez les enregistrements fournis par Resend');
    console.log('   DMARC : v=DMARC1; p=none; rua=mailto:dmarc@' + domain);
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification du domaine :', error);
  }
}

// Exécution du diagnostic
async function runDiagnostic() {
  console.log('🚀 Démarrage du diagnostic Resend...\n');
  
  await checkDomainConfiguration();
  console.log('\n' + '='.repeat(50) + '\n');
  
  const success = await testResendConfiguration();
  
  console.log('\n' + '='.repeat(50));
  console.log(success ? '✅ Diagnostic terminé avec succès' : '❌ Diagnostic terminé avec des erreurs');
  console.log('='.repeat(50));
}

// Exécuter le diagnostic si le script est appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  runDiagnostic().catch(console.error);
}

export { testResendConfiguration, checkDomainConfiguration };
