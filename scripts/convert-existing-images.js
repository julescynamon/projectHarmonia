#!/usr/bin/env node

/**
 * Script pour convertir les images existantes du blog en WebP
 * Usage: node scripts/convert-existing-images.js
 */

import fs from "fs";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const IMAGES_DIR = path.join(__dirname, "../public/images");
const QUALITY = 85; // Qualité WebP (0-100)
const SUPPORTED_FORMATS = [".jpg", ".jpeg", ".png"];

/**
 * Convertir une image en WebP
 */
async function convertImageToWebP(inputPath, outputPath) {
  try {
    const stats = await fs.promises.stat(inputPath);
    const originalSize = stats.size;

    await sharp(inputPath).webp({ quality: QUALITY }).toFile(outputPath);

    const newStats = await fs.promises.stat(outputPath);
    const newSize = newStats.size;
    const compressionRatio = ((originalSize - newSize) / originalSize) * 100;

    return {
      success: true,
      originalSize,
      newSize,
      compressionRatio: Math.round(compressionRatio * 100) / 100,
      savings: originalSize - newSize,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Parcourir récursivement un dossier
 */
async function walkDirectory(dir, callback) {
  const files = await fs.promises.readdir(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = await fs.promises.stat(filePath);

    if (stat.isDirectory()) {
      await walkDirectory(filePath, callback);
    } else {
      await callback(filePath);
    }
  }
}

/**
 * Fonction principale
 */
async function main() {
  // Vérifier si Sharp est installé
  try {
    await import("sharp");
  } catch (error) {
    console.error("❌ Sharp n'est pas installé. Installez-le avec:");
    console.error("npm install sharp");
    process.exit(1);
  }

  console.log("🔄 Début de la conversion des images en WebP...\n");

  const results = {
    converted: 0,
    skipped: 0,
    errors: 0,
    totalSavings: 0,
  };

  try {
    await walkDirectory(IMAGES_DIR, async (filePath) => {
      const ext = path.extname(filePath).toLowerCase();

      if (SUPPORTED_FORMATS.includes(ext)) {
        const webpPath = filePath.replace(ext, ".webp");

        // Vérifier si le fichier WebP existe déjà
        try {
          await fs.promises.access(webpPath);
          console.log(
            `⏭️  Ignoré (WebP existe déjà): ${path.relative(IMAGES_DIR, filePath)}`
          );
          results.skipped++;
          return;
        } catch {
          // Le fichier WebP n'existe pas, on peut convertir
        }

        console.log(`🔄 Conversion: ${path.relative(IMAGES_DIR, filePath)}`);

        const result = await convertImageToWebP(filePath, webpPath);

        if (result.success) {
          console.log(
            `✅ Converti: ${path.basename(filePath)} -> ${path.basename(webpPath)}`
          );
          console.log(
            `   📊 Réduction: ${result.compressionRatio}% (${(result.savings / 1024).toFixed(1)} KB économisés)`
          );
          results.converted++;
          results.totalSavings += result.savings;
        } else {
          console.log(
            `❌ Erreur: ${path.basename(filePath)} - ${result.error}`
          );
          results.errors++;
        }
      }
    });

    // Résumé
    console.log("\n📊 Résumé de la conversion:");
    console.log(`✅ Images converties: ${results.converted}`);
    console.log(`⏭️  Images ignorées: ${results.skipped}`);
    console.log(`❌ Erreurs: ${results.errors}`);
    console.log(
      `💾 Économie totale: ${(results.totalSavings / 1024).toFixed(1)} KB`
    );

    if (results.converted > 0) {
      console.log("\n🎉 Conversion terminée avec succès !");
      console.log(
        "💡 N'oubliez pas de mettre à jour les références dans le code."
      );
    }
  } catch (error) {
    console.error("❌ Erreur lors de la conversion:", error.message);
    process.exit(1);
  }
}

// Exécuter le script
main().catch(console.error);
