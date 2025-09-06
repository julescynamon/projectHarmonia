import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_KEY;

if (!supabaseServiceKey) {
  throw new Error('SUPABASE_SERVICE_KEY est requis pour la création de profils admin');
}

const createAdminClient = () => {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false
    }
  });
};

// Fonction spécifique pour l'insertion d'articles
const insertArticle = async (data: any) => {
      const response = await fetch(`${supabaseUrl}/rest/v1/posts`, {
    method: 'POST',
    headers: {
      'apikey': supabaseServiceKey,
      'Authorization': `Bearer ${supabaseServiceKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const error = await response.json();
    return { data: null, error };
  }

  return { data: await response.json(), error: null };
};

const createAuthClient = (token: string) => {
  const client = createClient(supabaseUrl, supabaseKey);
  client.auth.setSession({
    access_token: token,
    refresh_token: ''
  });
  return client;
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const session = locals.session;
    
    if (!session?.user) {
      return new Response(
        JSON.stringify({ error: 'Authentification requise' }),
        { status: 401 }
      );
    }

    const user = session.user;
    const adminClient = createAdminClient();

    // Vérifier/créer le profil admin
    const { data: profile, error: profileError } = await adminClient
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Erreur lors de la récupération du profil:', profileError);
      return new Response(
        JSON.stringify({ error: 'Erreur lors de la vérification du profil' }),
        { status: 500 }
      );
    }

    if (!profile) {
      // Créer le profil admin
      const { data: newProfile, error: createError } = await adminClient
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
          role: 'admin',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (createError) {
        console.error('Erreur lors de la création du profil admin:', createError);
        return new Response(
          JSON.stringify({ error: 'Erreur lors de la création du profil' }),
          { status: 500 }
        );
      }
    } else if (profile.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Accès refusé: droits administrateur requis' }),
        { status: 403 }
      );
    }

    // Récupérer les données de l'article
    const body = await request.json();
    const { title, content, excerpt, category, image, published = false } = body;

    if (!title || !content) {
      return new Response(
        JSON.stringify({ error: 'Titre et contenu requis' }),
        { status: 400 }
      );
    }

    // Générer le slug
    const baseSlug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // Vérifier l'unicité du slug
    let slug = baseSlug;
    let counter = 1;
    
    while (true) {
      const { data: existingPost } = await adminClient
        .from('posts')
        .select('id')
        .eq('slug', slug)
        .single();

      if (!existingPost) break;
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Créer l'article
    const insertData = {
      title,
      content,
      excerpt: excerpt || null,
      category: category || 'Général',
      image: image || null,
      published,
      slug,
      author_id: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await adminClient
      .from('blog_posts')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la création de l\'article:', error);
      return new Response(
        JSON.stringify({ error: 'Erreur lors de la création de l\'article' }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        article: data 
      }),
      { status: 201 }
    );

  } catch (error) {
    console.error('Erreur dans l\'API de création d\'article:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur interne du serveur' }),
      { status: 500 }
    );
  }
};
