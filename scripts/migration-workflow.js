#!/usr/bin/env node

/**
 * Script de workflow automatisé pour les migrations Supabase
 * Usage: node scripts/migration-workflow.js [command] [options]
 */

import fs from "fs";
import path from "path";
import { execSync, spawn } from "child_process";
import readline from "readline";
import { fileURLToPath } from "url";

// Obtenir le répertoire du script
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  migrationsDir: path.join(__dirname, "../supabase/migrations"),
  backupDir: path.join(__dirname, "../supabase/migrations_backup"),
  projectName: "la-maison-sattvaia",
  templateFile: path.join(__dirname, "migration-template.sql"),
};

// Couleurs pour l'affichage
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

// Fonctions utilitaires
function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logInfo(message) {
  log(`[INFO] ${message}`, "blue");
}

function logSuccess(message) {
  log(`[SUCCESS] ${message}`, "green");
}

function logWarning(message) {
  log(`[WARNING] ${message}`, "yellow");
}

function logError(message) {
  log(`[ERROR] ${message}`, "red");
}

// Vérifier que Supabase CLI est installé
function checkSupabaseCLI() {
  try {
    execSync("supabase --version", { stdio: "pipe" });
    return true;
  } catch (error) {
    logError("Supabase CLI n'est pas installé. Veuillez l'installer d'abord.");
    log("Installation: npm install -g supabase", "cyan");
    return false;
  }
}

// Générer un nom de migration avec timestamp
function generateMigrationName(description) {
  const timestamp = new Date()
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\..+/, "")
    .replace("T", "");

  const sanitizedDescription = description
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "_")
    .trim();

  return `${timestamp}_${sanitizedDescription}`;
}

// Créer une nouvelle migration
async function createMigration(description) {
  if (!description) {
    logError("Veuillez fournir une description pour la migration");
    log(
      'Usage: node scripts/migration-workflow.js create "description de la migration"',
      "cyan"
    );
    process.exit(1);
  }

  if (!checkSupabaseCLI()) {
    process.exit(1);
  }

  const migrationName = generateMigrationName(description);
  const migrationFile = path.join(CONFIG.migrationsDir, `${migrationName}.sql`);

  logInfo(`Création de la migration: ${migrationName}`);

  // Créer le répertoire des migrations s'il n'existe pas
  if (!fs.existsSync(CONFIG.migrationsDir)) {
    fs.mkdirSync(CONFIG.migrationsDir, { recursive: true });
  }

  // Lire le template
  let template = "";
  if (fs.existsSync(CONFIG.templateFile)) {
    template = fs.readFileSync(CONFIG.templateFile, "utf8");
  } else {
    template = getDefaultTemplate();
  }

  // Remplacer les placeholders
  const author =
    execSync("git config user.name", { encoding: "utf8" }).trim() || "Unknown";
  const date = new Date().toISOString().replace("T", " ").substring(0, 19);

  template = template
    .replace(/\[DESCRIPTION\]/g, description)
    .replace(/\[DATE\]/g, date)
    .replace(/\[AUTHOR\]/g, author)
    .replace(/\[VERSION\]/g, migrationName);

  // Écrire le fichier de migration
  fs.writeFileSync(migrationFile, template);

  logSuccess(`Migration créée: ${migrationFile}`);
  log(
    "Vous pouvez maintenant éditer le fichier et ajouter votre code SQL.",
    "cyan"
  );
}

// Template par défaut si le fichier template n'existe pas
function getDefaultTemplate() {
  return `-- Migration: [DESCRIPTION]
-- Date: [DATE]
-- Auteur: [AUTHOR]
-- Version: [VERSION]

-- =====================================================
-- DESCRIPTION: [DESCRIPTION]
-- =====================================================

-- Ajoutez votre code SQL ici
-- Exemple:
-- CREATE TABLE IF NOT EXISTS nom_table (
--     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
--     created_at TIMESTAMPTZ DEFAULT NOW()
-- );

-- =====================================================
-- ROLLBACK (optionnel)
-- =====================================================

-- DROP TABLE IF EXISTS nom_table;
`;
}

