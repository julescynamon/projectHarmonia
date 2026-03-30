// Script de test pour les templates d'emails
import { getAppointmentNotificationEmailHtml } from '../lib/emails/appointment-notification';
import { getAppointmentConfirmationEmailHtml } from '../lib/emails/appointment-confirmation';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

// Données de test
const testAppointment = {
  id: 'test-123',
  date: '2024-02-15',
  time: '14:00',
  client_name: 'Marie Dupont',
  client_email: 'marie.dupont@example.com',
  reason: 'Consultation pour des problèmes de sommeil et de stress au travail'
};

const testService = {
  title: 'Naturopathie Humaine – Première consultation',
  price: 120,
  duration: '1h30-2h'
};

// Fonction pour générer les emails de test
function generateTestEmails() {
  console.log('🔧 Génération des templates d\'emails de test...');

  // Créer le dossier de sortie
  const outputDir = join(process.cwd(), 'test-output');
  try {
    mkdirSync(outputDir, { recursive: true });
  } catch (error) {
    // Le dossier existe déjà
  }

  // Générer l'email de notification admin
  const adminEmailHtml = getAppointmentNotificationEmailHtml({
    appointment: testAppointment,
    service: testService
  });

  // Générer l'email de confirmation client
  const clientEmailHtml = getAppointmentConfirmationEmailHtml({
    appointment: testAppointment,
    service: testService
  });

  // Sauvegarder les fichiers
  writeFileSync(join(outputDir, 'admin-notification.html'), adminEmailHtml);
  writeFileSync(join(outputDir, 'client-confirmation.html'), clientEmailHtml);

  console.log('✅ Templates générés avec succès !');
  console.log('📁 Fichiers sauvegardés dans :', outputDir);
  console.log('   - admin-notification.html');
  console.log('   - client-confirmation.html');
  console.log('');
  console.log('📧 Vous pouvez ouvrir ces fichiers dans votre navigateur pour prévisualiser les emails.');
}

// Exécuter le test
generateTestEmails();

export { generateTestEmails };
