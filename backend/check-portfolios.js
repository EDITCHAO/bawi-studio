import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function checkPortfolios() {
  try {
    console.log('📋 Vérification des portfolios actuels...\n');

    const { data: portfolios, error } = await supabase
      .from('portfolios')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      console.error('❌ Erreur:', error);
      return;
    }

    console.log(`✅ ${portfolios.length} portfolios trouvés\n`);
    console.log('─'.repeat(80));

    portfolios.forEach((p, index) => {
      console.log(`\n${index + 1}. ${p.title}`);
      console.log(`   ID: ${p.id}`);
      console.log(`   Description: ${p.description}`);
      console.log(`   Catégorie: ${p.category}`);
      console.log(`   Image URL: ${p.image_url || '(aucune)'}`);
      console.log(`   Lien: ${p.link}`);
      console.log(`   Technologies: ${p.technologies}`);
      console.log(`   Ordre: ${p.order_index}`);
    });

    console.log('\n' + '─'.repeat(80));

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

checkPortfolios();