// Lister toutes les migrations
function listMigrations() {
  logInfo("Migrations existantes:");
  console.log("");

  if (!fs.existsSync(CONFIG.migrationsDir)) {
    logWarning("Le répertoire des migrations n'existe pas");
    return;
  }

  const files = fs
    .readdirSync(CONFIG.migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  if (files.length === 0) {
    logWarning("Aucune migration trouvée");
    return;
  }

  files.forEach((file) => {
    const filePath = path.join(CONFIG.migrationsDir, file);
    const stats = fs.statSync(filePath);
    const content = fs.readFileSync(filePath, "utf8");

    // Extraire la description depuis le contenu
    const descriptionMatch = content.match(/-- Migration: (.+)/);
    const description = descriptionMatch
      ? descriptionMatch[1]
      : "Description non trouvée";

    console.log(`  📄 ${file}`);
    console.log(`     📅 ${stats.mtime.toLocaleString()}`);
    console.log(`     📝 ${description}`);
    console.log(
      `     📊 ${stats.size} bytes, ${content.split("\n").length} lignes`
    );
    console.log("");
  });

  logSuccess(`${files.length} migration(s) trouvée(s)`);
}

// Appliquer les migrations
function applyMigrations() {
  logInfo("Application des migrations...");

  if (!checkSupabaseCLI()) {
    process.exit(1);
  }

  try {
    // Vérifier l'état de Supabase
    execSync("supabase status", { stdio: "pipe" });
  } catch (error) {
    logError(
      "Supabase n'est pas démarré. Veuillez d'abord exécuter: supabase start"
    );
    process.exit(1);
  }

  try {
    // Appliquer les migrations
    execSync("supabase db reset", { stdio: "inherit" });
    logSuccess("Migrations appliquées avec succès");
  } catch (error) {
    logError("Erreur lors de l'application des migrations");
    process.exit(1);
  }
}

// Créer une sauvegarde des migrations
function backupMigrations() {
  logInfo("Création d'une sauvegarde des migrations...");

  if (!fs.existsSync(CONFIG.backupDir)) {
    fs.mkdirSync(CONFIG.backupDir, { recursive: true });
  }

  if (!fs.existsSync(CONFIG.migrationsDir)) {
    logWarning("Aucune migration à sauvegarder");
    return;
  }

  const backupName = `backup_${new Date().toISOString().replace(/[:.]/g, "-")}`;
  const backupPath = path.join(CONFIG.backupDir, backupName);

  fs.cpSync(CONFIG.migrationsDir, backupPath, { recursive: true });
  logSuccess(`Sauvegarde créée: ${backupPath}`);
}

// Valider la syntaxe SQL des migrations
function validateMigrations() {
  logInfo("Validation de la syntaxe SQL des migrations...");

  if (!fs.existsSync(CONFIG.migrationsDir)) {
    logWarning("Le répertoire des migrations n'existe pas");
    return;
  }

  const files = fs
    .readdirSync(CONFIG.migrationsDir)
    .filter((file) => file.endsWith(".sql"));

  let errors = 0;

  files.forEach((file) => {
    const filePath = path.join(CONFIG.migrationsDir, file);
    const content = fs.readFileSync(filePath, "utf8");

    logInfo(`Validation de ${file}...`);

    // Vérifications basiques
    if (!content.includes(";")) {
      logWarning(`  ⚠️  Aucune instruction SQL trouvée dans ${file}`);
    }

    // Vérification des mots-clés dangereux
    const dangerousKeywords = ["DROP TABLE", "DROP DATABASE", "TRUNCATE"];
    dangerousKeywords.forEach((keyword) => {
      if (content.toUpperCase().includes(keyword)) {
        logWarning(`  ⚠️  Mot-clé dangereux détecté: ${keyword}`);
      }
    });

    // Vérification de la structure
    if (!content.includes("-- Migration:")) {
      logWarning(`  ⚠️  En-tête de migration manquant dans ${file}`);
    }

    logSuccess(`  ✅ ${file} validé`);
  });

  if (errors === 0) {
    logSuccess("Toutes les migrations sont valides");
  } else {
    logError(`${errors} erreur(s) trouvée(s)`);
    process.exit(1);
  }
}

// Générer un rapport de migration
function generateReport() {
  logInfo("Génération du rapport de migration...");

  const reportFile = `migration_report_${new Date().toISOString().replace(/[:.]/g, "-")}.md`;
  let report = `# Rapport de Migration - ${CONFIG.projectName}

**Date:** ${new Date().toLocaleString()}  
**Environnement:** ${getSupabaseStatus()}

## Résumé

`;

  if (fs.existsSync(CONFIG.migrationsDir)) {
    const files = fs
      .readdirSync(CONFIG.migrationsDir)
      .filter((file) => file.endsWith(".sql"));

    report += `- **Total des migrations:** ${files.length}\n`;

    if (files.length > 0) {
      const latestFile = files[files.length - 1];
      report += `- **Dernière migration:** ${latestFile}\n`;
    }

    report += "\n## Migrations\n\n";

    files.forEach((file) => {
      const filePath = path.join(CONFIG.migrationsDir, file);
      const stats = fs.statSync(filePath);
      const content = fs.readFileSync(filePath, "utf8");
      const lines = content.split("\n").length;

      report += `### ${file}\n`;
      report += `- **Taille:** ${stats.size} bytes\n`;
      report += `- **Lignes:** ${lines}\n`;
      report += `- **Créé:** ${stats.birthtime.toLocaleString()}\n`;
      report += `- **Modifié:** ${stats.mtime.toLocaleString()}\n\n`;
    });
  } else {
    report += "- **Total des migrations:** 0\n";
    report += "- **Dernière migration:** Aucune\n\n";
  }

  fs.writeFileSync(reportFile, report);
  logSuccess(`Rapport généré: ${reportFile}`);
}

// Obtenir le statut Supabase
function getSupabaseStatus() {
  try {
    const status = execSync("supabase status", { encoding: "utf8" });
    const apiUrlMatch = status.match(/API URL:\s+(.+)/);
    return apiUrlMatch ? apiUrlMatch[1] : "Non connecté";
  } catch (error) {
    return "Non connecté";
  }
}

// Workflow interactif
async function interactiveWorkflow() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (query) =>
    new Promise((resolve) => rl.question(query, resolve));

  log("🚀 Workflow interactif de migration Supabase", "cyan");
  console.log("");

  const action = await question(
    "Choisissez une action:\n1. Créer une migration\n2. Lister les migrations\n3. Appliquer les migrations\n4. Sauvegarder les migrations\n5. Valider les migrations\n6. Générer un rapport\n7. Quitter\n\nVotre choix (1-7): "
  );

  switch (action.trim()) {
    case "1":
      const description = await question("Description de la migration: ");
      await createMigration(description);
      break;
    case "2":
      listMigrations();
      break;
    case "3":
      const confirm = await question(
        "Êtes-vous sûr de vouloir appliquer toutes les migrations? (y/N): "
      );
      if (confirm.toLowerCase() === "y" || confirm.toLowerCase() === "yes") {
        applyMigrations();
      } else {
        log("Opération annulée", "yellow");
      }
      break;
    case "4":
      backupMigrations();
      break;
    case "5":
      validateMigrations();
      break;
    case "6":
      generateReport();
      break;
    case "7":
      log("Au revoir!", "green");
      break;
    default:
      logError("Choix invalide");
  }

  rl.close();
}

