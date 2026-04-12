# Backend Bawi Studio - Node.js/Express + Supabase

## Structure du projet

```
backend/
├── server.js                 # Serveur Express principal
├── setup-admin.js           # Script pour générer le hash du mot de passe
├── package.json             # Dépendances Node.js
├── .env.example             # Exemple de configuration
├── supabase-setup.sql       # Script SQL pour créer la table
├── QUICK_START.md           # Guide de démarrage rapide
├── SUPABASE_SETUP.md        # Guide de configuration détaillé
├── test-api.sh              # Script de test (Linux/Mac)
└── test-api.ps1             # Script de test (Windows)
```

## Dépendances

- **express**: Framework web
- **cors**: Gestion des CORS
- **dotenv**: Gestion des variables d'environnement
- **@supabase/supabase-js**: Client Supabase
- **bcryptjs**: Hachage des mots de passe
- **jsonwebtoken**: Gestion des JWT

## Architecture

### Flux de requête

```
Client (Frontend)
    ↓
Express Server
    ↓
Middleware (CORS, JSON)
    ↓
Routes
    ├── Public: /api/contact, /api/health
    └── Admin: /api/admin/* (avec authentification JWT)
    ↓
Supabase Client
    ↓
PostgreSQL (Supabase)
```

### Authentification

1. L'utilisateur envoie son mot de passe à `/api/admin/login`
2. Le serveur compare avec le hash stocké dans `.env`
3. Si correct, génère un JWT token (24h d'expiration)
4. Le client stocke le token et l'envoie dans les headers
5. Le middleware `authenticateToken` vérifie le token

### Base de données

La table `contact_messages` stocke:
- Informations du contact (name, email, phone)
- Détails du projet (domain, project_type, budget, deadline)
- Message et sujet
- Métadonnées (read, status, priority, notes)
- Timestamps (created_at, updated_at)

## Routes API

### Public

#### POST /api/contact
Soumettre un message de contact

**Requête:**
```json
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

**Réponse (201):**
```json
{
  "success": true,
  "id": 1
}
```

#### GET /api/health
Vérifier l'état du serveur

**Réponse (200):**
```json
{
  "status": "ok"
}
```

### Admin (authentification requise)

#### POST /api/admin/login
Se connecter

**Requête:**
```json
{
  "password": "your_admin_password"
}
```

**Réponse (200):**
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

#### GET /api/admin/client-messages
Récupérer tous les messages

**Headers:**
```
Authorization: Bearer <token>
```

**Réponse (200):**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+228 99 25 38 43",
    "domain": "company",
    "project_type": "web",
    "budget": "medium",
    "deadline": "normal",
    "subject": null,
    "message": "Je souhaite créer un site web...",
    "read": false,
    "status": "new",
    "priority": null,
    "notes": null,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
]
```

#### GET /api/admin/client-messages/:id
Récupérer un message spécifique (marque comme lu)

**Headers:**
```
Authorization: Bearer <token>
```

**Réponse (200):**
```json
{
  "id": 1,
  "name": "John Doe",
  ...
}
```

#### PUT /api/admin/client-messages/:id
Mettre à jour un message

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Requête:**
```json
{
  "status": "in_progress",
  "priority": "high",
  "notes": "Appel prévu demain"
}
```

**Réponse (200):**
```json
{
  "message": "Message mis à jour"
}
```

#### DELETE /api/admin/client-messages/:id
Supprimer un message

**Headers:**
```
Authorization: Bearer <token>
```

**Réponse (200):**
```json
{
  "message": "Message déplacé vers la corbeille"
}
```

#### GET /api/admin/stats
Récupérer les statistiques

**Headers:**
```
Authorization: Bearer <token>
```

**Réponse (200):**
```json
{
  "client_messages": {
    "total": 42,
    "new": 5,
    "in_progress": 3
  },
  "general_messages": {
    "total": 0,
    "new": 0
  },
  "by_domain": [
    {"domain": "company", "count": 30},
    {"domain": "student", "count": 12}
  ],
  "recent_messages": [...]
}
```

## Codes d'erreur

| Code | Signification |
|------|---------------|
| 200 | OK |
| 201 | Créé |
| 400 | Requête invalide |
| 401 | Non authentifié |
| 403 | Accès refusé |
| 404 | Non trouvé |
| 500 | Erreur serveur |

## Variables d'environnement

| Variable | Description | Exemple |
|----------|-------------|---------|
| SUPABASE_URL | URL du projet Supabase | https://abc.supabase.co |
| SUPABASE_KEY | Clé anon Supabase | eyJhbGc... |
| ADMIN_PASSWORD_HASH | Hash bcrypt du mot de passe | $2a$10$... |
| JWT_SECRET | Secret pour signer les JWT | my_secret_key_123 |
| PORT | Port du serveur | 5000 |
| NODE_ENV | Environnement | development/production |

## Développement

### Démarrer en mode développement

```bash
npm run dev
```

Le serveur redémarrera automatiquement à chaque modification.

### Générer un nouveau hash de mot de passe

```bash
node setup-admin.js
```

### Tester l'API

**Linux/Mac:**
```bash
bash test-api.sh
```

**Windows:**
```powershell
.\test-api.ps1
```

## Déploiement

### Heroku

```bash
heroku create your-app-name
heroku config:set SUPABASE_URL=...
heroku config:set SUPABASE_KEY=...
heroku config:set ADMIN_PASSWORD_HASH=...
heroku config:set JWT_SECRET=...
git push heroku main
```

### Railway

1. Connectez votre repo GitHub
2. Créez un nouveau projet
3. Ajoutez les variables d'environnement
4. Déployez

### Render

1. Connectez votre repo GitHub
2. Créez un Web Service
3. Configurez les variables d'environnement
4. Déployez

## Sécurité

✅ Mots de passe hashés avec bcryptjs
✅ JWT tokens avec expiration 24h
✅ CORS configuré
✅ Validation des entrées
✅ RLS policies sur Supabase
✅ Variables sensibles dans .env

## Performance

- Indexes sur email et created_at
- Requêtes optimisées
- Compression GZIP (via Express)
- Caching possible avec Redis (optionnel)

## Logs

Les logs sont affichés dans la console:
- Démarrage du serveur
- Erreurs Supabase
- Erreurs d'authentification

Pour la production, utilisez un service comme:
- Sentry
- LogRocket
- Datadog

## Support

Pour plus d'aide:
- Voir `QUICK_START.md` pour démarrer rapidement
- Voir `SUPABASE_SETUP.md` pour la configuration détaillée
- Consulter la [documentation Supabase](https://supabase.com/docs)
- Consulter la [documentation Express](https://expressjs.com)
