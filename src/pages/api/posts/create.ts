export const prerender = false;

// API endpoint pour créer des articles
// src/pages/api/posts/create.ts

import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { PostsService } from '../../../lib/posts-service';

export const POST: APIRoute = async ({ request, locals }) => {
  console.log('POST /api/posts/create appelé');
  
  try {
    // Vérifier l'authentification
    const session = locals.session;
    console.log('Session:', { hasSession: !!session, userId: session?.user?.id });
    
    if (!session?.user?.id) {
      console.log('Non authentifié');
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Non authentifié' 
      }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Récupérer les données de l'article
    const postData = await request.json();
    console.log('Données reçues:', { 
      title: postData.title, 
      status: postData.status,
      hasContent: !!postData.content 
    });
    
    // Validation des données
    if (!postData.title || !postData.content) {
      console.log('Données invalides:', { hasTitle: !!postData.title, hasContent: !!postData.content });
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Titre et contenu requis' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Créer l'article avec le client admin pour contourner RLS
    console.log('Création de l\'article...');
    
    // Créer un client Supabase admin
    const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Configuration Supabase manquante');
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Configuration Supabase manquante' 
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    // Générer un slug à partir du titre
    const generateSlug = (title: string) => {
      return title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
        .replace(/[^a-z0-9\s-]/g, '') // Garder seulement lettres, chiffres, espaces et tirets
        .replace(/\s+/g, '-') // Remplacer les espaces par des tirets
        .replace(/-+/g, '-') // Remplacer les tirets multiples par un seul
        .trim()
        .replace(/^-|-$/g, ''); // Supprimer les tirets en début et fin
    };
    
    const baseSlug = generateSlug(postData.title);
    console.log('Slug de base généré:', baseSlug);
    
    // Vérifier si le slug existe déjà et ajouter un suffixe si nécessaire
    let finalSlug = baseSlug;
    let counter = 1;
    
    while (true) {
      const { data: existingPost } = await supabaseAdmin
        .from('posts')
        .select('id')
        .eq('slug', finalSlug)
        .single();
      
      if (!existingPost) {
        break; // Le slug est unique
      }
      
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    console.log('Slug final:', finalSlug);
    
    // Créer l'article directement avec le client admin
    const { data: newPost, error: createError } = await supabaseAdmin
      .from('posts')
      .insert({
        ...postData,
        slug: finalSlug,
        author_id: session.user.id
      })
      .select()
      .single();
    
    if (createError) {
      console.error('Erreur lors de la création:', createError);
      return new Response(JSON.stringify({ 
        success: false, 
        error: createError.message 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    console.log('Article créé avec succès:', newPost);
    const response = { success: true, data: newPost };

    if (response.success) {
      return new Response(JSON.stringify(response), { 
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify(response), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

  } catch (error) {
    console.error('Erreur lors de la création de l\'article:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Erreur interne du serveur' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
