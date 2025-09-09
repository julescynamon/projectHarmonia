#!/usr/bin/env node
// Script de diagnostic pour les images d'articles de blog
// Usage: node scripts/diagnose-blog-images.js

import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { config } from "dotenv";

// Charger les variables d'environnement depuis .env
config();

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Variables d'environnement Supabase manquantes");
  console.log(
    "Vérifiez que PUBLIC_SUPABASE_URL et PUBLIC_SUPABASE_ANON_KEY sont définies"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function diagnoseBlogImages() {
  console.log("🔍 Diagnostic des images d'articles de blog...\n");

  try {
    // 1. Vérifier la structure de la table posts
    console.log("📊 1. Vérification de la structure de la table posts...");
    const { data: posts, error: postsError } = await supabase
      .from("posts")
      .select("id, title, slug, cover_url, cover_alt, status, created_at")
      .order("created_at", { ascending: false });

    if (postsError) {
      console.error(
        "❌ Erreur lors de la récupération des articles:",
        postsError
      );
      return;
    }

    console.log(
      `✅ ${posts.length} articles trouvés dans la base de données\n`
    );

    // Afficher les détails des articles
    console.log("📄 Détails des articles:");
    posts.forEach((post, index) => {
      console.log(`   ${index + 1}. "${post.title}" (${post.slug})`);
      console.log(`      • Image: ${post.cover_url || "Aucune"}`);
      console.log(`      • Statut: ${post.status}`);
      console.log(
        `      • Créé: ${new Date(post.created_at).toLocaleDateString("fr-FR")}`
      );
      console.log("");
    });

    // 2. Analyser les images de couverture
    console.log("🖼️  2. Analyse des images de couverture...");
    const imageAnalysis = {
      withCover: 0,
      withoutCover: 0,
      supabaseUrls: 0,
      localUrls: 0,
      brokenUrls: 0,
      invalidUrls: 0,
    };

    const articlesWithIssues = [];

    for (const post of posts) {
      if (post.cover_url) {
        imageAnalysis.withCover++;

        // Analyser le type d'URL
        if (post.cover_url.includes("supabase.co")) {
          imageAnalysis.supabaseUrls++;
        } else if (post.cover_url.startsWith("/images/")) {
          imageAnalysis.localUrls++;

          // Vérifier si le fichier local existe
          const localPath = path.join(process.cwd(), "public", post.cover_url);
          if (!fs.existsSync(localPath)) {
            imageAnalysis.brokenUrls++;
            articlesWithIssues.push({
              ...post,
              issue: "Fichier local manquant",
              path: localPath,
            });
          }
        } else {
          imageAnalysis.invalidUrls++;
          articlesWithIssues.push({
            ...post,
            issue: "URL invalide",
            url: post.cover_url,
          });
        }
      } else {
        imageAnalysis.withoutCover++;
        articlesWithIssues.push({
          ...post,
          issue: "Aucune image de couverture",
        });
      }
    }

    // Afficher les statistiques
    console.log("📈 Statistiques des images:");
    console.log(
      `   • Articles avec image de couverture: ${imageAnalysis.withCover}`
    );
    console.log(
      `   • Articles sans image de couverture: ${imageAnalysis.withoutCover}`
    );
    console.log(`   • URLs Supabase: ${imageAnalysis.supabaseUrls}`);
    console.log(`   • URLs locales: ${imageAnalysis.localUrls}`);
    console.log(`   • URLs cassées: ${imageAnalysis.brokenUrls}`);
    console.log(`   • URLs invalides: ${imageAnalysis.invalidUrls}\n`);

    // 3. Vérifier le bucket Supabase
    console.log("🪣 3. Vérification du bucket Supabase...");
    const { data: buckets, error: bucketsError } =
      await supabase.storage.listBuckets();

    if (bucketsError) {
      console.error(
        "❌ Erreur lors de la récupération des buckets:",
        bucketsError
      );
    } else {
      console.log(
        `📋 Tous les buckets trouvés: ${buckets.map((b) => b.name).join(", ")}`
      );

      const blogBucket = buckets.find(
        (bucket) => bucket.name === "blog-images"
      );
      if (blogBucket) {
        console.log('✅ Bucket "blog-images" trouvé');
        console.log(`   • Public: ${blogBucket.public}`);
        console.log(
          `   • Limite de taille: ${blogBucket.file_size_limit} bytes`
        );
        console.log(
          `   • Types MIME autorisés: ${blogBucket.allowed_mime_types?.join(", ") || "Tous"}`
        );

        // Lister les fichiers dans le bucket
        const { data: files, error: filesError } = await supabase.storage
          .from("blog-images")
          .list();

        if (filesError) {
          console.error(
            "❌ Erreur lors de la récupération des fichiers:",
            filesError
          );
        } else {
          console.log(`   • Fichiers dans le bucket: ${files.length}`);
          if (files.length > 0) {
            console.log("   • Derniers fichiers:");
            files.slice(0, 5).forEach((file) => {
              console.log(
                `     - ${file.name} (${file.metadata?.size || "N/A"} bytes)`
              );
            });
          }
        }
      } else {
        console.log('❌ Bucket "blog-images" non trouvé');
        console.log(
          "   Buckets disponibles:",
          buckets.map((b) => b.name)
        );
      }
    }

    // 4. Vérifier les fichiers locaux
    console.log("\n📁 4. Vérification des fichiers locaux...");
    const blogImagesPath = path.join(process.cwd(), "public", "images", "blog");
    if (fs.existsSync(blogImagesPath)) {
      const localFiles = fs.readdirSync(blogImagesPath);
      console.log(`✅ Dossier local trouvé: ${localFiles.length} fichiers`);
      localFiles.forEach((file) => {
        const filePath = path.join(blogImagesPath, file);
        const stats = fs.statSync(filePath);
        console.log(`   • ${file} (${Math.round(stats.size / 1024)} KB)`);
      });
    } else {
      console.log('❌ Dossier local "public/images/blog" non trouvé');
    }

    // 5. Afficher les articles avec problèmes
    if (articlesWithIssues.length > 0) {
      console.log("\n🚨 5. Articles avec problèmes:");
      articlesWithIssues.forEach((article) => {
        console.log(`   • "${article.title}" (${article.slug})`);
        console.log(`     Problème: ${article.issue}`);
        if (article.path) {
          console.log(`     Chemin: ${article.path}`);
        }
        if (article.url) {
          console.log(`     URL: ${article.url}`);
        }
        console.log("");
      });
    }

    // 6. Recommandations
    console.log("💡 6. Recommandations:");
    if (imageAnalysis.brokenUrls > 0) {
      console.log(
        "   • Réparer les URLs cassées en uploadant les images manquantes"
      );
    }
    if (imageAnalysis.withoutCover > 0) {
      console.log(
        "   • Ajouter des images de couverture aux articles sans image"
      );
    }
    if (imageAnalysis.invalidUrls > 0) {
      console.log("   • Corriger les URLs invalides dans la base de données");
    }
    if (imageAnalysis.supabaseUrls === 0 && imageAnalysis.localUrls > 0) {
      console.log(
        "   • Considérer migrer les images locales vers Supabase Storage"
      );
    }
  } catch (error) {
    console.error("❌ Erreur lors du diagnostic:", error);
  }
}

// Exécuter le diagnostic
diagnoseBlogImages();
