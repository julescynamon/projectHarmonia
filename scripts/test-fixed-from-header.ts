// scripts/test-fixed-from-header.ts
import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const resend = new Resend(RESEND_API_KEY);

console.log('🔧 Test avec correction de l\'en-tête From...\n');

async function testWithFixedFromHeader() {
  try {
    console.log('📧 Test avec contact@maisonsattvaia.fr comme expéditeur...');
    
    // Test 1: Avec la nouvelle adresse d'expédition
    const result1 = await resend.emails.send({
      from: 'Contact Maison Sattvaïa <contact@maisonsattvaia.fr>',
      to: 'naima@maisonsattvaia.fr',
      subject: '🔧 Test avec FROM corrigé',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2d5a27;">🔧 Test avec FROM corrigé</h2>
          <p>Ce test utilise <strong>contact@maisonsattvaia.fr</strong> comme expéditeur au lieu de notifications@maisonsattvaia.fr</p>
          <div style="background: #f0f8f0; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <strong>Configuration testée :</strong><br>
            • From: Contact Maison Sattvaïa &lt;contact@maisonsattvaia.fr&gt;<br>
            • To: naima@maisonsattvaia.fr<br>
            • Reply-To: test@example.com<br>
            • Heure: ${new Date().toLocaleString('fr-FR')}
          </div>
          <p>Cette configuration devrait améliorer la délivrabilité ! 🎯</p>
        </div>
      `,
      text: `
🔧 Test avec FROM corrigé

Ce test utilise contact@maisonsattvaia.fr comme expéditeur au lieu de notifications@maisonsattvaia.fr

Configuration testée :
• From: Contact Maison Sattvaïa <contact@maisonsattvaia.fr>
• To: naima@maisonsattvaia.fr  
• Reply-To: test@example.com
• Heure: ${new Date().toLocaleString('fr-FR')}

Cette configuration devrait améliorer la délivrabilité !
      `,
      replyTo: 'test@example.com'
    });
    
    if (result1.error) {
      console.log('❌ Erreur avec contact@:', result1.error);
      return false;
    } else {
      console.log('✅ Email envoyé avec contact@ !');
      console.log('📧 ID:', result1.data?.id);
    }
    
    // Attendre un peu pour éviter les limites de taux
    console.log('\n⏳ Attente de 3 secondes...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Test 2: Simulation exacte du formulaire de contact
    console.log('\n📝 Test de simulation exacte du formulaire...');
    
    const result2 = await resend.emails.send({
      from: 'Contact Maison Sattvaïa <contact@maisonsattvaia.fr>',
      to: 'naima@maisonsattvaia.fr',
      subject: 'Nouveau message de contact : consultation',
      text: `
Nom : Utilisateur Test
Email : utilisateur.test@example.com
Sujet : consultation

Message :
Bonjour, je souhaiterais prendre rendez-vous pour une consultation. Pouvez-vous me contacter pour convenir d'un créneau ? Merci beaucoup.
      `,
      replyTo: 'utilisateur.test@example.com'
    });
    
    if (result2.error) {
      console.log('❌ Erreur simulation formulaire:', result2.error);
      return false;
    } else {
      console.log('✅ Simulation formulaire envoyée !');
      console.log('📧 ID:', result2.data?.id);
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Erreur lors des tests:', error);
    return false;
  }
}

async function main() {
  if (!RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY non configurée');
    return;
  }
  
  console.log('🚀 Test de la correction de l\'en-tête From...\n');
  
  const success = await testWithFixedFromHeader();
  
  console.log('\n' + '='.repeat(60));
  if (success) {
    console.log('✅ Tests terminés avec succès !');
    console.log('💡 Actions à effectuer :');
    console.log('   1. Créez la boîte email contact@maisonsattvaia.fr dans OVH');
    console.log('   2. Attendez 2-3 minutes pour la livraison');
    console.log('   3. Vérifiez naima@maisonsattvaia.fr (et les spams)');
    console.log('   4. Vérifiez les logs Resend pour le statut "delivered"');
    console.log('   5. Testez le formulaire sur le site');
  } else {
    console.log('❌ Tests terminés avec des erreurs');
    console.log('💡 Vérifiez les erreurs ci-dessus');
  }
  console.log('='.repeat(60));
}

main().catch(console.error);
