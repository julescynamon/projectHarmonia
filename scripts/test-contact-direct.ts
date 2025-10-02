// scripts/test-contact-direct.ts
import { Resend } from 'resend';

// Configuration depuis les variables d'environnement
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || 'notifications@maisonsattvaia.fr';

console.log('🧪 Test direct de l\'envoi d\'email de contact...\n');

// Vérification des variables d'environnement
console.log('🔍 Vérification de la configuration...');
console.log(`   RESEND_API_KEY : ${RESEND_API_KEY ? '✅ Configurée' : '❌ Manquante'}`);
console.log(`   FROM_EMAIL : ${FROM_EMAIL}`);

if (!RESEND_API_KEY) {
  console.error('❌ RESEND_API_KEY n\'est pas configurée !');
  process.exit(1);
}

// Initialisation de Resend
const resend = new Resend(RESEND_API_KEY);

// Données de test (identiques au formulaire de contact)
const testContactData = {
  name: 'Test Utilisateur',
  email: 'test@example.com',
  subject: 'consultation',
  message: 'Ceci est un message de test pour vérifier que l\'envoi d\'emails de contact fonctionne correctement. Ce message contient plus de 10 caractères comme requis par la validation.'
};

async function testContactEmailDirect() {
  try {
    console.log('\n📋 Données de test :');
    console.log(`   Nom : ${testContactData.name}`);
    console.log(`   Email : ${testContactData.email}`);
    console.log(`   Sujet : ${testContactData.subject}`);
    console.log(`   Message : ${testContactData.message.substring(0, 50)}...\n`);

    console.log('📤 Envoi de l\'email de contact...');
    
    // Reproduction exacte de la logique de sendContactEmail
    const emailData = {
      from: `La Maison Sattvaïa <${FROM_EMAIL}>`,
      to: 'naima@maisonsattvaia.fr',
      subject: `Nouveau message de contact : ${testContactData.subject}`,
      text: `
Nom : ${testContactData.name}
Email : ${testContactData.email}
Sujet : ${testContactData.subject}

Message :
${testContactData.message}
      `,
      replyTo: testContactData.email,
    };

    console.log('📧 Configuration de l\'email :');
    console.log(`   De : ${emailData.from}`);
    console.log(`   À : ${emailData.to}`);
    console.log(`   Sujet : ${emailData.subject}`);
    console.log(`   Reply-To : ${emailData.replyTo}\n`);

    const result = await resend.emails.send(emailData);
    
    if (result.error) {
      throw new Error(`Erreur lors de l'envoi de l'email: ${result.error.message}`);
    }

    console.log('✅ Email de contact envoyé avec succès !');
    console.log('📧 Résultat :', result.data);
    
    console.log('\n💡 Vérifiez la boîte email naima@maisonsattvaia.fr pour confirmer la réception.');
    
    return true;
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email de contact :', error);
    
    if (error instanceof Error) {
      console.log('\n🔍 Message d\'erreur :', error.message);
      
      // Analyser les erreurs courantes
      if (error.message.includes('RESEND_API_KEY')) {
        console.log('💡 Problème de configuration de la clé API Resend.');
      } else if (error.message.includes('Domain')) {
        console.log('💡 Problème de configuration du domaine.');
      } else if (error.message.includes('Rate limit')) {
        console.log('💡 Limite de taux atteinte.');
      } else if (error.message.includes('Invalid')) {
        console.log('💡 Données invalides ou clé API incorrecte.');
      }
    }
    
    return false;
  }
}

// Exécution du test
testContactEmailDirect().then(success => {
  console.log('\n' + '='.repeat(50));
  console.log(success ? '✅ Test terminé avec succès' : '❌ Test terminé avec des erreurs');
  console.log('='.repeat(50));
}).catch(console.error);
