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

async function cleanupAndRestoreImages() {
  try {
    console.log('🖼️  Nettoyage et restauration des images...\n');

    // Étape 1: Récupérer tous les fichiers
    console.log('📸 Récupération des fichiers du storage...');
    const { data: files, error: listError } = await supabase.storage
      .from('portfolios')
      .list();

    if (listError) {
      console.error('❌ Erreur listing:', listError);
      return;
    }

    console.log(`✅ ${files.length} fichiers trouvés\n`);

    // Étape 2: Identifier les images à garder et à supprimer
    const imagesToKeep = [
      '1775913484354-bawi-permis.jpeg',  // BAWI-STUDIO
      '1776032039575-IMG_6115.JPG.jpeg'  // Pour Permis
    ];

    const imagesToDelete = files.filter(f => 
      f.name && 
      /\.(jpg|jpeg|png|gif|webp)$/i.test(f.name) &&
      !imagesToKeep.includes(f.name)
    );

    console.log(`📊 Images à garder: ${imagesToKeep.length}`);
    console.log(`🗑️  Images à supprimer: ${imagesToDelete.length}\n`);

    // Étape 3: Supprimer les images inutiles
    if (imagesToDelete.length > 0) {
      console.log('🗑️  Suppression des images inutiles...');
      for (const file of imagesToDelete) {
        const { error: deleteError } = await supabase.storage
          .from('portfolios')
          .remove([file.name]);

        if (deleteError) {
          console.error(`❌ Erreur suppression ${file.name}:`, deleteError);
        } else {
          console.log(`✅ Supprimé: ${file.name}`);
        }
      }
      console.log('');
    }

    // Étape 4: Obtenir les URLs publiques des images à garder
    console.log('🔗 Récupération des URLs publiques...\n');

    const imageUrls = {};
    
    for (const imageName of imagesToKeep) {
      const { data: publicData } = supabase.storage
        .from('portfolios')
        .getPublicUrl(imageName);
      
      imageUrls[imageName] = publicData.publicUrl;
      console.log(`✅ ${imageName}`);
      console.log(`   ${publicData.publicUrl}\n`);
    }

    // Étape 5: Mettre à jour les portfolios avec les images
    console.log('─'.repeat(80));
    console.log('\n📝 Mise à jour des portfolios...\n');

    const updates = [
      {
        id: 36,  // BAWI-STUDIO
        title: 'BAWI-STUDIO',
        image_url: imageUrls['1775913484354-bawi-permis.jpeg']
      },
      {
        id: 37,  // Pour Permis
        title: 'Pour Permis',
        image_url: imageUrls['1776032039575-IMG_6115.JPG.jpeg']
      }
    ];

    for (const update of updates) {
      const { error: updateError } = await supabase
        .from('portfolios')
        .update({ image_url: update.image_url })
        .eq('id', update.id);

      if (updateError) {
        console.error(`❌ Erreur mise à jour ${update.title}:`, updateError);
      } else {
        console.log(`✅ ${update.title}`);
        console.log(`   Image: ${update.image_url}\n`);
      }
    }

    // Étape 6: Vérifier les portfolios finaux
    console.log('─'.repeat(80));
    console.log('\n📊 Vérification des portfolios finaux...\n');

    const { data: finalPortfolios, error: fetchError } = await supabase
      .from('portfolios')
      .select('*')
      .order('order_index', { ascending: true });

    if (fetchError) {
      console.error('❌ Erreur:', fetchError);
      return;
    }

    finalPortfolios.forEach((p, index) => {
      console.log(`${index + 1}. ${p.title}`);
      console.log(`   Image: ${p.image_url || '(aucune)'}\n`);
    });

    console.log('─'.repeat(80));
    console.log('\n✅ Nettoyage et restauration terminés !\n');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

cleanupAndRestoreImages();
