#!/usr/bin/env node

/**
 * Script pour configurer l'environnement de test
 * Usage: node scripts/setup-test-env.js
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, "..");

function setupTestEnvironment() {
  console.log("🚀 Configuration de l'environnement de test...\n");

  const examplePath = resolve(__dirname, "..", "config", "test.env.example");
  const targetPath = resolve(__dirname, "..", ".env.test");

  // Vérifier si le fichier d'exemple existe
  if (!existsSync(examplePath)) {
    console.error("❌ Fichier config/test.env.example introuvable");
    process.exit(1);
  }

  // Vérifier si .env.test existe déjà
  if (existsSync(targetPath)) {
    console.log("⚠️  Le fichier .env.test existe déjà");
    const response = prompt("Voulez-vous le remplacer ? (y/N): ");
    if (response.toLowerCase() !== "y" && response.toLowerCase() !== "yes") {
      console.log("❌ Configuration annulée");
      process.exit(0);
    }
  }

  try {
    // Lire le fichier d'exemple
    const exampleContent = readFileSync(examplePath, "utf8");

    // Créer le fichier .env.test
    writeFileSync(targetPath, exampleContent, "utf8");

    console.log("✅ Fichier .env.test créé avec succès");
    console.log("📝 Modifiez les variables dans .env.test selon vos besoins");
    console.log("🔧 Variables importantes à configurer :");
    console.log("   - PUBLIC_SUPABASE_URL");
    console.log("   - PUBLIC_SUPABASE_ANON_KEY");
    console.log("   - SUPABASE_SERVICE_KEY");
    console.log("   - STRIPE_SECRET_KEY");
    console.log("   - RESEND_API_KEY");
    console.log("\n🎯 Vous pouvez maintenant exécuter vos tests avec :");
    console.log("   npm run test:run");
    console.log("   npm run test:e2e");
  } catch (error) {
    console.error(
      "❌ Erreur lors de la création du fichier .env.test:",
      error.message
    );
    process.exit(1);
  }
}

function prompt(message) {
  const readline = require("readline");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(message, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

// Exécuter le script
setupTestEnvironment();
