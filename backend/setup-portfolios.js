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
  console.error('SUPABASE_URL:', SUPABASE_URL ? '✓' : '✗');
  console.error('SUPABASE_SERVICE_KEY:', SUPABASE_SERVICE_KEY ? '✓' : '✗');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function setupPortfolios() {
  try {
    console.log('🚀 Vérification de la table portfolios...');

    const portfolioData = [
      {
        title: 'Site Vitrine - BAWI-STUDIO',
        description: 'Site vitrine moderne et responsive pour présenter les services de BAWI-STUDIO. Développé avec React, Vite et Tailwind CSS.',
        category: 'web',
        technologies: 'React, Vite, Tailwind CSS, JavaScript',
        link: 'https://bawi-studio.vercel.app',
        order_index: 1
      },
      {
        title: 'Plateforme E-commerce',
        description: 'Plateforme de vente en ligne complète avec panier, paiement et gestion des commandes. Intégration Stripe et Supabase.',
        category: 'web',
        technologies: 'React, Node.js, Express, Supabase, Stripe',
        link: 'https://example-ecommerce.com',
        order_index: 2
      },
      {
        title: 'Application Mobile - Gestion de Tâches',
        description: 'Application mobile pour la gestion des tâches quotidiennes avec synchronisation cloud. Disponible sur iOS et Android.',
        category: 'mobile',
        technologies: 'React Native, Firebase, Redux',
        link: 'https://play.google.com/store/apps/details?id=com.example.tasks',
        order_index: 3
      },
      {
        title: 'Dashboard Analytique',
        description: 'Dashboard interactif pour l\'analyse des données en temps réel. Graphiques dynamiques et rapports personnalisés.',
        category: 'web',
        technologies: 'React, Chart.js, D3.js, Node.js',
        link: 'https://example-dashboard.com',
        order_index: 4
      },
      {
        title: 'Système de Gestion Scolaire',
        description: 'Plateforme complète de gestion scolaire avec gestion des élèves, notes et communications parent-école.',
        category: 'web',
        technologies: 'React, Express, PostgreSQL, JWT',
        link: 'https://example-school.com',
        order_index: 5
      },
      {
        title: 'Application Fintech',
        description: 'Application de gestion financière personnelle avec suivi des dépenses et budgets. Sécurisée et conforme aux normes bancaires.',
        category: 'mobile',
        technologies: 'Flutter, Firebase, Dart',
        link: 'https://example-fintech.com',
        order_index: 6
      }
    ];

    // Vérifier si les données existent déjà
    const { data: checkData, error: checkError } = await supabase
      .from('portfolios')
      .select('id')
      .limit(1);

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('❌ Erreur vérification:', checkError);
      // Continuer quand même
    }

    console.log('✅ Table portfolios accessible');

    if (checkData && checkData.length > 0) {
      console.log('ℹ️  Les données existent déjà, suppression et réinsertion...');
      
      // Supprimer les données existantes
      const { error: deleteError } = await supabase
        .from('portfolios')
        .delete()
        .neq('id', 0);

      if (deleteError) {
        console.error('❌ Erreur suppression:', deleteError);
        return;
      }
    }

    // Insérer les nouvelles données
    console.log('📝 Insertion des données de test...');
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
      console.log(`  - ${p.title} (${p.category})`);
    });

    console.log('\n✅ Setup terminé avec succès !');

  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

setupPortfolios();
