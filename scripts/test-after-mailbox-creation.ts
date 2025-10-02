// scripts/test-after-mailbox-creation.ts
import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const resend = new Resend(RESEND_API_KEY);

console.log('🧪 Test après création de la boîte email naima@maisonsattvaia.fr...\n');

async function testAfterMailboxCreation() {
  try {
    console.log('📧 Envoi d\'un email de test...');
    
    const result = await resend.emails.send({
      from: 'La Maison Sattvaïa <notifications@maisonsattvaia.fr>',
      to: 'naima@maisonsattvaia.fr',
      subject: '✅ Test après création boîte email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2d5a27;">✅ Test de livraison</h2>
          <p>Ce test est effectué après la création de la boîte email naima@maisonsattvaia.fr</p>
          <div style="background: #f0f8f0; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <strong>Détails du test :</strong><br>
            • Heure d'envoi : ${new Date().toLocaleString('fr-FR')}<br>
            • Expéditeur : notifications@maisonsattvaia.fr<br>
            • Destinataire : naima@maisonsattvaia.fr<br>
            • Test après création de la boîte email
          </div>
          <p><strong>Si vous recevez cet email, le problème est résolu ! 🎉</strong></p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 12px;">
            Email de test automatique - La Maison Sattvaïa
          </p>
        </div>
      `,
      text: `
✅ Test après création de la boîte email

Ce test est effectué après la création de la boîte email naima@maisonsattvaia.fr

Détails du test :
• Heure d'envoi : ${new Date().toLocaleString('fr-FR')}
• Expéditeur : notifications@maisonsattvaia.fr
• Destinataire : naima@maisonsattvaia.fr

Si vous recevez cet email, le problème est résolu ! 🎉
      `
    });
    
    if (result.error) {
      console.log('❌ Erreur lors de l\'envoi:', result.error);
      return false;
    } else {
      console.log('✅ Email envoyé avec succès !');
      console.log('📧 ID de l\'email:', result.data?.id);
      console.log('⏰ Heure d\'envoi:', new Date().toLocaleString('fr-FR'));
      console.log('\n💡 Actions à effectuer :');
      console.log('   1. Attendez 1-2 minutes pour la livraison');
      console.log('   2. Vérifiez votre boîte naima@maisonsattvaia.fr');
      console.log('   3. Vérifiez aussi le dossier spam/indésirables');
      console.log('   4. Si vous ne recevez rien, vérifiez les logs Resend');
      return true;
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
    return false;
  }
}

async function testContactFormSimulation() {
  try {
    console.log('\n📝 Test de simulation du formulaire de contact...');
    
    const result = await resend.emails.send({
      from: 'La Maison Sattvaïa <notifications@maisonsattvaia.fr>',
      to: 'naima@maisonsattvaia.fr',
      subject: 'Nouveau message de contact : consultation',
      text: `
Nom : Test Utilisateur
Email : test@example.com
Sujet : consultation

Message :
Ceci est un test du formulaire de contact après la création de la boîte email. Ce message simule exactement ce qui se passe quand quelqu'un remplit le formulaire sur votre site.
      `,
      replyTo: 'test@example.com',
    });
    
    if (result.error) {
      console.log('❌ Erreur lors de la simulation:', result.error);
      return false;
    } else {
      console.log('✅ Simulation du formulaire envoyée avec succès !');
      console.log('📧 ID de l\'email:', result.data?.id);
      return true;
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la simulation:', error);
    return false;
  }
}

async function main() {
  if (!RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY non configurée');
    return;
  }
  
  console.log('🚀 Démarrage des tests après création de la boîte email...\n');
  
  const test1 = await testAfterMailboxCreation();
  const test2 = await testContactFormSimulation();
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 Résultats des tests :');
  console.log(`   • Test de base : ${test1 ? '✅ Réussi' : '❌ Échoué'}`);
  console.log(`   • Simulation formulaire : ${test2 ? '✅ Réussi' : '❌ Échoué'}`);
  
  if (test1 && test2) {
    console.log('\n🎉 Tous les tests sont réussis !');
    console.log('💡 Si vous recevez ces emails, votre formulaire de contact fonctionne maintenant.');
  } else {
    console.log('\n⚠️  Certains tests ont échoué.');
    console.log('💡 Vérifiez les erreurs ci-dessus et les logs Resend.');
  }
  
  console.log('\n🔍 Pour vérifier le statut dans Resend :');
  console.log('   1. Allez sur https://resend.com/logs');
  console.log('   2. Cherchez les emails récents vers naima@maisonsattvaia.fr');
  console.log('   3. Vérifiez si le statut est maintenant "delivered" au lieu de "bounced"');
  console.log('='.repeat(60));
}

main().catch(console.error);
