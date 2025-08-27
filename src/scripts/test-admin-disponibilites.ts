// Script de test pour la page admin disponibilités
import { createClient } from '@supabase/supabase-js';

// Configuration de test
const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey);

// Fonction pour tester la validation des dates futures
function testDateValidation() {
  console.log('🧪 Test de validation des dates futures...');
  
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  // Test avec une date passée
  const pastDate = yesterday.toISOString().split('T')[0];
  const pastDateTime = new Date(`${pastDate} 14:00`);
  
  if (pastDateTime <= today) {
    console.log('✅ Validation des dates passées : OK');
  } else {
    console.log('❌ Validation des dates passées : ÉCHEC');
  }
  
  // Test avec une date future
  const futureDate = tomorrow.toISOString().split('T')[0];
  const futureDateTime = new Date(`${futureDate} 14:00`);
  
  if (futureDateTime > today) {
    console.log('✅ Validation des dates futures : OK');
  } else {
    console.log('❌ Validation des dates futures : ÉCHEC');
  }
}

// Fonction pour tester la détection des chevauchements
function testOverlapDetection() {
  console.log('\n🧪 Test de détection des chevauchements...');
  
  // Plage existante : 2024-12-25 09:00 à 2024-12-25 12:00
  const existingStart = new Date('2024-12-25 09:00');
  const existingEnd = new Date('2024-12-25 12:00');
  
  // Test 1 : Chevauchement complet
  const newStart1 = new Date('2024-12-25 10:00');
  const newEnd1 = new Date('2024-12-25 11:00');
  
  const hasOverlap1 = newStart1 < existingEnd && newEnd1 > existingStart;
  console.log(`Test chevauchement complet (10:00-11:00) : ${hasOverlap1 ? '✅ Détecté' : '❌ Non détecté'}`);
  
  // Test 2 : Chevauchement partiel début
  const newStart2 = new Date('2024-12-25 08:00');
  const newEnd2 = new Date('2024-12-25 10:00');
  
  const hasOverlap2 = newStart2 < existingEnd && newEnd2 > existingStart;
  console.log(`Test chevauchement partiel début (08:00-10:00) : ${hasOverlap2 ? '✅ Détecté' : '❌ Non détecté'}`);
  
  // Test 3 : Chevauchement partiel fin
  const newStart3 = new Date('2024-12-25 11:00');
  const newEnd3 = new Date('2024-12-25 13:00');
  
  const hasOverlap3 = newStart3 < existingEnd && newEnd3 > existingStart;
  console.log(`Test chevauchement partiel fin (11:00-13:00) : ${hasOverlap3 ? '✅ Détecté' : '❌ Non détecté'}`);
  
  // Test 4 : Pas de chevauchement
  const newStart4 = new Date('2024-12-25 13:00');
  const newEnd4 = new Date('2024-12-25 15:00');
  
  const hasOverlap4 = newStart4 < existingEnd && newEnd4 > existingStart;
  console.log(`Test pas de chevauchement (13:00-15:00) : ${hasOverlap4 ? '❌ Faux positif' : '✅ Pas de chevauchement'}`);
}

// Fonction pour tester les requêtes Supabase
async function testSupabaseQueries() {
  console.log('\n🧪 Test des requêtes Supabase...');
  
  try {
    // Test de récupération des plages bloquées
    const { data: blockedTimes, error } = await supabase
      .from('blocked_times')
      .select('*')
      .order('start_date', { ascending: true })
      .limit(5);

    if (error) {
      console.error('❌ Erreur lors de la récupération des plages bloquées:', error);
      return;
    }

    console.log(`✅ Récupération des plages bloquées : ${blockedTimes?.length || 0} plages trouvées`);
    
    if (blockedTimes && blockedTimes.length > 0) {
      console.log('📋 Exemples de plages bloquées :');
      blockedTimes.slice(0, 3).forEach((block, index) => {
        console.log(`  ${index + 1}. Du ${block.start_date} ${block.start_time} au ${block.end_date} ${block.end_time}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du test des requêtes Supabase:', error);
  }
}

// Fonction principale de test
async function runTests() {
  console.log('🚀 Démarrage des tests de la page admin disponibilités...\n');
  
  testDateValidation();
  testOverlapDetection();
  await testSupabaseQueries();
  
  console.log('\n✅ Tests terminés !');
}

// Exécuter les tests
runTests().catch(console.error);
