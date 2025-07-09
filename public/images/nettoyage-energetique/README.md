# Images pour la page Nettoyage Énergétique

Ce dossier contient les images pour la page de nettoyage énergétique et réharmonisation des lieux.

## Images à ajouter

### 1. hero-image.jpg

- **Usage** : Image principale de la section hero
- **Dimensions recommandées** : 800x800px (carré)
- **Contenu suggéré** : Une maison ou un intérieur paisible avec des éléments naturels (plantes, bougies, cristaux)
- **Style** : Lumineux, apaisant, avec des tons chauds

### 2. outils.jpg

- **Usage** : Section "Les outils que j'utilise"
- **Dimensions recommandées** : 600x400px
- **Contenu suggéré** : Tambour chamanique, bols chantants, encens, pierres, symboles sacrés
- **Style** : Naturel, authentique, avec un éclairage doux

### 3. apres-soin.jpg

- **Usage** : Section "Et après le soin ?"
- **Dimensions recommandées** : 600x600px (carré)
- **Contenu suggéré** : Une pièce harmonisée, avec des plantes, de la lumière naturelle, un espace apaisant
- **Style** : Clair, lumineux, invitant

### 4. processus.jpg

- **Usage** : Section déroulement du soin
- **Dimensions recommandées** : 800x500px
- **Contenu suggéré** : Une personne pratiquant un rituel de nettoyage énergétique
- **Style** : Respectueux, professionnel, avec une ambiance sacrée

## Notes importantes

- Toutes les images doivent respecter la charte graphique du site (tons chauds, naturels)
- Privilégier des images de haute qualité (minimum 72 DPI pour le web)
- Assurer que les images sont optimisées pour le web (format JPG ou WebP)
- Respecter les droits d'utilisation des images
- Les images doivent être cohérentes avec l'identité visuelle du site

## Remplacement des placeholders

Une fois les images ajoutées, remplacer les placeholders dans le fichier `src/pages/nettoyage-energetique.astro` :

```astro
<!-- Remplacer ceci : -->
<div class="aspect-square bg-gradient-to-br from-sage/20 to-gold/20 rounded-2xl overflow-hidden flex items-center justify-center">
  <div class="text-center text-eucalyptus">
    <div class="text-6xl mb-4">🏠</div>
    <p class="text-sm">Image à venir</p>
  </div>
</div>

<!-- Par ceci : -->
<img src="/images/nettoyage-energetique/hero-image.jpg" alt="Nettoyage énergétique des lieux" class="w-full h-full object-cover rounded-2xl" />
```
