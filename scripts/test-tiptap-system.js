#!/usr/bin/env node

// Script de test pour le système TipTap
// scripts/test-tiptap-system.js

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Charger les variables d'environnement
dotenv.config();

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Variables d'environnement Supabase manquantes");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testTipTapSystem() {
  console.log("🧪 Test du système TipTap...\n");

  try {
    // 1. Tester la connexion à la base de données
    console.log("1️⃣ Test de connexion à la base de données...");
    const { data: testData, error: testError } = await supabase
      .from("posts")
      .select("count")
      .limit(1);

    if (testError) {
      console.error("❌ Erreur de connexion:", testError.message);
      return false;
    }
    console.log("✅ Connexion à la base de données réussie\n");

    // 2. Vérifier que la table posts existe
    console.log("2️⃣ Vérification de la table posts...");
    const { data: posts, error: postsError } = await supabase
      .from("posts")
      .select("*")
      .limit(5);

    if (postsError) {
      console.error(
        "❌ Erreur lors de la récupération des articles:",
        postsError.message
      );
      return false;
    }
    console.log(
      `✅ Table posts accessible, ${posts.length} articles trouvés\n`
    );

    // 3. Vérifier le bucket de stockage
    console.log("3️⃣ Vérification du bucket blog-images...");
    const { data: buckets, error: bucketsError } =
      await supabase.storage.listBuckets();

    if (bucketsError) {
      console.error(
        "❌ Erreur lors de la récupération des buckets:",
        bucketsError.message
      );
      return false;
    }

    const blogImagesBucket = buckets.find(
      (bucket) => bucket.id === "blog-images"
    );
    if (blogImagesBucket) {
      console.log("✅ Bucket blog-images trouvé");
      console.log(`   - Nom: ${blogImagesBucket.name}`);
      console.log(`   - Public: ${blogImagesBucket.public}`);
      console.log(`   - Taille max: ${blogImagesBucket.file_size_limit} bytes`);
    } else {
      console.log("❌ Bucket blog-images non trouvé");
      return false;
    }
    console.log("");

    // 4. Tester la fonction generate_unique_slug
    console.log("4️⃣ Test de la fonction generate_unique_slug...");
    const { data: slug, error: slugError } = await supabase.rpc(
      "generate_unique_slug",
      {
        title: "Test Article TipTap",
      }
    );

    if (slugError) {
      console.error(
        "❌ Erreur lors de la génération du slug:",
        slugError.message
      );
      return false;
    }
    console.log(`✅ Slug généré: ${slug}\n`);

    // 5. Vérifier les policies RLS
    console.log("5️⃣ Vérification des policies RLS...");
    const { data: policies, error: policiesError } = await supabase
      .from("information_schema.policies")
      .select("*")
      .eq("table_name", "posts");

    if (policiesError) {
      console.error(
        "❌ Erreur lors de la récupération des policies:",
        policiesError.message
      );
      return false;
    }

    console.log(`✅ ${policies.length} policies trouvées pour la table posts:`);
    policies.forEach((policy) => {
      console.log(
        `   - ${policy.policy_name}: ${policy.permissive ? "PERMISSIVE" : "RESTRICTIVE"} ${policy.action}`
      );
    });
    console.log("");

    // 6. Test de création d'un article de test
    console.log("6️⃣ Test de création d'un article de test...");
    const testPost = {
      title: "Article de test TipTap",
      slug: `test-tiptap-${Date.now()}`,
      excerpt: "Cet article teste le système TipTap",
      content: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Ceci est un test du système TipTap avec du contenu JSONB.",
              },
            ],
          },
          {
            type: "heading",
            attrs: { level: 2 },
            content: [
              {
                type: "text",
                text: "Sous-titre de test",
              },
            ],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Le système fonctionne correctement !",
              },
            ],
          },
        ],
      },
      status: "draft",
      tags: ["test", "tiptap"],
      author_id: "00000000-0000-0000-0000-000000000000", // UUID factice pour le test
    };

    const { data: createdPost, error: createError } = await supabase
      .from("posts")
      .insert(testPost)
      .select()
      .single();

    if (createError) {
      console.error(
        "❌ Erreur lors de la création de l'article de test:",
        createError.message
      );
      return false;
    }
    console.log("✅ Article de test créé avec succès");
    console.log(`   - ID: ${createdPost.id}`);
    console.log(`   - Titre: ${createdPost.title}`);
    console.log(`   - Statut: ${createdPost.status}`);
    console.log(
      `   - Contenu JSONB: ${typeof createdPost.content === "object" ? "✅" : "❌"}\n`
    );

    // 7. Nettoyer l'article de test
    console.log("7️⃣ Nettoyage de l'article de test...");
    const { error: deleteError } = await supabase
      .from("posts")
      .delete()
      .eq("id", createdPost.id);

    if (deleteError) {
      console.error(
        "❌ Erreur lors de la suppression de l'article de test:",
        deleteError.message
      );
      return false;
    }
    console.log("✅ Article de test supprimé\n");

    console.log("🎉 Tous les tests sont passés avec succès !");
    console.log("✅ Le système TipTap est prêt à être utilisé.");
    return true;
  } catch (error) {
    console.error("❌ Erreur lors des tests:", error.message);
    return false;
  }
}

// Exécuter les tests
testTipTapSystem()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error("❌ Erreur fatale:", error);
    process.exit(1);
  });
