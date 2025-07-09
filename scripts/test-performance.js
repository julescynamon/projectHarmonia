#!/usr/bin/env node

/**
 * Script de test des performances pour Harmonia
 * Usage: node scripts/test-performance.js [url]
 */

import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const args = process.argv.slice(2);
const targetUrl = args[0] || "http://localhost:4321";

console.log("🚀 Test des performances Harmonia");
console.log(`📊 URL cible: ${targetUrl}`);
console.log("");

// Fonction pour exécuter une commande
function runCommand(command) {
  try {
    return execSync(command, { encoding: "utf8", stdio: "pipe" });
  } catch (error) {
    console.error(`❌ Erreur lors de l'exécution: ${command}`);
    console.error(error.message);
    return null;
  }
}

// Test de compression
function testCompression() {
  console.log("🔍 Test de compression...");

  const testFiles = [
    "/assets/index.js",
    "/assets/index.css",
    "/assets/fonts.css",
  ];

  testFiles.forEach((file) => {
    const url = `${targetUrl}${file}`;
    const response = runCommand(
      `curl -I -H "Accept-Encoding: gzip, br" "${url}"`
    );

    if (response) {
      const hasGzip = response.includes("content-encoding: gzip");
      const hasBrotli = response.includes("content-encoding: br");

      console.log(`  ${file}:`);
      console.log(`    Gzip: ${hasGzip ? "✅" : "❌"}`);
      console.log(`    Brotli: ${hasBrotli ? "✅" : "❌"}`);
    }
  });

  console.log("");
}

// Test des en-têtes de cache
function testCacheHeaders() {
  console.log("💾 Test des en-têtes de cache...");

  const testAssets = ["/assets/index.js", "/assets/index.css", "/favicon.ico"];

  testAssets.forEach((asset) => {
    const url = `${targetUrl}${asset}`;
    const response = runCommand(`curl -I "${url}"`);

    if (response) {
      const hasCacheControl = response.includes("cache-control");
      const hasExpires = response.includes("expires");

      console.log(`  ${asset}:`);
      console.log(`    Cache-Control: ${hasCacheControl ? "✅" : "❌"}`);
      console.log(`    Expires: ${hasExpires ? "✅" : "❌"}`);

      if (hasCacheControl) {
        const cacheMatch = response.match(/cache-control:\s*(.+)/i);
        if (cacheMatch) {
          console.log(`    Valeur: ${cacheMatch[1].trim()}`);
        }
      }
    }
  });

  console.log("");
}

// Test de la taille des bundles
function testBundleSize() {
  console.log("📦 Test de la taille des bundles...");

  try {
    const distPath = join(process.cwd(), "dist");
    const files = runCommand(`find ${distPath} -name "*.js" -o -name "*.css"`);

    if (files) {
      const fileList = files.trim().split("\n");

      fileList.forEach((file) => {
        if (file) {
          const stats = runCommand(`ls -lh "${file}"`);
          if (stats) {
            const sizeMatch = stats.match(/\s+(\d+[KMG])\s+/);
            if (sizeMatch) {
              const size = sizeMatch[1];
              const fileName = file.split("/").pop();
              console.log(`  ${fileName}: ${size}`);
            }
          }
        }
      });
    }
  } catch (error) {
    console.log(
      "  ⚠️  Impossible de vérifier la taille des bundles (dossier dist non trouvé)"
    );
  }

  console.log("");
}

