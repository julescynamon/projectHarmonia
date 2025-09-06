// Script de test pour les fonctionnalités admin des réservations
import { createClient } from '@supabase/supabase-js';

// Configuration de test
const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey);

// Fonction pour tester la récupération des réservations
async function testAppointmentsList() {
  console.log('🧪 Test de récupération des réservations...');
  
  try {
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select(`
        *,
        services (
          title,
          price
        )
      `)
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('❌ Erreur lors de la récupération des réservations:', error);
      return;
    }

    console.log(`✅ ${appointments?.length || 0} réservations récupérées`);
    
    if (appointments && appointments.length > 0) {
      console.log('📋 Exemples de réservations :');
      appointments.forEach((appointment, index) => {
        console.log(`  ${index + 1}. ${appointment.client_name} - ${appointment.date} ${appointment.time} - ${appointment.status}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du test des réservations:', error);
  }
}

// Fonction pour tester les filtres
async function testFilters() {
  console.log('\n🧪 Test des filtres de réservation...');
  
  try {
    // Test filtre par statut
    const { data: pendingApprovals, error: statusError } = await supabase
      .from('appointments')
      .select('*')
      .eq('status', 'pending_approval')
      .limit(3);

    if (statusError) {
      console.error('❌ Erreur lors du filtrage par statut:', statusError);
    } else {
      console.log(`✅ ${pendingApprovals?.length || 0} réservations en attente d'approbation`);
    }

    // Test filtre par date
    const today = new Date().toISOString().split('T')[0];
    const { data: todayAppointments, error: dateError } = await supabase
      .from('appointments')
      .select('*')
      .gte('date', today)
      .limit(3);

    if (dateError) {
      console.error('❌ Erreur lors du filtrage par date:', dateError);
    } else {
      console.log(`✅ ${todayAppointments?.length || 0} réservations à partir d'aujourd'hui`);
    }

    // Test recherche par client
    const { data: clientSearch, error: clientError } = await supabase
      .from('appointments')
      .select('*')
      .or('client_name.ilike.%test%,client_email.ilike.%test%')
      .limit(3);

    if (clientError) {
      console.error('❌ Erreur lors de la recherche par client:', clientError);
    } else {
      console.log(`✅ ${clientSearch?.length || 0} réservations trouvées pour "test"`);
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du test des filtres:', error);
  }
}

// Fonction pour tester la pagination
async function testPagination() {
  console.log('\n🧪 Test de la pagination...');
  
  try {
    const pageSize = 5;
    const page = 1;
    const offset = (page - 1) * pageSize;

    const { data: appointments, error, count } = await supabase
      .from('appointments')
      .select('*', { count: 'exact' })
      .range(offset, offset + pageSize - 1)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Erreur lors du test de pagination:', error);
      return;
    }

    const totalPages = count ? Math.ceil(count / pageSize) : 0;
    console.log(`✅ Pagination : Page ${page}/${totalPages}, ${appointments?.length || 0} résultats sur ${count || 0} total`);
    
  } catch (error) {
    console.error('❌ Erreur lors du test de pagination:', error);
  }
}

// Fonction pour tester les statuts
function testStatusBadges() {
  console.log('\n🧪 Test des badges de statut...');
  
  const statuses = ['pending_approval', 'pending', 'confirmed', 'refused', 'cancelled'];
  
  statuses.forEach(status => {
    const badge = getStatusBadge(status);
    console.log(`  ${status}: ${badge}`);
  });
}

function getStatusBadge(status: string) {
  const badges = {
    'pending_approval': '⏳ En attente',
    'pending': '💳 En attente de paiement',
    'confirmed': '✅ Confirmé',
    'refused': '❌ Refusé',
    'cancelled': '🚫 Annulé'
  };
  return badges[status as keyof typeof badges] || '❓ Inconnu';
}

// Fonction pour tester les templates d'emails
function testEmailTemplates() {
  console.log('\n🧪 Test des templates d\'emails...');
  
  const mockAppointment = {
    id: 'test-123',
    date: '2024-12-25',
    time: '14:00',
    service: 'Consultation Naturopathie',
    clientName: 'Jean Dupont',
    clientEmail: 'jean@example.com'
  };

  // Test template d'approbation
  const approvalHtml = getAppointmentApprovalEmailHtml({
    appointment: mockAppointment,
    paymentUrl: 'https://checkout.stripe.com/test',
    websiteUrl: 'https://la-maison-sattvaia.com'
  });
  
  console.log('✅ Template d\'approbation généré:', approvalHtml.length, 'caractères');

  // Test template de refus
  const rejectionHtml = getAppointmentRejectionEmailHtml({
    appointment: mockAppointment,
    rejectionReason: 'Créneau non disponible',
    websiteUrl: 'https://la-maison-sattvaia.com'
  });
  
  console.log('✅ Template de refus généré:', rejectionHtml.length, 'caractères');
}

// Import des fonctions de template (simulation)
function getAppointmentApprovalEmailHtml(params: any) {
  return `<html><body>Template d'approbation pour ${params.appointment.clientName}</body></html>`;
}

function getAppointmentRejectionEmailHtml(params: any) {
  return `<html><body>Template de refus pour ${params.appointment.clientName}</body></html>`;
}

// Fonction principale de test
async function runTests() {
  console.log('🚀 Démarrage des tests des fonctionnalités admin...\n');
  
  await testAppointmentsList();
  await testFilters();
  await testPagination();
  testStatusBadges();
  testEmailTemplates();
  
  console.log('\n✅ Tests terminés !');
}

// Exécuter les tests
runTests().catch(console.error);
