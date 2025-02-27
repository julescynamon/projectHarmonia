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
  const response = await fetch(`${supabaseUrl}/rest/v1/blog_posts`, {
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
    console.log('=== Début de la requête POST /api/blog/create ===');
    console.log('En-têtes reçus:', Object.fromEntries(request.headers.entries()));

    // La session est déjà vérifiée par le middleware
    const session = locals.session;
    if (!session?.user) {
      console.error('Session utilisateur non trouvée');
      return new Response(JSON.stringify({ error: 'Session invalide' }), {
        status: 401
      });
    }

    const user = session.user;
    console.log('Utilisateur authentifié:', user.email);
    
    // Utiliser le client Supabase du middleware
    console.log('Utilisation du client Supabase...');
    const supabase = locals.supabase;
    const adminClient = createAdminClient();
    
    // ÉTAPE 1: Vérification de l'utilisateur
    console.log('\n=== ÉTAPE 1: Vérification de l\'utilisateur ===');
    
    console.log('Informations utilisateur:', {
      userId: user.id,
      email: user.email,
      timestamp: new Date().toISOString()
    });

    if (!user.id) {
      console.error('ID utilisateur manquant');
      return new Response(JSON.stringify({ error: 'Session invalide' }), {
        status: 401
      });
    }

    // ÉTAPE 2: Vérification/création du profil admin
    console.log('\n=== ÉTAPE 2: Vérification/création du profil admin ===');
    console.log('Configuration adminClient:', {
      url: supabaseUrl,
      hasServiceKey: !!supabaseServiceKey,
      timestamp: new Date().toISOString()
    });
    
    console.log('Recherche du profil existant...');
    let { data: profile, error: profileError } = await adminClient
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    console.log('Résultat recherche profil:', {
      success: !!profile,
      profile,
      error: profileError,
      timestamp: new Date().toISOString()
    });

    console.log('Résultat de la requête profile:', { profile, profileError });

    // Si le profil n'existe pas ou n'est pas admin, on le met à jour
    if (profileError || !profile || profile.role !== 'admin') {
      console.log('Mise à jour/création du profil admin pour:', user.id);
      
      const { data: updatedProfile, error: updateError } = await adminClient
        .from('profiles')
        .upsert({
          id: user.id,
          role: 'admin'
        })
        .select()
        .single();

      if (updateError) {
        console.error('Erreur lors de la mise à jour du profil:', updateError);
        return new Response(JSON.stringify({
          error: 'Erreur lors de la mise à jour du profil',
          details: updateError
        }), {
          status: 500
        });
      }

      profile = updatedProfile;
      console.log('Profil admin mis à jour:', profile);

      console.log('Profil admin créé/mis à jour:', profile);
    } else if (profileError) {
      console.error('Erreur lors de la vérification du profil:', profileError);
      return new Response(JSON.stringify({
        error: 'Erreur lors de la vérification du profil',
        details: profileError
      }), {
        status: 500
      });
    }

    console.log('Role trouvé:', profile.role);
    const isAdmin = profile.role === 'admin';
    
    // Vérifier si l'utilisateur est admin
    if (!isAdmin) {
      console.error('Utilisateur non admin:', { userId: user.id, role: profile.role });
      return new Response(JSON.stringify({ 
        error: 'Accès non autorisé',
        details: 'Vous devez être administrateur pour effectuer cette action',
        debug: { userId: user.id, role: profile.role }
      }), {
        status: 403
      });
    }
    
    console.log('Vérification admin réussie pour:', user.id);

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

    // ÉTAPE 3: Préparation des données de l'article
    console.log('\n=== ÉTAPE 3: Préparation des données de l\'article ===');
    
    // Validation des données requises
    console.log('Validation des données d\'entrée:', {
      hasTitle: !!title,
      hasCategory: !!category,
      hasSummary: !!summary,
      hasContent: !!content,
      hasImage: !!image,
      contentLength: content?.length
    });
    
    // Création du slug de base à partir du titre
    let baseSlug = title.toLowerCase()
      .replace(/[^à-ü\w\s-]/g, '') // Garde les lettres accentuées, les chiffres et les tirets
      .trim()
      .replace(/\s+/g, '-'); // Remplace les espaces par des tirets
    
    console.log('Slug généré:', { baseSlug });

    // ÉTAPE 4: Vérification de l'unicité du slug
    console.log('\n=== ÉTAPE 4: Vérification de l\'unicité du slug ===');
    let slug = baseSlug;
    let counter = 1;
    
    while (true) {
      console.log('Tentative avec slug:', { slug, tentative: counter });
      const { data: existingPost, error: checkError } = await adminClient
        .from('blog_posts')
        .select('id')
        .eq('slug', slug)
        .maybeSingle();

      console.log('Résultat vérification slug:', {
        slug,
        exists: !!existingPost,
        error: checkError,
        timestamp: new Date().toISOString()
      });

      if (checkError) {
        console.error('Erreur lors de la vérification du slug:', checkError);
        throw checkError;
      }
      
      if (!existingPost) {
        console.log('Slug unique trouvé:', { slug });
        break; // Le slug est unique, on peut l'utiliser
      }
      
      // Le slug existe déjà, ajouter un suffixe numérique
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // ÉTAPE 5: Création de l'article
    console.log('\n=== ÉTAPE 5: Création de l\'article ===');
    const articleData = {
      title,
      category,
      summary,
      content: htmlContent,
      image_url: image,
      author_id: user.id,
      slug
    };

    console.log('Données de l\'article à créer:', {
      ...articleData,
      contentLength: htmlContent?.length,
      timestamp: new Date().toISOString()
    });
    
    const startTime = Date.now();
    
    // Préparation des données minimales requises
    const insertData = {
      title: articleData.title,
      category: articleData.category,
      author_id: user.id,
      slug: articleData.slug
    };
    
    // Ajout des champs optionnels seulement s'ils sont définis
    if (articleData.summary) insertData['summary'] = articleData.summary;
    if (articleData.content) insertData['content'] = articleData.content;
    if (articleData.image_url) insertData['image_url'] = articleData.image_url;

    console.log(`=== DÉTAILS DE L'INSERTION (${Date.now() - startTime}ms) ===`);
    console.log('Client admin URL:', adminClient.supabaseUrl);
    console.log('Headers:', {
      ...adminClient.rest.headers,
      Authorization: '[MASQUÉ]'
    });
    console.log('Table:', 'blog_posts');
    console.log('Données à insérer:', JSON.stringify(insertData, null, 2));
    
    // Tentative d'insertion directe via fetch
    console.log('\nExécution de la requête...');
    const { data, error } = await insertArticle(insertData);
    
    // Log du résultat immédiat
    console.log(`\n=== RÉSULTAT DE L'INSERTION (${Date.now() - startTime}ms) ===`);
    console.log('Status:', error ? 'ERREUR' : 'SUCCÈS');
    if (error) {
      console.log('Type d\'erreur:', error.code);
      console.log('Message:', error.message);
      console.log('Détails:', error.details);
      console.log('Hint:', error.hint);
    } else {
      console.log('Données insérées:', JSON.stringify(data, null, 2));
    }
    
    console.log('Résultat de l\'insertion:', {
      success: !!data,
      error,
      data
    });
    
    if (error) {
      console.error('Erreur lors de la création:', error);
      throw new Error(JSON.stringify(error));
    }

    console.log('Article créé avec succès:', data);
    
    console.log('Résultat création article:', {
      success: !!data,
      data,
      error,
      timestamp: new Date().toISOString()
    });
    
    console.log('Résultat de la création:', { success: !!data, error });

    if (error) {
      console.error('Erreur lors de la création:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400
      });
    }

    // Notification temporairement désactivée pour debug
    /* 
    try {
      const notifyResponse = await fetch('/api/newsletter/notify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'hs_925095794b8727f1eb324f6b49855773f6e0f319c869bb71b3ce6f1221b0cee0'
        },
        body: JSON.stringify({
          title: data.title,
          slug: data.slug,
          summary: data.summary,
          image: data.image_url
        })
      });

      if (!notifyResponse.ok) {
        console.error('Erreur lors de l\'envoi des notifications:', await notifyResponse.text());
      }
    } catch (notifyError) {
      console.error('Erreur lors de l\'envoi des notifications:', notifyError);
    }
    */

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