// Test de Lighthouse (si disponible)
function testLighthouse() {
  console.log("🏗️  Test Lighthouse...");

  const lighthouseResult = runCommand(
    `npx lighthouse ${targetUrl} --output=json --only-categories=performance`
  );

  if (lighthouseResult) {
    try {
      const data = JSON.parse(lighthouseResult);
      const scores = data.lighthouseResult.categories.performance.score * 100;

      console.log(`  Score de performance: ${scores.toFixed(1)}/100`);

      const audits = data.lighthouseResult.audits;

      // Core Web Vitals
      const lcp = audits["largest-contentful-paint"];
      const fid = audits["max-potential-fid"];
      const cls = audits["cumulative-layout-shift"];

      console.log(`  LCP: ${lcp ? lcp.displayValue : "N/A"}`);
      console.log(`  FID: ${fid ? fid.displayValue : "N/A"}`);
      console.log(`  CLS: ${cls ? cls.displayValue : "N/A"}`);
    } catch (error) {
      console.log("  ⚠️  Impossible de parser les résultats Lighthouse");
    }
  } else {
    console.log(
      "  ⚠️  Lighthouse non disponible (installez-le avec: npm install -g lighthouse)"
    );
  }

  console.log("");
}

// Test de vitesse de chargement
function testLoadSpeed() {
  console.log("⚡ Test de vitesse de chargement...");

  const startTime = Date.now();
  const response = runCommand(
    `curl -s -o /dev/null -w "%{time_total}" "${targetUrl}"`
  );

  if (response) {
    const loadTime = parseFloat(response) * 1000; // Convertir en millisecondes
    console.log(`  Temps de chargement: ${loadTime.toFixed(2)}ms`);

    if (loadTime < 1000) {
      console.log("  ✅ Excellent (< 1s)");
    } else if (loadTime < 2000) {
      console.log("  ✅ Bon (< 2s)");
    } else if (loadTime < 3000) {
      console.log("  ⚠️  Moyen (< 3s)");
    } else {
      console.log("  ❌ Lent (> 3s)");
    }
  }

  console.log("");
}

// Test de compression des images
function testImageOptimization() {
  console.log("🖼️  Test d'optimisation des images...");

  const imageExtensions = ["webp", "avif", "png", "jpg", "jpeg"];

  imageExtensions.forEach((ext) => {
    const testUrl = `${targetUrl}/images/test.${ext}`;
    const response = runCommand(`curl -I "${testUrl}"`);

    if (response && !response.includes("404")) {
      const contentLength = response.match(/content-length:\s*(\d+)/i);
      if (contentLength) {
        const size = parseInt(contentLength[1]);
        const sizeKB = (size / 1024).toFixed(1);
        console.log(`  ${ext.toUpperCase()}: ${sizeKB}KB`);
      }
    }
  });

  console.log("");
}

// Génération du rapport
function generateReport() {
  console.log("📋 Génération du rapport...");

  const report = {
    timestamp: new Date().toISOString(),
    url: targetUrl,
    tests: {
      compression: "Testé",
      cache: "Testé",
      bundleSize: "Testé",
      lighthouse: "Testé",
      loadSpeed: "Testé",
      images: "Testé",
    },
  };

  const reportPath = join(
    process.cwd(),
    "test-results",
    "performance-report.json"
  );

  try {
    writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`  📄 Rapport sauvegardé: ${reportPath}`);
  } catch (error) {
    console.log("  ⚠️  Impossible de sauvegarder le rapport");
  }

  console.log("");
}

// Fonction principale
function main() {
  console.log("🎯 Démarrage des tests de performance...\n");

  testCompression();
  testCacheHeaders();
  testBundleSize();
  testLighthouse();
  testLoadSpeed();
  testImageOptimization();
  generateReport();

  console.log("✅ Tests de performance terminés !");
  console.log("");
  console.log("💡 Conseils d'optimisation:");
  console.log("  - Vérifiez que la compression Gzip/Brotli est activée");
  console.log("  - Optimisez les images avec WebP/AVIF");
  console.log("  - Minimisez la taille des bundles JavaScript");
  console.log("  - Configurez les en-têtes de cache appropriés");
  console.log("  - Utilisez le lazy loading pour les images");
  console.log("  - Implémentez un service worker pour le cache");
}

// Exécution
if (require.main === module) {
  main();
}
