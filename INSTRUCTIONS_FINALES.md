# 📋 Instructions Finales - Bawi Studio

## 🎯 Objectif

Pousser le code vers GitHub et déployer sur Vercel (frontend) et Render (backend).

## ✅ Checklist avant de pousser

- [x] Nettoyage du projet complété
- [x] Documentation organisée dans `docs/`
- [x] Configuration Vercel prête (`vercel.json`)
- [x] Configuration Render prête (`backend/render.yaml`)
- [x] Supabase SQL prêt (`backend/supabase-setup.sql`)
- [x] Variables d'environnement templates créés
- [x] README.md pointe vers `docs/`
- [x] Tous les fichiers inutiles supprimés

## 🚀 Étape 1: Pousser vers GitHub

### Méthode 1: Script Windows (Recommandé)

```bash
push.bat
```

### Méthode 2: Commandes manuelles

```bash
git add -A
git commit -m "Nettoyage et organisation du projet - Documentation dans docs/"
git push origin main
```

### Méthode 3: VS Code

1. Ctrl+Shift+G (Source Control)
2. Cliquer sur "+" pour ajouter tous les fichiers
3. Écrire le message de commit
4. Cliquer sur "Commit"
5. Cliquer sur "Push"

### Méthode 4: GitHub Desktop

1. Ouvrir GitHub Desktop
2. Voir les changements
3. Écrire le message de commit
4. Cliquer sur "Commit to main"
5. Cliquer sur "Push origin"

## 🔍 Vérification après le push

1. Aller sur https://github.com/EDITCHAO/bawi-studio
2. Vérifier que les fichiers sont à jour
3. Vérifier que `docs/` contient tous les fichiers `.md`
4. Vérifier que le README.md pointe vers `docs/`

## 📊 Étape 2: Configurer Supabase (5 min)

1. Aller sur https://supabase.com
2. Créer un nouveau projet
3. Attendre que le projet soit prêt
4. Aller dans SQL Editor
5. Copier-coller le contenu de `backend/supabase-setup.sql`
6. Exécuter le script
7. Récupérer les clés:
   - Settings > API > Project URL → `SUPABASE_URL`
   - Settings > API > Project API keys > anon → `SUPABASE_KEY`
   - Settings > API > Project API keys > service_role → `SUPABASE_SERVICE_KEY`

## 🔐 Étape 3: Générer les clés (2 min)

### JWT_SECRET

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### ADMIN_PASSWORD_HASH

```bash
cd backend
npm install
node generate-hash.js
# Copier le hash généré
```

## 🚀 Étape 4: Déployer le Backend sur Render (10 min)

1. Aller sur https://render.com
2. Créer un compte / Se connecter
3. Cliquer sur "New +" → "Web Service"
4. Connecter le repo GitHub
5. Configurer:
   - **Name**: `bawi-studio-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
6. Ajouter les variables d'environnement:
   ```
   NODE_ENV=production
   SUPABASE_URL=<votre_url>
   SUPABASE_KEY=<votre_clé>
   SUPABASE_SERVICE_KEY=<votre_clé_service>
   JWT_SECRET=<clé_générée>
   ADMIN_PASSWORD_HASH=<hash_généré>
   ```
7. Cliquer sur "Create Web Service"
8. Attendre le déploiement (2-3 min)
9. Copier l'URL du service (ex: `https://bawi-studio-backend.onrender.com`)

## 🎨 Étape 5: Déployer le Frontend sur Vercel (10 min)

1. Aller sur https://vercel.com
2. Créer un compte / Se connecter
3. Cliquer sur "Add New..." → "Project"
4. Importer le repo GitHub
5. Configurer:
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Ajouter les variables d'environnement:
   ```
   VITE_API_URL=<URL_RENDER_BACKEND>
   VITE_SUPABASE_URL=<votre_url>
   VITE_SUPABASE_KEY=<votre_clé>
   ```
7. Cliquer sur "Deploy"
8. Attendre le déploiement (2-3 min)
9. Copier l'URL du projet

## ✅ Étape 6: Tester (5 min)

### Backend
```bash
curl https://bawi-studio-backend.onrender.com/api/health
# Devrait retourner: {"status":"ok","message":"Backend is running"}
```

### Frontend
1. Ouvrir l'URL Vercel dans le navigateur
2. Vérifier que le site se charge
3. Tester le formulaire de contact
4. Vérifier que les messages arrivent dans Supabase
5. Tester l'admin login
6. Vérifier les logs Render et Vercel

## 📞 Support

Si vous avez des problèmes:

1. Consulter [docs/FAQ.md](docs/FAQ.md)
2. Consulter [docs/QUICK_DEPLOY.md](docs/QUICK_DEPLOY.md)
3. Consulter [docs/DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md)
4. Contacter le support: support@bawi-studio.com

## 🎉 Résultat final

```
Frontend: https://bawi-studio.vercel.app
Backend: https://bawi-studio-backend.onrender.com
Database: Supabase
```

## ⏱️ Temps total

- Pousser vers GitHub: 5 min
- Configurer Supabase: 5 min
- Générer les clés: 2 min
- Déployer le backend: 10 min
- Déployer le frontend: 10 min
- Tester: 5 min

**Total: 30-40 minutes**

## 🚀 Prochaines étapes

Après le déploiement:

1. Configurer les domaines personnalisés
2. Configurer les alertes
3. Monitorer les logs
4. Mettre à jour la documentation
5. Commencer à développer!

---

**Bonne chance! 🎉**

**Dernière mise à jour**: 2026-04-18
