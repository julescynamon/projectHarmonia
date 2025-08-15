# Scripts Supabase pour Harmonia

Ce dossier contient deux scripts shell pour gérer la sauvegarde et le rollback de votre base de données Supabase.

## 📋 Prérequis

1. **Supabase CLI installé** :

   ```bash
   npm install -g supabase
   ```

2. **Authentification Supabase** :

   ```bash
   supabase login
   ```

3. **Projet lié** :
   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   ```

## 🔧 Scripts disponibles

### 1. Script de sauvegarde (`backup-supabase.sh`)

Crée une sauvegarde complète de votre base de données Supabase.

#### Utilisation

```bash
./scripts/backup-supabase.sh
```

#### Fonctionnalités

- ✅ Création automatique d'un dump SQL
- ✅ Horodatage des sauvegardes
- ✅ Nettoyage automatique (garde les 10 plus récentes)
- ✅ Vérifications préalables (CLI, authentification)
- ✅ Messages colorés et informatifs
- ✅ Gestion d'erreurs robuste

#### Exemple de sortie

```
[INFO] === SAUVEGARDE SUPABASE HARMONIA ===
[INFO] Date: mar 26 déc 2024 15:30:45 CET
[INFO] Création du dossier de sauvegarde: /Users/jules/Downloads/harmonia/backups
[INFO] Début de la sauvegarde...
[INFO] Fichier de sauvegarde: harmonia_backup_20241226_153045.sql
[INFO] Création du dump SQL...
[SUCCESS] Sauvegarde créée avec succès: /Users/jules/Downloads/harmonia/backups/harmonia_backup_20241226_153045.sql
[INFO] Taille du fichier: 2.1M
[INFO] Nombre de lignes: 15420
[SUCCESS] Sauvegarde terminée avec succès !
```

### 2. Script de rollback (`rollback-supabase.sh`)

Permet de revenir à un état précédent de votre base de données.

#### Utilisation

**Lister les commits disponibles** :

```bash
./scripts/rollback-supabase.sh --list
```

**Effectuer un rollback** :

```bash
./scripts/rollback-supabase.sh --commit abc123def
```

**Simuler un rollback (dry-run)** :

```bash
./scripts/rollback-supabase.sh --commit abc123def --dry-run
```

**Afficher l'aide** :

```bash
./scripts/rollback-supabase.sh --help
```

#### Fonctionnalités

- ✅ Liste des commits disponibles
- ✅ Validation du hash de commit
- ✅ Mode dry-run pour simulation
- ✅ Confirmation utilisateur avant rollback
- ✅ Vérifications préalables
- ✅ Messages colorés et informatifs

#### Exemple de sortie

```
[INFO] === ROLLBACK SUPABASE HARMONIA ===
[INFO] Commit cible: abc123def
[INFO] Mode dry-run: false
[INFO] Date: mar 26 déc 2024 15:35:12 CET
[WARNING] ATTENTION: Cette opération va modifier la base de données de production !
Êtes-vous sûr de vouloir continuer ? (y/N): y
[INFO] Exécution du rollback...
[SUCCESS] Rollback effectué avec succès vers le commit abc123def
[SUCCESS] Rollback terminé !
```

## 📁 Structure des fichiers

```
harmonia/
├── scripts/
│   ├── backup-supabase.sh          # Script de sauvegarde
│   ├── rollback-supabase.sh        # Script de rollback
│   └── README_SUPABASE_SCRIPTS.md  # Cette documentation
├── backups/                        # Dossier créé automatiquement
│   ├── harmonia_backup_20241226_153045.sql
│   ├── harmonia_backup_20241226_143022.sql
│   └── ...
└── ...
```

## 🔄 Workflow recommandé

### Avant un déploiement

1. **Créer une sauvegarde** :

   ```bash
   ./scripts/backup-supabase.sh
   ```

2. **Déployer vos changements**

### En cas de problème

1. **Lister les commits disponibles** :

   ```bash
   ./scripts/rollback-supabase.sh --list
   ```

2. **Simuler le rollback** :

   ```bash
   ./scripts/rollback-supabase.sh --commit <HASH> --dry-run
   ```

3. **Effectuer le rollback** :
   ```bash
   ./scripts/rollback-supabase.sh --commit <HASH>
   ```

## ⚠️ Points d'attention

### Sauvegarde

- Les sauvegardes sont stockées dans le dossier `backups/`
- Seules les 10 dernières sauvegardes sont conservées
- Chaque sauvegarde est horodatée pour faciliter l'identification

### Rollback

- **ATTENTION** : Le rollback modifie la base de données de production
- Utilisez toujours le mode `--dry-run` avant un vrai rollback
- Vérifiez que vous avez le bon hash de commit
- Le script demande confirmation avant d'exécuter le rollback

## 🛠️ Dépannage

### Erreur "Supabase CLI n'est pas installé"

```bash
npm install -g supabase
```

### Erreur "Vous n'êtes pas connecté à Supabase"

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
```

### Erreur "Format de hash invalide"

- Vérifiez que le hash est alphanumérique
- Le hash doit contenir entre 7 et 40 caractères
- Utilisez `--list` pour voir les hashes valides

### Sauvegarde vide ou corrompue

- Vérifiez votre connexion internet
- Assurez-vous d'avoir les permissions nécessaires
- Vérifiez que votre projet Supabase est actif

## 📞 Support

En cas de problème avec ces scripts :

1. Vérifiez les prérequis
2. Consultez les messages d'erreur colorés
3. Utilisez le mode `--dry-run` pour tester
4. Vérifiez la documentation Supabase CLI

---

**Note** : Ces scripts sont spécifiquement conçus pour le projet Harmonia. Adaptez-les selon vos besoins si vous les utilisez dans d'autres projets.
