// scripts/test-contact-email.ts
import { sendContactEmail } from '../src/lib/email-service';
import type { ContactFormData } from '../src/lib/validation';

console.log('🧪 Test de l\'envoi d\'email de contact...\n');

// Données de test
const testContactData: ContactFormData = {
  name: 'Test Utilisateur',
  email: 'test@example.com',
  subject: 'consultation',
  message: 'Ceci est un message de test pour vérifier que l\'envoi d\'emails de contact fonctionne correctement. Ce message contient plus de 10 caractères comme requis par la validation.'
};

async function testContactEmail() {
  try {
    console.log('📋 Données de test :');
    console.log(`   Nom : ${testContactData.name}`);
    console.log(`   Email : ${testContactData.email}`);
    console.log(`   Sujet : ${testContactData.subject}`);
    console.log(`   Message : ${testContactData.message.substring(0, 50)}...\n`);

    console.log('📤 Envoi de l\'email de test...');
    
    const result = await sendContactEmail(testContactData);
    
    console.log('✅ Email de contact envoyé avec succès !');
    console.log('📧 Résultat :', result);
    
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
      }
    }
    
    return false;
  }
}

// Vérification des variables d'environnement
console.log('🔍 Vérification de la configuration...');
console.log(`   RESEND_API_KEY : ${process.env.RESEND_API_KEY ? '✅ Configurée' : '❌ Manquante'}`);
console.log(`   FROM_EMAIL : ${process.env.FROM_EMAIL || 'notifications@maisonsattvaia.fr'}`);
console.log(`   NODE_ENV : ${process.env.NODE_ENV || 'development'}\n`);

// Exécution du test
testContactEmail().then(success => {
  console.log('\n' + '='.repeat(50));
  console.log(success ? '✅ Test terminé avec succès' : '❌ Test terminé avec des erreurs');
  console.log('='.repeat(50));
}).catch(console.error);
