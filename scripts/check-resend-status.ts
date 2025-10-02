// scripts/check-resend-status.ts
import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const resend = new Resend(RESEND_API_KEY);

console.log('🔍 Vérification du statut des emails dans Resend...\n');

// IDs des emails de test récents
const emailIds = [
  '33ab4d13-e8ac-42ac-a79b-22e1865b7f46', // Test vers naima@maisonsattvaia.fr
  'a6f4a06c-c098-4045-bf4c-ab05a048d188', // Test vers Gmail
];

async function checkEmailStatus(emailId: string) {
  try {
    console.log(`📧 Vérification de l'email ID: ${emailId}`);
    
    // Note: L'API Resend ne permet pas toujours de récupérer le statut d'un email spécifique
    // mais nous pouvons essayer d'obtenir des informations
    
    const response = await fetch(`https://api.resend.com/emails/${emailId}`, {
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('   ✅ Statut récupéré:', data);
      return data;
    } else {
      const errorText = await response.text();
      console.log(`   ⚠️  Impossible de récupérer le statut (${response.status}):`, errorText);
      return null;
    }
    
  } catch (error) {
    console.log('   ❌ Erreur lors de la vérification:', error);
    return null;
  }
}

async function listRecentEmails() {
  try {
    console.log('\n📋 Récupération des emails récents...');
    
    const response = await fetch('https://api.resend.com/emails', {
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('   ✅ Emails récents récupérés:');
      
      if (data.data && Array.isArray(data.data)) {
        data.data.slice(0, 10).forEach((email: any, index: number) => {
          console.log(`   ${index + 1}. ID: ${email.id}`);
          console.log(`      À: ${email.to}`);
          console.log(`      Sujet: ${email.subject}`);
          console.log(`      Statut: ${email.last_event || 'N/A'}`);
          console.log(`      Date: ${email.created_at}`);
          console.log('      ---');
        });
      }
      
      return data;
    } else {
      const errorText = await response.text();
      console.log(`   ❌ Erreur (${response.status}):`, errorText);
      return null;
    }
    
  } catch (error) {
    console.log('   ❌ Erreur lors de la récupération:', error);
    return null;
  }
}

async function main() {
  if (!RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY non configurée');
    return;
  }
  
  // Vérifier le statut des emails spécifiques
  for (const emailId of emailIds) {
    await checkEmailStatus(emailId);
    console.log('');
  }
  
  // Lister les emails récents
  await listRecentEmails();
  
  console.log('\n' + '='.repeat(60));
  console.log('🎯 Prochaines étapes :');
  console.log('   1. Vérifiez manuellement les logs sur https://resend.com/logs');
  console.log('   2. Cherchez les emails vers naima@maisonsattvaia.fr');
  console.log('   3. Vérifiez le statut : delivered, bounced, spam, etc.');
  console.log('   4. Si "delivered", le problème est côté OVH');
  console.log('   5. Si "bounced", vérifiez que la boîte existe');
  console.log('='.repeat(60));
}

main().catch(console.error);
