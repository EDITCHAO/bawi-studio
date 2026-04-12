# Démarrage Rapide - Backend Supabase

## 5 minutes pour démarrer

### 1. Créer un projet Supabase (2 min)

1. Allez sur https://supabase.com
2. Cliquez "New Project"
3. Remplissez les informations
4. Attendez que le projet soit créé

### 2. Récupérer les clés (1 min)

1. Allez dans **Settings > API**
2. Copiez:
   - `Project URL` → `SUPABASE_URL`
   - `anon public` → `SUPABASE_KEY`

### 3. Créer la table (1 min)

1. Allez dans **SQL Editor**
2. Cliquez "New Query"
3. Collez ce code:

```sql
CREATE TABLE contact_messages (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  domain VARCHAR(50),
  project_type VARCHAR(50),
  budget VARCHAR(50),
  deadline VARCHAR(50),
  subject VARCHAR(255),
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  status VARCHAR(50) DEFAULT 'new',
  priority VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_contact_messages_email ON contact_messages(email);
CREATE INDEX idx_contact_messages_created_at ON contact_messages(created_at DESC);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert" ON contact_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read" ON contact_messages
  FOR SELECT USING (true);
```

4. Cliquez "Run"

### 4. Configurer le backend (1 min)

```bash
cd backend
npm install
node setup-admin.js
```

Entrez votre mot de passe admin et copiez le hash.

Créez `.env`:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_anon_key
ADMIN_PASSWORD_HASH=bcrypt_hash_from_setup_admin
JWT_SECRET=my_secret_key_12345
PORT=5000
```

### 5. Démarrer (1 min)

```bash
npm start
```

Visitez http://localhost:5000/api/health

## C'est tout! 🎉

Votre backend est prêt. Le frontend continuera à fonctionner sans modifications.

## Tester

### Soumettre un contact

```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "test@example.com",
    "contact": "+228 99 25 38 43",
    "domain": "company",
    "projectType": "web",
    "budget": "medium",
    "deadline": "normal",
    "message": "Test message"
  }'
```

### Se connecter

```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"password": "your_admin_password"}'
```

### Récupérer les messages

```bash
curl -X GET http://localhost:5000/api/admin/client-messages \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Besoin d'aide?

Voir `SUPABASE_SETUP.md` pour plus de détails.
