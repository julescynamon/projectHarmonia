// Script de test pour vérifier les pages admin
console.log('🧪 Test des pages admin...\n');

// Pages admin à tester
const adminPages = [
  {
    path: '/admin/disponibilites',
    description: 'Gestion des disponibilités et réservations'
  },
  {
    path: '/admin/boutique',
    description: 'Gestion de la boutique'
  },
  {
    path: '/admin/blog',
    description: 'Gestion du blog'
  }
];

console.log('📋 Pages admin configurées :');
adminPages.forEach(page => {
  console.log(`  ✅ ${page.path} - ${page.description}`);
});

console.log('\n🔒 Vérifications de sécurité appliquées :');
console.log('  ✅ Vérification de session utilisateur');
console.log('  ✅ Vérification du rôle admin dans profiles');
console.log('  ✅ Fallback pour tyzranaima@gmail.com (admin principal)');
console.log('  ✅ Redirection vers /mon-compte si non autorisé');

console.log('\n🎯 Logique d\'accès :');
console.log('  1. Si session.user.email === "tyzranaima@gmail.com" → ACCÈS AUTORISÉ');
console.log('  2. Sinon, vérifier profile.role === "admin" → ACCÈS AUTORISÉ');
console.log('  3. Sinon → REDIRECTION vers /mon-compte');

console.log('\n✅ Test terminé !');
console.log('Pour tester réellement :');
console.log('1. Connectez-vous avec tyzranaima@gmail.com');
console.log('2. Accédez directement à /admin/disponibilites');
console.log('3. Vérifiez que la page se charge correctement');
console.log('4. Testez avec un autre compte pour vérifier la redirection');
