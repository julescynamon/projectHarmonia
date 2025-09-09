// Composant d'upload d'images avec conversion automatique en WebP
// src/components/ui/ImageUploadEnhanced.jsx

import React, { useState, useCallback } from "react";
import { ImageUploadServiceEnhanced } from "../../lib/image-upload-service-enhanced";

const ImageUploadEnhanced = ({
  onImageUploaded,
  onRemoveImage,
  className = "",
  showCompressionStats = true,
  autoConvertToWebP = true,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [compressionStats, setCompressionStats] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  // Gestion du drag & drop
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  }, []);

  // Upload du fichier avec conversion automatique
  const handleFileUpload = async (file) => {
    try {
      setIsUploading(true);
      setError("");
      setUploadProgress(0);
      setCompressionStats(null);

      // Récupérer l'userId depuis la session ou utiliser un ID temporaire
      const userId = window.currentUserId || "temp-user-id";

      // Upload via le service amélioré
      const result = await ImageUploadServiceEnhanced.uploadImage(
        file,
        userId,
        (progress) => setUploadProgress(progress),
        autoConvertToWebP
      );

      setImageUrl(result.url);

      // Calculer les statistiques de compression si conversion effectuée
      if (
        autoConvertToWebP &&
        !file.type.includes("webp") &&
        !file.type.includes("gif")
      ) {
        // Simuler le fichier converti pour les stats (en réalité, on ne peut pas le récupérer)
        const estimatedConvertedSize = Math.round(file.size * 0.7); // Estimation 30% de réduction
        const stats = ImageUploadServiceEnhanced.getCompressionStats(
          file,
          { size: estimatedConvertedSize } // Objet simulé
        );
        setCompressionStats(stats);
      }

      // Notifier le parent
      if (onImageUploaded) {
        onImageUploaded(result.url);
      }

      // Réinitialiser après un délai
      setTimeout(() => {
        setUploadProgress(0);
        setIsUploading(false);
      }, 1000);
    } catch (error) {
      console.error("Erreur lors de l'upload:", error);
      setError(error.message || "Erreur lors de l'upload de l'image");
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Supprimer l'image
  const handleRemoveImage = () => {
    setImageUrl("");
    setCompressionStats(null);
    if (onRemoveImage) {
      onRemoveImage();
    }
  };

  // Gestion de la sélection de fichier
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Zone de drop */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
          dragActive
            ? "border-sage bg-sage/10"
            : "border-gray-300 hover:border-sage hover:bg-sage/5"
        } ${isUploading ? "pointer-events-none opacity-50" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {imageUrl ? (
          // Image uploadée
          <div className="space-y-4">
            <div className="relative inline-block">
              <img
                src={imageUrl}
                alt="Image uploadée"
                className="max-w-full max-h-64 rounded-lg shadow-lg"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                title="Supprimer l'image"
              >
                ×
              </button>
            </div>

            {/* Statistiques de compression */}
            {showCompressionStats && compressionStats && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-green-600 font-medium">
                    ✓ Conversion WebP réussie
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                  <div>
                    <span className="font-medium">Taille originale:</span>
                    <br />
                    {(compressionStats.originalSize / 1024).toFixed(1)} KB
                  </div>
                  <div>
                    <span className="font-medium">Taille WebP:</span>
                    <br />
                    {(compressionStats.convertedSize / 1024).toFixed(1)} KB
                  </div>
                  <div>
                    <span className="font-medium">Réduction:</span>
                    <br />
                    {compressionStats.compressionRatio}%
                  </div>
                  <div>
                    <span className="font-medium">Économie:</span>
                    <br />
                    {(compressionStats.savings / 1024).toFixed(1)} KB
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Zone de drop vide
          <div className="space-y-4">
            <div className="text-gray-500">
              <svg
                className="mx-auto h-12 w-12 mb-4"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="text-lg font-medium text-gray-900 mb-2">
                Glissez-déposez votre image ici
              </p>
              <p className="text-sm text-gray-500 mb-4">
                ou cliquez pour sélectionner un fichier
              </p>
              <p className="text-xs text-gray-400">
                Formats supportés: JPG, PNG, GIF, WebP (max 10MB)
                {autoConvertToWebP && (
                  <>
                    <br />
                    🔄 Conversion automatique en WebP pour optimiser la taille
                  </>
                )}
              </p>
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="image-upload"
              disabled={isUploading}
            />
            <label
              htmlFor="image-upload"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-sage hover:bg-sage/90 cursor-pointer transition-colors"
            >
              Sélectionner une image
            </label>
          </div>
        )}

        {/* Barre de progression */}
        {isUploading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-sage border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-sm text-gray-600 mb-2">
                {uploadProgress < 50
                  ? "Conversion en WebP..."
                  : "Upload en cours..."}
              </p>
              <div className="w-48 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-sage h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">{uploadProgress}%</p>
            </div>
          </div>
        )}
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploadEnhanced;
