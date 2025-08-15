#!/usr/bin/env node

/**
 * Script de validation des secrets GitHub Actions
 * Vérifie que tous les secrets nécessaires sont configurés
 */

import { execSync } from "child_process";
import { readFileSync } from "fs";
import { join } from "path";

// Couleurs pour la console
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  header: (msg) =>
    console.log(`\n${colors.bright}${colors.cyan}${msg}${colors.reset}\n`),
};

// Secrets requis pour le workflow
const requiredSecrets = {
  // Variables d'environnement de base
  base: ["PUBLIC_SITE_URL", "SUPABASE_URL", "SUPABASE_ANON_KEY"],

  // Configuration Vercel
  vercel: ["VERCEL_TOKEN", "VERCEL_ORG_ID", "VERCEL_PROJECT_ID"],

  // Configuration Netlify (optionnel)
  netlify: ["NETLIFY_AUTH_TOKEN", "NETLIFY_SITE_ID", "NETLIFY_SITE_URL"],

  // Notifications (optionnel)
  notifications: ["SLACK_WEBHOOK_URL", "EMAIL_WEBHOOK_URL"],
};

// Fonction pour vérifier si un secret existe
function checkSecret(secretName) {
  try {
    // Cette commande échouera si le secret n'existe pas
    execSync(`gh secret list --json name | grep -q "${secretName}"`, {
      stdio: "pipe",
      encoding: "utf8",
    });
    return true;
  } catch (error) {
    return false;
  }
}

// Fonction pour vérifier la configuration GitHub CLI
function checkGitHubCLI() {
  try {
    execSync("gh auth status", { stdio: "pipe" });
    return true;
  } catch (error) {
    return false;
  }
}

// Fonction pour lire le workflow et extraire les secrets utilisés
function extractSecretsFromWorkflow() {
  try {
    const workflowPath = join(
      process.cwd(),
      ".github",
      "workflows",
      "deploy.yml"
    );
    const workflowContent = readFileSync(workflowPath, "utf8");

    // Extraire les secrets utilisés dans le workflow
    const secretMatches = workflowContent.match(/\${{ secrets\.([A-Z_]+) }}/g);
    const usedSecrets = secretMatches
      ? [
          ...new Set(
            secretMatches.map((match) =>
              match.replace("${{ secrets.", "").replace(" }}", "")
            )
          ),
        ]
      : [];

    return usedSecrets;
  } catch (error) {
    log.error(`Impossible de lire le fichier workflow: ${error.message}`);
    return [];
  }
}

// Fonction principale
async function validateSecrets() {
  log.header("🔐 Validation des Secrets GitHub Actions");

  // Vérifier GitHub CLI
  log.info("Vérification de GitHub CLI...");
  if (!checkGitHubCLI()) {
    log.error(
      "GitHub CLI n'est pas configuré. Installez-le et connectez-vous avec:"
    );
    console.log("  npm install -g gh");
    console.log("  gh auth login");
    process.exit(1);
  }
  log.success("GitHub CLI est configuré");

  // Extraire les secrets utilisés dans le workflow
  const usedSecrets = extractSecretsFromWorkflow();
  log.info(`Secrets détectés dans le workflow: ${usedSecrets.length}`);

  // Vérifier les secrets requis
  let allValid = true;
  const missingSecrets = [];
  const optionalSecrets = [];

  log.header("📋 Vérification des Secrets Requis");

  // Vérifier les secrets de base
  log.info("Variables d'environnement de base:");
  for (const secret of requiredSecrets.base) {
    if (checkSecret(secret)) {
      log.success(`  ${secret}`);
    } else {
      log.error(`  ${secret} - MANQUANT`);
      missingSecrets.push(secret);
      allValid = false;
    }
  }

  // Vérifier les secrets Vercel
  log.info("\nConfiguration Vercel:");
  let vercelConfigured = true;
  for (const secret of requiredSecrets.vercel) {
    if (checkSecret(secret)) {
      log.success(`  ${secret}`);
    } else {
      log.error(`  ${secret} - MANQUANT`);
      missingSecrets.push(secret);
      vercelConfigured = false;
      allValid = false;
    }
  }

  // Vérifier les secrets Netlify (optionnel)
  log.info("\nConfiguration Netlify (optionnel):");
  let netlifyConfigured = true;
  for (const secret of requiredSecrets.netlify) {
    if (checkSecret(secret)) {
      log.success(`  ${secret}`);
    } else {
      log.warning(`  ${secret} - MANQUANT (optionnel)`);
      optionalSecrets.push(secret);
      netlifyConfigured = false;
    }
  }

  // Vérifier les secrets de notifications (optionnel)
  log.info("\nNotifications (optionnel):");
  for (const secret of requiredSecrets.notifications) {
    if (checkSecret(secret)) {
      log.success(`  ${secret}`);
    } else {
      log.warning(`  ${secret} - MANQUANT (optionnel)`);
      optionalSecrets.push(secret);
    }
  }

  // Résumé
  log.header("📊 Résumé de la Validation");

  if (allValid) {
    log.success("✅ Tous les secrets requis sont configurés !");
  } else {
    log.error("❌ Certains secrets requis sont manquants");
    console.log("\nSecrets manquants:");
    missingSecrets.forEach((secret) => {
      console.log(`  - ${secret}`);
    });
  }

  if (optionalSecrets.length > 0) {
    log.warning("⚠️  Secrets optionnels manquants:");
    optionalSecrets.forEach((secret) => {
      console.log(`  - ${secret}`);
    });
  }

  // Recommandations
  log.header("💡 Recommandations");

  if (!vercelConfigured) {
    log.info("Pour configurer Vercel:");
    console.log("  1. Allez sur https://vercel.com/account/tokens");
    console.log("  2. Créez un nouveau token");
    console.log("  3. Ajoutez les secrets VERCEL_* dans GitHub");
  }

  if (!netlifyConfigured) {
    log.info("Pour configurer Netlify (optionnel):");
    console.log("  1. Allez sur https://app.netlify.com/user/applications");
    console.log("  2. Créez un nouveau token");
    console.log("  3. Ajoutez les secrets NETLIFY_* dans GitHub");
  }

  if (optionalSecrets.length > 0) {
    log.info("Pour les notifications (optionnel):");
    console.log(
      "  1. Configurez Slack: https://api.slack.com/messaging/webhooks"
    );
    console.log("  2. Configurez un service d'email (SendGrid, Mailgun, etc.)");
  }

  // Instructions pour ajouter des secrets
  log.header("🔧 Comment ajouter des secrets");
  console.log("1. Allez sur votre repository GitHub");
  console.log("2. Settings > Secrets and variables > Actions");
  console.log('3. Cliquez sur "New repository secret"');
  console.log("4. Ajoutez chaque secret manquant");

  return allValid;
}

// Exécuter la validation
if (import.meta.url === `file://${process.argv[1]}`) {
  validateSecrets()
    .then((valid) => {
      process.exit(valid ? 0 : 1);
    })
    .catch((error) => {
      log.error(`Erreur lors de la validation: ${error.message}`);
      process.exit(1);
    });
}

export { validateSecrets };
