#!/usr/bin/env node

/**
 * Script de vérification du build pour Vercel
 * Vérifie que tout est prêt pour le déploiement
 */

const fs = require('fs');
const path = require('path');

const checks = [];
let passed = 0;
let failed = 0;

function check(name, condition, message) {
  const status = condition ? '✅' : '❌';
  console.log(`${status} ${name}`);
  if (message) console.log(`   ${message}`);
  if (condition) passed++;
  else failed++;
  checks.push({ name, condition, message });
}

console.log('\n🔍 Vérification du build Vercel...\n');

// Vérifier les fichiers essentiels
check(
  'index.html existe',
  fs.existsSync(path.join(__dirname, 'index.html')),
  'Point d\'entrée HTML trouvé'
);

check(
  'package.json existe',
  fs.existsSync(path.join(__dirname, 'package.json')),
  'Configuration npm trouvée'
);

check(
  'vite.config.js existe',
  fs.existsSync(path.join(__dirname, 'vite.config.js')),
  'Configuration Vite trouvée'
);

check(
  'vercel.json existe',
  fs.existsSync(path.join(__dirname, 'vercel.json')),
  'Configuration Vercel trouvée'
);

check(
  '.env.production existe',
  fs.existsSync(path.join(__dirname, '.env.production')),
  'Variables de production trouvées'
);

// Vérifier les dossiers essentiels
check(
  'src/ existe',
  fs.existsSync(path.join(__dirname, 'src')),
  'Dossier source trouvé'
);

check(
  'public/ existe',
  fs.existsSync(path.join(__dirname, 'public')),
  'Dossier public trouvé'
);

// Vérifier package.json
const packageJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8')
);

check(
  'Script "build" configuré',
  packageJson.scripts && packageJson.scripts.build,
  `Commande: ${packageJson.scripts?.build}`
);

check(
  'React installé',
  packageJson.dependencies && packageJson.dependencies.react,
  `Version: ${packageJson.dependencies?.react}`
);

check(
  'React DOM installé',
  packageJson.dependencies && packageJson.dependencies['react-dom'],
  `Version: ${packageJson.dependencies?.['react-dom']}`
);

check(
  'Vite installé',
  packageJson.devDependencies && packageJson.devDependencies.vite,
  `Version: ${packageJson.devDependencies?.vite}`
);

// Vérifier vercel.json
const vercelJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'vercel.json'), 'utf8')
);

check(
  'buildCommand configuré',
  vercelJson.buildCommand === 'npm run build',
  `Commande: ${vercelJson.buildCommand}`
);

check(
  'outputDirectory configuré',
  vercelJson.outputDirectory === 'dist',
  `Répertoire: ${vercelJson.outputDirectory}`
);

check(
  'framework configuré',
  vercelJson.framework === 'vite',
  `Framework: ${vercelJson.framework}`
);

// Résumé
console.log('\n' + '='.repeat(50));
console.log(`\n📊 Résumé: ${passed} ✅ | ${failed} ❌\n`);

if (failed === 0) {
  console.log('🎉 Tout est prêt pour le déploiement sur Vercel!\n');
  process.exit(0);
} else {
  console.log('⚠️  Veuillez corriger les erreurs avant de déployer.\n');
  process.exit(1);
}
