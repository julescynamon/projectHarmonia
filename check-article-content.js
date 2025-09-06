// Script pour vérifier le contenu d'un article
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hvthtebjvmutuvzvttdb.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseServiceKey) {
  console.error('SUPABASE_SERVICE_KEY non définie');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkArticleContent() {
  try {
    const { data: post, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', 'comment-renforcer-son-systeme-immunitaire-naturellement')
      .single();

    if (error) {
      console.error('Erreur:', error);
      return;
    }

    console.log('=== ARTICLE TROUVÉ ===');
    console.log('Titre:', post.title);
    console.log('SEO Title:', post.seo_title);
    console.log('SEO Description:', post.seo_description);
    console.log('Excerpt:', post.excerpt);
    console.log('\n=== CONTENU TIP TAP ===');
    console.log(JSON.stringify(post.content, null, 2));
    
  } catch (error) {
    console.error('Erreur:', error);
  }
}

checkArticleContent();
