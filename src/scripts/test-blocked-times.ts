// Script de test pour vérifier les données dans blocked_times
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Variables d\'environnement Supabase manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testBlockedTimes() {
  console.log('🔍 Test de la table blocked_times...');
  
  try {
    // Test 1: Compter les lignes
    const { count, error: countError } = await supabase
      .from('blocked_times')
      .select('*', { count: 'exact', head: true });
    
    console.log('📊 Nombre de lignes dans blocked_times:', count);
    if (countError) console.error('Erreur count:', countError);
    
    // Test 2: Récupérer toutes les données
    const { data, error } = await supabase
      .from('blocked_times')
      .select('*');
    
    if (error) {
      console.error('❌ Erreur lors de la récupération:', error);
      return;
    }
    
    console.log('📋 Données dans blocked_times:');
    console.log(JSON.stringify(data, null, 2));
    
    // Test 3: Tester la requête pour une date spécifique
    const testDate = '2025-09-15';
    console.log(`\n🔍 Test pour la date ${testDate}:`);
    
    const { data: filteredData, error: filterError } = await supabase
      .from('blocked_times')
      .select('*')
      .lte('start_date', testDate)
      .gte('end_date', testDate);
    
    if (filterError) {
      console.error('❌ Erreur filtrage:', filterError);
    } else {
      console.log('✅ Périodes trouvées pour cette date:', filteredData);
    }
    
  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

testBlockedTimes();
