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

async function addCustomDomainColumn() {
  try {
    console.log('🔧 Ajout de la colonne custom_domain...\n');

    // Vérifier si la colonne existe déjà
    const { data: columns, error: checkError } = await supabase
      .from('contact_messages')
      .select('*')
      .limit(1);

    if (checkError) {
      console.error('❌ Erreur vérification:', checkError);
      return;
    }

    // Essayer d'ajouter la colonne via une requête SQL
    // Note: Supabase ne supporte pas les migrations SQL directes via l'API
    // Il faut utiliser le dashboard Supabase ou une autre méthode

    console.log('⚠️  Pour ajouter la colonne custom_domain, veuillez:');
    console.log('');
    console.log('1. Allez sur https://app.supabase.com');
    console.log('2. Sélectionnez votre projet');
    console.log('3. Allez dans SQL Editor');
    console.log('4. Exécutez cette requête:');
    console.log('');
    console.log('ALTER TABLE contact_messages ADD COLUMN custom_domain VARCHAR(255);');
    console.log('');
    console.log('Ou utilisez le Table Editor pour ajouter la colonne manuellement.');
    console.log('');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

addCustomDomainColumn();
