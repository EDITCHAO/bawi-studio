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

async function updatePortfolios() {
  try {
    console.log('🚀 Mise à jour des portfolios...\n');

    // Étape 1: Récupérer tous les portfolios actuels
    console.log('📋 Récupération des portfolios actuels...');
    const { data: currentPortfolios, error: fetchError } = await supabase
      .from('portfolios')
      .select('*');

    if (fetchError) {
      console.error('❌ Erreur:', fetchError);
      return;
    }

    console.log(`✅ ${currentPortfolios.length} portfolios trouvés\n`);

    // Étape 2: Supprimer tous les portfolios
    if (currentPortfolios.length > 0) {
      console.log('🗑️  Suppression des portfolios existants...');
      const { error: deleteError } = await supabase
        .from('portfolios')
        .delete()
        .gt('id', 0);

      if (deleteError) {
        console.error('❌ Erreur suppression:', deleteError);
        return;
      }
      console.log('✅ Tous les portfolios supprimés\n');
    }

    // Étape 3: Insérer les 2 nouveaux portfolios
    console.log('📝 Insertion des 2 portfolios...\n');

    const newPortfolios = [
      {
        title: 'BAWI-STUDIO',
        description: 'Site vitrine de BAWI-STUDIO - Solutions digitales au Togo et en Afrique de l\'Ouest. Développement web, mobile et logiciel.',
        category: 'web',
        technologies: 'React, Vite, Tailwind CSS, JavaScript, Node.js, Express',
        link: 'https://bawi-studio.vercel.app',
        order_index: 1
      },
      {
        title: 'Pour Permis',
        description: 'Plateforme de gestion et de suivi des demandes de permis. Application web complète avec authentification et gestion des dossiers.',
        category: 'web',
        technologies: 'React, Node.js, Express, PostgreSQL, JWT',
        link: 'https://pour-permis.com',
        order_index: 2
      }
    ];

    const { data: insertedData, error: insertError } = await supabase
      .from('portfolios')
      .insert(newPortfolios)
      .select();

    if (insertError) {
      console.error('❌ Erreur insertion:', insertError);
      return;
    }

    console.log(`✅ ${insertedData.length} portfolios insérés\n`);

    // Étape 4: Vérifier les données finales
    console.log('📊 Portfolios finaux:');
    console.log('─'.repeat(60));
    insertedData.forEach((p, index) => {
      console.log(`\n${index + 1}. ${p.title}`);
      console.log(`   ID: ${p.id}`);
      console.log(`   Catégorie: ${p.category}`);
      console.log(`   Lien: ${p.link}`);
      console.log(`   Technologies: ${p.technologies}`);
    });
    console.log('\n' + '─'.repeat(60));
    console.log('\n✅ Mise à jour terminée avec succès !\n');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

updatePortfolios();
