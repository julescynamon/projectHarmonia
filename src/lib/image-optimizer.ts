// src/lib/image-optimizer.ts
import sharp from 'sharp';

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpeg' | 'png';
  progressive?: boolean;
  lossless?: boolean;
}

export interface OptimizedImageResult {
  originalSize: number;
  optimizedSize: number;
  compressionRatio: number;
  format: string;
  dimensions: { width: number; height: number };
}

export class ImageOptimizer {
  private static readonly DEFAULT_OPTIONS: Required<ImageOptimizationOptions> = {
    width: 1920,
    height: 1080,
    quality: 80,
    format: 'webp',
    progressive: true,
    lossless: false,
  };

  /**
   * Optimise une image avec Sharp
   */
  static async optimizeImage(
    inputBuffer: Buffer,
    options: Partial<ImageOptimizationOptions> = {}
  ): Promise<{ buffer: Buffer; metadata: OptimizedImageResult }> {
    const opts = { ...this.DEFAULT_OPTIONS, ...options };
    
    // Obtenir les métadonnées de l'image originale
    const originalMetadata = await sharp(inputBuffer).metadata();
    const originalSize = inputBuffer.length;

    // Configuration Sharp selon le format
    let sharpInstance = sharp(inputBuffer)
      .resize(opts.width, opts.height, {
        fit: 'inside',
        withoutEnlargement: true,
      });

    // Appliquer les optimisations selon le format
    switch (opts.format) {
      case 'webp':
        sharpInstance = sharpInstance.webp({
          quality: opts.quality,
          progressive: opts.progressive,
          lossless: opts.lossless,
        });
        break;
      case 'avif':
        sharpInstance = sharpInstance.avif({
          quality: opts.quality,
          lossless: opts.lossless,
        });
        break;
      case 'jpeg':
        sharpInstance = sharpInstance.jpeg({
          quality: opts.quality,
          progressive: opts.progressive,
          mozjpeg: true,
        });
        break;
      case 'png':
        sharpInstance = sharpInstance.png({
          progressive: opts.progressive,
          compressionLevel: 9,
        });
        break;
    }

    // Générer l'image optimisée
    const optimizedBuffer = await sharpInstance.toBuffer();
    const optimizedMetadata = await sharp(optimizedBuffer).metadata();

    const result: OptimizedImageResult = {
      originalSize,
      optimizedSize: optimizedBuffer.length,
      compressionRatio: Math.round(((originalSize - optimizedBuffer.length) / originalSize) * 100),
      format: opts.format,
      dimensions: {
        width: optimizedMetadata.width || 0,
        height: optimizedMetadata.height || 0,
      },
    };

    return { buffer: optimizedBuffer, metadata: result };
  }

  /**
   * Génère plusieurs tailles d'image pour le responsive
   */
  static async generateResponsiveImages(
    inputBuffer: Buffer,
    baseOptions: Partial<ImageOptimizationOptions> = {}
  ): Promise<{ [key: string]: { buffer: Buffer; metadata: OptimizedImageResult } }> {
    const sizes = [
      { suffix: 'sm', width: 480, height: 320 },
      { suffix: 'md', width: 768, height: 512 },
      { suffix: 'lg', width: 1024, height: 683 },
      { suffix: 'xl', width: 1920, height: 1280 },
    ];

    const results: { [key: string]: { buffer: Buffer; metadata: OptimizedImageResult } } = {};

    for (const size of sizes) {
      const options = {
        ...baseOptions,
        width: size.width,
        height: size.height,
      };

      results[size.suffix] = await this.optimizeImage(inputBuffer, options);
    }

    return results;
  }

  /**
   * Génère un srcset pour les images responsives
   */
  static generateSrcSet(
    basePath: string,
    format: string = 'webp',
    densities: number[] = [1, 2]
  ): string {
    return densities
      .map(density => `${basePath}?w=${density}x&f=${format} ${density}x`)
      .join(', ');
  }

  /**
   * Calcule les tailles optimales pour le lazy loading
   */
  static calculateSizes(breakpoints: { [key: string]: string } = {}): string {
    const defaultBreakpoints = {
      '(max-width: 480px)': '100vw',
      '(max-width: 768px)': '100vw',
      '(max-width: 1024px)': '50vw',
      '(max-width: 1920px)': '33vw',
    };

    const finalBreakpoints = { ...defaultBreakpoints, ...breakpoints };
    
    return Object.entries(finalBreakpoints)
      .map(([query, size]) => `${query} ${size}`)
      .join(', ');
  }

  /**
   * Valide si une image est optimisée
   */
  static isImageOptimized(filePath: string): boolean {
    const optimizedExtensions = ['.webp', '.avif'];
    const optimizedSuffixes = ['_optimized', '_resultat'];
    
    return (
      optimizedExtensions.some(ext => filePath.endsWith(ext)) ||
      optimizedSuffixes.some(suffix => filePath.includes(suffix))
    );
  }

  /**
   * Obtient le format d'image optimal selon le navigateur
   */
  static getOptimalFormat(userAgent?: string): 'webp' | 'avif' | 'jpeg' {
    if (!userAgent) return 'webp';
    
    // AVIF support (Chrome 85+, Firefox 93+)
    if (userAgent.includes('Chrome/8') || userAgent.includes('Firefox/9')) {
      return 'avif';
    }
    
    // WebP support (Chrome 23+, Firefox 65+, Safari 14+)
    if (
      userAgent.includes('Chrome') ||
      userAgent.includes('Firefox') ||
      userAgent.includes('Safari/1')
    ) {
      return 'webp';
    }
    
    return 'jpeg';
  }
}

