import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    console.log('=== Début de la requête POST /api/blog/delete ===');
    
    const { id } = await request.json();
    console.log('ID de l\'article à supprimer:', id);

    // La session est déjà vérifiée par le middleware
    const session = locals.session;
    if (!session?.user) {
      console.error('Session utilisateur non trouvée');
      return new Response(JSON.stringify({ error: 'Session invalide' }), {
        status: 401
      });
    }

    // Utiliser le client Supabase du middleware
    const supabase = locals.supabase;

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
