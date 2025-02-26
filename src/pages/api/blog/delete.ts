import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const post: APIRoute = async ({ request }) => {
  try {
    const { id } = await request.json();

    // Vérifier que l'utilisateur est admin
    const session = await supabase.auth.getSession();
    if (!session?.data?.session?.user?.id) {
      return new Response(JSON.stringify({ error: 'Non authentifié' }), {
        status: 401,
      });
    }

    // Vérifier que l'utilisateur est admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.data.session.user.id)
      .single();

    if (profileError || profile?.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Non autorisé' }), {
        status: 403,
      });
    }

    // Supprimer l'article
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    return new Response(JSON.stringify({ error: 'Erreur serveur' }), {
      status: 500,
    });
  }
};
