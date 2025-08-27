// Script de test pour vérifier l'accès admin
console.log('🧪 Test d\'accès aux pages admin...\n');

// Simuler les URLs des pages admin
const adminPages = [
  '/admin/disponibilites',
  '/admin/boutique', 
  '/admin/blog'
];

console.log('📋 Pages admin disponibles :');
adminPages.forEach(page => {
  console.log(`  - ${page}`);
});

console.log('\n✅ Test terminé !');
console.log('Pour tester réellement :');
console.log('1. Connectez-vous avec tyzranaima@gmail.com');
console.log('2. Allez sur /mon-compte');
console.log('3. Cliquez sur un bouton admin');
console.log('4. Vérifiez que vous êtes redirigé vers la page admin');
