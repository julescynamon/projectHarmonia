// scripts/analyze-resend-logs.ts
import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const resend = new Resend(RESEND_API_KEY);

console.log('🔍 Analyse des logs Resend récents...\n');

async function analyzeRecentLogs() {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('📊 Analyse des 15 derniers emails :\n');
      
      if (data.data && Array.isArray(data.data)) {
        data.data.slice(0, 15).forEach((email: any, index: number) => {
          console.log(`${index + 1}. ID: ${email.id}`);
          console.log(`   À: ${email.to}`);
          console.log(`   De: ${email.from}`);
          console.log(`   Sujet: ${email.subject}`);
          console.log(`   Statut: ${email.last_event || 'N/A'}`);
          console.log(`   Date: ${new Date(email.created_at).toLocaleString('fr-FR')}`);
          console.log('   ---');
        });
        
        console.log('\n📈 Analyse des statuts :');
        const statusCount: { [key: string]: number } = {};
        data.data.slice(0, 15).forEach((email: any) => {
          const status = email.last_event || 'N/A';
          statusCount[status] = (statusCount[status] || 0) + 1;
        });
        
        Object.entries(statusCount).forEach(([status, count]) => {
          console.log(`   ${status}: ${count} emails`);
        });
      }
      
      return data;
    } else {
      console.log('❌ Erreur:', response.status, await response.text());
      return null;
    }
    
  } catch (error) {
    console.log('❌ Erreur:', error);
    return null;
  }
}

async function explainEndpoints() {
  console.log('\n🔍 Explication des endpoints dans vos logs :\n');
  
  console.log('📋 Types d\'endpoints visibles :');
  console.log('   • /emails (POST) - Envoi d\'un nouvel email');
  console.log('   • /emails (GET) - Récupération de la liste des emails');
  console.log('   • /emails/{id} (GET) - Récupération d\'un email spécifique');
  console.log('');
  
  console.log('🎯 Pourquoi certains ont des IDs et d\'autres non :');
  console.log('   • Status 200 + /emails (POST) = Email envoyé avec succès');
  console.log('   • Status 200 + /emails (GET) = Liste récupérée avec succès');
  console.log('   • Status 401 + /emails/{id} (GET) = Tentative de récupération d\'un email spécifique');
  console.log('   • Status 401 = Clé API limitée (send-only)');
  console.log('');
  
  console.log('💡 Dans votre cas :');
  console.log('   • Les POST /emails avec 200 = Vos emails de contact envoyés');
  console.log('   • Les GET /emails avec 200 = Nos scripts qui récupèrent la liste');
  console.log('   • Les GET /emails/{id} avec 401 = Nos tentatives de récupération détaillée');
}

async function main() {
  if (!RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY non configurée');
    return;
  }
  
  await analyzeRecentLogs();
  await explainEndpoints();
  
  console.log('\n' + '='.repeat(60));
  console.log('🎯 Résumé :');
  console.log('   • Les logs montrent vos envois d\'emails (POST /emails)');
  console.log('   • Les erreurs 401 viennent de nos scripts de diagnostic');
  console.log('   • Votre clé API est configurée en "send-only"');
  console.log('   • C\'est normal et sécurisé pour la production');
  console.log('='.repeat(60));
}

main().catch(console.error);
