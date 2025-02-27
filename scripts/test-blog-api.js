// @ts-check
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Variables d\'environnement manquantes');
  process.exit(1);
}

async function main() {
  try {
    // Création du client Supabase
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Connexion avec email/password
    const { data: { session }, error } = await supabase.auth.signInWithPassword({
      email: 'tyzranaima@gmail.com',
      password: process.env.TEST_PASSWORD // Assurez-vous d'avoir ce mot de passe dans .env
    });

    if (error) {
      throw error;
    }

    console.log('Connecté avec succès');

    // Test de création d'article
    const response = await fetch('http://localhost:4321/api/blog/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `supabase.auth.token=${encodeURIComponent(JSON.stringify({
          access_token: session.access_token,
          refresh_token: session.refresh_token
        }))}`
      },
      body: JSON.stringify({
        title: "Article Test via Script",
        category: "Test",
        summary: "Ceci est un test via script",
        content: "# Mon Article Test\n\nCeci est le contenu de mon article test via script.",
        image: "https://example.com/image.jpg"
      })
    });

    const result = await response.text();
    console.log('Statut:', response.status);
    console.log('Réponse:', result);

  } catch (error) {
    console.error('Erreur:', error);
  }
}

main();
