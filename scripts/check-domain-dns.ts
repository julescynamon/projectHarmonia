// scripts/check-domain-dns.ts
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const domain = 'maisonsattvaia.fr';

console.log(`🌐 Vérification DNS pour le domaine : ${domain}\n`);

async function checkDNSRecord(type: string, record: string) {
  try {
    console.log(`🔍 Vérification ${type} : ${record}`);
    const { stdout, stderr } = await execAsync(`dig ${type} ${record} +short`);
    
    if (stderr) {
      console.log(`   ⚠️  Erreur : ${stderr.trim()}`);
      return false;
    }
    
    const result = stdout.trim();
    if (result) {
      console.log(`   ✅ Résultat : ${result}`);
      return true;
    } else {
      console.log(`   ❌ Aucun enregistrement trouvé`);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ Erreur lors de la vérification : ${error}`);
    return false;
  }
}

async function checkEmailConfiguration() {
  console.log('📧 Vérification de la configuration email...\n');
  
  // Vérification SPF
  console.log('1. Enregistrement SPF :');
  await checkDNSRecord('TXT', domain);
  
  console.log('\n2. Enregistrements MX :');
  await checkDNSRecord('MX', domain);
  
  console.log('\n3. Enregistrements DKIM (Resend) :');
  // Les enregistrements DKIM de Resend sont généralement sous cette forme
  await checkDNSRecord('TXT', `resend._domainkey.${domain}`);
  
  console.log('\n4. Enregistrement DMARC :');
  await checkDNSRecord('TXT', `_dmarc.${domain}`);
  
  console.log('\n📝 Configuration recommandée pour Resend + OVH :');
  console.log('   SPF : v=spf1 include:_spf.resend.com ~all');
  console.log('   DKIM : Ajoutez les enregistrements fournis par Resend dans votre dashboard');
  console.log('   DMARC : v=DMARC1; p=none; rua=mailto:dmarc@' + domain);
  
  console.log('\n💡 Instructions :');
  console.log('   1. Connectez-vous à votre dashboard Resend');
  console.log('   2. Allez dans "Domains" et vérifiez le statut de ' + domain);
  console.log('   3. Ajoutez les enregistrements DNS manquants dans votre panneau OVH');
  console.log('   4. Attendez la propagation DNS (peut prendre jusqu\'à 48h)');
}

// Vérification de la disponibilité de dig
async function checkDigAvailability() {
  try {
    await execAsync('which dig');
    return true;
  } catch {
    console.log('⚠️  L\'outil "dig" n\'est pas disponible. Installation recommandée :');
    console.log('   macOS : brew install bind');
    console.log('   Ubuntu/Debian : sudo apt-get install dnsutils');
    return false;
  }
}

async function main() {
  const digAvailable = await checkDigAvailability();
  
  if (digAvailable) {
    await checkEmailConfiguration();
  } else {
    console.log('\n📝 Vérifications manuelles recommandées :');
    console.log('   1. Vérifiez votre dashboard Resend pour le statut du domaine');
    console.log('   2. Consultez votre panneau OVH pour les enregistrements DNS');
    console.log('   3. Utilisez un outil en ligne comme mxtoolbox.com pour vérifier vos enregistrements');
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ Vérification DNS terminée');
  console.log('='.repeat(60));
}

main().catch(console.error);
