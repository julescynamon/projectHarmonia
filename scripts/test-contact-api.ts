// scripts/test-contact-api.ts
console.log('🧪 Test de l\'API de contact en production...\n');

const API_URL = 'https://project-harmonia.vercel.app/api/contact';
// const API_URL = 'http://localhost:4321/api/contact'; // Pour les tests locaux

// Données de test identiques au formulaire
const testData = {
  name: 'Test Diagnostic',
  email: 'test@example.com',
  subject: 'consultation',
  message: 'Ceci est un test automatique pour diagnostiquer le problème d\'envoi d\'emails de contact. Ce message contient suffisamment de caractères pour passer la validation.'
};

async function testContactAPI() {
  try {
    console.log('📋 Données de test :');
    console.log(`   URL : ${API_URL}`);
    console.log(`   Nom : ${testData.name}`);
    console.log(`   Email : ${testData.email}`);
    console.log(`   Sujet : ${testData.subject}`);
    console.log(`   Message : ${testData.message.substring(0, 50)}...\n`);

    console.log('📤 Envoi de la requête à l\'API...');
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Test-Script/1.0'
      },
      body: JSON.stringify(testData)
    });

    console.log(`📊 Statut de la réponse : ${response.status} ${response.statusText}`);
    
    const responseText = await response.text();
    console.log(`📄 Réponse brute : ${responseText}\n`);
    
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ Erreur lors du parsing JSON :', parseError);
      console.log('📄 Contenu de la réponse :', responseText);
      return false;
    }

    if (response.ok) {
      console.log('✅ Requête réussie !');
      console.log('📧 Réponse :', responseData);
      
      if (responseData.success) {
        console.log('🎉 Email envoyé avec succès selon l\'API !');
        console.log('💡 Vérifiez la boîte email naima@maisonsattvaia.fr');
        return true;
      } else {
        console.log('⚠️  L\'API indique un échec :', responseData.message);
        return false;
      }
    } else {
      console.error('❌ Erreur HTTP :', response.status, response.statusText);
      console.error('📄 Détails :', responseData);
      
      // Analyser les erreurs courantes
      if (response.status === 400) {
        console.log('💡 Erreur 400 : Données invalides ou problème de validation');
      } else if (response.status === 500) {
        console.log('💡 Erreur 500 : Problème serveur, probablement lié à l\'envoi d\'email');
      } else if (response.status === 429) {
        console.log('💡 Erreur 429 : Limite de taux atteinte');
      }
      
      return false;
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la requête :', error);
    
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        console.log('💡 Problème de connexion réseau ou URL incorrecte');
      } else if (error.message.includes('JSON')) {
        console.log('💡 Problème de format de réponse');
      }
    }
    
    return false;
  }
}

// Test avec différentes configurations
async function runTests() {
  console.log('🚀 Démarrage des tests API...\n');
  
  const success = await testContactAPI();
  
  console.log('\n' + '='.repeat(50));
  if (success) {
    console.log('✅ Test API terminé avec succès');
    console.log('💡 Si vous ne recevez toujours pas l\'email, vérifiez :');
    console.log('   - Votre boîte de réception naima@maisonsattvaia.fr');
    console.log('   - Le dossier spam/indésirables');
    console.log('   - Les logs Resend dans votre dashboard');
  } else {
    console.log('❌ Test API terminé avec des erreurs');
    console.log('💡 Vérifiez les logs ci-dessus pour identifier le problème');
  }
  console.log('='.repeat(50));
}

runTests().catch(console.error);
