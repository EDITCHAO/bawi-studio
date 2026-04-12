import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

console.log('=== Vérification de la configuration ===\n');

const checks = [
  {
    name: 'SUPABASE_URL',
    value: process.env.SUPABASE_URL,
    required: true
  },
  {
    name: 'SUPABASE_KEY',
    value: process.env.SUPABASE_KEY,
    required: true
  },
  {
    name: 'JWT_SECRET',
    value: process.env.JWT_SECRET,
    required: true
  },
  {
    name: 'ADMIN_PASSWORD_HASH',
    value: process.env.ADMIN_PASSWORD_HASH,
    required: true
  },
  {
    name: 'PORT',
    value: process.env.PORT || '5000',
    required: false
  }
];

let allGood = true;

checks.forEach(check => {
  const status = check.value ? '✓' : '✗';
  const color = check.value ? '\x1b[32m' : '\x1b[31m';
  const reset = '\x1b[0m';
  
  console.log(`${color}${status}${reset} ${check.name}: ${check.value ? 'OK' : 'MANQUANT'}`);
  
  if (check.required && !check.value) {
    allGood = false;
  }
});

console.log('\n=== Résumé ===');
if (allGood) {
  console.log('\x1b[32m✓ Configuration OK - Vous pouvez démarrer le serveur\x1b[0m');
  process.exit(0);
} else {
  console.log('\x1b[31m✗ Configuration incomplète - Veuillez configurer les variables manquantes\x1b[0m');
  console.log('\nPour générer le hash du mot de passe:');
  console.log('  node setup-supabase.js');
  process.exit(1);
}
