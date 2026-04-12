# Configuration du Backend avec Supabase

## 1. Créer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Notez votre `SUPABASE_URL` et `SUPABASE_KEY` (clé anon)

## 2. Créer la table dans Supabase

Allez dans l'éditeur SQL de Supabase et exécutez le script `supabase-setup.sql` :

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
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public read" ON contact_messages
  FOR SELECT
  USING (true);
```

## 3. Configuration du Backend

### Installer les dépendances

```bash
cd backend
npm install
```

### Créer le fichier .env

```bash
cp .env.example .env
```

### Générer le hash du mot de passe admin

```bash
node setup-admin.js
```

Entrez votre mot de passe admin et copiez le hash généré.

### Remplir le .env

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_anon_key
ADMIN_PASSWORD_HASH=bcrypt_hash_from_setup_admin
JWT_SECRET=your_secret_key_here
PORT=5000
```

## 4. Démarrer le backend

```bash
npm start
```

Ou en mode développement avec rechargement automatique :

```bash
npm run dev
```

## 5. Endpoints disponibles

### Public
- `POST /api/contact` - Soumettre un message de contact
- `GET /api/health` - Vérifier l'état du serveur

### Admin (authentification requise)
- `POST /api/admin/login` - Se connecter
- `GET /api/admin/client-messages` - Récupérer tous les messages
- `GET /api/admin/client-messages/:id` - Récupérer un message spécifique
- `PUT /api/admin/client-messages/:id` - Mettre à jour un message
- `DELETE /api/admin/client-messages/:id` - Supprimer un message
- `GET /api/admin/stats` - Récupérer les statistiques

## 6. Format des requêtes

### Soumettre un contact

```bash
POST /api/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "contact": "+228 99 25 38 43",
  "domain": "company",
  "projectType": "web",
  "budget": "medium",
  "deadline": "normal",
  "message": "Je souhaite créer un site web..."
}
```

### Login admin

```bash
POST /api/admin/login
Content-Type: application/json

{
  "password": "your_admin_password"
}
```

Réponse :
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

### Récupérer les messages

```bash
GET /api/admin/client-messages
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

## 7. Déploiement

### Sur Heroku

```bash
heroku create your-app-name
heroku config:set SUPABASE_URL=your_url
heroku config:set SUPABASE_KEY=your_key
heroku config:set ADMIN_PASSWORD_HASH=your_hash
heroku config:set JWT_SECRET=your_secret
git push heroku main
```

### Sur Vercel (avec serverless)

Créez un fichier `vercel.json` :

```json
{
  "buildCommand": "npm install",
  "outputDirectory": ".",
  "env": {
    "SUPABASE_URL": "@supabase_url",
    "SUPABASE_KEY": "@supabase_key",
    "ADMIN_PASSWORD_HASH": "@admin_password_hash",
    "JWT_SECRET": "@jwt_secret"
  }
}
```

## Notes

- Le frontend reste inchangé et utilise les mêmes endpoints
- La base de données Supabase remplace SQLite/MySQL
- L'authentification utilise JWT
- Les mots de passe sont hashés avec bcryptjs
