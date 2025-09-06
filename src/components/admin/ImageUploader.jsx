// Composant d'upload d'images avec drag & drop
// src/components/admin/ImageUploader.jsx

import React, { useState, useRef, useCallback } from "react";
import { ImageUploadService } from "../../lib/image-upload-service";

const ImageUploader = ({ onImageUploaded, onError, className = "" }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragCounter, setDragCounter] = useState(0);
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  // Gérer le drag enter
  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter((prev) => prev + 1);
    setIsDragging(true);
  }, []);

  // Gérer le drag leave
  const handleDragLeave = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragCounter((prev) => prev - 1);
      if (dragCounter === 0) {
        setIsDragging(false);
      }
    },
    [dragCounter]
  );

  // Gérer le drag over
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  // Gérer le drop
  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setDragCounter(0);

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length === 0) {
      onError?.("Aucune image valide trouvée dans les fichiers déposés");
      return;
    }

    // Uploader chaque image
    for (const file of imageFiles) {
      await uploadFile(file);
    }
  }, []);

  // Gérer la sélection de fichier via l'input
  const handleFileSelect = useCallback(async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    for (const file of files) {
      await uploadFile(file);
    }

    // Réinitialiser l'input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  // Uploader un fichier
  const uploadFile = async (file) => {
    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Simuler une progression (car Supabase ne fournit pas de callback de progression)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Ici on devrait récupérer l'userId depuis le contexte d'auth
      const userId = "temp-user-id"; // À remplacer par l'userId réel
      const result = await ImageUploadService.uploadImage(file, userId);

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Notifier le composant parent
      onImageUploaded?.(result);

      // Réinitialiser après un délai
      setTimeout(() => {
        setUploadProgress(0);
        setIsUploading(false);
      }, 1000);
    } catch (error) {
      console.error("Erreur lors de l'upload:", error);
      onError?.(error.message || "Erreur lors de l'upload de l'image");
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Ouvrir le sélecteur de fichiers
  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      {/* Zone de drop */}
      <div
        ref={dropZoneRef}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
          ${
            isDragging
              ? "border-sage bg-sage-50 scale-105"
              : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
          }
          ${isUploading ? "pointer-events-none opacity-75" : ""}
        `}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Icône */}
        <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
          {isUploading ? (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage"></div>
          ) : (
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          )}
        </div>

        {/* Texte principal */}
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {isUploading ? "Upload en cours..." : "Glissez vos images ici"}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-500 mb-4">
          {isUploading
            ? "Veuillez patienter pendant l'upload..."
            : "ou cliquez pour sélectionner des fichiers"}
        </p>

        {/* Bouton de sélection */}
        {!isUploading && (
          <button
            type="button"
            onClick={openFileSelector}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-sage hover:bg-sage-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sage transition-colors"
          >
            Choisir des images
          </button>
        )}

        {/* Barre de progression */}
        {isUploading && (
          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
            <div
              className="bg-sage h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}

        {/* Indicateur de drag */}
        {isDragging && (
          <div className="absolute inset-0 bg-sage-100 bg-opacity-50 rounded-lg flex items-center justify-center">
            <div className="text-sage-800 text-lg font-medium">
              Déposez vos images ici
            </div>
          </div>
        )}

        {/* Input de fichier caché */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Informations sur les formats supportés */}
      <div className="mt-4 text-center text-sm text-gray-500">
        <p>Formats supportés : JPEG, PNG, WebP, GIF</p>
        <p>Taille maximum : 10 MB par image</p>
      </div>
    </div>
  );
};

export default ImageUploader;
