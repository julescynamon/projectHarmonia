import fs from 'fs/promises';
import path from 'path';

interface ArticleData {
  title: string;
  description: string;
  url: string;
  image?: string;
  category: string;
}

interface TemplateData {
  article: ArticleData;
  websiteUrl: string;
  unsubscribeUrl: string;
}

export async function getNewArticleEmailTemplate(data: TemplateData): Promise<string> {
  const templatePath = path.join(process.cwd(), 'src', 'email-templates', 'newsletter.html');
  let template = await fs.readFile(templatePath, 'utf-8');
  
  // Remplacer les variables dans le template
  template = template
    .replace(/{{websiteUrl}}/g, data.websiteUrl)
    .replace(/{{article\.title}}/g, data.article.title)
    .replace(/{{article\.description}}/g, data.article.description)
    .replace(/{{article\.url}}/g, data.article.url)
    .replace(/{{article\.category}}/g, data.article.category)
    .replace(/{{unsubscribe_url}}/g, data.unsubscribeUrl);

  // Gérer l'image conditionnellement
  if (data.article.image) {
    template = template.replace('{{#if article.image}}', '')
      .replace('{{/if}}', '')
      .replace(/{{article\.image}}/g, data.article.image);
  } else {
    // Supprimer le bloc d'image si pas d'image
    template = template.replace(/{{#if article\.image}}[\s\S]*?{{\/if}}/gm, '');
  }

  return template;
}
