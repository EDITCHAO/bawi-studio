import bcrypt from 'bcryptjs';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Entrez le mot de passe admin : ', async (password) => {
  const hash = await bcrypt.hash(password, 10);
  console.log('\nAjoutez cette ligne à votre .env :');
  console.log(`ADMIN_PASSWORD_HASH=${hash}`);
  rl.close();
});