// Afficher l'aide
function showHelp() {
  console.log("Script de workflow automatisé pour les migrations Supabase");
  console.log("");
  console.log("Usage: node scripts/migration-workflow.js [command] [options]");
  console.log("");
  console.log("Commandes:");
  console.log("  create <description>    Créer une nouvelle migration");
  console.log("  list                    Lister toutes les migrations");
  console.log("  apply                   Appliquer toutes les migrations");
  console.log("  backup                  Créer une sauvegarde des migrations");
  console.log("  validate                Valider la syntaxe des migrations");
  console.log("  report                  Générer un rapport des migrations");
  console.log("  interactive             Mode interactif");
  console.log("  help                    Afficher cette aide");
  console.log("");
  console.log("Exemples:");
  console.log(
    '  node scripts/migration-workflow.js create "ajouter table utilisateurs"'
  );
  console.log("  node scripts/migration-workflow.js list");
  console.log("  node scripts/migration-workflow.js apply");
  console.log("  node scripts/migration-workflow.js interactive");
  console.log("");
  console.log("Convention de nommage:");
  console.log("  Format: YYYYMMDDHHMMSS_description_en_snake_case.sql");
  console.log("  Exemple: 20250120143000_ajouter_table_utilisateurs.sql");
}

// Script principal
async function main() {
  const command = process.argv[2] || "help";
  const args = process.argv.slice(3);

  try {
    switch (command) {
      case "create":
        await createMigration(args[0]);
        break;
      case "list":
        listMigrations();
        break;
      case "apply":
        applyMigrations();
        break;
      case "backup":
        backupMigrations();
        break;
      case "validate":
        validateMigrations();
        break;
      case "report":
        generateReport();
        break;
      case "interactive":
        await interactiveWorkflow();
        break;
      case "help":
      default:
        showHelp();
        break;
    }
  } catch (error) {
    logError(`Erreur: ${error.message}`);
    process.exit(1);
  }
}

// Exécuter le script principal
main();
