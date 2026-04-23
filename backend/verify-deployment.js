#!/usr/bin/env node

/**
 * Script de vérification du déploiement
 * Vérifie que toutes les variables d'environnement requises sont présentes
 */

import dotenv from 'dotenv';

dotenv.config();

const requiredVars = [
  'SUPABASE_URL',
  'SUPABASE_KEY',
  'SUPABASE_SERVICE_KEY',
  'JWT_SECRET',
  'ADMIN_PASSWORD_HASH'
];

const optionalVars = [
  'NODE_ENV',
  'PORT'
];

console.log('🔍 Vérification des variables d\'environnement...\n');

let hasErrors = false;

// Vérifier les variables requises
console.log('📋 Variables REQUISES:');
requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    const masked = value.substring(0, 10) + '...' + value.substring(value.length - 5);
    console.log(`  ✅ ${varName}: ${masked}`);
  } else {
    console.log(`  ❌ ${varName}: MANQUANTE`);
    hasErrors = true;
  }
});

console.log('\n📋 Variables OPTIONNELLES:');
optionalVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`  ✅ ${varName}: ${value}`);
  } else {
    console.log(`  ⚠️  ${varName}: non définie (utilisation de la valeur par défaut)`);
  }
});

console.log('\n' + '='.repeat(50));

if (hasErrors) {
  console.log('❌ ERREUR: Des variables d\'environnement requises sont manquantes!');
  console.log('\nAssurez-vous que les variables suivantes sont définies:');
  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      console.log(`  - ${varName}`);
    }
  });
  process.exit(1);
} else {
  console.log('✅ Toutes les variables d\'environnement requises sont présentes!');
  console.log('\n🚀 Le serveur est prêt pour le déploiement.');
  process.exit(0);
}
