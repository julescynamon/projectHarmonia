import type { APIRoute } from 'astro';
import { createServiceClient } from '../../../lib/supabase';
import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

export const POST: APIRoute = async ({ request }) => {
  try {
    // Récupération du token d'authentification
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Token d\'authentification manquant' }), {
        status: 401
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Créer le client Supabase avec le token
    const supabase = createServiceClient(token);
    const { data: { user }, error: authError } = await supabase.auth.getUser();


    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Token d\'authentification invalide', details: authError }), {
        status: 401
      });
    }

    // Vérification du rôle admin dans la table profiles
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id);


    // Vérifions aussi directement dans la base

    const { data: directCheck, error: directError } = await supabase
      .rpc('check_is_admin', { user_id: user.id });



    const isAdmin = (profiles && profiles.length > 0 && profiles[0].role === 'admin') || directCheck === true;
    
    // Vérifier si l'utilisateur est admin
    if (!isAdmin) {
      return new Response(JSON.stringify({ 
        error: 'Accès non autorisé',
        details: 'Vous devez être administrateur pour effectuer cette action'
      }), {
        status: 403
      });
    }

    // Le client est déjà configuré avec la session

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
    const { data, error } = await supabase
      .from('blog_posts')
      .insert({
        title,
        category,
        summary,
        content: htmlContent,
        image_url: image,
        author_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        slug
      })
      .select()
      .single();

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
