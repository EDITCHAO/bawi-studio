# 📝 Commandes Utiles - Bawi Studio

## 🚀 Démarrage Local

### Démarrer le frontend
```bash
npm run dev
```
Accès: http://localhost:5173 ou http://localhost:5174

### Démarrer le backend
```bash
cd backend
npm run dev
```
Accès: http://localhost:5000

### Démarrer les deux en même temps (depuis la racine)
```bash
# Terminal 1
npm run dev

# Terminal 2
cd backend && npm run dev
```

## 🏗️ Build

### Build du frontend
```bash
npm run build
```
Génère le dossier `dist/`

### Build du backend
```bash
cd backend
npm run build
```

## 🧪 Tests

### Tester le backend
```bash
curl http://localhost:5000/api/health
```

### Tester le login admin
```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"password":"20-86"}'
```

### Tester la récupération des portfolios
```bash
curl http://localhost:5000/api/portfolios
```

## 📦 Installation des dépendances

### Frontend
```bash
npm install
```

### Backend
```bash
cd backend
npm install
```

### Les deux
```bash
npm install
cd backend && npm install && cd ..
```

## 🔄 Git

### Vérifier le statut
```bash
git status
```

### Ajouter les changements
```bash
git add .
```

### Commiter
```bash
git commit -m "Description des changements"
```

### Pousser vers GitHub
```bash
git push origin main
```

### Voir l'historique
```bash
git log --oneline
```

## 🚀 Déploiement

### Déployer avec le script (Windows)
```bash
deploy.bat "Message de commit"
```

### Déployer avec le script (Linux/Mac)
```bash
./deploy.sh "Message de commit"
```

### Déployer manuellement
```bash
git add .
git commit -m "Message de commit"
git push origin main
```

## 🔐 Gestion des secrets

### Créer un hash de mot de passe
```bash
cd backend
node generate-hash.js
```

### Vérifier les variables d'environnement
```bash
# Frontend
cat .env

# Backend
cat backend/.env
```

## 📊 Logs

### Logs du frontend (Vercel)
1. Va sur https://vercel.com
2. Sélectionne le projet `bawi-studio`
3. Clique sur "Deployments"
4. Clique sur le déploiement
5. Clique sur "Logs"

### Logs du backend (Render)
1. Va sur https://render.com
2. Sélectionne le service `bawi-studio-backend`
3. Clique sur "Logs"

## 🗄️ Supabase

### Accéder à Supabase
https://app.supabase.com

### Voir les données
1. Va dans "SQL Editor"
2. Exécute: `SELECT * FROM portfolios;`

### Voir les images uploadées
1. Va dans "Storage"
2. Sélectionne le bucket `portfolios`

## 🧹 Nettoyage

### Supprimer les dépendances locales
```bash
rm -rf node_modules
rm -rf backend/node_modules
```

### Supprimer le build
```bash
rm -rf dist
```

### Réinstaller tout
```bash
npm install
cd backend && npm install && cd ..
```

## 🐛 Dépannage

### Le frontend ne se connecte pas au backend
```bash
# Vérifier que le backend tourne
curl http://localhost:5000/api/health

# Vérifier la configuration
cat src/config.js
```

### Le backend ne démarre pas
```bash
# Vérifier les dépendances
cd backend
npm install

# Vérifier les variables d'environnement
cat .env

# Vérifier les erreurs
npm run dev
```

### Les images ne s'affichent pas
```bash
# Vérifier que Supabase Storage est configuré
# Va dans Supabase → Storage → portfolios

# Vérifier les URLs des images
# Va dans Supabase → SQL Editor
# SELECT image_url FROM portfolios;
```

## 📞 Ressources

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Node.js Docs**: https://nodejs.org/docs
- **React Docs**: https://react.dev

## 💡 Tips

- Utilise `npm run dev` pour développer localement
- Utilise `npm run build` avant de pousser vers GitHub
- Utilise `git status` pour vérifier les changements
- Utilise `git log` pour voir l'historique
- Utilise les logs Vercel/Render pour déboguer les erreurs de production
