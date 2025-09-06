// Script de test pour vérifier l'accès admin
// src/scripts/test-admin-access.ts

import { createClient } from '@supabase/supabase-js';

// Variables d'environnement Astro
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY || import.meta.env.SUPABASE_SERVICE_KEY;

console.log('🔍 Configuration:');
console.log('   URL:', supabaseUrl);
console.log('   Service Key:', supabaseServiceKey ? '✅ Présente' : '❌ Manquante');

if (!supabaseServiceKey) {
  console.error('❌ Clé de service Supabase manquante');
  console.log('   Ajoutez SUPABASE_SERVICE_ROLE_KEY dans vos variables d\'environnement');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testAdminAccess() {
  console.log('\n🔍 Test d\'accès admin...\n');

  try {
    // 1. Vérifier si la table profiles existe
    console.log('1. Vérification de la table profiles...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (profilesError) {
      console.error('❌ Erreur table profiles:', profilesError.message);
      console.log('   La table profiles n\'existe peut-être pas');
    } else {
      console.log('✅ Table profiles existe');
      if (profiles.length > 0) {
        console.log('   Structure:', Object.keys(profiles[0]));
      }
    }

    // 2. Chercher l'utilisateur tyzranaima@gmail.com
    console.log('\n2. Recherche de l\'utilisateur tyzranaima@gmail.com...');
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.error('❌ Erreur liste utilisateurs:', usersError.message);
    } else {
      const targetUser = users.users.find(u => u.email === 'tyzranaima@gmail.com');
      if (targetUser) {
        console.log('✅ Utilisateur trouvé:', targetUser.id);
        console.log('   Email:', targetUser.email);
        console.log('   Créé le:', targetUser.created_at);
        
        // 3. Vérifier le profil de cet utilisateur
        console.log('\n3. Vérification du profil...');
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', targetUser.id)
          .single();
        
        if (profileError) {
          console.error('❌ Erreur profil:', profileError.message);
          console.log('   Création du profil admin...');
          
          // Créer le profil admin
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: targetUser.id,
              email: targetUser.email,
              role: 'admin',
              full_name: 'Naïma Admin'
            })
            .select()
            .single();
          
          if (createError) {
            console.error('❌ Erreur création profil:', createError.message);
          } else {
            console.log('✅ Profil admin créé:', newProfile);
          }
        } else {
          console.log('✅ Profil trouvé:', profile);
          if (profile.role !== 'admin') {
            console.log('⚠️  Mise à jour du rôle vers admin...');
            const { error: updateError } = await supabase
              .from('profiles')
              .update({ role: 'admin' })
              .eq('id', targetUser.id);
            
            if (updateError) {
              console.error('❌ Erreur mise à jour:', updateError.message);
            } else {
              console.log('✅ Rôle mis à jour vers admin');
            }
          }
        }
      } else {
        console.error('❌ Utilisateur tyzranaima@gmail.com non trouvé');
        console.log('   Utilisateurs disponibles:');
        users.users.forEach(u => {
          console.log(`   - ${u.email} (${u.id})`);
        });
      }
    }

    // 4. Vérifier la table posts
    console.log('\n4. Vérification de la table posts...');
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('*')
      .limit(1);
    
    if (postsError) {
      console.error('❌ Erreur table posts:', postsError.message);
    } else {
      console.log('✅ Table posts existe');
      if (posts.length > 0) {
        console.log('   Structure:', Object.keys(posts[0]));
      }
    }

    // 5. Vérifier le bucket blog-images
    console.log('\n5. Vérification du bucket blog-images...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ Erreur buckets:', bucketsError.message);
    } else {
      const blogImagesBucket = buckets.find(b => b.name === 'blog-images');
      if (blogImagesBucket) {
        console.log('✅ Bucket blog-images existe');
        console.log('   Public:', blogImagesBucket.public);
      } else {
        console.error('❌ Bucket blog-images non trouvé');
        console.log('   Buckets disponibles:');
        buckets.forEach(b => {
          console.log(`   - ${b.name} (public: ${b.public})`);
        });
      }
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
  }
}

testAdminAccess();
