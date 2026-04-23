# ✅ Checklist de Déploiement - Render & Vercel

## 🔐 Avant de Commencer

### Préparation Supabase
- [ ] Projet Supabase créé et configuré
- [ ] Tables créées: `contact_messages`, `portfolios`
- [ ] Buckets créés: `cahiers-de-charge`, `portfolios`
- [ ] Clés d'API récupérées:
  - [ ] `SUPABASE_URL`
  - [ ] `SUPABASE_KEY` (clé anon)
  - [ ] `SUPABASE_SERVICE_KEY` (clé de service)

### Préparation JWT & Admin
- [ ] `JWT_SECRET` généré (chaîne aléatoire sécurisée)
- [ ] `ADMIN_PASSWORD_HASH` généré avec bcrypt

### Préparation GitHub
- [ ] Repository poussé vers GitHub
- [ ] Branche `main` à jour
- [ ] Fichiers `.env` dans `.gitignore`

---

## 🚀 Déploiement Backend (Render)

### Étape 1: Créer le Service
- [ ] Compte Render créé
- [ ] Repository GitHub connecté à Render
- [ ] Nouveau Web Service créé
- [ ] Root Directory défini à `backend`
- [ ] Runtime défini à Node

### Étape 2: Configurer les Variables d'Environnement
- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `10000`
- [ ] `SUPABASE_URL` = `<votre_url>`
- [ ] `SUPABASE_KEY` = `<votre_clé>`
- [ ] `SUPABASE_SERVICE_KEY` = `<votre_clé_service>`
- [ ] `JWT_SECRET` = `<votre_secret>`
- [ ] `ADMIN_PASSWORD_HASH` = `<votre_hash>`

### Étape 3: Déployer
- [ ] Cliquez sur "Deploy"
- [ ] Attendez la fin du build
- [ ] Vérifiez que le service est "Live"

### Étape 4: Tester le Backend
- [ ] Health check: `curl https://bawi-studio-backend.onrender.com/api/health`
- [ ] Résultat: `{"status":"ok","message":"Backend is running"}`
- [ ] Portfolios: `curl https://bawi-studio-backend.onrender.com/api/portfolios`

---

## 🌐 Déploiement Frontend (Vercel)

### Étape 1: Créer le Projet
- [ ] Compte Vercel créé
- [ ] Repository GitHub connecté à Vercel
- [ ] Nouveau projet créé
- [ ] Root Directory défini à `frontend`
- [ ] Framework défini à Vite

### Étape 2: Configurer les Variables d'Environnement
- [ ] `VITE_API_URL` = `https://bawi-studio-backend.onrender.com`

### Étape 3: Déployer
- [ ] Cliquez sur "Deploy"
- [ ] Attendez la fin du build
- [ ] Vérifiez que le déploiement est "Ready"

### Étape 4: Tester le Frontend
- [ ] Ouvrez `https://bawi-studio.vercel.app`
- [ ] Vérifiez que la page se charge
- [ ] Vérifiez que les images se chargent
- [ ] Ouvrez la console du navigateur (F12)
- [ ] Vérifiez qu'il n'y a pas d'erreurs CORS

---

## 🧪 Tests Fonctionnels

### Formulaire de Contact
- [ ] Remplissez le formulaire
- [ ] Soumettez
- [ ] Vérifiez le message de succès
- [ ] Vérifiez que le message est dans Supabase

### Admin Dashboard
- [ ] Allez à `https://bawi-studio.vercel.app/admin`
- [ ] Connectez-vous avec le mot de passe admin
- [ ] Vérifiez que vous pouvez voir les messages
- [ ] Vérifiez que vous pouvez voir les statistiques
- [ ] Testez la création d'un portfolio
- [ ] Testez la modification d'un portfolio
- [ ] Testez la suppression d'un portfolio

### API Endpoints
- [ ] `GET /api/health` - Retourne le statut
- [ ] `GET /api/portfolios` - Retourne les portfolios
- [ ] `POST /api/contact` - Accepte les messages
- [ ] `POST /api/admin/login` - Authentification admin
- [ ] `GET /api/admin/stats` - Statistiques (authentifié)

---

## 🔍 Vérification de Sécurité

### Secrets
- [ ] Aucun `.env` committé
- [ ] Toutes les clés dans les variables d'environnement des plateformes
- [ ] `JWT_SECRET` est une chaîne aléatoire sécurisée
- [ ] `ADMIN_PASSWORD_HASH` est un hash bcrypt valide

### CORS
- [ ] L'URL Vercel est dans la liste CORS du backend
- [ ] Les requêtes cross-origin fonctionnent
- [ ] Pas d'erreurs CORS dans la console

### Authentification
- [ ] Le login admin fonctionne
- [ ] Les tokens JWT sont valides
- [ ] Les endpoints admin sont protégés

---

## 📊 Monitoring Post-Déploiement

### Render Dashboard
- [ ] Vérifiez les logs du service
- [ ] Vérifiez que le service ne s'arrête pas
- [ ] Vérifiez l'utilisation des ressources

### Vercel Dashboard
- [ ] Vérifiez les logs de build
- [ ] Vérifiez les logs runtime
- [ ] Vérifiez les performances

### Supabase Dashboard
- [ ] Vérifiez les statistiques d'utilisation
- [ ] Vérifiez que les tables reçoivent des données
- [ ] Vérifiez les erreurs de base de données

---

## 🔄 Mise à Jour Continue

### Pour les mises à jour du code:
- [ ] Testez localement avec `npm run dev`
- [ ] Poussez vers GitHub
- [ ] Render/Vercel redéploient automatiquement
- [ ] Vérifiez que le déploiement est réussi

### Pour les changements de variables d'environnement:
- [ ] Mettez à jour sur Render/Vercel
- [ ] Redéployez manuellement si nécessaire

---

## 🆘 Dépannage Rapide

| Problème | Solution |
|----------|----------|
| Erreur "Variables manquantes" | Vérifiez les variables d'environnement sur Render |
| Erreur CORS | Vérifiez que l'URL Vercel est dans corsOrigins |
| Erreur Supabase | Vérifiez les clés et que le projet est actif |
| Formulaire ne soumet pas | Vérifiez que le backend est accessible |
| Admin login échoue | Vérifiez le mot de passe et JWT_SECRET |
| Images ne se chargent pas | Vérifiez les URLs Supabase Storage |

---

## ✨ Félicitations!

Si tous les points sont cochés, votre application est prête pour la production! 🎉

