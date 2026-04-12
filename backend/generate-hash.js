import bcrypt from 'bcryptjs';

const password = '20-86';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Erreur:', err);
    process.exit(1);
  }
  
  console.log('✅ Hash généré pour le mot de passe "20-86":');
  console.log(hash);
  console.log('\n📝 Copie cette ligne dans backend/.env:');
  console.log(`ADMIN_PASSWORD_HASH=${hash}`);
});
