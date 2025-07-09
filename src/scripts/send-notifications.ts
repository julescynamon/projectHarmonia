import { getCollection } from 'astro:content';
import { sendNewArticleNotification } from '../src/lib/blog-service.js';

async function notifyNewArticles() {
  try {
    const allPosts = await getCollection('blog');
    const publishedPosts = allPosts.filter(post => 
      post.data.status === 'published' && !post.data.notificationSent
    );

    console.log(`Found ${publishedPosts.length} new published posts to notify about`);

    for (const post of publishedPosts) {
      try {
        console.log(`Sending notification for: ${post.data.title}`);
        await sendNewArticleNotification(post.slug);
        console.log(`✓ Notification sent for: ${post.data.title}`);
      } catch (error) {
        console.error(`× Error sending notification for ${post.data.title}:`, error);
      }
    }

    console.log('Finished sending notifications');
  } catch (error) {
    console.error('Error processing notifications:', error);
    process.exit(1);
  }
}

notifyNewArticles();
