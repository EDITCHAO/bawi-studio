# ⚡ Démarrage Rapide - 30 Minutes

## 🎯 Objectif
Déployer votre application sur Render (backend) et Vercel (frontend) en 30 minutes.

---

## ⏱️ Timeline

| Étape | Durée | Action |
|-------|-------|--------|
| 1. Générer les secrets | 2 min | Exécuter les commandes |
| 2. Créer Render | 5 min | Créer le service |
| 3. Créer Vercel | 5 min | Créer le projet |
| 4. Ajouter variables | 5 min | Configurer les env vars |
| 5. Déployer | 5 min | Cliquer sur Deploy |
| 6. Tester | 3 min | Vérifier les URLs |
| **Total** | **~30 min** | **Prêt!** |

---

## 1️⃣ Générer les Secrets (2 minutes)

### JWT_SECRET
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
**Copier le résultat** → Vous en aurez besoin pour Render

### ADMIN_PASSWORD_HASH
```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('admin123', 10, (err, hash) => console.log(hash));"
```
**Copier le résultat** → Vous en aurez besoin pour Render

---

## 2️⃣ Créer le Service Render (5 minutes)

### Étapes:
1. Allez sur https://render.com
2. Cliquez sur "New +" → "Web Service"
3. Connectez votre repository GitHub
4. Configurez:
   - **Name:** `bawi-studio-backend`
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Cliquez sur "Create Web Service"

---

## 3️⃣ Créer le Projet Vercel (5 minutes)

### Étapes:
1. Allez sur https://vercel.com
2. Cliquez sur "Add New..." → "Project"
3. Importez votre repository GitHub
4. Configurez:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Cliquez sur "Deploy"

---

## 4️⃣ Ajouter les Variables d'Environnement (5 minutes)

### Sur Render:
1. Allez au dashboard Render
2. Sélectionnez `bawi-studio-backend`
3. Allez à "Environment"
4. Ajoutez:
   ```
   NODE_ENV=production
   PORT=10000
   SUPABASE_URL=<votre_url_supabase>
   SUPABASE_KEY=<votre_clé_supabase>
   SUPABASE_SERVICE_KEY=<votre_clé_service>
   JWT_SECRET=<le_secret_généré>
   ADMIN_PASSWORD_HASH=<le_hash_généré>
   ```

### Sur Vercel:
1. Allez au dashboard Vercel
2. Sélectionnez votre projet
3. Allez à "Settings" → "Environment Variables"
4. Ajoutez:
   ```
   VITE_API_URL=https://bawi-studio-backend.onrender.com
   ```

---

## 5️⃣ Déployer (5 minutes)

### Render:
1. Cliquez sur "Deploy" dans le dashboard
2. Attendez que le build se termine (~2-3 minutes)

### Vercel:
1. Cliquez sur "Deploy" dans le dashboard
2. Attendez que le build se termine (~2-3 minutes)

---

## 6️⃣ Tester (3 minutes)

### Backend:
```bash
curl https://bawi-studio-backend.onrender.com/api/health
```
**Résultat attendu:** `{"status":"ok","message":"Backend is running"}`

### Frontend:
Ouvrez: https://bawi-studio.vercel.app

**Vérifications:**
- [ ] La page se charge
- [ ] Les images s'affichent
- [ ] Pas d'erreurs dans la console (F12)

---

## ✅ Checklist Rapide

- [ ] Secrets générés
- [ ] Render créé
- [ ] Vercel créé
- [ ] Variables d'environnement ajoutées
- [ ] Déploiement terminé
- [ ] Backend accessible
- [ ] Frontend accessible
- [ ] Pas d'erreurs

---

## 🆘 Problèmes Courants

### Le backend ne démarre pas
→ Vérifiez les variables d'environnement sur Render

### Erreur CORS
→ Vérifiez que `https://bawi-studio.vercel.app` est dans corsOrigins

### Le frontend ne se charge pas
→ Vérifiez que `VITE_API_URL` est défini sur Vercel

### Erreur Supabase
→ Vérifiez les clés Supabase

---

## 📞 Besoin d'Aide?

1. Consultez **DEPLOYMENT_TROUBLESHOOTING.md**
2. Vérifiez les logs Render et Vercel
3. Testez localement avec `npm run dev`

---

## 🎉 Félicitations!

Votre application est maintenant en production! 🚀

**URLs:**
- Frontend: https://bawi-studio.vercel.app
- Backend: https://bawi-studio-backend.onrender.com

