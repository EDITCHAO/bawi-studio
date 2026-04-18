# Configuration des Variables d'Environnement

## 🔐 Sécurité

**IMPORTANT**: Les fichiers `.env` ne doivent JAMAIS être commitées dans Git.

## Frontend (.env)

### Développement local

```bash
VITE_API_URL=http://localhost:5000
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_supabase_anon_key
```

### Production (Vercel)

```
VITE_API_URL=https://bawi-studio-backend.onrender.com
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_supabase_anon_key
```

## Backend (.env)

### Développement local

```bash
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
JWT_SECRET=your_jwt_secret_key_here
ADMIN_PASSWORD_HASH=your_bcrypt_hashed_password
PORT=5000
NODE_ENV=development
```

### Production (Render)

```
NODE_ENV=production
PORT=10000
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
JWT_SECRET=your_jwt_secret_key_here
ADMIN_PASSWORD_HASH=your_bcrypt_hashed_password
```

## Générer les clés secrètes

### JWT_SECRET

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### ADMIN_PASSWORD_HASH

```bash
cd backend
npm install
node generate-hash.js
```

## Récupérer les clés Supabase

1. Aller sur https://supabase.com
2. Sélectionner le projet
3. Aller dans Settings > API
4. Copier les clés nécessaires
