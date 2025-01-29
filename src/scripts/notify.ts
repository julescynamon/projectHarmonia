import { getCollection } from 'astro:content';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;
const FROM_EMAIL = import.meta.env.FROM_EMAIL;
const WEBSITE_URL = import.meta.env.WEBSITE_URL;
const WEBSITE_NAME = import.meta.env.WEBSITE_NAME;
const IS_DEVELOPMENT = import.meta.env.DEV;

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Configuration Supabase incomplète');
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const resend = new Resend(RESEND_API_KEY);

export async function sendNewArticleNotifications() {
  try {
    // Récupérer tous les articles publiés
    const allPosts = await getCollection('blog');
    const publishedPosts = allPosts.filter(post => 
      post.data.status === 'published' && !post.data.notificationSent
    );

    console.log(`Found ${publishedPosts.length} new published posts to notify about`);

    if (publishedPosts.length === 0) {
      console.log('No new posts to notify about');
      return;
    }

    // Récupérer tous les abonnés confirmés
    const { data: subscribers, error: queryError } = await supabase
      .from('newsletter_subscribers')
      .select('email')
      .eq('confirmed', true)
      .eq('unsubscribed', false);

    if (queryError) {
      console.error('Error fetching subscribers:', queryError);
      return;
    }

    if (!subscribers || subscribers.length === 0) {
      console.log('No confirmed subscribers to notify');
      return;
    }

    console.log(`Found ${subscribers.length} subscribers to notify`);

    // Pour chaque article
    for (const post of publishedPosts) {
      console.log(`\nProcessing notifications for: ${post.data.title}`);
      const articleUrl = `${WEBSITE_URL}/blog/${post.slug}`;

      // En développement, simuler l'envoi sauf pour l'email de test
      if (IS_DEVELOPMENT) {
        console.log('Development mode: Simulating email sending');
        console.log('Article URL:', articleUrl);
        continue;
      }

      // Envoyer par lots de 50 pour éviter les limites de taux
      const batchSize = 50;
      let successCount = 0;
      let errorCount = 0;

      for (let i = 0; i < subscribers.length; i += batchSize) {
        const batch = subscribers.slice(i, i + batchSize);
        const batchPromises = batch.map(({ email }) => 
          resend.emails.send({
            from: FROM_EMAIL,
            to: email,
            subject: `Nouvel article sur ${WEBSITE_NAME} : ${post.data.title}`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h1>Nouveau sur ${WEBSITE_NAME}</h1>
                ${post.data.image ? `
                  <img src="${post.data.image}" 
                       alt="Image de couverture pour ${post.data.title}"
                       style="max-width: 100%; height: auto; margin: 20px 0;"
                  />
                ` : ''}
                <h2>${post.data.title}</h2>
                <p>${post.data.description}</p>
                <p>
                  <a href="${articleUrl}" 
                     style="display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px;">
                    Lire l'article
                  </a>
                </p>
                <p style="margin-top: 20px; font-size: 0.8em; color: #666;">
                  <a href="${WEBSITE_URL}/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}" 
                     style="color: #666;">
                    Se désinscrire
                  </a>
                </p>
              </div>
            `,
          }).then(() => {
            successCount++;
            return true;
          }).catch(error => {
            console.error(`Error sending to ${email}:`, error);
            errorCount++;
            return false;
          })
        );

        await Promise.all(batchPromises);
        console.log(`Processed batch ${i/batchSize + 1}/${Math.ceil(subscribers.length/batchSize)}`);
      }

      console.log(`Finished sending notifications for "${post.data.title}"`);
      console.log(`Success: ${successCount}, Errors: ${errorCount}`);
    }

  } catch (error) {
    console.error('Error processing notifications:', error);
  }
}
