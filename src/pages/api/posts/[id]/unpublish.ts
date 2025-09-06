// API endpoint pour mettre un article en brouillon
// src/pages/api/posts/[id]/unpublish.ts

import type { APIRoute } from 'astro';
import { supabase } from '../../../../lib/supabase';
import { PostsService } from '../../../../lib/posts-service';

export const POST: APIRoute = async ({ params, locals }) => {
  try {
    // Vérifier l'authentification
    const session = locals.session;
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Non authentifié' 
      }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'ID de l\'article requis' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Vérifier que l'article appartient à l'utilisateur
    const { data: existingPost, error: fetchError } = await supabase
      .from('posts')
      .select('author_id, status')
      .eq('id', id)
      .single();

    if (fetchError || !existingPost) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Article non trouvé' 
      }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (existingPost.author_id !== session.user.id) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Non autorisé' 
      }), { 
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (existingPost.status === 'draft') {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'L\'article est déjà en brouillon' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Mettre l'article en brouillon
    const response = await PostsService.unpublishPost(id);

    if (response.success) {
      return new Response(JSON.stringify(response), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify(response), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

  } catch (error) {
    console.error('Erreur lors de la mise en brouillon de l\'article:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Erreur interne du serveur' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
