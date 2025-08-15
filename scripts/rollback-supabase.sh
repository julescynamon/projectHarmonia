#!/bin/bash

# Script de rollback Supabase pour Harmonia
# Permet de revenir à un état précédent avec supabase db remote commit

set -e  # Arrêter le script en cas d'erreur

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

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

# Afficher l'aide
show_help() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Script de rollback Supabase pour Harmonia"
    echo ""
    echo "OPTIONS:"
    echo "  -c, --commit HASH    Hash du commit vers lequel revenir"
    echo "  -l, --list           Lister les commits disponibles"
    echo "  -d, --dry-run        Simuler le rollback sans l'exécuter"
    echo "  -h, --help           Afficher cette aide"
    echo ""
    echo "EXEMPLES:"
    echo "  $0 --list                    # Lister les commits"
    echo "  $0 --commit abc123def        # Rollback vers le commit abc123def"
    echo "  $0 --commit abc123def --dry-run  # Simuler le rollback"
    echo ""
}

# Lister les commits disponibles
list_commits() {
    log_info "Récupération des commits disponibles..."
    
    # Changer vers le répertoire du projet
    cd "$PROJECT_ROOT"
    
    # Récupérer l'historique des commits
    if supabase db remote commit list; then
        log_success "Liste des commits récupérée"
    else
        log_error "Impossible de récupérer la liste des commits"
        exit 1
    fi
}

# Valider le hash du commit
validate_commit_hash() {
    local commit_hash="$1"
    
    if [ -z "$commit_hash" ]; then
        log_error "Hash du commit requis"
        exit 1
    fi
    
    # Vérifier le format du hash (alphanumérique, 7-40 caractères)
    if [[ ! "$commit_hash" =~ ^[a-zA-Z0-9]{7,40}$ ]]; then
        log_error "Format de hash invalide: $commit_hash"
        log_info "Le hash doit être alphanumérique et contenir 7-40 caractères"
        exit 1
    fi
    
    log_info "Hash du commit validé: $commit_hash"
}

# Effectuer le rollback
perform_rollback() {
    local commit_hash="$1"
    local dry_run="$2"
    
    log_info "=== ROLLBACK SUPABASE HARMONIA ==="
    log_info "Commit cible: $commit_hash"
    log_info "Mode dry-run: $dry_run"
    log_info "Date: $(date)"
    
    # Changer vers le répertoire du projet
    cd "$PROJECT_ROOT"
    
    if [ "$dry_run" = "true" ]; then
        log_warning "MODE DRY-RUN - Aucune modification ne sera effectuée"
        log_info "Commande qui serait exécutée:"
        echo "  supabase db remote commit --commit $commit_hash"
    else
        # Demander confirmation
        log_warning "ATTENTION: Cette opération va modifier la base de données de production !"
        echo -n "Êtes-vous sûr de vouloir continuer ? (y/N): "
        read -r confirmation
        
        if [[ ! "$confirmation" =~ ^[Yy]$ ]]; then
            log_info "Rollback annulé par l'utilisateur"
            exit 0
        fi
        
        # Effectuer le rollback
        log_info "Exécution du rollback..."
        if supabase db remote commit --commit "$commit_hash"; then
            log_success "Rollback effectué avec succès vers le commit $commit_hash"
        else
            log_error "Échec du rollback"
            exit 1
        fi
    fi
}

# Vérifier l'état actuel
check_current_state() {
    log_info "Vérification de l'état actuel..."
    
    cd "$PROJECT_ROOT"
    
    # Afficher le commit actuel
    log_info "Commit actuel:"
    if supabase db remote commit list --limit 1; then
        log_success "État actuel vérifié"
    else
        log_warning "Impossible de récupérer l'état actuel"
    fi
}

# Fonction principale
main() {
    local commit_hash=""
    local list_mode=false
    local dry_run=false
    
    # Parser les arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -c|--commit)
                commit_hash="$2"
                shift 2
                ;;
            -l|--list)
                list_mode=true
                shift
                ;;
            -d|--dry-run)
                dry_run=true
                shift
                ;;
            -h|--help)
                show_help
                exit 0
                ;;
            *)
                log_error "Option inconnue: $1"
                show_help
                exit 1
                ;;
        esac
    done
    
    # Vérifications préalables
    check_supabase_cli
    check_supabase_auth
    
    # Mode liste
    if [ "$list_mode" = "true" ]; then
        list_commits
        exit 0
    fi
    
    # Mode rollback
    if [ -n "$commit_hash" ]; then
        validate_commit_hash "$commit_hash"
        perform_rollback "$commit_hash" "$dry_run"
        check_current_state
        log_success "Rollback terminé !"
    else
        log_error "Aucune action spécifiée"
        show_help
        exit 1
    fi
}

# Exécuter le script principal
main "$@" 