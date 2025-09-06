# Guide d'utilisation du système TipTap pour l'admin d'articles

## 🎯 Vue d'ensemble

Ce guide explique comment utiliser le nouveau système d'édition d'articles avec TipTap, qui remplace l'ancien système Markdown. TipTap est un éditeur WYSIWYG moderne qui permet de créer du contenu riche sans connaître la syntaxe Markdown.

## 🚀 Accès au système

1. **Connexion** : Connectez-vous avec votre email `tyzranaima@gmail.com`
2. **Navigation** : Allez dans `/admin/blog`
3. **Interface** : Vous verrez l'éditeur TipTap et la liste de vos articles

## ✍️ Créer un nouvel article

### 1. Remplir les métadonnées

- **Titre** : Le titre principal de votre article (obligatoire)
- **Extrait** : Un résumé court qui apparaîtra dans la liste des articles
- **Image de couverture** : URL d'une image pour illustrer l'article
- **Texte alternatif** : Description de l'image pour l'accessibilité
- **Tags** : Mots-clés séparés par des virgules (ex: bien-être, conseils, nutrition)
- **Statut** : Choisir entre "Brouillon" ou "Publié"
- **Titre SEO** : Titre optimisé pour les moteurs de recherche
- **Description SEO** : Description optimisée pour les moteurs de recherche

### 2. Utiliser l'éditeur TipTap

#### Barre d'outils principale

- **H1, H2, H3** : Créer des titres de différents niveaux
- **B, I, U** : Mettre en gras, italique, souligné
- **•, 1.** : Créer des listes à puces ou numérotées
- **"** : Créer des citations
- **←, ↔, →** : Aligner le texte à gauche, centre, droite
- **🔗** : Ajouter des liens
- **🖼️** : Insérer des images

#### Utilisation des outils

**Titres** :

1. Placez votre curseur où vous voulez le titre
2. Cliquez sur H1, H2 ou H3
3. Tapez votre titre

**Formatage de texte** :

1. Sélectionnez le texte à formater
2. Cliquez sur B (gras), I (italique) ou U (souligné)

**Listes** :

1. Cliquez sur • pour une liste à puces
2. Ou cliquez sur 1. pour une liste numérotée
3. Tapez vos éléments
4. Appuyez sur Entrée pour un nouvel élément
5. Appuyez sur Entrée deux fois pour sortir de la liste

**Citations** :

1. Cliquez sur "
2. Tapez votre citation
3. Appuyez sur Entrée pour sortir de la citation

**Liens** :

1. Sélectionnez le texte à transformer en lien
2. Cliquez sur 🔗
3. Entrez l'URL dans le champ qui apparaît
4. Cliquez sur "Ajouter"

**Images** :

1. Cliquez sur 🖼️
2. Choisissez une image depuis votre ordinateur
3. L'image sera automatiquement uploadée et insérée
4. Vous pouvez ajouter une légende en cliquant sur l'image

## 📝 Sauvegarder et publier

### Sauvegarde automatique

- Le contenu est sauvegardé automatiquement toutes les 2 secondes
- Vous pouvez aussi cliquer sur "Brouillon" pour sauvegarder manuellement

### Publication

- Cliquez sur "Publier" pour rendre l'article public
- L'article sera visible sur votre site immédiatement
- Vous pouvez le remettre en brouillon plus tard si nécessaire

## 🖼️ Gestion des images

### Upload d'images

- **Formats supportés** : JPEG, PNG, WebP, GIF
- **Taille maximum** : 10 MB par image
- **Stockage** : Les images sont stockées dans le cloud Supabase
- **Responsive** : Les images s'adaptent automatiquement à tous les écrans

### Bonnes pratiques

- Utilisez des images de bonne qualité
- Ajoutez toujours un texte alternatif descriptif
- Optimisez la taille des images avant l'upload
- Utilisez des formats modernes comme WebP quand possible

## 📱 Responsive et SEO

### Responsive

- Tous les articles s'adaptent automatiquement aux mobiles et tablettes
- Les images sont optimisées pour chaque taille d'écran
- La typographie s'ajuste selon l'appareil

### SEO

- Remplissez toujours le titre SEO et la description SEO
- Utilisez des mots-clés pertinents dans vos tags
- Créez des titres H1, H2, H3 structurés
- Ajoutez des liens vers d'autres pages de votre site

## 🔧 Gestion des articles existants

### Éditer un article

1. Dans la liste des articles, cliquez sur ✏️
2. Vous serez redirigé vers l'éditeur
3. Modifiez le contenu comme souhaité
4. Sauvegardez ou publiez

### Changer le statut

- **Publier** : Cliquez sur 📤 pour rendre l'article public
- **Mettre en brouillon** : Cliquez sur 📥 pour le remettre en brouillon
- **Supprimer** : Cliquez sur 🗑️ (attention, cette action est irréversible)

### Recherche et filtres

- Utilisez la barre de recherche pour trouver des articles
- Filtrez par statut (Brouillon/Publié)
- Les articles sont triés par date de création

## 🎨 Personnalisation du contenu

### Alignement du texte

- Utilisez les boutons d'alignement pour centrer ou aligner à droite
- Parfait pour les citations ou les images

### Couleurs et surlignage

- Utilisez les outils de couleur pour mettre en valeur certains passages
- Le surlignage permet d'attirer l'attention sur des points importants

### Typographie

- L'éditeur utilise automatiquement les bonnes polices
- Les titres sont en serif, le texte en sans-serif
- L'espacement est optimisé pour la lecture

## 🚨 Dépannage

### Problèmes courants

**L'éditeur ne se charge pas** :

- Vérifiez votre connexion internet
- Rechargez la page
- Vérifiez que vous êtes bien connecté

**Les images ne s'affichent pas** :

- Vérifiez que l'URL est correcte
- Assurez-vous que l'image est accessible publiquement
- Utilisez l'upload direct plutôt que les URLs externes

**Perte de contenu** :

- Le contenu est sauvegardé automatiquement
- Vérifiez dans la liste des articles
- Contactez le support si le problème persiste

**Problèmes de publication** :

- Vérifiez que tous les champs obligatoires sont remplis
- Assurez-vous que le titre n'est pas trop long
- Vérifiez votre connexion à la base de données

## 📞 Support

Si vous rencontrez des problèmes :

1. Vérifiez ce guide en premier
2. Essayez de recharger la page
3. Vérifiez votre connexion internet
4. Contactez le support technique

## 🔄 Migration depuis l'ancien système

### Articles existants

- Tous vos anciens articles Markdown ont été migrés automatiquement
- Ils sont maintenant au format JSONB TipTap
- Vous pouvez les éditer avec le nouvel éditeur
- Le contenu est préservé et accessible

### Nouveaux articles

- Créez tous vos nouveaux articles avec TipTap
- L'ancien système Markdown n'est plus disponible
- Profitez des nouvelles fonctionnalités WYSIWYG

---

**🎉 Félicitations ! Vous maîtrisez maintenant le système TipTap pour créer des articles riches et engageants !**
