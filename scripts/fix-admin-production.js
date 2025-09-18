// Script pour diagnostiquer et corriger le problème admin en production
// scripts/fix-admin-production.js

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Charger les variables d'environnement
dotenv.config();

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

console.log("🔍 Configuration:");
console.log("   URL:", supabaseUrl || "❌ Manquante");
console.log(
  "   Service Key:",
  supabaseServiceKey ? "✅ Présente" : "❌ Manquante"
);

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Variables d'environnement manquantes");
  console.log("   Vérifiez PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixAdminProduction() {
  console.log("\n🔧 Diagnostic et correction admin production...\n");

  const adminEmail = "tyzranaima@gmail.com";

  try {
    // 1. Chercher l'utilisateur dans auth.users
    console.log("1. Recherche de l'utilisateur dans auth.users...");
    const { data: users, error: usersError } =
      await supabase.auth.admin.listUsers();

    if (usersError) {
      console.error("❌ Erreur liste utilisateurs:", usersError.message);
      return;
    }

    const targetUser = users.users.find((u) => u.email === adminEmail);

    if (!targetUser) {
      console.error("❌ Utilisateur non trouvé:", adminEmail);
      console.log("   Utilisateurs disponibles:");
      users.users.forEach((u) => {
        console.log(`   - ${u.email} (${u.id})`);
      });
      return;
    }

    console.log("✅ Utilisateur trouvé:");
    console.log("   ID:", targetUser.id);
    console.log("   Email:", targetUser.email);
    console.log("   Créé le:", targetUser.created_at);

    // 2. Vérifier le profil existant
    console.log("\n2. Vérification du profil dans la table profiles...");
    const { data: existingProfile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", targetUser.id)
      .maybeSingle();

    if (profileError && profileError.code !== "PGRST116") {
      console.error("❌ Erreur profil:", profileError.message);
      return;
    }

    if (existingProfile) {
      console.log("✅ Profil trouvé:", existingProfile);

      if (existingProfile.role === "admin") {
        console.log("✅ Le profil a déjà le rôle admin");
        console.log("   Le problème pourrait être ailleurs...");

        // Vérifier les politiques RLS
        console.log("\n3. Diagnostic supplémentaire...");
        console.log("   - Vérifiez que l'utilisateur peut se connecter");
        console.log("   - Vérifiez les cookies de session");
        console.log("   - Vérifiez les logs de production");
      } else {
        console.log("⚠️  Mise à jour du rôle vers admin...");
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ role: "admin" })
          .eq("id", targetUser.id);

        if (updateError) {
          console.error("❌ Erreur mise à jour:", updateError.message);
        } else {
          console.log("✅ Rôle mis à jour vers admin");
        }
      }
    } else {
      console.log("❌ Aucun profil trouvé, création...");

      const { data: newProfile, error: createError } = await supabase
        .from("profiles")
        .insert({
          id: targetUser.id,
          role: "admin",
        })
        .select()
        .single();

      if (createError) {
        console.error("❌ Erreur création profil:", createError.message);
        console.log("   Code d'erreur:", createError.code);
        console.log("   Détails:", createError.details);
      } else {
        console.log("✅ Profil admin créé:", newProfile);
      }
    }

    // 3. Vérification finale
    console.log("\n4. Vérification finale...");
    const { data: finalProfile, error: finalError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", targetUser.id)
      .single();

    if (finalError) {
      console.error("❌ Erreur vérification finale:", finalError.message);
    } else {
      console.log("✅ Profil final:", finalProfile);
      if (finalProfile.role === "admin") {
        console.log("🎉 L'utilisateur a maintenant le rôle admin !");
      } else {
        console.log("⚠️  Le rôle n'est toujours pas admin");
      }
    }
  } catch (error) {
    console.error("❌ Erreur générale:", error.message);
  }
}

// Exporter pour utilisation
if (import.meta.url === `file://${process.argv[1]}`) {
  fixAdminProduction();
}

export { fixAdminProduction };
