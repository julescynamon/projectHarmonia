import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Les variables d\'environnement PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont requises');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function addAdminRole(email: string) {
  try {
    // Récupérer l'utilisateur par email
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (userError) {
      throw new Error(`Erreur lors de la recherche de l'utilisateur: ${userError.message}`);
    }

    if (!user) {
      throw new Error(`Aucun utilisateur trouvé avec l'email: ${email}`);
    }

    // Ajouter le rôle admin
    const { error: roleError } = await supabase
      .from('user_roles')
      .upsert({
        user_id: user.id,
        role: 'admin'
      });

    if (roleError) {
      throw new Error(`Erreur lors de l'ajout du rôle admin: ${roleError.message}`);
    }

    console.log(`Rôle admin ajouté avec succès pour l'utilisateur: ${email}`);
  } catch (error) {
    console.error('Erreur:', error);
  }
}

// Remplacez par votre email
const adminEmail = 'votre.email@example.com';
addAdminRole(adminEmail);
