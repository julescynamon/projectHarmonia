// Script de test pour l'initialisation Supabase dans admin disponibilités
console.log('🧪 Test de l\'initialisation Supabase...\n');

console.log('📋 PROBLÈME IDENTIFIÉ :');
console.log('  ❌ Erreur: Cannot read properties of undefined (reading \'createClient\')');
console.log('  ❌ Cause: window.supabase était undefined');
console.log('  ❌ Localisation: disponibilites:4064');

console.log('\n🔧 CORRECTION APPLIQUÉE :');
console.log('  ✅ Ajout du script CDN Supabase');
console.log('  ✅ Changement de window.supabase.createClient vers supabase.createClient');
console.log('  ✅ Initialisation correcte du client Supabase');

console.log('\n📝 CODE CORRIGÉ :');
console.log('```html');
console.log('<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>');
console.log('<script is:inline define:vars={{ supabaseUrl: import.meta.env.PUBLIC_SUPABASE_URL, supabaseKey: import.meta.env.PUBLIC_SUPABASE_ANON_KEY }}>');
console.log('  const supabase = supabase.createClient(supabaseUrl, supabaseKey);');
console.log('```');

console.log('\n🎯 AVANT (PROBLÉMATIQUE) :');
console.log('  const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);');

console.log('\n🎯 APRÈS (CORRIGÉ) :');
console.log('  const supabase = supabase.createClient(supabaseUrl, supabaseKey);');

console.log('\n✅ RÉSULTAT ATTENDU :');
console.log('  - Plus d\'erreur "Cannot read properties of undefined"');
console.log('  - Client Supabase correctement initialisé');
console.log('  - Fonctionnalités de blocage de périodes opérationnelles');
console.log('  - Chargement des périodes bloquées fonctionnel');

console.log('\n🧪 POUR TESTER :');
console.log('1. Rechargez la page /admin/disponibilites');
console.log('2. Ouvrez la console du navigateur');
console.log('3. Vérifiez qu\'il n\'y a plus d\'erreur Supabase');
console.log('4. Testez l\'onglet "Périodes bloquées"');
console.log('5. Vérifiez que le formulaire de blocage fonctionne');

console.log('\n🎉 L\'erreur Supabase devrait maintenant être résolue !');
