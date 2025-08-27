// Script de test pour les fonctions de disponibilité (version simplifiée)
import { createClient } from '@supabase/supabase-js';

// Configuration de test
const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey);

// Fonction isDayBlocked simplifiée pour le test
async function isDayBlocked(date: string): Promise<boolean> {
  try {
    const { data: blockedTimes, error: blockedError } = await supabase
      .from('blocked_times')
      .select('*')
      .lte('start_date', date)
      .gte('end_date', date);

    if (blockedError) {
      console.error('Erreur lors de la vérification du jour bloqué:', blockedError);
      return false;
    }

    // Vérifier si une plage couvre toute la journée (00:00 à 23:59)
    if (blockedTimes && blockedTimes.length > 0) {
      for (const block of blockedTimes) {
        // Si la plage commence à 00:00 et finit à 23:59, c'est une journée entière bloquée
        if (block.start_time === '00:00' && block.end_time === '23:59') {
          return true;
        }
        
        // Si la plage couvre toute la journée de travail (par exemple 09:00 à 18:00)
        // on peut considérer que c'est une journée entière bloquée
        if (block.start_time === '09:00' && block.end_time === '18:00') {
          return true;
        }
      }
    }

    return false;
  } catch (error) {
    console.error('Erreur lors de la vérification du jour:', error);
    return false;
  }
}

// Fonction checkAvailability simplifiée pour le test
async function checkAvailability(date: string, time: string): Promise<boolean> {
  try {
    console.log('Vérification de disponibilité pour:', { date, time });

    // Vérifier les rendez-vous existants
    const { data: appointments, error: appointmentsError } = await supabase
      .from('appointments')
      .select('*')
      .eq('date', date)
      .eq('time', time);

    if (appointmentsError) {
      console.error('Erreur lors de la vérification des rendez-vous:', appointmentsError);
      throw appointmentsError;
    }

    console.log('Rendez-vous existants:', appointments);

    // Vérifier les plages bloquées
    const { data: blockedTimes, error: blockedError } = await supabase
      .from('blocked_times')
      .select('*')
      .lte('start_date', date)
      .gte('end_date', date);

    if (blockedError) {
      console.error('Erreur lors de la vérification des plages bloquées:', blockedError);
      throw blockedError;
    }

    console.log('Plages bloquées trouvées:', blockedTimes);

    // Si des rendez-vous existent déjà pour ce créneau
    if (appointments && appointments.length > 0) {
      console.log(`Créneau ${date} ${time} déjà réservé par:`, appointments);
      return false;
    }

    // Vérifier si l'horaire est dans une plage bloquée
    if (blockedTimes && blockedTimes.length > 0) {
      console.log('Vérification des plages bloquées:', blockedTimes);
      
      for (const block of blockedTimes) {
        console.log('Vérification de la plage:', {
          start_date: block.start_date,
          end_date: block.end_date,
          start_time: block.start_time,
          end_time: block.end_time
        });

        // Convertir les heures en minutes pour faciliter la comparaison
        const [blockStartHour, blockStartMin] = block.start_time.split(':').map(Number);
        const [blockEndHour, blockEndMin] = block.end_time.split(':').map(Number);
        const [timeHour, timeMin] = time.split(':').map(Number);

        const blockStartMinutes = blockStartHour * 60 + blockStartMin;
        const blockEndMinutes = blockEndHour * 60 + blockEndMin;
        const timeMinutes = timeHour * 60 + timeMin;

        console.log('Comparaison des minutes:', {
          blockStart: blockStartMinutes,
          blockEnd: blockEndMinutes,
          time: timeMinutes
        });

        if (timeMinutes >= blockStartMinutes && timeMinutes <= blockEndMinutes) {
          console.log(`Créneau ${date} ${time} dans une période bloquée:`, block);
          return false;
        }
      }
    }

    console.log(`Créneau ${date} ${time} disponible`);
    return true;
  } catch (error) {
    console.error('Erreur lors de la vérification des disponibilités:', error);
    throw error;
  }
}

// Fonction de test pour isDayBlocked
async function testIsDayBlocked() {
  console.log('🧪 Test de la fonction isDayBlocked...');
  
  try {
    // Test avec une date future
    const testDate = '2024-12-25';
    const isBlocked = await isDayBlocked(testDate);
    
    console.log(`Date testée: ${testDate}`);
    console.log(`Journée bloquée: ${isBlocked}`);
    
    if (isBlocked) {
      console.log('✅ La fonction détecte correctement une journée bloquée');
    } else {
      console.log('ℹ️ Aucune journée bloquée détectée pour cette date');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du test de isDayBlocked:', error);
  }
}

// Fonction de test pour checkAvailability
async function testCheckAvailability() {
  console.log('\n🧪 Test de la fonction checkAvailability...');
  
  try {
    // Test avec une date et heure futures
    const testDate = '2024-12-25';
    const testTime = '14:00';
    
    const isAvailable = await checkAvailability(testDate, testTime);
    
    console.log(`Date testée: ${testDate}`);
    console.log(`Heure testée: ${testTime}`);
    console.log(`Créneau disponible: ${isAvailable}`);
    
    if (isAvailable) {
      console.log('✅ Le créneau est disponible');
    } else {
      console.log('ℹ️ Le créneau n\'est pas disponible');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du test de checkAvailability:', error);
  }
}

// Fonction principale de test
async function runTests() {
  console.log('🚀 Démarrage des tests de disponibilité...\n');
  
  await testIsDayBlocked();
  await testCheckAvailability();
  
  console.log('\n✅ Tests terminés !');
}

// Exécuter les tests
runTests().catch(console.error);
