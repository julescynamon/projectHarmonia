export const prerender = false;

// API endpoint pour publier un article
// src/pages/api/posts/[id]/publish.ts

import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { supabase } from '../../../../lib/supabase';

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

    if (existingPost.status === 'published') {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'L\'article est déjà publié' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Publier l'article avec le client admin
    const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Configuration Supabase manquante' 
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    const { data: publishedPost, error: publishError } = await supabaseAdmin
      .from('posts')
      .update({
        status: 'published',
        published_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (publishError) {
      console.error('Erreur lors de la publication:', publishError);
      return new Response(JSON.stringify({ 
        success: false, 
        error: publishError.message 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      data: publishedPost 
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erreur lors de la publication de l\'article:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Erreur interne du serveur' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
