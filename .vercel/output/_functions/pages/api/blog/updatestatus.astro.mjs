import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request }) => {
  try {
    const { slug, status } = await request.json();
    if (!slug || !status) {
      return new Response(JSON.stringify({ error: "Slug et status requis" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const filePath = path.join(process.cwd(), "src", "content", "blog", `${slug}.md`);
    const fileContent = await fs.readFile(filePath, "utf-8");
    const { data, content } = matter(fileContent);
    const shouldNotify = status === "published" && data.status !== "published";
    const updatedData = {
      ...data,
      status,
      notificationSent: shouldNotify ? false : data.notificationSent
    };
    const updatedFileContent = matter.stringify(content, updatedData);
    await fs.writeFile(filePath, updatedFileContent, "utf-8");
    if (shouldNotify) {
      try {
        const notifyResponse = await fetch(new URL("/api/blog/notify", request.url).toString(), {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ slug })
        });
        if (!notifyResponse.ok) {
          console.error("Erreur lors de l'envoi de la notification");
        }
      } catch (error) {
        console.error("Erreur lors de l'envoi de la notification:", error);
      }
    }
    return new Response(JSON.stringify({
      success: true,
      message: shouldNotify ? "Status mis à jour et notification envoyée" : "Status mis à jour"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du status:", error);
    return new Response(JSON.stringify({ error: "Erreur lors de la mise à jour du status" }), {
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
