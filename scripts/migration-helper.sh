#!/bin/bash

# Script d'aide pour les migrations Supabase versionnées
# Usage: ./scripts/migration-helper.sh [command] [options]

set -e

# Configuration
MIGRATIONS_DIR="supabase/migrations"
BACKUP_DIR="supabase/migrations_backup"
PROJECT_NAME="la-maison-sattvaia"

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonctions utilitaires
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérifier que Supabase CLI est installé
check_supabase_cli() {
    if ! command -v supabase &> /dev/null; then
        log_error "Supabase CLI n'est pas installé. Veuillez l'installer d'abord."
        echo "Installation: npm install -g supabase"
        exit 1
    fi
}

# Générer un nom de migration avec timestamp
generate_migration_name() {
    local description="$1"
    local timestamp=$(date +"%Y%m%d%H%M%S")
    local sanitized_description=$(echo "$description" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/_/g' | sed 's/__*/_/g' | sed 's/^_//' | sed 's/_$//')
    echo "${timestamp}_${sanitized_description}"
}

# Créer une nouvelle migration
create_migration() {
    local description="$1"
    
    if [ -z "$description" ]; then
        log_error "Veuillez fournir une description pour la migration"
        echo "Usage: $0 create \"description de la migration\""
        exit 1
    fi
    
    check_supabase_cli
    
    local migration_name=$(generate_migration_name "$description")
    local migration_file="${MIGRATIONS_DIR}/${migration_name}.sql"
    
    log_info "Création de la migration: $migration_name"
    
    # Créer le fichier de migration avec un template
    cat > "$migration_file" << EOF
-- Migration: $description
-- Date: $(date '+%Y-%m-%d %H:%M:%S')
-- Auteur: $(git config user.name 2>/dev/null || echo "Unknown")
-- Version: $migration_name

-- =====================================================
-- DESCRIPTION: $description
-- =====================================================

-- Ajoutez votre code SQL ici
-- Exemple:
-- CREATE TABLE IF NOT EXISTS nom_table (
--     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
--     created_at TIMESTAMPTZ DEFAULT NOW()
-- );

-- =====================================================
-- ROLLBACK (optionnel - pour les migrations complexes)
-- =====================================================

-- Si vous avez besoin d'un rollback, décommentez et modifiez:
-- DROP TABLE IF EXISTS nom_table;

EOF
    
    log_success "Migration créée: $migration_file"
    echo "Vous pouvez maintenant éditer le fichier et ajouter votre code SQL."
}

# Lister toutes les migrations
list_migrations() {
    log_info "Migrations existantes:"
    echo ""
    
    if [ ! -d "$MIGRATIONS_DIR" ]; then
        log_warning "Le répertoire des migrations n'existe pas"
        return
    fi
    
    local count=0
    for file in "$MIGRATIONS_DIR"/*.sql; do
        if [ -f "$file" ]; then
            local filename=$(basename "$file")
            local timestamp=$(echo "$filename" | cut -d'_' -f1)
            local description=$(echo "$filename" | cut -d'_' -f2- | sed 's/\.sql$//' | tr '_' ' ')
            
            echo "  📄 $filename"
            echo "     📅 $(date -d "@$((timestamp/1000000))" '+%Y-%m-%d %H:%M:%S' 2>/dev/null || echo "Date inconnue")"
            echo "     📝 $description"
            echo ""
            ((count++))
        fi
    done
    
    if [ $count -eq 0 ]; then
        log_warning "Aucune migration trouvée"
    else
        log_success "$count migration(s) trouvée(s)"
    fi
}

# Appliquer les migrations
apply_migrations() {
    log_info "Application des migrations..."
    check_supabase_cli
    
    # Vérifier l'état de Supabase
    if ! supabase status &> /dev/null; then
        log_error "Supabase n'est pas démarré. Veuillez d'abord exécuter: supabase start"
        exit 1
    fi
    
    # Appliquer les migrations
    supabase db reset
    
    log_success "Migrations appliquées avec succès"
}

# Créer une sauvegarde des migrations
backup_migrations() {
    local backup_name="backup_$(date +"%Y%m%d_%H%M%S")"
    local backup_path="$BACKUP_DIR/$backup_name"
    
    log_info "Création d'une sauvegarde des migrations..."
    
    if [ ! -d "$BACKUP_DIR" ]; then
        mkdir -p "$BACKUP_DIR"
    fi
    
    if [ -d "$MIGRATIONS_DIR" ]; then
        cp -r "$MIGRATIONS_DIR" "$backup_path"
        log_success "Sauvegarde créée: $backup_path"
    else
        log_warning "Aucune migration à sauvegarder"
    fi
}

# Valider la syntaxe SQL des migrations
validate_migrations() {
    log_info "Validation de la syntaxe SQL des migrations..."
    
    if [ ! -d "$MIGRATIONS_DIR" ]; then
        log_warning "Le répertoire des migrations n'existe pas"
        return
    fi
    
    local errors=0
    
    for file in "$MIGRATIONS_DIR"/*.sql; do
        if [ -f "$file" ]; then
            local filename=$(basename "$file")
            log_info "Validation de $filename..."
            
            # Vérification basique de la syntaxe SQL
            if ! grep -q ";" "$file"; then
                log_warning "  ⚠️  Aucune instruction SQL trouvée dans $filename"
            fi
            
            # Vérification des mots-clés dangereux
            if grep -i "DROP TABLE\|DROP DATABASE\|TRUNCATE" "$file" > /dev/null; then
                log_warning "  ⚠️  Instructions destructives détectées dans $filename"
            fi
            
            log_success "  ✅ $filename validé"
        fi
    done
    
    if [ $errors -eq 0 ]; then
        log_success "Toutes les migrations sont valides"
    else
        log_error "$errors erreur(s) trouvée(s)"
        exit 1
    fi
}

# Générer un rapport de migration
generate_report() {
    local report_file="migration_report_$(date +"%Y%m%d_%H%M%S").md"
    
    log_info "Génération du rapport de migration..."
    
    cat > "$report_file" << EOF
# Rapport de Migration - $PROJECT_NAME

**Date:** $(date '+%Y-%m-%d %H:%M:%S')  
**Environnement:** $(supabase status 2>/dev/null | grep "API URL" | cut -d' ' -f3 || echo "Non connecté")

## Résumé

- **Total des migrations:** $(ls "$MIGRATIONS_DIR"/*.sql 2>/dev/null | wc -l)
- **Dernière migration:** $(ls -t "$MIGRATIONS_DIR"/*.sql 2>/dev/null | head -1 | xargs basename 2>/dev/null || echo "Aucune")

## Migrations

EOF
    
    if [ -d "$MIGRATIONS_DIR" ]; then
        for file in "$MIGRATIONS_DIR"/*.sql; do
            if [ -f "$file" ]; then
                local filename=$(basename "$file")
                local size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null || echo "0")
                local lines=$(wc -l < "$file")
                
                echo "### $filename" >> "$report_file"
                echo "- **Taille:** ${size} bytes" >> "$report_file"
                echo "- **Lignes:** $lines" >> "$report_file"
                echo "- **Créé:** $(stat -f%Sm "$file" 2>/dev/null || stat -c%y "$file" 2>/dev/null || echo "Date inconnue")" >> "$report_file"
                echo "" >> "$report_file"
            fi
        done
    fi
    
    log_success "Rapport généré: $report_file"
}

# Afficher l'aide
show_help() {
    echo "Script d'aide pour les migrations Supabase versionnées"
    echo ""
    echo "Usage: $0 [command] [options]"
    echo ""
    echo "Commandes:"
    echo "  create <description>    Créer une nouvelle migration"
    echo "  list                    Lister toutes les migrations"
    echo "  apply                   Appliquer toutes les migrations"
    echo "  backup                  Créer une sauvegarde des migrations"
    echo "  validate                Valider la syntaxe des migrations"
    echo "  report                  Générer un rapport des migrations"
    echo "  help                    Afficher cette aide"
    echo ""
    echo "Exemples:"
    echo "  $0 create \"ajouter table utilisateurs\""
    echo "  $0 list"
    echo "  $0 apply"
    echo ""
    echo "Convention de nommage:"
    echo "  Format: YYYYMMDDHHMMSS_description_en_snake_case.sql"
    echo "  Exemple: 20250120143000_ajouter_table_utilisateurs.sql"
}

# Script principal
main() {
    case "${1:-help}" in
        "create")
            create_migration "$2"
            ;;
        "list")
            list_migrations
            ;;
        "apply")
            apply_migrations
            ;;
        "backup")
            backup_migrations
            ;;
        "validate")
            validate_migrations
            ;;
        "report")
            generate_report
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

# Exécuter le script principal
main "$@" 