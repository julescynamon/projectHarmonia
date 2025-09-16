import fs from 'fs/promises';
import path from 'path';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request }) => {
  try {
    const { slug } = await request.json();
    if (!slug) {
      return new Response(JSON.stringify({ error: "Slug manquant" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const filePath = path.join(process.cwd(), "src", "content", "blog", `${slug}.md`);
    try {
      const content = await fs.readFile(filePath, "utf-8");
      if (content.includes("notificationSent: true")) {
        return new Response(JSON.stringify({ message: "Article déjà marqué comme notifié" }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }
      const updatedContent = content.replace(
        /notificationSent: false/,
        "notificationSent: true"
      );
      await fs.writeFile(filePath, updatedContent, "utf-8");
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du fichier:", error);
      return new Response(JSON.stringify({ error: "Erreur lors de la mise à jour du fichier" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  } catch (error) {
    console.error("Erreur lors du traitement de la requête:", error);
    return new Response(JSON.stringify({ error: "Erreur lors du traitement de la requête" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
