import type { APIRoute } from 'astro';
import { createServerClient } from '../../../lib/supabase';
import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

export const POST: APIRoute = async ({ request }) => {
  try {
    // Récupération du token d'authentification
    const authHeader = request.headers.get('Authorization');
    console.log('Auth Header:', authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Token d\'authentification manquant' }), {
        status: 401
      });
    }

    const token = authHeader.split(' ')[1];
    console.log('Token:', token);

    // Créer le client Supabase avec le token
    const supabaseAdmin = createServerClient();
    
    // Définir le token d'authentification
    supabaseAdmin.auth.setSession({
      access_token: token,
      refresh_token: ''
    });

    // Vérifier l'utilisateur
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser();
    console.log('User:', user);
    console.log('Auth Error:', authError);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Token d\'authentification invalide', details: authError }), {
        status: 401
      });
    }

    // Vérification du rôle admin dans la table profiles
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    console.log('Profile Query:', {
      userId: user.id,
      profile,
      profileError
    });

    // Vérifier si l'utilisateur est admin
    if (!profile || profile.role !== 'admin') {
      return new Response(JSON.stringify({ 
        error: 'Accès non autorisé',
        details: 'Vous devez être administrateur pour effectuer cette action'
      }), {
        status: 403
      });
    }

    // La vérification du profil est déjà faite plus haut
    // Continuer avec la création de l'article


    
    const formData = await request.json();
    const { title, category, summary, content, image } = formData;

    // Conversion du Markdown en HTML sécurisé
    const htmlContent = sanitizeHtml(marked(content), {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        img: ['src', 'alt', 'title', 'class']
      },
      transformTags: {
        'h1': 'h2',  // Convertir h1 en h2 pour la hiérarchie SEO
        'img': (tagName, attribs) => ({
          tagName,
          attribs: {
            ...attribs,
            class: 'w-full rounded-lg shadow-md my-8'
          }
        })
      }
    });

    // Création du slug à partir du titre
    const slug = title.toLowerCase()
      .replace(/[^à-ü\w\s-]/g, '') // Garde les lettres accentuées, les chiffres et les tirets
      .trim()
      .replace(/\s+/g, '-'); // Remplace les espaces par des tirets

    // Création de l'article
    const { data, error } = await supabaseAdmin.from("blog_posts").insert([
      {
        title,
        category,
        summary,
        content: htmlContent,
        image_url: image,
        author_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        slug
      }
    ]).select().single();

    if (error) {
      console.error('Erreur lors de la création:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400
      });
    }

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200
    });
  } catch (error) {
    console.error('Erreur:', error);
    return new Response(JSON.stringify({ error: 'Erreur serveur' }), {
      status: 500
    });
  }
};
