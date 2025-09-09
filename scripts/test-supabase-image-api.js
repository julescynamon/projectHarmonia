#!/usr/bin/env node
// Script de test pour l'API de transformation d'images Supabase
// Usage: node scripts/test-supabase-image-api.js

import { config } from "dotenv";
import fs from "fs";

// Charger les variables d'environnement
config();

// URLs d'images de test depuis le diagnostic précédent
const testUrls = [
  "https://hvthtebjvmutuvzvttdb.supabase.co/storage/v1/object/public/blog-images/16343c97-e11d-416f-b64c-e43933d19d45/1757179264461-i6jj22spoc.jpg",
  "https://hvthtebjvmutuvzvttdb.supabase.co/storage/v1/object/public/blog-images/16343c97-e11d-416f-b64c-e43933d19d45/1756891685116-audtskh642.jpg",
  "https://hvthtebjvmutuvzvttdb.supabase.co/storage/v1/object/public/blog-images/16343c97-e11d-416f-b64c-e43933d19d45/1756834069598-qw24lsxphhl.jpg",
];

// Fonction pour tester une URL d'image
async function testImageUrl(originalUrl, testName) {
  console.log(`\n🧪 Test: ${testName}`);
  console.log(`📷 URL originale: ${originalUrl}`);

  try {
    // Test 1: URL originale (sans paramètres)
    console.log("\n1️⃣ Test URL originale...");
    const response1 = await fetch(originalUrl, { method: "HEAD" });
    console.log(`   Status: ${response1.status} ${response1.statusText}`);
    console.log(`   Content-Type: ${response1.headers.get("content-type")}`);
    console.log(
      `   Content-Length: ${response1.headers.get("content-length")} bytes`
    );

    // Test 2: URL avec paramètres de transformation Supabase
    const transformedUrl =
      originalUrl.replace("/object/public/", "/render/image/public/") +
      "?width=800&height=600&quality=80";
    console.log("\n2️⃣ Test URL avec transformation...");
    console.log(`   URL transformée: ${transformedUrl}`);

    const response2 = await fetch(transformedUrl, { method: "HEAD" });
    console.log(`   Status: ${response2.status} ${response2.statusText}`);
    console.log(`   Content-Type: ${response2.headers.get("content-type")}`);
    console.log(
      `   Content-Length: ${response2.headers.get("content-length")} bytes`
    );

    // Test 3: URL avec format WebP explicite
    const webpUrl =
      originalUrl.replace("/object/public/", "/render/image/public/") +
      "?width=800&height=600&quality=80&format=webp";
    console.log("\n3️⃣ Test URL avec format WebP...");
    console.log(`   URL WebP: ${webpUrl}`);

    const response3 = await fetch(webpUrl, { method: "HEAD" });
    console.log(`   Status: ${response3.status} ${response3.statusText}`);
    console.log(`   Content-Type: ${response3.headers.get("content-type")}`);
    console.log(
      `   Content-Length: ${response3.headers.get("content-length")} bytes`
    );

    // Test 4: URL avec format AVIF
    const avifUrl =
      originalUrl.replace("/object/public/", "/render/image/public/") +
      "?width=800&height=600&quality=80&format=avif";
    console.log("\n4️⃣ Test URL avec format AVIF...");
    console.log(`   URL AVIF: ${avifUrl}`);

    const response4 = await fetch(avifUrl, { method: "HEAD" });
    console.log(`   Status: ${response4.status} ${response4.statusText}`);
    console.log(`   Content-Type: ${response4.headers.get("content-type")}`);
    console.log(
      `   Content-Length: ${response4.headers.get("content-length")} bytes`
    );

    // Résumé des résultats
    console.log("\n📊 Résumé des tests:");
    console.log(
      `   ✅ Originale: ${response1.status === 200 ? "OK" : "ERREUR"}`
    );
    console.log(
      `   ${response2.status === 200 ? "✅" : "❌"} Transformation: ${response2.status === 200 ? "OK" : "ERREUR"}`
    );
    console.log(
      `   ${response3.status === 200 ? "✅" : "❌"} WebP: ${response3.status === 200 ? "OK" : "ERREUR"}`
    );
    console.log(
      `   ${response4.status === 200 ? "✅" : "❌"} AVIF: ${response4.status === 200 ? "OK" : "ERREUR"}`
    );

    return {
      original: response1.status === 200,
      transformed: response2.status === 200,
      webp: response3.status === 200,
      avif: response4.status === 200,
    };
  } catch (error) {
    console.error(`❌ Erreur lors du test: ${error.message}`);
    return {
      original: false,
      transformed: false,
      webp: false,
      avif: false,
    };
  }
}

