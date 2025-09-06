// Script de test pour l'upload d'images
// scripts/test-image-upload.js

import { ImageUploadService } from '../src/lib/image-upload-service.js';

async function testImageUpload() {
  console.log('🧪 Test de l\'upload d\'images...');
  
  try {
    // Créer un fichier de test (simulation)
    const testFile = new File(['test image content'], 'test-image.jpg', {
      type: 'image/jpeg'
    });
    
    console.log('📁 Fichier de test créé:', testFile.name);
    
    // Test de validation
    const validation = ImageUploadService.validateFile(testFile);
    console.log('✅ Validation:', validation);
    
    // Test de génération de nom de fichier
    const fileName = ImageUploadService.generateFileName(testFile, 'test-user');
    console.log('📝 Nom de fichier généré:', fileName);
    
    console.log('🎉 Tests terminés avec succès !');
    console.log('💡 Pour tester l\'upload réel, utilisez le formulaire d\'admin');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

// Exécuter le test
testImageUpload();
