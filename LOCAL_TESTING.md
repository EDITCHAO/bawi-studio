# 🧪 Guide de Test Local

## 🚀 Démarrer les Serveurs Localement

### Terminal 1: Backend
```bash
cd backend
npm install
npm run dev
```

**Résultat attendu:**
```
✅ Backend running on port 5000
📍 Environment: development
📍 Health check: http://localhost:5000/api/health
```

### Terminal 2: Frontend
```bash
cd frontend
npm install
npm run dev
```

**Résultat attendu:**
```
  VITE v5.0.0  ready in 123 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

---

## ✅ Tests Fonctionnels

### 1. Health Check Backend
```bash
curl http://localhost:5000/api/health
```

**Résultat attendu:**
```json
{"status":"ok","message":"Backend is running"}
```

### 2. Récupérer les Portfolios
```bash
curl http://localhost:5000/api/portfolios
```

**Résultat attendu:**
```json
[
  {
    "id": 1,
    "title": "Portfolio 1",
    "description": "Description",
    ...
  }
]
```

### 3. Soumettre un Message de Contact
```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "contact": "+228123456789",
    "domain": "web",
    "projectType": "website",
    "budget": "5000-10000",
    "deadline": "2024-06-01",
    "message": "Test message"
  }'
```

**Résultat attendu:**
```json
{"success":true,"id":1}
```

### 4. Login Admin
```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"password":"votre_mot_de_passe_admin"}'
```

**Résultat attendu:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": 1,
    "username": "admin",
    "email": "admin@bawi-studio.com"
  }
}
```

### 5. Récupérer les Statistiques (Admin)
```bash
# Remplacez <token> par le token reçu du login
curl -H "Authorization: Bearer <token>" \
  http://localhost:5000/api/admin/stats
```

**Résultat attendu:**
```json
{
  "success": true,
  "client_messages": {
    "total": 1,
    "new": 1,
    "in_progress": 0
  },
  "general_messages": {
    "total": 0,
    "new": 0
  },
  "by_domain": [
    {"domain": "web", "count": 1}
  ],
  "recent_messages": [...]
}
```

---

## 🌐 Tests Frontend

### 1. Ouvrir l'Application
```
http://localhost:5173
```

**Vérifications:**
- [ ] La page se charge sans erreurs
- [ ] Les images se chargent
- [ ] Le menu de navigation fonctionne
- [ ] Les sections se chargent correctement

### 2. Tester le Formulaire de Contact
1. Allez à la section "Contact"
2. Remplissez le formulaire:
   - Nom: "Test User"
   - Email: "test@example.com"
   - Téléphone: "+228123456789"
   - Domaine: "Web"
   - Type de projet: "Site Vitrine"
   - Budget: "5000-10000"
   - Délai: "2024-06-01"
   - Message: "Test message"
3. Cliquez sur "Envoyer"

**Vérifications:**
- [ ] Le formulaire se soumet sans erreurs
- [ ] Un message de succès s'affiche
- [ ] Le message est enregistré dans Supabase

### 3. Tester le Dashboard Admin
1. Allez à `http://localhost:5173/admin`
2. Connectez-vous avec le mot de passe admin
3. Vérifiez que vous pouvez voir:
   - [ ] Les statistiques
   - [ ] Les messages de contact
   - [ ] Les portfolios
   - [ ] Les options de gestion

### 4. Vérifier la Console du Navigateur
1. Ouvrez la console (F12)
2. Vérifiez qu'il n'y a pas d'erreurs:
   - [ ] Pas d'erreurs CORS
   - [ ] Pas d'erreurs 404
   - [ ] Pas d'erreurs de connexion API

---

## 🔍 Tests de Vérification

### Vérifier les Variables d'Environnement
```bash
cd backend
npm run verify
```

**Résultat attendu:**
```
🔍 Vérification des variables d'environnement...

📋 Variables REQUISES:
  ✅ SUPABASE_URL: https://...
  ✅ SUPABASE_KEY: eyJ...
  ✅ SUPABASE_SERVICE_KEY: eyJ...
  ✅ JWT_SECRET: a1b2c3d4...
  ✅ ADMIN_PASSWORD_HASH: $2a$10$...

✅ Toutes les variables d'environnement requises sont présentes!
```

