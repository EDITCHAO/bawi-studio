# 🔧 Commandes Utiles pour le Déploiement

## 🔐 Générer les Secrets

### Générer JWT_SECRET
```bash
# Générez une chaîne aléatoire sécurisée (32 bytes en hex)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Exemple de résultat:
# a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

### Générer ADMIN_PASSWORD_HASH
```bash
# Installez bcryptjs si ce n'est pas fait
npm install bcryptjs

# Générez le hash du mot de passe
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('votre_mot_de_passe_admin', 10, (err, hash) => { if (err) console.error(err); else console.log(hash); });"

# Exemple de résultat:
# $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/KFm
```

## 🧪 Tester Localement

### Démarrer le backend
```bash
cd backend
npm install
npm run dev
```

### Démarrer le frontend
```bash
cd frontend
npm install
npm run dev
```

### Vérifier les variables d'environnement (backend)
```bash
cd backend
npm run verify
```

## 🚀 Déployer sur Render

### Vérifier que le code est prêt
```bash
# Vérifiez que tout est commité
git status

# Poussez vers GitHub
git push origin main
```

### Créer le service sur Render
1. Allez sur https://render.com
2. Cliquez sur "New +" → "Web Service"
3. Connectez votre repository GitHub
4. Configurez:
   - Name: `bawi-studio-backend`
   - Root Directory: `backend`
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `npm start`

### Ajouter les variables d'environnement sur Render
```bash
# Dans le dashboard Render, allez à "Environment" et ajoutez:
NODE_ENV=production
PORT=10000
SUPABASE_URL=<votre_url>
SUPABASE_KEY=<votre_clé>
SUPABASE_SERVICE_KEY=<votre_clé_service>
JWT_SECRET=<votre_secret_jwt>
ADMIN_PASSWORD_HASH=<votre_hash_bcrypt>
```

### Tester le backend après déploiement
```bash
# Health check
curl https://bawi-studio-backend.onrender.com/api/health

# Récupérer les portfolios
curl https://bawi-studio-backend.onrender.com/api/portfolios

# Tester le login admin
curl -X POST https://bawi-studio-backend.onrender.com/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"password":"votre_mot_de_passe_admin"}'
```

## 🌐 Déployer sur Vercel

### Vérifier que le code est prêt
```bash
# Vérifiez que tout est commité
git status

# Poussez vers GitHub
git push origin main
```

### Créer le projet sur Vercel
1. Allez sur https://vercel.com
2. Cliquez sur "Add New..." → "Project"
3. Importez votre repository GitHub
4. Configurez:
   - Framework Preset: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

### Ajouter les variables d'environnement sur Vercel
```bash
# Dans le dashboard Vercel, allez à "Settings" → "Environment Variables" et ajoutez:
VITE_API_URL=https://bawi-studio-backend.onrender.com
```

### Tester le frontend après déploiement
```bash
# Ouvrez dans le navigateur
https://bawi-studio.vercel.app

# Vérifiez la console du navigateur (F12) pour les erreurs
```

## 📊 Monitoring et Logs

### Logs Render
```bash
# Consultez les logs dans le dashboard Render
# Settings → Logs
```

### Logs Vercel
```bash
# Consultez les logs dans le dashboard Vercel
# Deployments → Logs
```

### Logs Supabase
```bash
# Consultez les logs dans le dashboard Supabase
# Logs → Database
```

## 🔄 Mise à Jour du Code

### Mettre à jour le backend
```bash
# Faites vos changements
# Testez localement
npm run dev

# Commitez et poussez
git add .
git commit -m "Description des changements"
git push origin main

# Render redéploiera automatiquement
```

### Mettre à jour le frontend
```bash
# Faites vos changements
# Testez localement
npm run dev

# Commitez et poussez
git add .
git commit -m "Description des changements"
git push origin main

# Vercel redéploiera automatiquement
```

## 🆘 Dépannage

### Le backend ne démarre pas
```bash
# Vérifiez les logs Render
# Vérifiez que les variables d'environnement sont correctes
# Vérifiez que le PORT est 10000

# Testez localement
cd backend
npm run verify
npm run dev
```

### Le frontend ne se charge pas
```bash
# Vérifiez les logs Vercel
# Vérifiez que VITE_API_URL est défini
# Vérifiez la console du navigateur (F12)

# Testez localement
cd frontend
npm run build
npm run preview
```

### Erreur CORS
```bash
# Vérifiez que l'URL Vercel est dans corsOrigins du backend
# Vérifiez que le backend est accessible
# Vérifiez la console du navigateur pour le message d'erreur exact

# Testez localement
curl -H "Origin: https://bawi-studio.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -X OPTIONS https://bawi-studio-backend.onrender.com/api/contact
```

### Erreur Supabase
```bash
# Vérifiez les clés Supabase
# Vérifiez que le projet Supabase est actif
# Vérifiez les logs Supabase

# Testez localement
cd backend
npm run verify
```

## 📝 Checklist Rapide

- [ ] JWT_SECRET généré
- [ ] ADMIN_PASSWORD_HASH généré
- [ ] Code poussé vers GitHub
- [ ] Service Render créé
- [ ] Variables d'environnement Render ajoutées
- [ ] Backend déployé et testé
- [ ] Projet Vercel créé
- [ ] Variable VITE_API_URL ajoutée
- [ ] Frontend déployé et testé
- [ ] Formulaire de contact testé
- [ ] Admin dashboard testé
- [ ] Logs vérifiés

## 🎯 Résumé

Vous êtes maintenant prêt à déployer! Suivez les étapes ci-dessus et consultez le **DEPLOYMENT_GUIDE_FINAL.md** pour plus de détails.

