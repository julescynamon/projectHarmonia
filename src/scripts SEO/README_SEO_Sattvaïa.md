# 🌿 Maison Sattvaïa — Agent SEO : Guide d'utilisation

Scripts Python pour améliorer le référencement Google et IA du site **maisonsattvaia.fr**.

---

## 📦 Les 4 scripts

| Script | Rôle | Output |
|--------|------|--------|
| `seo_keyword_research.py` | Recherche de mots-clés par thématique | CSV de mots-clés priorisés |
| `seo_content_generator.py` | Génère des articles de blog complets | Fichiers Markdown (.md) |
| `seo_meta_generator.py` | Génère titles, metas, H1/H2 pour chaque page | CSV des métadonnées |
| `seo_content_plan.py` | Crée un calendrier éditorial 3 mois | CSV du plan éditorial |

---

## ⚙️ Installation (une seule fois)

```bash
# 1. Installer la bibliothèque Anthropic
pip install anthropic

# 2. Configurer ta clé API (obtenue sur console.anthropic.com)
export ANTHROPIC_API_KEY='sk-ant-xxxxxxxxxxxxxxxx'
```

> 💡 Pour que la clé soit permanente sur Mac, ajoute la ligne `export ANTHROPIC_API_KEY='...'` dans ton fichier `~/.zshrc` puis relance le Terminal.

---

## 🚀 Utilisation

### 1. Recherche de mots-clés
```bash
python seo_keyword_research.py
```
→ Génère un CSV avec ~100 mots-clés classés par thématique, volume, difficulté et idée d'article.

---

### 2. Générer des articles de blog
```bash
python seo_content_generator.py
```
Tu choisis :
- **Mode 1 — Interactif** : tu saisis un sujet, une catégorie, un mot-clé → article généré
- **Mode 2 — Batch** : génère automatiquement 8 articles prédéfinis adaptés au site

Chaque article est sauvegardé en **Markdown** (`.md`), prêt à être copié-collé dans le blog.

**Structure de chaque article généré :**
- Frontmatter SEO (titre, meta, catégorie, mots-clés)
- Introduction avec mot-clé dans les 100 premiers mots
- 4 sections H2 structurées
- Section FAQ optimisée Google AI Overview
- Appel à l'action vers le bilan découverte gratuit

---

### 3. Générer les métadonnées SEO des pages
```bash
python seo_meta_generator.py
```
→ Génère pour chaque page du site :
- `<title>` optimisé (50-60 caractères)
- `<meta description>` (140-160 caractères)
- Balise H1 recommandée
- Suggestions de H2
- Type de Schema.org recommandé
- Conseil SEO prioritaire

**À faire ensuite :** implémenter ces balises dans le code du site (demander au développeur ou le faire dans le CMS).

---

### 4. Calendrier éditorial 3 mois
```bash
python seo_content_plan.py
```
→ Génère un plan de 12 articles avec :
- Date de publication recommandée (1 article/semaine)
- Priorité SEO (haute / moyenne / faible)
- Potentiel de conversion vers RDV
- Service lié (SATTVA / AÏA / MAISON)

---

## 📋 Workflow recommandé

```
Semaine 1 :  python seo_content_plan.py
             → Valider le calendrier éditorial

Semaine 2 :  python seo_keyword_research.py
             → Ouvrir le CSV, sélectionner les meilleurs mots-clés

Semaine 3+ : python seo_content_generator.py (mode interactif)
             → 1 article par semaine selon le calendrier

En parallèle : python seo_meta_generator.py
             → Donner le CSV au développeur pour implémenter les balises
```

---

## 💡 Conseils SEO supplémentaires pour Maison Sattvaïa

### Référencement local (priorité haute)
- Créer / optimiser la **fiche Google Business Profile** (adresse Salazac, Gard)
- Mentionner les villes cibles dans les articles : *Alès, Uzès, Avignon, Valence, Privas*
- Obtenir des avis Google vérifiés de clients satisfaits

### Optimisation pour Google AI Overview
- Structurer les articles avec des réponses directes en début de section
- Ajouter des balises **FAQ Schema** sur les articles de blog
- Utiliser des phrases courtes et des listes à puces dans les sections FAQ

### Maillage interne
Dans chaque article généré, ajouter des liens vers :
- `/sattva` quand l'article parle de naturopathie humaine
- `/aia` quand l'article parle de bien-être animal
- `/maison` quand l'article parle du lien humain-animal
- `/accompagnements/reservation` pour le CTA principal

### Fréquence de publication recommandée
- **Minimum** : 2 articles/mois
- **Optimal** : 1 article/semaine (les scripts génèrent le contenu en quelques secondes)

---

## ❓ Problèmes fréquents

**`ANTHROPIC_API_KEY manquante`**
→ Tu dois d'abord configurer ta clé : `export ANTHROPIC_API_KEY='sk-ant-...'`

**`ModuleNotFoundError: anthropic`**
→ Exécute : `pip install anthropic`

**Les articles générés sont trop longs pour le blog**
→ Dans `seo_content_generator.py`, modifie `max_tokens=1000` à `max_tokens=700`

---

*Scripts générés pour Maison Sattvaïa — maisonsattvaia.fr*
*Gard · Vaucluse · Drôme · Ardèche*