### Vérifier la Connexion Supabase
```bash
# Testez localement que Supabase fonctionne
curl http://localhost:5000/api/portfolios
```

### Vérifier le Build Frontend
```bash
cd frontend
npm run build
```

**Résultat attendu:**
```
✓ 1234 modules transformed.
dist/index.html                   0.50 kB │ gzip:  0.30 kB
dist/assets/index-abc123.js     123.45 kB │ gzip: 45.67 kB
✓ built in 12.34s
```

---

## 🐛 Débogage

### Activer les Logs Détaillés

**Backend:**
```bash
# Ajouter des logs dans server.js
console.log('🔍 Debug:', variable);
```

**Frontend:**
```bash
# Ouvrir la console du navigateur (F12)
# Vérifier les logs et erreurs
```

### Vérifier les Requêtes API

**Avec curl:**
```bash
curl -v http://localhost:5000/api/health
```

**Avec le navigateur:**
1. Ouvrez F12
2. Allez à l'onglet "Network"
3. Effectuez une action
4. Vérifiez les requêtes et réponses

### Vérifier la Base de Données

1. Allez au dashboard Supabase
2. Vérifiez que les données sont enregistrées
3. Vérifiez les logs Supabase pour les erreurs

---

## 📊 Checklist de Test Local

### Backend
- [ ] Le serveur démarre sans erreurs
- [ ] Health check fonctionne
- [ ] Les portfolios se chargent
- [ ] Le formulaire de contact fonctionne
- [ ] Le login admin fonctionne
- [ ] Les statistiques se chargent
- [ ] Les variables d'environnement sont vérifiées

### Frontend
- [ ] La page se charge sans erreurs
- [ ] Les images se chargent
- [ ] Le formulaire de contact fonctionne
- [ ] Le dashboard admin fonctionne
- [ ] Pas d'erreurs CORS
- [ ] Pas d'erreurs dans la console

### Intégration
- [ ] Le frontend communique avec le backend
- [ ] Les données sont enregistrées dans Supabase
- [ ] L'authentification fonctionne
- [ ] Les permissions fonctionnent

---

## 🚀 Préparer pour le Déploiement

### Avant de Déployer

1. **Testez localement:**
   ```bash
   npm run dev
   ```

2. **Vérifiez les variables d'environnement:**
   ```bash
   cd backend
   npm run verify
   ```

3. **Testez le build:**
   ```bash
   cd frontend
   npm run build
   ```

4. **Vérifiez qu'il n'y a pas d'erreurs:**
   - [ ] Pas d'erreurs de compilation
   - [ ] Pas d'erreurs de linting
   - [ ] Pas d'erreurs dans la console

5. **Commitez et poussez:**
   ```bash
   git add .
   git commit -m "Prêt pour le déploiement"
   git push origin main
   ```

---

## 📝 Notes Importantes

- Les variables d'environnement locales sont dans `.env`
- Les variables de production sont sur Render et Vercel
- Testez toujours localement avant de déployer
- Vérifiez les logs en cas de problème
- Utilisez la console du navigateur pour déboguer le frontend

---

## 🆘 Problèmes Courants

### Le backend ne démarre pas
```bash
# Vérifiez les variables d'environnement
cd backend
npm run verify

# Vérifiez les dépendances
npm install

# Vérifiez les erreurs
npm run dev
```

### Le frontend ne se charge pas
```bash
# Vérifiez les dépendances
cd frontend
npm install

# Vérifiez le build
npm run build

# Vérifiez les erreurs
npm run dev
```

### Erreur CORS
```bash
# Vérifiez que le backend est accessible
curl http://localhost:5000/api/health

# Vérifiez la console du navigateur pour le message d'erreur exact
```

### Erreur Supabase
```bash
# Vérifiez les variables d'environnement
cd backend
npm run verify

# Vérifiez les clés Supabase
# Vérifiez que le projet Supabase est actif
```

---

## ✨ Conseils Utiles

- Gardez les logs ouverts pendant le test
- Testez les cas d'erreur (données invalides, etc.)
- Testez les performances (temps de réponse, etc.)
- Testez sur différents navigateurs
- Testez sur mobile (responsive design)
- Testez les permissions (admin vs public)

