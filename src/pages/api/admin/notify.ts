import type { APIRoute } from 'astro';
import { sendNewArticleNotifications } from '../../../scripts/notify';

export const POST: APIRoute = async ({ request }) => {
  try {
    await sendNewArticleNotifications();
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Notifications sent successfully'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error sending notifications:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Error sending notifications'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
