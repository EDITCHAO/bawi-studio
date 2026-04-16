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

async function getStorageImages() {
  try {
    console.log('📸 Récupération des images du Supabase Storage...\n');

    // Lister tous les fichiers dans le bucket 'portfolios'
    const { data: files, error } = await supabase.storage
      .from('portfolios')
      .list();

    if (error) {
      console.error('❌ Erreur:', error);
      return;
    }

    console.log(`✅ ${files.length} fichiers trouvés\n`);
    console.log('─'.repeat(80));

    const imageUrls = [];

    files.forEach((file, index) => {
      if (file.name) {
        // Obtenir l'URL publique
        const { data: publicData } = supabase.storage
          .from('portfolios')
          .getPublicUrl(file.name);

        const publicUrl = publicData.publicUrl;
        imageUrls.push({
          name: file.name,
          url: publicUrl
        });

        console.log(`\n${index + 1}. ${file.name}`);
        console.log(`   URL: ${publicUrl}`);
        console.log(`   Taille: ${file.metadata?.size || 'N/A'} bytes`);
        console.log(`   Créé: ${file.created_at || 'N/A'}`);
      }
    });

    console.log('\n' + '─'.repeat(80));
    console.log('\n📋 URLs des images:');
    console.log('─'.repeat(80));

    imageUrls.forEach((img, index) => {
      console.log(`\n${index + 1}. ${img.name}`);
      console.log(`   ${img.url}`);
    });

    console.log('\n' + '─'.repeat(80));
    console.log(`\n✅ ${imageUrls.length} images trouvées\n`);

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

getStorageImages();
