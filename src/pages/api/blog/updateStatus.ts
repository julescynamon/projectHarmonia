export const prerender = false;

import type { APIRoute } from 'astro';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { slug, status } = await request.json();

    if (!slug || !status) {
      return new Response(JSON.stringify({ error: 'Slug et status requis' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const filePath = path.join(process.cwd(), 'src', 'content', 'blog', `${slug}.md`);

    // Lire le fichier
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const { data, content } = matter(fileContent);

    // Si le statut change vers "published", déclencher la notification
    const shouldNotify = status === 'published' && data.status !== 'published';

    // Mettre à jour le frontmatter
    const updatedData = {
      ...data,
      status,
      notificationSent: shouldNotify ? false : data.notificationSent
    };

    // Réécrire le fichier avec le nouveau frontmatter
    const updatedFileContent = matter.stringify(content, updatedData);
    await fs.writeFile(filePath, updatedFileContent, 'utf-8');

    // Si on doit notifier, appeler l'endpoint de notification
    if (shouldNotify) {
      try {
        const notifyResponse = await fetch(new URL('/api/blog/notify', request.url).toString(), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ slug }),
        });

        if (!notifyResponse.ok) {
          console.error('Erreur lors de l\'envoi de la notification');
        }
      } catch (error) {
        console.error('Erreur lors de l\'envoi de la notification:', error);
      }
    }

    return new Response(JSON.stringify({ 
      success: true,
      message: shouldNotify ? 'Status mis à jour et notification envoyée' : 'Status mis à jour'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du status:', error);
    return new Response(JSON.stringify({ error: 'Erreur lors de la mise à jour du status' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
