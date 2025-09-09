#!/usr/bin/env node

/**
 * Script d'installation des dépendances pour la conversion WebP
 * Usage: node scripts/install-webp-dependencies.js
 */

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log("🚀 Installation des dépendances pour la conversion WebP...\n");

  // Vérifier si Sharp est déjà installé
  try {
    await import("sharp");
    console.log("✅ Sharp est déjà installé");
  } catch (error) {
    console.log("📦 Installation de Sharp...");
    try {
      execSync("npm install sharp", { stdio: "inherit" });
      console.log("✅ Sharp installé avec succès");
    } catch (installError) {
      console.error(
        "❌ Erreur lors de l'installation de Sharp:",
        installError.message
      );
      process.exit(1);
    }
  }

  // Vérifier si les fichiers nécessaires existent
  const requiredFiles = [
    "src/lib/image-upload-service-enhanced.ts",
    "src/components/ui/ImageUploadEnhanced.jsx",
    "src/components/admin/PostEditorEnhanced.jsx",
    "scripts/convert-existing-images.js",
  ];

  console.log("\n📋 Vérification des fichiers...");
  let allFilesExist = true;

  requiredFiles.forEach((file) => {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file}`);
    } else {
      console.log(`❌ ${file} - MANQUANT`);
      allFilesExist = false;
    }
  });

  if (!allFilesExist) {
    console.log(
      "\n⚠️  Certains fichiers sont manquants. Assurez-vous que tous les fichiers ont été créés."
    );
  }

  // Vérifier les modifications dans package.json
  const packageJsonPath = "package.json";
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

    if (packageJson.scripts && packageJson.scripts["convert-images"]) {
      console.log("✅ Script convert-images ajouté au package.json");
    } else {
      console.log("⚠️  Script convert-images manquant dans package.json");
    }
  }

  console.log("\n🎉 Installation terminée !");
  console.log("\n📝 Prochaines étapes :");
  console.log("1. Tester le composant ImageUploadEnhanced dans l'admin");
  console.log(
    "2. Optionnel : Convertir les images existantes avec npm run convert-images"
  );
  console.log("3. Vérifier que la conversion WebP fonctionne correctement");

  console.log("\n💡 Pour tester la conversion :");
  console.log("- Allez dans l'admin blog");
  console.log("- Essayez d'uploader une image JPG/PNG");
  console.log("- Vérifiez que les statistiques de compression s'affichent");
}

// Exécuter le script
main().catch(console.error);
