// Service pour l'upload d'images vers Supabase Storage avec conversion automatique en WebP
// src/lib/image-upload-service-enhanced.ts

import { createClient } from '@supabase/supabase-js';
import type { ImageUploadResult } from '../types/blog';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Variables d\'environnement Supabase manquantes');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export class ImageUploadServiceEnhanced {
  private static readonly BUCKET_NAME = 'blog-images';
  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  private static readonly ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  private static readonly WEBP_QUALITY = 0.85; // Qualité WebP (0.0 à 1.0)

  /**
   * Valider un fichier image
   */
  private static validateFile(file: File): { valid: boolean; error?: string } {
    if (!file) {
      return { valid: false, error: 'Aucun fichier sélectionné' };
    }

    if (file.size > this.MAX_FILE_SIZE) {
      return { valid: false, error: `Fichier trop volumineux. Taille maximum: ${this.MAX_FILE_SIZE / 1024 / 1024}MB` };
    }

    if (!this.ALLOWED_TYPES.includes(file.type)) {
      return { valid: false, error: `Type de fichier non supporté. Types autorisés: ${this.ALLOWED_TYPES.join(', ')}` };
    }

    return { valid: true };
  }

  /**
   * Convertir une image en WebP
   */
  private static async convertToWebP(file: File, quality: number = this.WEBP_QUALITY): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        try {
          canvas.width = img.width;
          canvas.height = img.height;
          
          // Dessiner l'image sur le canvas
          ctx?.drawImage(img, 0, 0);
          
          // Convertir en WebP
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const webpFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.webp'), {
                  type: 'image/webp',
                  lastModified: Date.now()
                });
                resolve(webpFile);
              } else {
                reject(new Error('Erreur lors de la conversion en WebP'));
              }
            },
            'image/webp',
            quality
          );
        } catch (error) {
          reject(new Error('Erreur lors de la conversion: ' + error));
        }
      };

      img.onerror = () => reject(new Error('Erreur lors du chargement de l\'image'));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Générer un nom de fichier unique
   */
  private static generateFileName(file: File, userId: string): string {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split('.').pop();
    return `${userId}/${timestamp}-${randomId}.${extension}`;
  }

  /**
   * Uploader une image avec conversion automatique en WebP
   */
  static async uploadImage(
    file: File, 
    userId: string, 
    onProgress?: (progress: number) => void,
    convertToWebP: boolean = true
  ): Promise<ImageUploadResult> {
    try {
      // Valider le fichier
      const validation = this.validateFile(file);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      let fileToUpload = file;
      let originalFileName = file.name;

      // Conversion en WebP si demandée et si ce n'est pas déjà du WebP
      if (convertToWebP && !file.type.includes('webp') && !file.type.includes('gif')) {
        try {
          onProgress?.(10); // 10% - début de conversion
          fileToUpload = await this.convertToWebP(file);
          onProgress?.(50); // 50% - conversion terminée
          console.log(`Image convertie en WebP: ${originalFileName} -> ${fileToUpload.name}`);
        } catch (conversionError) {
          console.warn('Erreur lors de la conversion WebP, utilisation du fichier original:', conversionError);
          // En cas d'erreur de conversion, on utilise le fichier original
          fileToUpload = file;
        }
      }

      // Générer le nom de fichier
      const fileName = this.generateFileName(fileToUpload, userId);
      const filePath = `${fileName}`;

      onProgress?.(60); // 60% - début de l'upload

      // Upload du fichier
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(filePath, fileToUpload, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw new Error(`Erreur lors de l'upload: ${error.message}`);
      }

      onProgress?.(90); // 90% - upload terminé

      // Récupérer l'URL publique
      const { data: urlData } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(filePath);

      onProgress?.(100); // 100% - terminé

      const result: ImageUploadResult = {
        url: urlData.publicUrl,
        path: filePath,
        filename: fileToUpload.name,
        size: fileToUpload.size,
        mime_type: fileToUpload.type
      };

      return result;
    } catch (error) {
      console.error('Erreur lors de l\'upload de l\'image:', error);
      throw error;
    }
  }

  /**
   * Supprimer une image
   */
  static async deleteImage(filePath: string): Promise<void> {
    try {
      const { error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove([filePath]);

      if (error) {
        throw new Error(`Erreur lors de la suppression: ${error.message}`);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'image:', error);
      throw error;
    }
  }

  /**
   * Lister les images d'un utilisateur
   */
  static async listUserImages(userId: string): Promise<string[]> {
    try {
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list(userId);

      if (error) {
        throw new Error(`Erreur lors de la récupération des images: ${error.message}`);
      }

      return data?.map(file => file.name) || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des images:', error);
      throw error;
    }
  }

  /**
   * Obtenir les statistiques de compression
   */
  static getCompressionStats(originalFile: File, convertedFile: File): {
    originalSize: number;
    convertedSize: number;
    compressionRatio: number;
    savings: number;
  } {
    const originalSize = originalFile.size;
    const convertedSize = convertedFile.size;
    const compressionRatio = ((originalSize - convertedSize) / originalSize) * 100;
    const savings = originalSize - convertedSize;

    return {
      originalSize,
      convertedSize,
      compressionRatio: Math.round(compressionRatio * 100) / 100,
      savings
    };
  }
}