// Fonction pour tester différentes syntaxes de paramètres
async function testParameterSyntaxes(originalUrl) {
  console.log("\n🔧 Test des différentes syntaxes de paramètres...");

  const baseUrl = originalUrl.replace(
    "/object/public/",
    "/render/image/public/"
  );

  const syntaxes = [
    { name: "Syntaxe 1", url: baseUrl + "?width=800&height=600&quality=80" },
    { name: "Syntaxe 2", url: baseUrl + "?w=800&h=600&q=80" },
    {
      name: "Syntaxe 3",
      url: baseUrl + "?width=800&height=600&quality=80&format=webp",
    },
    { name: "Syntaxe 4", url: baseUrl + "?w=800&h=600&q=80&f=webp" },
    { name: "Syntaxe 5", url: baseUrl + "?resize=800x600&quality=80" },
  ];

  for (const syntax of syntaxes) {
    try {
      console.log(`\n   ${syntax.name}: ${syntax.url}`);
      const response = await fetch(syntax.url, { method: "HEAD" });
      console.log(`   Status: ${response.status} ${response.statusText}`);
      if (response.status === 200) {
        console.log(`   Content-Type: ${response.headers.get("content-type")}`);
        console.log(`   ✅ ${syntax.name} fonctionne !`);
      } else {
        console.log(`   ❌ ${syntax.name} ne fonctionne pas`);
      }
    } catch (error) {
      console.log(`   ❌ ${syntax.name} - Erreur: ${error.message}`);
    }
  }
}

// Fonction principale
async function testSupabaseImageAPI() {
  console.log("🔍 Test de l'API de transformation d'images Supabase...\n");

  if (testUrls.length === 0) {
    console.log("❌ Aucune URL de test disponible");
    return;
  }

  const results = [];

  // Tester chaque URL
  for (let i = 0; i < testUrls.length; i++) {
    const url = testUrls[i];
    const result = await testImageUrl(url, `Image ${i + 1}`);
    results.push(result);

    // Attendre un peu entre les tests pour éviter de surcharger
    if (i < testUrls.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  // Tester les syntaxes de paramètres avec la première URL
  if (testUrls.length > 0) {
    await testParameterSyntaxes(testUrls[0]);
  }

  // Résumé global
  console.log("\n" + "=".repeat(60));
  console.log("📋 RÉSUMÉ GLOBAL DES TESTS");
  console.log("=".repeat(60));

  const summary = {
    original: results.filter((r) => r.original).length,
    transformed: results.filter((r) => r.transformed).length,
    webp: results.filter((r) => r.webp).length,
    avif: results.filter((r) => r.avif).length,
    total: results.length,
  };

  console.log(`📷 Images testées: ${summary.total}`);
  console.log(
    `✅ URLs originales fonctionnelles: ${summary.original}/${summary.total}`
  );
  console.log(
    `🔄 Transformation d'images: ${summary.transformed}/${summary.total}`
  );
  console.log(`🎨 Format WebP: ${summary.webp}/${summary.total}`);
  console.log(`🚀 Format AVIF: ${summary.avif}/${summary.total}`);

  // Recommandations
  console.log("\n💡 RECOMMANDATIONS:");

  if (summary.original === summary.total) {
    console.log("✅ Les images originales sont accessibles");
  } else {
    console.log("❌ Certaines images originales ne sont pas accessibles");
  }

  if (summary.transformed > 0) {
    console.log("✅ L'API de transformation Supabase fonctionne");
    console.log("   → Vous pouvez utiliser les paramètres de transformation");
  } else {
    console.log("❌ L'API de transformation Supabase ne fonctionne pas");
    console.log("   → Vérifiez que l'Image Transformation API est activée");
    console.log("   → Utilisez les URLs originales sans paramètres");
  }

  if (summary.webp > 0) {
    console.log("✅ Le format WebP est supporté");
  } else {
    console.log("❌ Le format WebP n'est pas supporté");
  }

  if (summary.avif > 0) {
    console.log("✅ Le format AVIF est supporté");
  } else {
    console.log("❌ Le format AVIF n'est pas supporté");
  }
}

// Exécuter les tests
testSupabaseImageAPI().catch(console.error);
