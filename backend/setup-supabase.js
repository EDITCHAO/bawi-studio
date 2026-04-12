import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// Générer le hash du mot de passe admin
const adminPassword = '20-86'; // Mot de passe par défaut
const saltRounds = 10;

bcrypt.hash(adminPassword, saltRounds, (err, hash) => {
  if (err) {
    console.error('Erreur:', err);
    process.exit(1);
  }
  
  console.log('Hash du mot de passe admin:');
  console.log(hash);
  console.log('\nAjoutez cette ligne dans backend/.env:');
  console.log(`ADMIN_PASSWORD_HASH=${hash}`);
});
