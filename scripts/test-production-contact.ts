// scripts/test-production-contact.ts
console.log('🧪 Test de l\'API de contact sur maisonsattvaia.fr...\n');

const API_URL = 'https://maisonsattvaia.fr/api/contact';

// Données de test identiques au formulaire
const testData = {
  name: 'Test Diagnostic Production',
  email: 'test@example.com',
  subject: 'consultation',
  message: 'Ceci est un test automatique pour diagnostiquer le problème d\'envoi d\'emails de contact sur le site de production. Ce message contient suffisamment de caractères pour passer la validation.'
};

async function testProductionContactAPI() {
  try {
    console.log('📋 Test de production :');
    console.log(`   URL : ${API_URL}`);
    console.log(`   Nom : ${testData.name}`);
    console.log(`   Email : ${testData.email}`);
    console.log(`   Sujet : ${testData.subject}`);
    console.log(`   Message : ${testData.message.substring(0, 50)}...\n`);

    console.log('📤 Envoi de la requête à l\'API de production...');
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Test-Script-Production/1.0',
        'Accept': 'application/json'
      },
      body: JSON.stringify(testData)
    });

    console.log(`📊 Statut de la réponse : ${response.status} ${response.statusText}`);
    
    // Afficher les headers de réponse pour debug
    console.log('📋 Headers de réponse :');
    response.headers.forEach((value, key) => {
      console.log(`   ${key}: ${value}`);
    });
    
    const responseText = await response.text();
    console.log(`📄 Réponse brute : ${responseText}\n`);
    
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ Erreur lors du parsing JSON :', parseError);
      console.log('📄 Contenu de la réponse (non-JSON) :', responseText);
      
      // Vérifier si c'est une page HTML d'erreur
      if (responseText.includes('<html>') || responseText.includes('<!DOCTYPE')) {
        console.log('🌐 La réponse semble être une page HTML, pas une réponse API JSON');
        console.log('💡 Cela peut indiquer que l\'endpoint API n\'existe pas ou qu\'il y a une redirection');
      }
      
      return false;
    }

    if (response.ok) {
      console.log('✅ Requête réussie !');
      console.log('📧 Réponse :', responseData);
      
      if (responseData.success) {
        console.log('🎉 Email envoyé avec succès selon l\'API de production !');
        console.log('💡 Vérifiez la boîte email naima@maisonsattvaia.fr');
        console.log('📧 Si vous ne recevez pas l\'email, vérifiez aussi les spams');
        return true;
      } else {
        console.log('⚠️  L\'API indique un échec :', responseData.message);
        if (responseData.errors) {
          console.log('📋 Erreurs détaillées :', responseData.errors);
        }
        return false;
      }
    } else {
      console.error('❌ Erreur HTTP :', response.status, response.statusText);
      console.error('📄 Détails :', responseData);
      
      // Analyser les erreurs courantes
      if (response.status === 400) {
        console.log('💡 Erreur 400 : Données invalides ou problème de validation');
        if (responseData.errors) {
          console.log('📋 Erreurs de validation :', responseData.errors);
        }
      } else if (response.status === 500) {
        console.log('💡 Erreur 500 : Problème serveur, probablement lié à l\'envoi d\'email');
        console.log('🔍 Vérifiez les variables d\'environnement sur le serveur de production');
      } else if (response.status === 429) {
        console.log('💡 Erreur 429 : Limite de taux atteinte');
      } else if (response.status === 404) {
        console.log('💡 Erreur 404 : L\'endpoint API n\'existe pas sur le serveur de production');
      }
      
      return false;
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la requête :', error);
    
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        console.log('💡 Problème de connexion réseau ou CORS');
      } else if (error.message.includes('JSON')) {
        console.log('💡 Problème de format de réponse');
      } else if (error.message.includes('ENOTFOUND')) {
        console.log('💡 Le domaine maisonsattvaia.fr n\'est pas accessible');
      }
    }
    
    return false;
  }
}

// Exécution du test
async function runProductionTest() {
  console.log('🚀 Démarrage du test de production...\n');
  
  const success = await testProductionContactAPI();
  
  console.log('\n' + '='.repeat(60));
  if (success) {
    console.log('✅ Test de production terminé avec succès');
    console.log('🎉 Le formulaire de contact fonctionne en production !');
    console.log('💡 Si vous ne recevez toujours pas l\'email :');
    console.log('   1. Vérifiez votre boîte naima@maisonsattvaia.fr');
    console.log('   2. Vérifiez le dossier spam/indésirables');
    console.log('   3. Vérifiez les logs Resend dans votre dashboard');
    console.log('   4. Vérifiez les variables d\'environnement sur Vercel');
  } else {
    console.log('❌ Test de production terminé avec des erreurs');
    console.log('💡 Actions recommandées :');
    console.log('   1. Vérifiez que le site est bien déployé sur maisonsattvaia.fr');
    console.log('   2. Vérifiez les variables d\'environnement sur le serveur');
    console.log('   3. Vérifiez les logs du serveur de production');
  }
  console.log('='.repeat(60));
}

runProductionTest().catch(console.error);
