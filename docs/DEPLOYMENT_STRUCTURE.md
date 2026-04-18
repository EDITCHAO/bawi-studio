# Structure de Déploiement - Bawi Studio

## 🎯 Architecture recommandée

Pour un déploiement optimal sur Vercel et Render, voici la structure recommandée :

### Option 1: Monorepo (Actuel)

```
bawi-studio/
├── src/                    # Frontend React
├── backend/                # Backend Node.js
├── docs/                   # Documentation
├── package.json            # Frontend
├── vercel.json             # Config Vercel
└── backend/
    ├── package.json        # Backend
    ├── render.yaml         # Config Render
    └── Procfile
```

**Avantages:**
- Un seul repo à gérer
- Facile à synchroniser
- Déploiements coordonnés

**Déploiement:**
- Frontend: Vercel (root directory: `.`)
- Backend: Render (root directory: `backend`)

### Option 2: Repos séparés (Recommandé)

```
bawi-studio-frontend/
├── src/
├── public/
├── package.json
├── vercel.json
└── docs/

bawi-studio-backend/
├── server.js
├── package.json
├── render.yaml
├── Procfile
└── supabase-setup.sql
```

**Avantages:**
- Déploiements indépendants
- Meilleure scalabilité
- Repos plus légers
- Déploiements plus rapides

**Déploiement:**
- Frontend: Vercel (root directory: `.`)
- Backend: Render (root directory: `.`)

## 📋 Étapes pour passer au monorepo

### 1. Préparer le repo principal

```bash
# Ajouter tous les changements
git add -A

# Commiter
git commit -m "Nettoyage et organisation du projet"

# Pousser
git push origin main
```

### 2. Configurer Vercel

1. Aller sur https://vercel.com
2. Importer le repo GitHub
3. Configurer:
   - **Framework**: Vite
   - **Root Directory**: `.` (racine)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Ajouter les variables d'environnement:
   - `VITE_API_URL`
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_KEY`

### 3. Configurer Render

1. Aller sur https://render.com
2. Créer un Web Service
3. Connecter le repo GitHub
4. Configurer:
   - **Name**: `bawi-studio-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Ajouter les variables d'environnement:
   - `NODE_ENV=production`
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `SUPABASE_SERVICE_KEY`
   - `JWT_SECRET`
   - `ADMIN_PASSWORD_HASH`

## 🚀 Déploiement avec le monorepo

### Frontend (Vercel)

```bash
# Chaque push sur main déclenche:
1. Build: npm run build
2. Output: dist/
3. Deploy: Vercel
```

### Backend (Render)

```bash
# Chaque push sur main déclenche:
1. Build: npm install (dans backend/)
2. Start: npm start (dans backend/)
3. Deploy: Render
```

## ✅ Checklist de déploiement

### Avant le déploiement

- [ ] Tous les fichiers sont dans le repo
- [ ] `.env` n'est pas commité
- [ ] `vercel.json` est configuré
- [ ] `backend/render.yaml` est configuré
- [ ] `backend/Procfile` existe
- [ ] Variables d'environnement prêtes

### Après le déploiement

- [ ] Frontend accessible sur Vercel
- [ ] Backend accessible sur Render
- [ ] API répond correctement
- [ ] Base de données connectée
- [ ] Logs vérifiés

## 📞 Support

Pour toute question, consulter:
- [docs/QUICK_DEPLOY.md](QUICK_DEPLOY.md)
- [docs/DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

---

**Dernière mise à jour**: 2026-04-18
