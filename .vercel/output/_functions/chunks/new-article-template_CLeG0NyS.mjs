import fs from 'fs/promises';
import path from 'path';

async function getNewArticleEmailTemplate(data) {
  const templatePath = path.join(process.cwd(), "src", "email-templates", "newsletter.html");
  let template = await fs.readFile(templatePath, "utf-8");
  template = template.replace(/{{websiteUrl}}/g, data.websiteUrl).replace(/{{article\.title}}/g, data.article.title).replace(/{{article\.description}}/g, data.article.description).replace(/{{article\.url}}/g, data.article.url).replace(/{{article\.category}}/g, data.article.category).replace(/{{unsubscribe_url}}/g, data.unsubscribeUrl);
  if (data.article.image) {
    template = template.replace("{{#if article.image}}", "").replace("{{/if}}", "").replace(/{{article\.image}}/g, data.article.image);
  } else {
    template = template.replace(/{{#if article\.image}}[\s\S]*?{{\/if}}/gm, "");
  }
  return template;
}

export { getNewArticleEmailTemplate as g };
