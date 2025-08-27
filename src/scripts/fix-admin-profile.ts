// Script pour vérifier et corriger le profil admin
import { createClient } from '@supabase/supabase-js';

// Configuration
const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixAdminProfile() {
  console.log('🔧 Vérification et correction du profil admin...\n');
  
  const adminEmail = 'tyzranaima@gmail.com';
  
  try {
    // 1. Vérifier si l'utilisateur existe dans auth.users
    console.log('1. Vérification de l\'utilisateur dans auth.users...');
    
    // Note: On ne peut pas directement accéder à auth.users avec la clé anon
    // On va vérifier via la table profiles
    
    // 2. Vérifier le profil dans la table profiles
    console.log('2. Vérification du profil dans la table profiles...');
    
    const { data: existingProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', adminEmail)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('❌ Erreur lors de la vérification du profil:', profileError);
      return;
    }

    if (existingProfile) {
      console.log('✅ Profil trouvé:', {
        id: existingProfile.id,
        email: existingProfile.email,
        role: existingProfile.role,
        created_at: existingProfile.created_at
      });
      
      if (existingProfile.role === 'admin') {
        console.log('✅ Le profil a déjà le rôle admin');
        return;
      } else {
        console.log('⚠️ Le profil existe mais n\'a pas le rôle admin');
      }
    } else {
      console.log('❌ Aucun profil trouvé pour cet email');
    }

    // 3. Créer ou mettre à jour le profil admin
    console.log('\n3. Création/mise à jour du profil admin...');
    
    // Générer un UUID pour l'ID (simulation)
    const userId = '00000000-0000-0000-0000-000000000000'; // Placeholder
    
    const { data: upsertResult, error: upsertError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        email: adminEmail,
        role: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'email'
      })
      .select();

    if (upsertError) {
      console.error('❌ Erreur lors de la création/mise à jour du profil:', upsertError);
      return;
    }

    console.log('✅ Profil admin créé/mis à jour avec succès:', upsertResult);

    // 4. Vérifier que le profil est bien créé
    console.log('\n4. Vérification finale...');
    
    const { data: finalCheck, error: finalError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', adminEmail)
      .single();

    if (finalError) {
      console.error('❌ Erreur lors de la vérification finale:', finalError);
      return;
    }

    console.log('✅ Vérification finale réussie:', {
      id: finalCheck.id,
      email: finalCheck.email,
      role: finalCheck.role
    });

    console.log('\n🎉 Le profil admin a été configuré avec succès !');
    console.log('Vous pouvez maintenant accéder aux pages admin.');

  } catch (error) {
    console.error('❌ Erreur lors de la correction du profil admin:', error);
  }
}

// Exécuter le script
fixAdminProfile().catch(console.error);
