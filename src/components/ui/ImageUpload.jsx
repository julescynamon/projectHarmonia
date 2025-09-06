// Composant d'upload d'images avec drag & drop
// src/components/ui/ImageUpload.jsx

import React, { useState, useRef, useCallback } from 'react';
import { ImageUploadService } from '../../lib/image-upload-service.js';

const ImageUpload = ({ 
  onImageUploaded, 
  currentImageUrl = '', 
  onRemoveImage,
  className = '' 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  // Gérer le drag & drop
  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!dropZoneRef.current?.contains(e.relatedTarget)) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, []);

  // Gérer la sélection de fichier
  const handleFileSelect = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  }, []);

  // Upload du fichier
  const handleFileUpload = async (file) => {
    try {
      setIsUploading(true);
      setError('');
      setUploadProgress(0);

      // Simuler le progrès (Supabase ne fournit pas de callback de progrès)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Récupérer l'userId depuis la session ou utiliser un ID temporaire
      const userId = window.currentUserId || 'temp-user-id';

      // Upload via le service
      const result = await ImageUploadService.uploadImage(file, userId);

      clearInterval(progressInterval);
      setUploadProgress(100);

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
      console.error('Erreur lors de l\'upload:', error);
      setError(error.message || 'Erreur lors de l\'upload de l\'image');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Supprimer l'image
  const handleRemoveImage = () => {
    if (onRemoveImage) {
      onRemoveImage();
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Zone de drop */}
      <div
        ref={dropZoneRef}
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200
          ${isDragging 
            ? 'border-sage bg-sage/10' 
            : 'border-gray-300 hover:border-sage/50 hover:bg-gray-50'
          }
          ${isUploading ? 'pointer-events-none opacity-75' : ''}
        `}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Image actuelle */}
        {currentImageUrl && !isUploading && (
          <div className="mb-4">
            <img
              src={currentImageUrl}
              alt="Image de couverture"
              className="max-w-full h-32 object-cover rounded-lg mx-auto"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="mt-2 text-sm text-red-600 hover:text-red-800"
            >
              Supprimer l'image
            </button>
          </div>
        )}

        {/* Contenu de la zone de drop */}
        {!currentImageUrl && (
          <div className="space-y-3">
            <div className="text-4xl">📸</div>
            <div className="text-lg font-medium text-gray-700">
              {isDragging ? 'Déposez votre image ici' : 'Glissez-déposez une image ou cliquez pour sélectionner'}
            </div>
            <div className="text-sm text-gray-500">
              PNG, JPG, GIF jusqu'à 10MB
            </div>
          </div>
        )}

        {/* Barre de progression */}
        {isUploading && (
          <div className="space-y-3">
            <div className="text-4xl">⏳</div>
            <div className="text-lg font-medium text-gray-700">
              Upload en cours...
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-sage h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <div className="text-sm text-gray-500">
              {uploadProgress}% terminé
            </div>
          </div>
        )}

        {/* Bouton de sélection */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className={`
            mt-4 px-4 py-2 rounded-md text-sm font-medium transition-colors
            ${isUploading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-sage text-white hover:bg-sage-600'
            }
          `}
        >
          {isUploading ? 'Upload...' : 'Sélectionner une image'}
        </button>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
          {error}
        </div>
      )}

      {/* Aide */}
      <div className="text-xs text-gray-500">
        <p>• Formats acceptés : PNG, JPG, GIF</p>
        <p>• Taille maximum : 10MB</p>
        <p>• L'image sera automatiquement optimisée</p>
      </div>
    </div>
  );
};

export default ImageUpload;
