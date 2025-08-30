// src/scripts/test-services-sync.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// IDs des services du frontend
const frontendServices = [
  'naturopathie-humaine-premiere',
  'naturopathie-humaine-suivi',
  'naturopathie-animale-premiere',
  'naturopathie-animale-suivi',
  'soins-energetiques-humains',
  'soins-energetiques-animaux',
  'accompagnement-personnalise'
];

async function testServicesSync() {
  console.log('🧪 Test de synchronisation des services\n');

  try {
    // 1. Récupérer tous les services de la base de données
    console.log('1️⃣ Récupération des services depuis la base de données...');
    
    const { data: dbServices, error: fetchError } = await supabase
      .from('services')
      .select('*')
      .order('category', { ascending: true });

    if (fetchError) {
      console.error('❌ Erreur lors de la récupération:', fetchError);
      return;
    }

    console.log(`✅ ${dbServices?.length || 0} services trouvés en base de données\n`);

    // 2. Vérifier que tous les services du frontend existent en base
    console.log('2️⃣ Vérification de la correspondance frontend ↔ base de données...');
    
    const dbServiceIds = dbServices?.map(s => s.id) || [];
    const missingServices = frontendServices.filter(id => !dbServiceIds.includes(id));
    const extraServices = dbServiceIds.filter(id => !frontendServices.includes(id));

    if (missingServices.length > 0) {
      console.log('❌ Services manquants en base de données:');
      missingServices.forEach(id => console.log(`   - ${id}`));
    } else {
      console.log('✅ Tous les services du frontend existent en base de données');
    }

    if (extraServices.length > 0) {
      console.log('⚠️ Services en base non utilisés par le frontend:');
      extraServices.forEach(id => console.log(`   - ${id}`));
    }

    // 3. Afficher les détails des services
    console.log('\n3️⃣ Détails des services par catégorie:');
    
    const categories = ['naturopathie-humaine', 'naturopathie-animale', 'soins-energetiques', 'accompagnement'];
    
    categories.forEach(category => {
      const categoryServices = dbServices?.filter(s => s.category === category) || [];
      if (categoryServices.length > 0) {
        console.log(`\n📂 ${category.toUpperCase()}:`);
        categoryServices.forEach(service => {
          console.log(`   - ${service.title} (${service.price}€, ${service.duration})`);
        });
      }
    });

    // 4. Test de création d'une réservation
    console.log('\n4️⃣ Test de création d\'une réservation...');
    
    const testServiceId = frontendServices[0]; // Premier service
    const { data: testService, error: serviceError } = await supabase
      .from('services')
      .select('*')
      .eq('id', testServiceId)
      .single();

    if (serviceError) {
      console.error(`❌ Erreur lors de la récupération du service ${testServiceId}:`, serviceError);
    } else {
      console.log(`✅ Service trouvé: ${testService.title} (${testService.price}€)`);
      
      // Test de création d'une réservation de test
      const testAppointment = {
        date: '2024-12-30',
        time: '14:00',
        service_id: testServiceId,
        client_name: 'Test Sync',
        client_email: 'test-sync@example.com',
        client_phone: '0123456789',
        reason: 'Test de synchronisation services',
        status: 'pending_approval'
      };

      const { data: appointment, error: createError } = await supabase
        .from('appointments')
        .insert([testAppointment])
        .select()
        .single();

      if (createError) {
        console.error('❌ Erreur lors de la création de la réservation de test:', createError);
      } else {
        console.log('✅ Réservation de test créée avec succès');
        
        // Nettoyer la réservation de test
        await supabase
          .from('appointments')
          .delete()
          .eq('id', appointment.id);
        
        console.log('✅ Réservation de test supprimée');
      }
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

// Exécution du test
testServicesSync().then(() => {
  console.log('\n✨ Test de synchronisation terminé !');
}).catch(console.error);
