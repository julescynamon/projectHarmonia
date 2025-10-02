import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import { getNewArticleEmailTemplate } from '../src/lib/emails/new-article-template';

// Configuration - utiliser les variables d'environnement du fichier .env
import dotenv from 'dotenv';
dotenv.config();

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || 'notifications@maisonsattvaia.fr';
const WEBSITE_URL = process.env.WEBSITE_URL || 'https://maisonsattvaia.fr';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!RESEND_API_KEY) {
  console.error('❌ RESEND_API_KEY n\'est pas configurée !');
  process.exit(1);
}

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Configuration Supabase incomplète !');
  process.exit(1);
}

const resend = new Resend(RESEND_API_KEY);
const supabase = createClient(supabaseUrl, supabaseKey);

// Fonction utilitaire pour générer un token de désabonnement sécurisé
function generateUnsubscribeToken(email: string): string {
  const secret = process.env.API_SECRET_KEY || 'default-secret';
  return Buffer.from(email + secret).toString('base64');
}

async function testNewsletterUnsubscribe() {
  const testEmail = 'tyzranaima@gmail.com';
  
  console.log('🧪 Test du système de désabonnement newsletter...\n');
  console.log(`📧 Email de test : ${testEmail}`);
  
  try {
    // 1. Vérifier si l'email existe dans la base de données
    console.log('\n1️⃣ Vérification de l\'abonnement...');
    
    const { data: existingSubscriber, error: queryError } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .eq('email', testEmail)
      .single();

    if (queryError && queryError.code !== 'PGRST116') {
      console.error('❌ Erreur lors de la vérification:', queryError);
      return;
    }

    // 2. Ajouter l'email s'il n'existe pas
    if (!existingSubscriber) {
      console.log('   📝 Ajout de l\'email à la base de données...');
      
      const confirmationToken = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      const { error: insertError } = await supabase
        .from('newsletter_subscribers')
        .insert({
          email: testEmail,
          confirmed: true, // Directement confirmé pour le test
          confirmation_token: null,
          token_expires_at: null,
          confirmed_at: new Date().toISOString(),
          unsubscribed: false,
          unsubscribed_at: null,
          consent_timestamp: new Date().toISOString()
        });

      if (insertError) {
        console.error('❌ Erreur lors de l\'ajout:', insertError);
        return;
      }
      
      console.log('   ✅ Email ajouté et confirmé dans la base de données');
    } else {
      console.log(`   ✅ Email trouvé - Confirmé: ${existingSubscriber.confirmed}, Désabonné: ${existingSubscriber.unsubscribed}`);
      
      // S'assurer que l'email est confirmé et pas désabonné pour le test
      if (!existingSubscriber.confirmed || existingSubscriber.unsubscribed) {
        console.log('   🔄 Mise à jour du statut pour le test...');
        
        const { error: updateError } = await supabase
          .from('newsletter_subscribers')
          .update({
            confirmed: true,
            unsubscribed: false,
            unsubscribed_at: null,
            confirmed_at: new Date().toISOString()
          })
          .eq('email', testEmail);

        if (updateError) {
          console.error('❌ Erreur lors de la mise à jour:', updateError);
          return;
        }
        
        console.log('   ✅ Statut mis à jour');
      }
    }

    // 3. Envoyer l'email de newsletter de test
    console.log('\n2️⃣ Envoi de l\'email de newsletter de test...');
    
    const testArticle = {
      title: '🧪 Test du système de désabonnement',
      description: 'Ceci est un email de test pour vérifier que le bouton de désabonnement fonctionne correctement. Cliquez sur "Se désinscrire" en bas de cet email pour tester la fonctionnalité.',
      url: `${WEBSITE_URL}/blog/test-article`,
      category: 'Test',
      image: `${WEBSITE_URL}/images/about-bg.webp`
    };

    const unsubscribeToken = generateUnsubscribeToken(testEmail);
    const unsubscribeUrl = `${WEBSITE_URL}/api/newsletter/unsubscribe?email=${encodeURIComponent(testEmail)}&token=${encodeURIComponent(unsubscribeToken)}`;

    console.log(`   🔗 URL de désabonnement : ${unsubscribeUrl}`);

    const emailHtml = await getNewArticleEmailTemplate({
      article: testArticle,
      websiteUrl: WEBSITE_URL,
      unsubscribeUrl: unsubscribeUrl
    });

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: testEmail,
      subject: '🧪 Test Newsletter - Vérification du désabonnement',
      html: emailHtml
    });

    if (result.error) {
      console.error('❌ Erreur lors de l\'envoi:', result.error);
      return;
    }

    console.log('✅ Email de newsletter de test envoyé avec succès !');
    console.log(`📧 ID de l'email : ${result.data?.id}`);
    
    console.log('\n📋 Instructions pour le test :');
    console.log('1. Vérifiez votre boîte email tyzranaima@gmail.com');
    console.log('2. Ouvrez l\'email de newsletter de test');
    console.log('3. Cliquez sur le bouton "Se désinscrire" en bas de l\'email');
    console.log('4. Vérifiez que vous êtes redirigé vers la page de confirmation');
    console.log('5. Vérifiez dans Supabase que le champ "unsubscribed" est passé à true');
    
    console.log('\n🔍 Pour vérifier le statut après test :');
    console.log(`   SELECT * FROM newsletter_subscribers WHERE email = '${testEmail}';`);

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

// Exécuter le test
testNewsletterUnsubscribe().then(() => {
  console.log('\n🏁 Test terminé');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
});
