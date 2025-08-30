// src/scripts/test-admin-approval.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAdminApproval() {
  console.log('🧪 Test du système d\'approbation/refus des réservations\n');

  try {
    // 1. Créer une réservation de test
    console.log('1️⃣ Création d\'une réservation de test...');
    
    const testAppointment = {
      date: '2024-12-25',
      time: '14:00',
      service_id: 'consultation',
      client_name: 'Test Client',
      client_email: 'test@example.com',
      client_phone: '0123456789',
      reason: 'Test d\'approbation',
      status: 'pending_approval'
    };

    const { data: appointment, error: createError } = await supabase
      .from('appointments')
      .insert([testAppointment])
      .select()
      .single();

    if (createError) {
      console.error('❌ Erreur lors de la création:', createError);
      return;
    }

    console.log('✅ Réservation créée:', appointment.id);

    // 2. Tester l'API d'approbation
    console.log('\n2️⃣ Test de l\'API d\'approbation...');
    
    const approveResponse = await fetch('http://localhost:4321/api/admin/appointments/approve', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ADMIN_TOKEN || 'test-token'}`
      },
      body: JSON.stringify({
        appointmentId: appointment.id
      })
    });

    const approveData = await approveResponse.json();
    
    if (approveResponse.ok) {
      console.log('✅ Approbation réussie:', approveData.message);
      console.log('🔗 Lien de paiement:', approveData.paymentUrl);
    } else {
      console.log('❌ Erreur d\'approbation:', approveData.error);
    }

    // 3. Vérifier le statut mis à jour
    console.log('\n3️⃣ Vérification du statut...');
    
    const { data: updatedAppointment, error: fetchError } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', appointment.id)
      .single();

    if (fetchError) {
      console.error('❌ Erreur lors de la récupération:', fetchError);
    } else {
      console.log('📊 Statut mis à jour:', updatedAppointment.status);
      console.log('⏰ Date d\'approbation:', updatedAppointment.approved_at);
    }

    // 4. Nettoyer la réservation de test
    console.log('\n4️⃣ Nettoyage...');
    
    const { error: deleteError } = await supabase
      .from('appointments')
      .delete()
      .eq('id', appointment.id);

    if (deleteError) {
      console.error('❌ Erreur lors du nettoyage:', deleteError);
    } else {
      console.log('✅ Réservation de test supprimée');
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

async function testAdminRejection() {
  console.log('\n🧪 Test du système de refus des réservations\n');

  try {
    // 1. Créer une réservation de test
    console.log('1️⃣ Création d\'une réservation de test...');
    
    const testAppointment = {
      date: '2024-12-26',
      time: '15:00',
      service_id: 'consultation',
      client_name: 'Test Client Rejet',
      client_email: 'test-reject@example.com',
      client_phone: '0123456789',
      reason: 'Test de refus',
      status: 'pending_approval'
    };

    const { data: appointment, error: createError } = await supabase
      .from('appointments')
      .insert([testAppointment])
      .select()
      .single();

    if (createError) {
      console.error('❌ Erreur lors de la création:', createError);
      return;
    }

    console.log('✅ Réservation créée:', appointment.id);

    // 2. Tester l'API de refus
    console.log('\n2️⃣ Test de l\'API de refus...');
    
    const rejectResponse = await fetch('http://localhost:4321/api/admin/appointments/reject', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ADMIN_TOKEN || 'test-token'}`
      },
      body: JSON.stringify({
        appointmentId: appointment.id,
        rejectionReason: 'Créneau non disponible, veuillez choisir une autre date.'
      })
    });

    const rejectData = await rejectResponse.json();
    
    if (rejectResponse.ok) {
      console.log('✅ Refus réussi:', rejectData.message);
    } else {
      console.log('❌ Erreur de refus:', rejectData.error);
    }

    // 3. Vérifier le statut mis à jour
    console.log('\n3️⃣ Vérification du statut...');
    
    const { data: updatedAppointment, error: fetchError } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', appointment.id)
      .single();

    if (fetchError) {
      console.error('❌ Erreur lors de la récupération:', fetchError);
    } else {
      console.log('📊 Statut mis à jour:', updatedAppointment.status);
      console.log('⏰ Date de refus:', updatedAppointment.rejected_at);
      console.log('📝 Motif:', updatedAppointment.rejection_reason);
    }

    // 4. Nettoyer la réservation de test
    console.log('\n4️⃣ Nettoyage...');
    
    const { error: deleteError } = await supabase
      .from('appointments')
      .delete()
      .eq('id', appointment.id);

    if (deleteError) {
      console.error('❌ Erreur lors du nettoyage:', deleteError);
    } else {
      console.log('✅ Réservation de test supprimée');
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

// Exécution des tests
async function runTests() {
  console.log('🚀 Démarrage des tests d\'approbation/refus admin\n');
  
  await testAdminApproval();
  await testAdminRejection();
  
  console.log('\n✨ Tests terminés !');
}

runTests().catch(console.error);
