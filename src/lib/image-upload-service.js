// Service pour l'upload d'images vers Supabase Storage (version JavaScript)
// src/lib/image-upload-service.js

import { supabase } from "./supabase-client.js";

export class ImageUploadService {
  static BUCKET_NAME = "blog-images";
  static MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  static ALLOWED_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
  ];

  /**
   * Valider un fichier image
   */
  static validateFile(file) {
    if (!file) {
      return { valid: false, error: "Aucun fichier sélectionné" };
    }

    if (file.size > this.MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `Fichier trop volumineux. Taille maximum: ${this.MAX_FILE_SIZE / 1024 / 1024}MB`,
      };
    }

    if (!this.ALLOWED_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: `Type de fichier non supporté. Types autorisés: ${this.ALLOWED_TYPES.join(", ")}`,
      };
    }

    return { valid: true };
  }

  /**
   * Générer un nom de fichier unique
   */
  static generateFileName(file, userId) {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split(".").pop();
    return `${userId}/${timestamp}-${randomId}.${extension}`;
  }

  /**
   * Uploader une image
   */
  static async uploadImage(file, userId, onProgress) {
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
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        throw new Error(`Erreur lors de l'upload: ${error.message}`);
      }

      // Récupérer l'URL publique
      const { data: urlData } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(filePath);

      const result = {
        url: urlData.publicUrl,
        path: filePath,
        filename: file.name,
        size: file.size,
        mime_type: file.type,
      };

      return result;
    } catch (error) {
      console.error("Erreur lors de l'upload de l'image:", error);
      throw error;
    }
  }

  /**
   * Supprimer une image
   */
  static async deleteImage(filePath) {
    try {
      const { error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove([filePath]);

      if (error) {
        throw new Error(`Erreur lors de la suppression: ${error.message}`);
      }

      return { success: true };
    } catch (error) {
      console.error("Erreur lors de la suppression de l'image:", error);
      throw error;
    }
  }

  /**
   * Générer des URLs responsives
   */
  static generateResponsiveUrls(baseUrl, widths = [480, 768, 1200, 1600]) {
    return widths.map((width) => ({
      width,
      url: `${baseUrl}?width=${width}&quality=80&resize=contain`,
    }));
  }

  /**
   * Générer un srcset pour les images responsives
   */
  static generateSrcSet(baseUrl, widths = [480, 768, 1200, 1600]) {
    const urls = this.generateResponsiveUrls(baseUrl, widths);
    return urls.map(({ width, url }) => `${url} ${width}w`).join(", ");
  }

  /**
   * Optimiser une image avec les transformations Supabase
   */
  static optimizeImage(url, options = {}) {
    const params = new URLSearchParams();

    if (options.width) params.append("width", options.width);
    if (options.height) params.append("height", options.height);
    if (options.quality) params.append("quality", options.quality);
    if (options.resize) params.append("resize", options.resize);
    if (options.format) params.append("format", options.format);

    return params.toString() ? `${url}?${params.toString()}` : url;
  }

  /**
   * Vérifier si une image existe
   */
  static async imageExists(filePath) {
    try {
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list("", {
          search: filePath,
        });

      if (error) throw error;

      return data && data.length > 0;
    } catch (error) {
      console.error("Erreur lors de la vérification de l'image:", error);
      return false;
    }
  }

  /**
   * Récupérer les métadonnées d'une image
   */
  static async getImageMetadata(filePath) {
    try {
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list("", {
          search: filePath,
        });

      if (error) throw error;

      return data && data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error("Erreur lors de la récupération des métadonnées:", error);
      return null;
    }
  }
}
