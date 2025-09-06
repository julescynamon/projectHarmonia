// Service pour l'upload d'images vers Supabase Storage
// src/lib/image-upload-service.ts

import { createClient } from '@supabase/supabase-js';
import { ImageUploadResult } from '../types/blog';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Variables d\'environnement Supabase manquantes');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export class ImageUploadService {
  private static readonly BUCKET_NAME = 'blog-images';
  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  private static readonly ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

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
   * Générer un nom de fichier unique
   */
  private static generateFileName(file: File, userId: string): string {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split('.').pop();
    return `${userId}/${timestamp}-${randomId}.${extension}`;
  }

  /**
   * Uploader une image
   */
  static async uploadImage(
    file: File, 
    userId: string, 
    onProgress?: (progress: number) => void
  ): Promise<ImageUploadResult> {
    try {
      // Valider le fichier
      const validation = this.validateFile(file);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      // Générer le nom de fichier
      const fileName = this.generateFileName(file, userId);
      const filePath = `${fileName}`;

      // Upload du fichier
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw new Error(`Erreur lors de l'upload: ${error.message}`);
      }

      // Récupérer l'URL publique
      const { data: urlData } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(filePath);

      const result: ImageUploadResult = {
        url: urlData.publicUrl,
        path: filePath,
        filename: file.name,
        size: file.size,
        mime_type: file.type
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
   * Générer des URLs responsives pour les images
   */
  static generateResponsiveUrls(baseUrl: string, widths: number[] = [480, 768, 1200, 1600]): string[] {
    return widths.map(width => `${baseUrl}?width=${width}&quality=80&resize=contain`);
  }

  /**
   * Générer un srcset pour les images responsives
   */
  static generateSrcSet(baseUrl: string, widths: number[] = [480, 768, 1200, 1600]): string {
    const urls = this.generateResponsiveUrls(baseUrl, widths);
    return urls.map((url, index) => `${url} ${widths[index]}w`).join(', ');
  }

  /**
   * Optimiser une image existante (redimensionnement via Supabase)
   */
  static optimizeImage(url: string, width: number, height?: number, quality = 80): string {
    const params = new URLSearchParams();
    params.append('width', width.toString());
    params.append('quality', quality.toString());
    
    if (height) {
      params.append('height', height.toString());
    }
    
    params.append('resize', 'contain');
    
    return `${url}?${params.toString()}`;
  }

  /**
   * Vérifier si une image existe
   */
  static async imageExists(filePath: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list(filePath.split('/').slice(0, -1).join('/'));

      if (error) {
        return false;
      }

      const fileName = filePath.split('/').pop();
      return data?.some(file => file.name === fileName) || false;
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'existence de l\'image:', error);
      return false;
    }
  }

  /**
   * Obtenir les métadonnées d'une image
   */
  static async getImageMetadata(filePath: string): Promise<{ size: number; mimeType: string; lastModified: string } | null> {
    try {
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list(filePath.split('/').slice(0, -1).join('/'));

      if (error) {
        return null;
      }

      const fileName = filePath.split('/').pop();
      const file = data?.find(f => f.name === fileName);

      if (!file) {
        return null;
      }

      return {
        size: file.metadata?.size || 0,
        mimeType: file.metadata?.mimetype || 'unknown',
        lastModified: file.updated_at || file.created_at || ''
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des métadonnées de l\'image:', error);
      return null;
    }
  }
}
