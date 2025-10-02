// scripts/debug-email-delivery.ts
import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const resend = new Resend(RESEND_API_KEY);

console.log('🔍 Diagnostic avancé de la livraison d\'emails...\n');

async function checkEmailDelivery() {
  try {
    console.log('📧 Test avec différentes adresses de destination...\n');
    
    // Test 1: Email vers naima@maisonsattvaia.fr
    console.log('1️⃣ Test vers naima@maisonsattvaia.fr...');
    const result1 = await resend.emails.send({
      from: 'La Maison Sattvaïa <notifications@maisonsattvaia.fr>',
      to: 'naima@maisonsattvaia.fr',
      subject: '🔍 Test de livraison - naima@maisonsattvaia.fr',
      html: `
        <h2>Test de livraison d'email</h2>
        <p>Ceci est un test pour vérifier la livraison vers naima@maisonsattvaia.fr</p>
        <p><strong>Heure d'envoi :</strong> ${new Date().toLocaleString('fr-FR')}</p>
        <p><strong>ID de test :</strong> TEST-NAIMA-${Date.now()}</p>
      `,
      text: `Test de livraison vers naima@maisonsattvaia.fr - ${new Date().toLocaleString('fr-FR')}`
    });
    
    if (result1.error) {
      console.log('   ❌ Erreur:', result1.error);
    } else {
      console.log('   ✅ Envoyé avec succès, ID:', result1.data?.id);
    }
    
    // Test 2: Email vers une adresse Gmail pour comparaison
    console.log('\n2️⃣ Test vers une adresse Gmail (pour comparaison)...');
    const testGmail = 'test.harmonia.debug@gmail.com'; // Vous pouvez changer cette adresse
    
    const result2 = await resend.emails.send({
      from: 'La Maison Sattvaïa <notifications@maisonsattvaia.fr>',
      to: testGmail,
      subject: '🔍 Test de livraison - Gmail',
      html: `
        <h2>Test de livraison d'email</h2>
        <p>Ceci est un test pour comparer la livraison avec Gmail</p>
        <p><strong>Heure d'envoi :</strong> ${new Date().toLocaleString('fr-FR')}</p>
        <p><strong>ID de test :</strong> TEST-GMAIL-${Date.now()}</p>
      `,
      text: `Test de livraison vers Gmail - ${new Date().toLocaleString('fr-FR')}`
    });
    
    if (result2.error) {
      console.log('   ❌ Erreur:', result2.error);
    } else {
      console.log('   ✅ Envoyé avec succès, ID:', result2.data?.id);
    }
    
    // Test 3: Email avec différents paramètres
    console.log('\n3️⃣ Test avec paramètres différents...');
    const result3 = await resend.emails.send({
      from: 'notifications@maisonsattvaia.fr', // Sans nom d'affichage
      to: 'naima@maisonsattvaia.fr',
      subject: 'Test simple - Sans HTML',
      text: `Test simple en texte brut - ${new Date().toLocaleString('fr-FR')}`
    });
    
    if (result3.error) {
      console.log('   ❌ Erreur:', result3.error);
    } else {
      console.log('   ✅ Envoyé avec succès, ID:', result3.data?.id);
    }
    
    console.log('\n📊 Résumé des tests :');
    console.log('   • Test 1 (naima@maisonsattvaia.fr avec HTML) :', result1.error ? '❌' : '✅');
    console.log('   • Test 2 (Gmail pour comparaison) :', result2.error ? '❌' : '✅');
    console.log('   • Test 3 (naima@maisonsattvaia.fr texte simple) :', result3.error ? '❌' : '✅');
    
    return { result1, result2, result3 };
    
  } catch (error) {
    console.error('❌ Erreur lors des tests:', error);
    return null;
  }
}

async function checkResendLogs() {
  console.log('\n📋 Instructions pour vérifier les logs Resend :');
  console.log('   1. Allez sur https://resend.com/logs');
  console.log('   2. Cherchez les emails envoyés vers naima@maisonsattvaia.fr');
  console.log('   3. Vérifiez le statut de livraison (delivered, bounced, etc.)');
  console.log('   4. Regardez les détails de chaque email');
}

async function checkEmailConfiguration() {
  console.log('\n🔧 Vérifications recommandées côté OVH :');
  console.log('   1. Vérifiez que la boîte naima@maisonsattvaia.fr existe');
  console.log('   2. Vérifiez l\'espace de stockage de la boîte');
  console.log('   3. Vérifiez les règles de filtrage/anti-spam');
  console.log('   4. Vérifiez les redirections d\'emails');
  console.log('   5. Testez l\'envoi d\'un email manuel vers cette adresse');
}

async function main() {
  if (!RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY non configurée');
    return;
  }
  
  const results = await checkEmailDelivery();
  
  await checkResendLogs();
  await checkEmailConfiguration();
  
  console.log('\n' + '='.repeat(60));
  console.log('🎯 Actions recommandées :');
  console.log('   1. Vérifiez immédiatement les logs Resend pour ces tests');
  console.log('   2. Vérifiez votre boîte naima@maisonsattvaia.fr ET les spams');
  console.log('   3. Si Gmail reçoit mais pas naima@, le problème est côté OVH');
  console.log('   4. Contactez le support OVH si nécessaire');
  console.log('='.repeat(60));
}

main().catch(console.error);
