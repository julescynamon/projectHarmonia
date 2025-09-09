#!/usr/bin/env node
// Script pour tester l'accessibilité directe des images
// Usage: node scripts/test-image-access.js

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

// Charger les variables d'environnement
config();

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Variables d'environnement Supabase manquantes");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testImageAccess() {
  console.log("🔍 Test d'accessibilité des images d'articles...\n");

  try {
    // 1. Récupérer les articles avec leurs URLs d'images
    console.log("📊 1. Récupération des articles...");
    const { data: posts, error: postsError } = await supabase
      .from("posts")
      .select("id, title, slug, cover_url, status")
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (postsError) {
      console.error(
        "❌ Erreur lors de la récupération des articles:",
        postsError
      );
      return;
    }

    console.log(`✅ ${posts.length} articles trouvés\n`);

    // 2. Tester chaque URL d'image
    for (const post of posts) {
      if (!post.cover_url) {
        console.log(
          `⚠️  Article "${post.title}" n'a pas d'image de couverture`
        );
        continue;
      }

      console.log(`🧪 Test de l'image pour: "${post.title}"`);
      console.log(`   URL: ${post.cover_url}`);

      try {
        // Test avec fetch
        const response = await fetch(post.cover_url, {
          method: "HEAD",
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
          },
        });

        console.log(`   Status: ${response.status} ${response.statusText}`);
        console.log(`   Content-Type: ${response.headers.get("content-type")}`);
        console.log(
          `   Content-Length: ${response.headers.get("content-length")} bytes`
        );
        console.log(
          `   Cache-Control: ${response.headers.get("cache-control")}`
        );
        console.log(
          `   Access-Control-Allow-Origin: ${response.headers.get("access-control-allow-origin")}`
        );

        if (response.status === 200) {
          console.log(`   ✅ Image accessible`);
        } else {
          console.log(`   ❌ Image non accessible`);

          // Essayer de récupérer le contenu de l'erreur
          try {
            const errorResponse = await fetch(post.cover_url, {
              method: "GET",
            });
            const errorText = await errorResponse.text();
            console.log(`   Erreur détail: ${errorText.substring(0, 200)}...`);
          } catch (e) {
            console.log(
              `   Erreur lors de la récupération du détail: ${e.message}`
            );
          }
        }
      } catch (error) {
        console.log(`   ❌ Erreur lors du test: ${error.message}`);
      }

      console.log("");
    }

    // 3. Tester l'accès au bucket directement
    console.log("🪣 3. Test d'accès au bucket blog-images...");

    try {
      const { data: files, error: filesError } = await supabase.storage
        .from("blog-images")
        .list();

      if (filesError) {
        console.error(
          "❌ Erreur lors de la récupération des fichiers:",
          filesError
        );
      } else {
        console.log(`✅ ${files.length} fichiers trouvés dans le bucket`);

        if (files.length > 0) {
          console.log("📁 Fichiers dans le bucket:");
          files.slice(0, 5).forEach((file, index) => {
            console.log(`   ${index + 1}. ${file.name}`);
          });
        }
      }
    } catch (error) {
      console.error("❌ Erreur lors du test du bucket:", error);
    }

    // 4. Tester une URL publique générée
    console.log("\n🔗 4. Test de génération d'URL publique...");

    if (posts.length > 0 && posts[0].cover_url) {
      const firstPost = posts[0];
      const urlParts = firstPost.cover_url.split("/");
      const fileName = urlParts[urlParts.length - 1];
      const folderPath = urlParts[urlParts.length - 2];

      console.log(`   Dossier: ${folderPath}`);
      console.log(`   Fichier: ${fileName}`);

      try {
        const { data: urlData } = supabase.storage
          .from("blog-images")
          .getPublicUrl(`${folderPath}/${fileName}`);

        console.log(`   URL générée: ${urlData.publicUrl}`);

        // Tester cette URL générée
        const testResponse = await fetch(urlData.publicUrl, { method: "HEAD" });
        console.log(
          `   Status de l'URL générée: ${testResponse.status} ${testResponse.statusText}`
        );

        if (testResponse.status === 200) {
          console.log(`   ✅ URL générée fonctionne`);
        } else {
          console.log(`   ❌ URL générée ne fonctionne pas`);
        }
      } catch (error) {
        console.error(
          `   ❌ Erreur lors du test de l'URL générée: ${error.message}`
        );
      }
    }
  } catch (error) {
    console.error("❌ Erreur lors du test:", error);
  }
}

// Exécuter les tests
testImageAccess();
