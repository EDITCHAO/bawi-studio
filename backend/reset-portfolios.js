import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Variables d\'environnement manquantes');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function resetPortfolios() {
  try {
    console.log('🚀 Réinitialisation des portfolios...');

    // Supprimer tous les portfolios existants
    console.log('🗑️  Suppression des portfolios existants...');
    const { error: deleteError } = await supabase
      .from('portfolios')
      .delete()
      .neq('id', 0);

    if (deleteError) {
      console.error('❌ Erreur suppression:', deleteError);
      return;
    }

    console.log('✅ Tous les portfolios supprimés');

    // Insérer les 2 portfolios
    console.log('📝 Insertion des 2 portfolios...');

    const portfolioData = [
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

    const { data, error: insertError } = await supabase
      .from('portfolios')
      .insert(portfolioData)
      .select();

    if (insertError) {
      console.error('❌ Erreur insertion:', insertError);
      return;
    }

    console.log('✅ Données insérées avec succès:', data.length, 'portfolios');

    // Vérifier les données
    const { data: allPortfolios, error: selectError } = await supabase
      .from('portfolios')
      .select('*')
      .order('order_index', { ascending: true });

    if (selectError) {
      console.error('❌ Erreur lecture:', selectError);
      return;
    }

    console.log('📊 Portfolios actuels:');
    allPortfolios.forEach(p => {
      console.log(`  ${p.order_index}. ${p.title}`);
      console.log(`     Catégorie: ${p.category}`);
      console.log(`     Lien: ${p.link}`);
      console.log('');
    });

    console.log('\n✅ Réinitialisation terminée avec succès !');

  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

resetPortfolios();
