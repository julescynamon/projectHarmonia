// scripts/deep-email-debug.ts
import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const resend = new Resend(RESEND_API_KEY);

console.log('🔍 Diagnostic approfondi du problème de livraison...\n');

async function testMultipleFromAddresses() {
  console.log('📧 Test avec différentes adresses d\'expédition...\n');
  
  const testAddresses = [
    'contact@maisonsattvaia.fr',
    'noreply@maisonsattvaia.fr', 
    'hello@maisonsattvaia.fr',
    'info@maisonsattvaia.fr'
  ];
  
  for (const fromAddress of testAddresses) {
    try {
      console.log(`🧪 Test avec ${fromAddress}...`);
      
      const result = await resend.emails.send({
        from: `Test <${fromAddress}>`,
        to: 'naima@maisonsattvaia.fr',
        subject: `🧪 Test depuis ${fromAddress}`,
        text: `Test d'envoi depuis ${fromAddress} - ${new Date().toLocaleString('fr-FR')}`,
        html: `
          <h3>Test d'envoi depuis ${fromAddress}</h3>
          <p>Heure: ${new Date().toLocaleString('fr-FR')}</p>
          <p>Si vous recevez cet email, ${fromAddress} fonctionne !</p>
        `
      });
      
      if (result.error) {
        console.log(`   ❌ Erreur: ${result.error.message}`);
      } else {
        console.log(`   ✅ Envoyé, ID: ${result.data?.id}`);
      }
      
      // Attendre pour éviter les limites de taux
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.log(`   ❌ Exception: ${error}`);
    }
  }
}

async function testToMultipleAddresses() {
  console.log('\n📬 Test vers différentes adresses de destination...\n');
  
  // Test vers une adresse qui fonctionne (référence)
  try {
    console.log('🧪 Test vers julescynamon@hotmail.com (référence)...');
    
    const result1 = await resend.emails.send({
      from: 'Contact Maison Sattvaïa <contact@maisonsattvaia.fr>',
      to: 'julescynamon@hotmail.com',
      subject: '🧪 Test de référence - Hotmail',
      text: `Test de référence vers Hotmail - ${new Date().toLocaleString('fr-FR')}`,
      html: `
        <h3>Test de référence vers Hotmail</h3>
        <p>Heure: ${new Date().toLocaleString('fr-FR')}</p>
        <p>Ce test sert de référence car cette adresse fonctionne.</p>
      `
    });
    
    if (result1.error) {
      console.log(`   ❌ Erreur: ${result1.error.message}`);
    } else {
      console.log(`   ✅ Envoyé vers Hotmail, ID: ${result1.data?.id}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
  } catch (error) {
    console.log(`   ❌ Exception: ${error}`);
  }
  
  // Test vers naima avec différents paramètres
  try {
    console.log('🧪 Test vers naima@maisonsattvaia.fr (simplifié)...');
    
    const result2 = await resend.emails.send({
      from: 'contact@maisonsattvaia.fr', // Sans nom d'affichage
      to: 'naima@maisonsattvaia.fr',
      subject: 'Test simplifie',
      text: `Test simplifié sans HTML - ${new Date().toLocaleString('fr-FR')}`
    });
    
    if (result2.error) {
      console.log(`   ❌ Erreur: ${result2.error.message}`);
    } else {
      console.log(`   ✅ Envoyé vers naima (simplifié), ID: ${result2.data?.id}`);
    }
    
  } catch (error) {
    console.log(`   ❌ Exception: ${error}`);
  }
}

async function checkDomainReputation() {
  console.log('\n🌐 Vérifications de réputation du domaine...\n');
  
  console.log('🔍 Points à vérifier manuellement :');
  console.log('   1. Allez sur https://mxtoolbox.com/blacklists.aspx');
  console.log('   2. Entrez "maisonsattvaia.fr" pour vérifier les blacklists');
  console.log('   3. Vérifiez https://postmaster.google.com/ si vous avez Gmail');
  console.log('   4. Vérifiez https://senderscore.org/ pour votre réputation');
  console.log('');
  
  console.log('📧 Vérifications côté OVH à faire :');
  console.log('   1. Connectez-vous à votre webmail OVH directement');
  console.log('   2. Vérifiez que naima@maisonsattvaia.fr existe et est active');
  console.log('   3. Vérifiez l\'espace de stockage disponible');
  console.log('   4. Vérifiez les règles de filtrage anti-spam');
  console.log('   5. Vérifiez les redirections d\'emails');
  console.log('   6. Testez en envoyant un email depuis une autre adresse');
}

async function suggestAlternatives() {
  console.log('\n💡 Solutions alternatives à tester :\n');
  
  console.log('🔄 Option 1 - Changer temporairement l\'adresse de réception :');
  console.log('   • Modifiez le code pour envoyer vers julescynamon@hotmail.com');
  console.log('   • Cela confirmera que le problème vient de naima@maisonsattvaia.fr');
  console.log('');
  
  console.log('📞 Option 2 - Contacter le support OVH :');
  console.log('   • Mentionnez que vous ne recevez pas d\'emails externes');
  console.log('   • Demandez s\'il y a des blocages sur votre domaine');
  console.log('   • Vérifiez les logs côté serveur OVH');
  console.log('');
  
  console.log('🔧 Option 3 - Créer une nouvelle adresse email :');
  console.log('   • Créez support@maisonsattvaia.fr ou admin@maisonsattvaia.fr');
  console.log('   • Testez avec cette nouvelle adresse');
  console.log('');
  
  console.log('📊 Option 4 - Utiliser un service de monitoring :');
  console.log('   • https://www.mail-tester.com/ pour tester la délivrabilité');
  console.log('   • Envoyez un email vers leur adresse de test');
}

async function main() {
  if (!RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY non configurée');
    return;
  }
  
  console.log('🚀 Diagnostic approfondi du problème de livraison...\n');
  
  await testMultipleFromAddresses();
  await testToMultipleAddresses();
  await checkDomainReputation();
  await suggestAlternatives();
  
  console.log('\n' + '='.repeat(70));
  console.log('🎯 CONCLUSION :');
  console.log('   Le problème semble être côté OVH/naima@maisonsattvaia.fr');
  console.log('   Resend envoie bien, mais la livraison finale échoue');
  console.log('   Vérifiez immédiatement votre configuration OVH');
  console.log('='.repeat(70));
}

main().catch(console.error);
