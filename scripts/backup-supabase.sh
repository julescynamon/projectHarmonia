#!/bin/bash

# Script de sauvegarde Supabase pour La Maison Sattvaïa
# Utilise l'API Supabase pour créer un dump SQL de la base de données

set -e  # Arrêter le script en cas d'erreur

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BACKUP_DIR="$PROJECT_ROOT/backups"
DATE=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="la-maison-sattvaia_backup_${DATE}.sql"

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
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
        log_info "Installation: npm install -g supabase"
        exit 1
    fi
}

# Vérifier que nous sommes connectés à Supabase
check_supabase_auth() {
    if ! supabase status &> /dev/null; then
        log_error "Vous n'êtes pas connecté à Supabase ou le projet n'est pas configuré."
        log_info "Connectez-vous avec: supabase login"
        log_info "Liez votre projet avec: supabase link --project-ref YOUR_PROJECT_REF"
        exit 1
    fi
}

# Créer le dossier de sauvegarde
create_backup_dir() {
    if [ ! -d "$BACKUP_DIR" ]; then
        log_info "Création du dossier de sauvegarde: $BACKUP_DIR"
        mkdir -p "$BACKUP_DIR"
    fi
}

# Nettoyer les anciennes sauvegardes (garder les 10 plus récentes)
cleanup_old_backups() {
    log_info "Nettoyage des anciennes sauvegardes..."
    cd "$BACKUP_DIR"
    ls -t la-maison-sattvaia_backup_*.sql 2>/dev/null | tail -n +11 | xargs -r rm -f
    log_success "Nettoyage terminé"
}

# Créer la sauvegarde
create_backup() {
    log_info "Début de la sauvegarde..."
    log_info "Fichier de sauvegarde: $BACKUP_FILE"
    
    # Changer vers le répertoire du projet
    cd "$PROJECT_ROOT"
    
    # Créer le dump SQL
    log_info "Création du dump SQL..."
    if supabase db dump --file "$BACKUP_DIR/$BACKUP_FILE"; then
        log_success "Sauvegarde créée avec succès: $BACKUP_DIR/$BACKUP_FILE"
        
        # Afficher la taille du fichier
        FILE_SIZE=$(du -h "$BACKUP_DIR/$BACKUP_FILE" | cut -f1)
        log_info "Taille du fichier: $FILE_SIZE"
        
        # Afficher le nombre de lignes (pour vérifier que le fichier n'est pas vide)
        LINE_COUNT=$(wc -l < "$BACKUP_DIR/$BACKUP_FILE")
        log_info "Nombre de lignes: $LINE_COUNT"
        
    else
        log_error "Échec de la création de la sauvegarde"
        exit 1
    fi
}

# Afficher un résumé
show_summary() {
    log_info "=== RÉSUMÉ DE LA SAUVEGARDE ==="
    log_info "Fichier: $BACKUP_FILE"
    log_info "Emplacement: $BACKUP_DIR"
    log_info "Date: $(date)"
    log_info "Taille: $(du -h "$BACKUP_DIR/$BACKUP_FILE" | cut -f1)"
    
    # Lister les 5 dernières sauvegardes
    log_info "Dernières sauvegardes:"
    ls -lt "$BACKUP_DIR"/la-maison-sattvaia_backup_*.sql 2>/dev/null | head -6 | tail -5 | while read line; do
        echo "  $line"
    done
}

# Fonction principale
main() {
    log_info "=== SAUVEGARDE SUPABASE LA MAISON SATTVAÏA ==="
    log_info "Date: $(date)"
    
    # Vérifications préalables
    check_supabase_cli
    check_supabase_auth
    
    # Créer le dossier de sauvegarde
    create_backup_dir
    
    # Créer la sauvegarde
    create_backup
    
    # Nettoyer les anciennes sauvegardes
    cleanup_old_backups
    
    # Afficher le résumé
    show_summary
    
    log_success "Sauvegarde terminée avec succès !"
}

# Exécuter le script principal
main "$@" 