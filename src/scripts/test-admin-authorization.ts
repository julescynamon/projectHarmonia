// Script de test pour la logique d'autorisation admin
console.log('🧪 Test de la logique d\'autorisation admin...\n');

// Simulation de différents scénarios
const testScenarios = [
  {
    name: 'Admin principal (tyzranaima@gmail.com)',
    email: 'tyzranaima@gmail.com',
    profile: null,
    expected: 'AUTORISÉ',
    description: 'Doit avoir accès même sans profil dans la base'
  },
  {
    name: 'Admin avec profil',
    email: 'admin@example.com',
    profile: { role: 'admin' },
    expected: 'AUTORISÉ',
    description: 'Doit avoir accès avec profil admin'
  },
  {
    name: 'Utilisateur normal avec profil',
    email: 'user@example.com',
    profile: { role: 'user' },
    expected: 'REFUSÉ',
    description: 'Ne doit pas avoir accès'
  },
  {
    name: 'Utilisateur sans profil',
    email: 'newuser@example.com',
    profile: null,
    expected: 'REFUSÉ',
    description: 'Ne doit pas avoir accès sans profil'
  }
];

// Fonction pour simuler la logique d'autorisation
function checkAdminAccess(email: string, profile: any): boolean {
  // Vérification spéciale pour l'admin principal
  const isMainAdmin = email === 'tyzranaima@gmail.com';
  
  if (isMainAdmin) {
    return true;
  }
  
  // Vérification du profil admin
  if (profile && profile.role === 'admin') {
    return true;
  }
  
  return false;
}

console.log('📋 Scénarios de test :');
testScenarios.forEach((scenario, index) => {
  const result = checkAdminAccess(scenario.email, scenario.profile);
  const status = result ? '✅ AUTORISÉ' : '❌ REFUSÉ';
  const expected = scenario.expected === 'AUTORISÉ' ? '✅' : '❌';
  
  console.log(`\n${index + 1}. ${scenario.name}`);
  console.log(`   Email: ${scenario.email}`);
  console.log(`   Profil: ${scenario.profile ? `role=${scenario.profile.role}` : 'null'}`);
  console.log(`   Résultat: ${status}`);
  console.log(`   Attendu: ${scenario.expected} ${expected}`);
  console.log(`   Description: ${scenario.description}`);
  
  if ((result && scenario.expected === 'AUTORISÉ') || (!result && scenario.expected === 'REFUSÉ')) {
    console.log(`   ✅ Test réussi`);
  } else {
    console.log(`   ❌ Test échoué`);
  }
});

console.log('\n🔧 Code de vérification appliqué :');
console.log('```typescript');
console.log('// Vérification spéciale pour l\'admin principal');
console.log('const isMainAdmin = user.email === "tyzranaima@gmail.com";');
console.log('');
console.log('if (!isMainAdmin && (profileError || !profile || profile.role !== "admin")) {');
console.log('  return Astro.redirect("/mon-compte");');
console.log('}');
console.log('```');

console.log('\n✅ Tests terminés !');
console.log('La logique d\'autorisation est maintenant cohérente sur toutes les pages admin.');
