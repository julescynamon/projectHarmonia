# Guide de Test - Conversion Automatique WebP

## 🧪 Tests à Effectuer

### **Test 1 : Installation des Dépendances**

```bash
# Installer les dépendances
npm run install-webp

# Vérifier que Sharp est installé
npm list sharp
```

**✅ Résultat attendu :**

- Sharp installé sans erreur
- Tous les fichiers créés
- Scripts ajoutés au package.json

---

### **Test 2 : Upload d'Image dans l'Admin Blog**

1. **Accéder à l'admin blog**

   ```
   http://localhost:4321/admin/blog
   ```

2. **Créer un nouvel article**

   - Cliquer sur "Nouvel article"
   - Remplir le titre

3. **Tester l'upload d'image de couverture**
   - Cliquer sur la zone d'upload d'image
   - Sélectionner une image JPG ou PNG (ex: 2-5MB)
   - Observer le processus de conversion

**✅ Résultat attendu :**

- Barre de progression : "Conversion en WebP..." puis "Upload en cours..."
- Statistiques de compression affichées
- Image uploadée avec succès

---

### **Test 3 : Insertion d'Image dans le Contenu**

1. **Dans l'éditeur TipTap**
   - Cliquer sur le bouton d'upload d'image dans la barre d'outils
   - Sélectionner une image
   - Vérifier l'insertion dans le contenu

**✅ Résultat attendu :**

- Image insérée dans le contenu
- Conversion automatique en WebP
- Pas d'affichage des statistiques (paramètre `showCompressionStats={false}`)

---

### **Test 4 : Vérification des Statistiques**

**Images de test recommandées :**

- JPG haute qualité (3-5MB)
- PNG avec transparence (1-3MB)
- Image déjà en WebP (doit être ignorée)

**✅ Statistiques attendues :**

- Réduction de 20-50% de la taille
- Qualité visuelle maintenue
- Temps de conversion < 5 secondes

---

### **Test 5 : Conversion des Images Existantes (Optionnel)**

```bash
# Convertir toutes les images existantes
npm run convert-images
```

**✅ Résultat attendu :**

- Images converties avec succès
- Rapport détaillé des économies
- Fichiers WebP créés dans `public/images/`

---

## 🔍 Vérifications Techniques

### **Console du Navigateur**

Ouvrir les DevTools (F12) et vérifier :

```javascript
// Pas d'erreurs JavaScript
// Messages de conversion visibles
console.log("Image convertie en WebP: filename.jpg -> filename.webp");
```

### **Réseau (Network)**

1. Aller dans l'onglet Network
2. Uploader une image
3. Vérifier :
   - Requête POST vers Supabase Storage
   - Taille du fichier uploadé (plus petite que l'original)
   - Type MIME : `image/webp`

### **Stockage Supabase**

1. Aller dans Supabase Dashboard
2. Storage > blog-images
3. Vérifier :
   - Fichiers avec extension `.webp`
   - Taille réduite par rapport aux originaux

---

## 🚨 Dépannage

### **Erreur : "Sharp n'est pas installé"**

```bash
npm install sharp
# ou
npm run install-webp
```

### **Erreur : "Conversion WebP échouée"**

1. Vérifier la console pour l'erreur exacte
2. Tester avec une image plus petite (< 1MB)
3. Vérifier que le navigateur supporte Canvas API

### **Images de mauvaise qualité**

1. Ajuster la qualité dans `image-upload-service-enhanced.ts` :
   ```typescript
   private static readonly WEBP_QUALITY = 0.9; // Augmenter la qualité
   ```

### **Upload très lent**

1. Vérifier la connexion internet
2. Réduire la taille des images avant upload
3. Vérifier les performances de Supabase

---

## 📊 Métriques de Succès

### **Performance**

- ✅ Temps de conversion < 5 secondes
- ✅ Réduction de taille 20-50%
- ✅ Qualité visuelle maintenue

### **Expérience Utilisateur**

- ✅ Feedback visuel pendant la conversion
- ✅ Statistiques de compression affichées
- ✅ Pas d'erreurs visibles

### **Technique**

- ✅ Fichiers WebP créés correctement
- ✅ URLs d'images fonctionnelles
- ✅ Pas d'erreurs dans la console

---

## 🎯 Checklist de Validation

- [ ] Dépendances installées
- [ ] Composant ImageUploadEnhanced fonctionnel
- [ ] Conversion automatique active
- [ ] Statistiques de compression affichées
- [ ] Images insérées dans le contenu
- [ ] Pas d'erreurs JavaScript
- [ ] Fichiers WebP dans Supabase Storage
- [ ] Qualité des images acceptable
- [ ] Performance satisfaisante

---

## 🚀 Déploiement

Une fois les tests validés :

1. **Commit des changements**

   ```bash
   git add .
   git commit -m "feat: add automatic WebP conversion for blog images"
   ```

2. **Déploiement**

   - Les nouvelles images seront automatiquement converties
   - Les images existantes restent en format original
   - Optionnel : Exécuter `npm run convert-images` en production

3. **Monitoring**
   - Surveiller les performances d'upload
   - Vérifier la satisfaction utilisateur
   - Ajuster la qualité si nécessaire

---

**🎉 Félicitations ! La conversion automatique WebP est maintenant active pour Naïma !**
