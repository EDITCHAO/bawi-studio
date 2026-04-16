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

async function restorePortfolioImages() {
  try {
    console.log('🖼️  Restauration des images des portfolios...\n');

    // Étape 1: Récupérer tous les fichiers du storage
    console.log('📸 Récupération des images du Supabase Storage...');
    const { data: files, error: listError } = await supabase.storage
      .from('portfolios')
      .list();

    if (listError) {
      console.error('❌ Erreur listing:', listError);
      return;
    }

    console.log(`✅ ${files.length} fichiers trouvés\n`);

    // Étape 2: Récupérer les portfolios actuels
    console.log('📋 Récupération des portfolios...');
    const { data: portfolios, error: fetchError } = await supabase
      .from('portfolios')
      .select('*')
      .order('order_index', { ascending: true });

    if (fetchError) {
      console.error('❌ Erreur:', fetchError);
      return;
    }

    console.log(`✅ ${portfolios.length} portfolios trouvés\n`);

    // Étape 3: Associer les images aux portfolios
    console.log('🔗 Association des images aux portfolios...\n');

    const imageFiles = files.filter(f => f.name && /\.(jpg|jpeg|png|gif|webp)$/i.test(f.name));
    
    console.log(`📊 ${imageFiles.length} fichiers image trouvés\n`);

    // Afficher les images disponibles
    console.log('Images disponibles:');
    console.log('─'.repeat(80));
    imageFiles.forEach((file, index) => {
      const { data: publicData } = supabase.storage
        .from('portfolios')
        .getPublicUrl(file.name);
      console.log(`${index + 1}. ${file.name}`);
      console.log(`   ${publicData.publicUrl}\n`);
    });

    console.log('─'.repeat(80));
    console.log('\n📝 Portfolios à mettre à jour:');
    console.log('─'.repeat(80));

    portfolios.forEach((p, index) => {
      console.log(`\n${index + 1}. ${p.title}`);
      console.log(`   Image actuelle: ${p.image_url || '(aucune)'}`);
    });

    console.log('\n' + '─'.repeat(80));
    console.log('\n⚠️  Pour restaurer les images, tu dois:');
    console.log('1. Identifier quelle image correspond à quel portfolio');
    console.log('2. Exécuter le script avec les URLs des images');
    console.log('\nExemple:');
    console.log('  const imageUrls = {');
    console.log('    "BAWI-STUDIO": "https://...",');
    console.log('    "Pour Permis": "https://..."');
    console.log('  };');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

restorePortfolioImages();
