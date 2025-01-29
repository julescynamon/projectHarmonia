import { getCollection } from 'astro:content';

export async function sendNewArticleNotification(slug: string) {
  const API_SECRET_KEY = import.meta.env.API_SECRET_KEY;
  if (!API_SECRET_KEY) {
    throw new Error('API_SECRET_KEY is not configured');
  }

  try {
    // Récupérer l'article
    const allPosts = await getCollection('blog');
    const post = allPosts.find(post => post.slug === slug);
    
    if (!post) {
      throw new Error('Article non trouvé');
    }

    // Vérifier si l'article est publié et si la notification n'a pas déjà été envoyée
    if (post.data.status !== 'published' || post.data.notificationSent) {
      console.log('Notification non nécessaire:', {
        status: post.data.status,
        notificationSent: post.data.notificationSent
      });
      return;
    }

    // Envoyer la notification
    const response = await fetch('/api/newsletter/notify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_SECRET_KEY
      },
      body: JSON.stringify({
        title: post.data.title,
        description: post.data.description,
        slug: post.slug,
        coverImage: post.data.image
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Erreur lors de l'envoi de la notification: ${error.message}`);
    }

    console.log('Notification envoyée avec succès pour:', post.data.title);
    return await response.json();
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la notification:', error);
    throw error;
  }
}
