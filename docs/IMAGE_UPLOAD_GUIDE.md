# Guide d'Upload d'Images

## 🎯 Fonctionnalité Ajoutée

L'upload d'images est maintenant intégré dans le formulaire de création d'articles avec :

- ✅ **Drag & Drop** : Glissez-déposez vos images
- ✅ **Sélection de fichier** : Cliquez pour choisir une image
- ✅ **Barre de progression** : Suivi visuel de l'upload
- ✅ **Validation** : Formats PNG, JPG, GIF jusqu'à 10MB
- ✅ **Optimisation automatique** : Images optimisées par Supabase
- ✅ **Prévisualisation** : Aperçu de l'image uploadée

## 🧪 Comment Tester

### 1. Accéder au formulaire
```
http://localhost:4321/admin/blog
```

### 2. Tester l'upload
1. **Drag & Drop** : Glissez une image depuis votre ordinateur
2. **Sélection** : Cliquez sur "Sélectionner une image"
3. **Vérification** : L'URL s'affiche automatiquement dans le champ

### 3. Vérifier l'upload
- ✅ L'image s'affiche dans la zone de drop
- ✅ L'URL est automatiquement remplie
- ✅ Le bouton "Supprimer l'image" fonctionne

## 🔧 Configuration Technique

### Supabase Storage
- **Bucket** : `blog-images`
- **Politiques RLS** : Configurées pour les utilisateurs authentifiés
- **Limite** : 10MB par fichier
- **Formats** : PNG, JPG, GIF

### Variables d'environnement requises
```env
PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_key
```

## 🚨 Dépannage

### Erreur "Bucket non trouvé"
```sql
-- Exécuter dans Supabase SQL Editor
SELECT * FROM storage.buckets WHERE name = 'blog-images';
```

### Erreur "Permission refusée"
```sql
-- Vérifier les politiques RLS
SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';
```

### Erreur "Fichier trop volumineux"
- Vérifier que le fichier fait moins de 10MB
- Compresser l'image si nécessaire

## 📁 Structure des fichiers

```
src/
├── components/
│   ├── admin/
│   │   └── PostEditor.jsx          # Formulaire d'articles
│   └── ui/
│       └── ImageUpload.jsx         # Composant d'upload
├── lib/
│   └── image-upload-service.js     # Service d'upload
└── pages/
    └── admin/
        └── blog/
            └── index.astro         # Page admin
```

## 🎉 Avantages

- **Simplicité** : Plus besoin de copier-coller d'URLs
- **Performance** : Images optimisées automatiquement
- **Sécurité** : Upload sécurisé via Supabase
- **UX** : Interface intuitive avec feedback visuel
