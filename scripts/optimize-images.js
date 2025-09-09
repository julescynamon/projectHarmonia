#!/usr/bin/env node
// scripts/optimize-images.js
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

class ImageOptimizerScript {
  constructor() {
    this.inputDir = path.join(projectRoot, 'public/images');
    this.outputDir = path.join(projectRoot, 'public/images-optimized');
    this.supportedFormats = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff'];
    this.optimizedFormats = ['webp', 'avif'];
    this.quality = 80;
    this.maxWidth = 1920;
    this.maxHeight = 1080;
  }

  async run() {
    console.log('🚀 Début de l\'optimisation des images...');
    console.log(`📁 Répertoire source: ${this.inputDir}`);
    console.log(`📁 Répertoire de sortie: ${this.outputDir}`);

    try {
      // Créer le répertoire de sortie
      await fs.mkdir(this.outputDir, { recursive: true });

      // Analyser les images existantes
      const imageStats = await this.analyzeImages();
      console.log(`📊 Images trouvées: ${imageStats.total}`);
      console.log(`💾 Taille totale: ${this.formatBytes(imageStats.totalSize)}`);

      // Nettoyer les images dupliquées
      await this.cleanupDuplicates();

      // Optimiser les images
      const results = await this.optimizeAllImages();
      
      // Générer le rapport
      await this.generateReport(results);

      console.log('✅ Optimisation terminée avec succès!');
      console.log(`💾 Économie d'espace: ${this.formatBytes(results.totalSavings)}`);
      console.log(`📈 Taux de compression moyen: ${results.averageCompression}%`);

    } catch (error) {
      console.error('❌ Erreur lors de l\'optimisation:', error);
      process.exit(1);
    }
  }

  async analyzeImages() {
    const files = await this.getAllImageFiles(this.inputDir);
    let totalSize = 0;

    for (const file of files) {
      const stats = await fs.stat(file);
      totalSize += stats.size;
    }

    return {
      total: files.length,
      totalSize,
      files
    };
  }

