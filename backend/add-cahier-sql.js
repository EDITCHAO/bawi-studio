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

async function addCahierColumn() {
  try {
    console.log('🔧 Ajout de la colonne cahier_de_charge_url...\n');

    // Exécuter la requête SQL directement
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS cahier_de_charge_url VARCHAR(500);'
    });

    if (error) {
      // Si la méthode rpc n'existe pas, essayer une autre approche
      console.log('⚠️  Méthode RPC non disponible');
      console.log('\n📝 Veuillez exécuter cette requête SQL dans Supabase SQL Editor:');
      console.log('');
      console.log('ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS cahier_de_charge_url VARCHAR(500);');
      console.log('');
      console.log('Étapes:');
      console.log('1. Allez sur https://app.supabase.com');
      console.log('2. Sélectionnez votre projet');
      console.log('3. Allez dans SQL Editor');
      console.log('4. Collez la requête ci-dessus');
      console.log('5. Cliquez sur "Run"');
      console.log('');
      return;
    }

    console.log('✅ Colonne cahier_de_charge_url ajoutée avec succès!');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    console.log('\n📝 Veuillez exécuter cette requête SQL dans Supabase SQL Editor:');
    console.log('');
    console.log('ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS cahier_de_charge_url VARCHAR(500);');
  }
}

addCahierColumn();
