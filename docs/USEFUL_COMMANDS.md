# Commandes Utiles - Bawi Studio

## 🚀 Développement local

### Démarrer les serveurs

```bash
# Terminal 1 - Frontend
npm install
npm run dev

# Terminal 2 - Backend
cd backend
npm install
npm run dev
```

### Accéder à l'application

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Health check: http://localhost:5000/api/health

## 🔧 Configuration

### Générer le hash du mot de passe admin

```bash
cd backend
npm install
node generate-hash.js
```

### Générer une clé JWT secrète

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 📦 Build et déploiement

### Build pour la production

```bash
# Frontend
npm run build

# Backend (pas de build nécessaire)
cd backend
npm install
```

### Vérifier le build

```bash
# Frontend
npm run preview
```

## 🗄️ Base de données

### Exécuter le script SQL Supabase

1. Aller sur https://supabase.com
2. Sélectionner le projet
3. Aller dans SQL Editor
4. Copier-coller le contenu de backend/supabase-setup.sql
5. Exécuter

## 🔐 Authentification

### Tester le login admin

```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"votre_mot_de_passe"}'
```

## 📝 Gestion des fichiers

### Supprimer les fichiers inutiles

```bash
rm -rf docs
rm PROBLEMES_ET_SOLUTIONS.md
```

## 🧪 Tests

### Tester le formulaire de contact

```bash
curl -X POST http://localhost:5000/api/contact \
  -F "name=Jean Dupont" \
  -F "email=jean@example.com" \
  -F "message=Bonjour, j'aimerais créer un site..."
```

### Tester les portfolios

```bash
curl -X GET http://localhost:5000/api/portfolios
```

## 🔄 Git

### Commiter les changements

```bash
git add .
git commit -m "Description du changement"
git push origin main
```

### Voir l'historique

```bash
git log --oneline
```