  async getAllImageFiles(dir) {
    const files = [];
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        const subFiles = await this.getAllImageFiles(fullPath);
        files.push(...subFiles);
      } else if (this.supportedFormats.some(ext => entry.name.toLowerCase().endsWith(ext))) {
        files.push(fullPath);
      }
    }

    return files;
  }

  async cleanupDuplicates() {
    console.log('🧹 Nettoyage des images dupliquées...');
    
    const files = await this.getAllImageFiles(this.inputDir);
    const duplicates = [];

    for (const file of files) {
      if (file.includes('_resultat.') || file.includes('_optimized.')) {
        duplicates.push(file);
      }
    }

    console.log(`🗑️  Suppression de ${duplicates.length} images dupliquées...`);
    
    for (const duplicate of duplicates) {
      try {
        await fs.unlink(duplicate);
        console.log(`   Supprimé: ${path.basename(duplicate)}`);
      } catch (error) {
        console.warn(`   ⚠️  Impossible de supprimer: ${path.basename(duplicate)}`);
      }
    }
  }

  async optimizeAllImages() {
    const files = await this.getAllImageFiles(this.inputDir);
    const results = {
      processed: 0,
      skipped: 0,
      errors: 0,
      totalSavings: 0,
      averageCompression: 0,
      details: []
    };

    console.log(`🔄 Optimisation de ${files.length} images...`);

    for (const file of files) {
      try {
        const result = await this.optimizeImage(file);
        results.details.push(result);
        
        if (result.success) {
          results.processed++;
          results.totalSavings += result.savings;
          console.log(`   ✅ ${path.basename(file)} - ${result.compression}% compression`);
        } else {
          results.skipped++;
          console.log(`   ⏭️  ${path.basename(file)} - déjà optimisé`);
        }
      } catch (error) {
        results.errors++;
        console.error(`   ❌ ${path.basename(file)} - erreur: ${error.message}`);
      }
    }

    // Calculer la compression moyenne
    const successfulOptimizations = results.details.filter(r => r.success);
    if (successfulOptimizations.length > 0) {
      results.averageCompression = Math.round(
        successfulOptimizations.reduce((sum, r) => sum + r.compression, 0) / successfulOptimizations.length
      );
    }

    return results;
  }

  async optimizeImage(filePath) {
    const fileName = path.basename(filePath, path.extname(filePath));
    const relativePath = path.relative(this.inputDir, filePath);
    const outputDir = path.join(this.outputDir, path.dirname(relativePath));
    
    // Créer le répertoire de sortie
    await fs.mkdir(outputDir, { recursive: true });

    const inputBuffer = await fs.readFile(filePath);
    const originalSize = inputBuffer.length;

    // Vérifier si l'image est déjà optimisée
    if (this.isAlreadyOptimized(filePath)) {
      return {
        file: path.basename(filePath),
        success: false,
        reason: 'already_optimized',
        compression: 0,
        savings: 0
      };
    }

    const results = [];

    // Générer les formats optimisés
    for (const format of this.optimizedFormats) {
      try {
        let sharpInstance = sharp(inputBuffer)
          .resize(this.maxWidth, this.maxHeight, {
            fit: 'inside',
            withoutEnlargement: true,
          });

        if (format === 'webp') {
          sharpInstance = sharpInstance.webp({ quality: this.quality });
        } else if (format === 'avif') {
          sharpInstance = sharpInstance.avif({ quality: this.quality });
        }

        const outputBuffer = await sharpInstance.toBuffer();
        const outputPath = path.join(outputDir, `${fileName}.${format}`);
        
        await fs.writeFile(outputPath, outputBuffer);
        
        const compression = Math.round(((originalSize - outputBuffer.length) / originalSize) * 100);
        const savings = originalSize - outputBuffer.length;

        results.push({
          format,
          size: outputBuffer.length,
          compression,
          savings
        });

      } catch (error) {
        console.warn(`   ⚠️  Erreur avec le format ${format}: ${error.message}`);
      }
    }

    // Retourner le meilleur résultat
    const bestResult = results.reduce((best, current) => 
      current.compression > best.compression ? current : best
    );

    return {
      file: path.basename(filePath),
      success: true,
      originalSize,
      ...bestResult,
      formats: results.length
    };
  }

  isAlreadyOptimized(filePath) {
    const fileName = path.basename(filePath);
    return (
      fileName.includes('_resultat.') ||
      fileName.includes('_optimized.') ||
      fileName.endsWith('.webp') ||
      fileName.endsWith('.avif')
    );
  }

  async generateReport(results) {
    const reportPath = path.join(projectRoot, 'docs', 'IMAGE_OPTIMIZATION_REPORT.md');
    
    const report = `# Rapport d'Optimisation des Images

## 📊 Résumé
- **Images traitées**: ${results.processed}
- **Images ignorées**: ${results.skipped}
- **Erreurs**: ${results.errors}
- **Économie totale**: ${this.formatBytes(results.totalSavings)}
- **Compression moyenne**: ${results.averageCompression}%

## 📈 Détails par Image

${results.details.map(detail => `
### ${detail.file}
- **Statut**: ${detail.success ? '✅ Optimisé' : '⏭️ Ignoré'}
- **Compression**: ${detail.compression}%
- **Économie**: ${this.formatBytes(detail.savings)}
- **Formats générés**: ${detail.formats || 0}
`).join('\n')}

## 🎯 Recommandations

1. **Utiliser WebP** pour la compatibilité maximale
2. **Utiliser AVIF** pour les navigateurs modernes
3. **Implémenter le lazy loading** pour les images non critiques
4. **Utiliser des tailles responsives** selon les breakpoints

## 📅 Généré le ${new Date().toLocaleDateString('fr-FR')}
`;

    await fs.mkdir(path.dirname(reportPath), { recursive: true });
    await fs.writeFile(reportPath, report);
    console.log(`📄 Rapport généré: ${reportPath}`);
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Exécuter le script
const optimizer = new ImageOptimizerScript();
optimizer.run().catch(console.error);

