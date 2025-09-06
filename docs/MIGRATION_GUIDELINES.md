# Guide des Migrations Supabase - La Maison Sattvaïa

Ce document décrit les bonnes pratiques et conventions pour gérer les migrations de base de données avec Supabase dans le projet La Maison Sattvaïa.

## 📋 Table des Matières

- [Convention de Nommage](#convention-de-nommage)
- [Structure des Migrations](#structure-des-migrations)
- [Scripts d'Automatisation](#scripts-dautomatisation)
- [Workflow de Migration](#workflow-de-migration)
- [Bonnes Pratiques](#bonnes-pratiques)
- [Exemples de Migrations](#exemples-de-migrations)
- [Dépannage](#dépannage)

## 🏷️ Convention de Nommage

### Format Standard

```
YYYYMMDDHHMMSS_description_en_snake_case.sql
```

### Exemples

- `20250120143000_ajouter_table_utilisateurs.sql`
- `20250120144530_modifier_colonne_email.sql`
- `20250120150000_creer_index_performance.sql`

### Règles de Nommage

- **Timestamp** : Format ISO sans séparateurs (YYYYMMDDHHMMSS)
- **Description** : En minuscules, mots séparés par des underscores
- **Extension** : Toujours `.sql`
- **Longueur** : Maximum 100 caractères pour le nom complet

## 📁 Structure des Migrations

### En-tête Obligatoire

```sql
-- Migration: [Description claire et concise]
-- Date: [Date de création]
-- Auteur: [Nom du développeur]
-- Version: [Timestamp de la migration]
-- Type: [CREATE|ALTER|DROP|DATA]
```

### Sections Recommandées

```sql
-- =====================================================
-- DESCRIPTION: [Description détaillée]
-- =====================================================

-- OBJECTIFS:
-- - [Objectif 1]
-- - [Objectif 2]

-- IMPACT:
-- - [Impact sur les performances]
-- - [Impact sur les données existantes]

-- =====================================================
-- MIGRATION SQL
-- =====================================================

-- [Code SQL principal]

-- =====================================================
-- VALIDATION
-- =====================================================

-- [Requêtes de validation]

-- =====================================================
-- ROLLBACK (optionnel)
-- =====================================================

-- [Instructions de rollback]
```

## 🤖 Scripts d'Automatisation

### Script Bash (`scripts/migration-helper.sh`)

```bash
# Créer une nouvelle migration
./scripts/migration-helper.sh create "ajouter table utilisateurs"

# Lister les migrations
./scripts/migration-helper.sh list

# Appliquer les migrations
./scripts/migration-helper.sh apply

# Valider les migrations
./scripts/migration-helper.sh validate

# Générer un rapport
./scripts/migration-helper.sh report
```

### Script Node.js (`scripts/migration-workflow.js`)

```bash
# Mode interactif
node scripts/migration-workflow.js interactive

# Créer une migration
node scripts/migration-workflow.js create "ajouter table utilisateurs"

# Lister les migrations
node scripts/migration-workflow.js list
```

## 🔄 Workflow de Migration

### 1. Préparation

```bash
# Démarrer Supabase localement
supabase start

# Vérifier l'état
supabase status
```

### 2. Création de Migration

```bash
# Utiliser le script automatisé
./scripts/migration-helper.sh create "description de la migration"

# Ou utiliser Supabase CLI directement
supabase migration new nom_de_la_migration
```

### 3. Développement

- Éditer le fichier de migration généré
- Tester localement avec `supabase db reset`
- Valider la syntaxe avec `./scripts/migration-helper.sh validate`

### 4. Application

```bash
# Appliquer les migrations
supabase db reset

# Ou utiliser le script
./scripts/migration-helper.sh apply
```

### 5. Validation

```bash
# Vérifier que tout fonctionne
supabase db diff

# Générer un rapport
./scripts/migration-helper.sh report
```

## ✅ Bonnes Pratiques

### Sécurité

- ✅ Utilisez `IF NOT EXISTS` pour éviter les erreurs
- ✅ Utilisez `IF EXISTS` pour les suppressions
- ✅ Activez RLS sur toutes les tables utilisateur
- ✅ Documentez les politiques de sécurité
- ❌ Évitez `DROP TABLE` sans sauvegarde
- ❌ Évitez les modifications de données sans `WHERE`

### Performance

- ✅ Ajoutez des index pour les colonnes fréquemment utilisées
- ✅ Utilisez des index partiels quand approprié
- ✅ Optimisez les requêtes complexes
- ❌ Évitez les index inutiles

### Maintenabilité

- ✅ Documentez chaque migration
- ✅ Incluez des instructions de rollback
- ✅ Testez sur un environnement de développement
- ✅ Utilisez des transactions pour les migrations complexes
- ✅ Ajoutez des commentaires explicatifs

### Exemples de Bonnes Pratiques

#### Création de Table

```sql
-- ✅ Bon
CREATE TABLE IF NOT EXISTS utilisateurs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Créer des index pour les performances
CREATE INDEX IF NOT EXISTS idx_utilisateurs_email ON utilisateurs(email);

-- Activer RLS
ALTER TABLE utilisateurs ENABLE ROW LEVEL SECURITY;

-- Ajouter des politiques de sécurité
CREATE POLICY "Users can view own data" ON utilisateurs
    FOR SELECT USING (auth.uid() = id);
```

#### Modification de Table

```sql
-- ✅ Bon
ALTER TABLE utilisateurs
ADD COLUMN IF NOT EXISTS nom VARCHAR(255),
ADD COLUMN IF NOT EXISTS prenom VARCHAR(255);

-- Ajouter un index pour la recherche
CREATE INDEX IF NOT EXISTS idx_utilisateurs_nom_prenom
ON utilisateurs(nom, prenom);
```

## 📝 Exemples de Migrations

### Exemple 1: Création de Table Simple

```sql
-- Migration: Ajouter table produits
-- Date: 2025-01-20 14:30:00
-- Auteur: Jules Dupont
-- Version: 20250120143000
-- Type: CREATE

-- =====================================================
-- DESCRIPTION: Création de la table produits pour la boutique
-- =====================================================

-- OBJECTIFS:
-- - Stocker les informations des produits
-- - Permettre la gestion du catalogue
-- - Supporter les images et descriptions

-- IMPACT:
-- - Nouvelle table créée
-- - Aucun impact sur les données existantes

-- =====================================================
-- MIGRATION SQL
-- =====================================================

CREATE TABLE IF NOT EXISTS produits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    description TEXT,
    prix DECIMAL(10,2) NOT NULL CHECK (prix >= 0),
    stock INTEGER DEFAULT 0 CHECK (stock >= 0),
    image_url TEXT,
    categorie VARCHAR(100),
    actif BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_produits_categorie ON produits(categorie);
CREATE INDEX IF NOT EXISTS idx_produits_actif ON produits(actif) WHERE actif = true;
CREATE INDEX IF NOT EXISTS idx_produits_prix ON produits(prix);

-- RLS
ALTER TABLE produits ENABLE ROW LEVEL SECURITY;

-- Politiques de sécurité
CREATE POLICY "Public can view active products" ON produits
    FOR SELECT USING (actif = true);

CREATE POLICY "Admins can manage products" ON produits
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- =====================================================
-- VALIDATION
-- =====================================================

-- Vérifier que la table a été créée
SELECT COUNT(*) FROM produits;

-- Vérifier les index
SELECT indexname FROM pg_indexes WHERE tablename = 'produits';

-- =====================================================
-- ROLLBACK
-- =====================================================

-- DROP TABLE IF EXISTS produits CASCADE;
```

### Exemple 2: Modification de Table

```sql
-- Migration: Ajouter colonnes SEO aux produits
-- Date: 2025-01-20 15:00:00
-- Auteur: Jules Dupont
-- Version: 20250120150000
-- Type: ALTER

-- =====================================================
-- DESCRIPTION: Ajout de colonnes SEO pour optimiser le référencement
-- =====================================================

-- OBJECTIFS:
-- - Améliorer le SEO des produits
-- - Permettre des URLs personnalisées
-- - Ajouter des métadonnées

-- IMPACT:
-- - Nouvelles colonnes ajoutées
-- - Aucun impact sur les données existantes

-- =====================================================
-- MIGRATION SQL
-- =====================================================

-- Ajouter les colonnes SEO
ALTER TABLE produits
ADD COLUMN IF NOT EXISTS slug VARCHAR(255),
ADD COLUMN IF NOT EXISTS meta_title VARCHAR(255),
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS keywords TEXT;

-- Créer un index unique sur le slug
CREATE UNIQUE INDEX IF NOT EXISTS idx_produits_slug ON produits(slug) WHERE slug IS NOT NULL;

-- Index pour la recherche par mots-clés
CREATE INDEX IF NOT EXISTS idx_produits_keywords ON produits USING GIN(to_tsvector('french', keywords));

-- =====================================================
-- VALIDATION
-- =====================================================

-- Vérifier que les colonnes ont été ajoutées
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'produits'
AND column_name IN ('slug', 'meta_title', 'meta_description', 'keywords');

-- =====================================================
-- ROLLBACK
-- =====================================================

-- ALTER TABLE produits DROP COLUMN IF EXISTS slug;
-- ALTER TABLE produits DROP COLUMN IF EXISTS meta_title;
-- ALTER TABLE produits DROP COLUMN IF EXISTS meta_description;
-- ALTER TABLE produits DROP COLUMN IF EXISTS keywords;
```

## 🔧 Dépannage

### Erreurs Courantes

#### Migration déjà appliquée

```bash
# Vérifier l'état des migrations
supabase migration list

# Réinitialiser si nécessaire
supabase db reset
```

#### Conflit de noms

```bash
# Renommer la migration
mv supabase/migrations/ancien_nom.sql supabase/migrations/nouveau_nom.sql
```

#### Erreur de syntaxe SQL

```bash
# Valider la syntaxe
./scripts/migration-helper.sh validate

# Tester localement
supabase db reset
```

### Commandes Utiles

```bash
# Voir les différences avec la base de production
supabase db diff

# Générer une migration à partir des différences
supabase db diff --schema public > migration_auto.sql

# Voir l'état de Supabase
supabase status

# Redémarrer Supabase
supabase stop && supabase start
```

## 📚 Ressources

- [Documentation Supabase CLI](https://supabase.com/docs/guides/cli)
- [Guide des Migrations Supabase](https://supabase.com/docs/guides/database/migrations)
- [Bonnes Pratiques PostgreSQL](https://www.postgresql.org/docs/current/index.html)

## 🤝 Contribution

Pour contribuer aux migrations :

1. Suivez les conventions de nommage
2. Documentez vos changements
3. Testez localement avant de soumettre
4. Utilisez les scripts d'automatisation
5. Validez la syntaxe SQL

---

**Note** : Ce guide est un document vivant qui sera mis à jour selon les besoins du projet.
