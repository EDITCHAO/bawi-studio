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

async function migrateDatabase() {
  try {
    console.log('🔧 Migration de la base de données...\n');

    // Vérifier si la colonne existe déjà
    console.log('📋 Vérification de la structure de la table...');
    const { data: columns, error: checkError } = await supabase
      .from('contact_messages')
      .select('*')
      .limit(1);

    if (checkError) {
      console.error('❌ Erreur:', checkError);
      return;
    }

    console.log('✅ Table contact_messages accessible\n');

    // Essayer d'insérer un enregistrement de test avec la colonne cahier_de_charge_url
    console.log('🧪 Test d\'insertion avec cahier_de_charge_url...');
    
    const testData = {
      name: 'Test Migration',
      email: 'test@migration.com',
      phone: null,
      domain: 'test',
      project_type: null,
      budget: null,
      deadline: null,
      subject: null,
      message: 'Test message for migration',
      cahier_de_charge_url: null,
      created_at: new Date().toISOString(),
      read: false
    };

    const { data, error: insertError } = await supabase
      .from('contact_messages')
      .insert([testData])
      .select();

    if (insertError) {
      if (insertError.message.includes('cahier_de_charge_url')) {
        console.log('⚠️  La colonne cahier_de_charge_url n\'existe pas encore');
        console.log('\n📝 Veuillez exécuter cette requête SQL dans Supabase:');
        console.log('');
        console.log('ALTER TABLE contact_messages ADD COLUMN cahier_de_charge_url VARCHAR(500);');
        console.log('');
        console.log('Puis relancez ce script.');
      } else {
        console.error('❌ Erreur:', insertError);
      }
      return;
    }

    console.log('✅ Migration réussie!');
    console.log('✅ La colonne cahier_de_charge_url est maintenant disponible');

    // Supprimer le test
    if (data && data[0]) {
      await supabase
        .from('contact_messages')
        .delete()
        .eq('id', data[0].id);
      console.log('✅ Enregistrement de test supprimé');
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

migrateDatabase();
