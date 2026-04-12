# Démarrage - Backend Supabase

## Avant de commencer

Assurez-vous d'avoir:
- Node.js 16+ installé
- Un compte Supabase (gratuit)
- npm ou yarn

## 1️⃣ Créer un projet Supabase (2 minutes)

1. Allez sur https://supabase.com
2. Cliquez "New Project"
3. Remplissez les informations:
   - Nom du projet: `bawi-studio`
   - Mot de passe: Générez un mot de passe fort
   - Région: Choisissez la plus proche
4. Cliquez "Create new project"
5. Attendez que le projet soit créé (2-3 minutes)

## 2️⃣ Récupérer les clés (1 minute)

1. Une fois le projet créé, allez dans **Settings** (en bas à gauche)
2. Cliquez sur **API**
3. Vous verrez:
   - **Project URL** → Copiez-la (c'est votre `SUPABASE_URL`)
   - **anon public** → Copiez-la (c'est votre `SUPABASE_KEY`)

Exemple:
```
SUPABASE_URL = https://abc123def456.supabase.co
SUPABASE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 3️⃣ Créer la table (1 minute)

1. Allez dans **SQL Editor** (à gauche)
2. Cliquez **New Query**
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

4. Cliquez **Run** (ou Ctrl+Enter)
5. Vous devriez voir "Success" en bas

## 4️⃣ Configurer le backend (2 minutes)

Ouvrez un terminal et allez dans le dossier `backend`:

```bash
cd backend
npm install
```

Attendez que les dépendances soient installées.

Générez le hash du mot de passe admin:

```bash
node setup-admin.js
```

Entrez votre mot de passe admin (ex: `MySecurePassword123!`).

Vous verrez quelque chose comme:
```
Ajoutez cette ligne à votre .env :
ADMIN_PASSWORD_HASH=$2a$10$abcdefghijklmnopqrstuvwxyz...
```

Copiez cette ligne.

## 5️⃣ Créer le fichier .env (1 minute)

1. Ouvrez le fichier `backend/.env.example`
2. Copiez-le et renommez-le en `backend/.env`
3. Remplissez-le avec vos valeurs:

```env
SUPABASE_URL=https://abc123def456.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
ADMIN_PASSWORD_HASH=$2a$10$abcdefghijklmnopqrstuvwxyz...
JWT_SECRET=my_super_secret_key_at_least_32_characters_long
PORT=5000
NODE_ENV=development
```

**Important:**
- `SUPABASE_URL` et `SUPABASE_KEY` viennent de Supabase
- `ADMIN_PASSWORD_HASH` vient de `setup-admin.js`
- `JWT_SECRET` doit être unique et long (min 32 caractères)

## 6️⃣ Démarrer le serveur (1 minute)

```bash
npm start
```

Vous devriez voir:
```
Backend running on port 5000
```

## 7️⃣ Tester (2 minutes)

Ouvrez un autre terminal et testez:

### Test 1: Health check
```bash
curl http://localhost:5000/api/health
```

Réponse attendue:
```json
{"status":"ok"}
```

### Test 2: Soumettre un contact
```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "contact": "+228 99 25 38 43",
    "domain": "company",
    "projectType": "web",
    "budget": "medium",
    "deadline": "normal",
    "message": "Test message"
  }'
```

Réponse attendue:
```json
{"success":true,"id":1}
```

### Test 3: Login admin
```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"password": "MySecurePassword123!"}'
```

Réponse attendue:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "admin": {
    "id": 1,
    "username": "admin",
    "email": "admin@bawi-studio.com"
  }
}
```

Copiez le token.

### Test 4: Récupérer les messages
```bash
curl -X GET http://localhost:5000/api/admin/client-messages \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Réponse attendue:
```json
[
  {
    "id": 1,
    "name": "Test User",
    "email": "test@example.com",
    ...
  }
]
```

## ✅ C'est tout!

Votre backend est maintenant prêt!

## 🎯 Prochaines étapes

1. **Tester le frontend:**
   - Assurez-vous que `VITE_API_URL=http://localhost:5000`
   - Testez le formulaire de contact
   - Testez le login admin

2. **Déployer en production:**
   - Voir `SUPABASE_SETUP.md` pour les instructions de déploiement

3. **Lire la documentation:**
   - `README_BACKEND.md` - Documentation complète
   - `SUPABASE_SETUP.md` - Configuration avancée

## 🆘 Problèmes courants

### "SUPABASE_URL not found"
- Vérifiez que le fichier `.env` existe
- Vérifiez que les variables sont correctement définies

### "Identifiants invalides"
- Vérifiez que le mot de passe est correct
- Vérifiez que `ADMIN_PASSWORD_HASH` est correct

### "Cannot POST /api/contact"
- Vérifiez que le serveur est en cours d'exécution
- Vérifiez que le port 5000 est disponible

### Les messages ne s'enregistrent pas
- Vérifiez que la table existe dans Supabase
- Vérifiez les logs du serveur pour les erreurs

## 📞 Besoin d'aide?

1. Consultez `README_BACKEND.md` pour la documentation complète
2. Consultez `SUPABASE_SETUP.md` pour la configuration avancée
3. Consultez la [documentation Supabase](https://supabase.com/docs)
4. Consultez la [documentation Express](https://expressjs.com)

---

**Temps total:** ~10 minutes ⏱️
