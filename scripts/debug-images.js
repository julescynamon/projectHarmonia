#!/usr/bin/env node
// Script de débogage pour identifier le problème exact avec les images
// Usage: node scripts/debug-images.js

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

async function debugImages() {
  console.log("🔍 Débogage des images d'articles...\n");

  try {
    // 1. Récupérer les articles
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

    // 2. Analyser chaque URL d'image
    for (const post of posts) {
      if (!post.cover_url) {
        console.log(
          `⚠️  Article "${post.title}" n'a pas d'image de couverture`
        );
        continue;
      }

      console.log(`🧪 Analyse de l'image pour: "${post.title}"`);
      console.log(`   URL: ${post.cover_url}`);

      // Vérifier la structure de l'URL
      const urlParts = post.cover_url.split("/");
      const fileName = urlParts[urlParts.length - 1];
      const folderPath = urlParts[urlParts.length - 2];
      const bucketName = urlParts[urlParts.length - 3];

      console.log(`   Bucket: ${bucketName}`);
      console.log(`   Dossier: ${folderPath}`);
      console.log(`   Fichier: ${fileName}`);

      // Tester l'URL avec différents User-Agents
      const userAgents = [
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "curl/7.68.0",
      ];

      for (const userAgent of userAgents) {
        try {
          const response = await fetch(post.cover_url, {
            method: "HEAD",
            headers: { "User-Agent": userAgent },
          });

          console.log(
            `   ${userAgent.split(" ")[0]}: ${response.status} ${response.statusText}`
          );

          if (response.status !== 200) {
            // Essayer de récupérer le contenu de l'erreur
            try {
              const errorResponse = await fetch(post.cover_url, {
                method: "GET",
                headers: { "User-Agent": userAgent },
              });
              const errorText = await errorResponse.text();
              console.log(`   Erreur: ${errorText.substring(0, 100)}...`);
            } catch (e) {
              console.log(`   Erreur lors de la récupération: ${e.message}`);
            }
          }
        } catch (error) {
          console.log(
            `   Erreur avec ${userAgent.split(" ")[0]}: ${error.message}`
          );
        }
      }

      // Tester la génération d'URL publique
      try {
        const { data: urlData } = supabase.storage
          .from("blog-images")
          .getPublicUrl(`${folderPath}/${fileName}`);

        console.log(`   URL générée: ${urlData.publicUrl}`);

        // Comparer avec l'URL stockée
        if (urlData.publicUrl === post.cover_url) {
          console.log(`   ✅ URL générée identique à l'URL stockée`);
        } else {
          console.log(`   ⚠️  URL générée différente de l'URL stockée`);
          console.log(`   Stockée: ${post.cover_url}`);
          console.log(`   Générée: ${urlData.publicUrl}`);
        }
      } catch (error) {
        console.log(
          `   ❌ Erreur lors de la génération d'URL: ${error.message}`
        );
      }

      console.log("");
    }

    // 3. Tester l'accès au bucket
    console.log("🪣 Test d'accès au bucket...");

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
        console.log(
          `✅ ${files.length} fichiers/dossiers trouvés dans le bucket`
        );

        if (files.length > 0) {
          console.log("📁 Contenu du bucket:");
          files.forEach((file, index) => {
            console.log(
              `   ${index + 1}. ${file.name} (${file.metadata?.size || "N/A"} bytes)`
            );
          });
        }
      }
    } catch (error) {
      console.error("❌ Erreur lors du test du bucket:", error);
    }

    // 4. Vérifier les permissions
    console.log("\n🔐 Vérification des permissions...");

    try {
      // Tester l'upload d'un petit fichier de test
      const testContent = "test";
      const testFileName = `test-${Date.now()}.txt`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("blog-images")
        .upload(testFileName, testContent, {
          contentType: "text/plain",
        });

      if (uploadError) {
        console.log(`❌ Erreur d'upload: ${uploadError.message}`);
      } else {
        console.log(`✅ Upload de test réussi: ${uploadData.path}`);

        // Supprimer le fichier de test
        const { error: deleteError } = await supabase.storage
          .from("blog-images")
          .remove([testFileName]);

        if (deleteError) {
          console.log(
            `⚠️  Erreur lors de la suppression du fichier de test: ${deleteError.message}`
          );
        } else {
          console.log(`✅ Fichier de test supprimé`);
        }
      }
    } catch (error) {
      console.error("❌ Erreur lors du test de permissions:", error);
    }
  } catch (error) {
    console.error("❌ Erreur lors du débogage:", error);
  }
}

// Exécuter le débogage
debugImages();
