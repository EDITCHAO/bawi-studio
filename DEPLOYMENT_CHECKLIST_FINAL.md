# ✅ Checklist de Déploiement Final - Bawi Studio

## 🔐 Avant de déployer

- [ ] Vérifier que `.env` et `backend/.env` ne sont PAS dans Git
- [ ] Vérifier que `.gitignore` contient `.env` et `backend/.env`
- [ ] Vérifier que tous les secrets sont dans `.env.example` (sans valeurs)
- [ ] Tester localement: `npm run dev` et `cd backend && npm run dev`
- [ ] Vérifier que le frontend se connecte au backend local

## 📝 Configuration GitHub

- [ ] Créer un repository sur GitHub: `bawi-studio`
- [ ] Pousser le code: `git push origin main`
- [ ] Vérifier que le code est sur GitHub (sans fichiers `.env`)

## 🌐 Configuration Vercel (Frontend)

- [ ] Créer un compte Vercel
- [ ] Connecter Vercel à GitHub
- [ ] Importer le repository `bawi-studio`
- [ ] Ajouter la variable d'environnement:
  - `VITE_API_URL` = `https://bawi-studio-backend.onrender.com`
- [ ] Vérifier le build: `npm run build`
- [ ] Vérifier que le déploiement est réussi
- [ ] Tester le frontend: https://bawi-studio.vercel.app

## 🔧 Configuration Render (Backend)

- [ ] Créer un compte Render
- [ ] Créer un nouveau Web Service
- [ ] Connecter Render à GitHub
- [ ] Sélectionner le repository `bawi-studio`
- [ ] Configurer:
  - **Name**: `bawi-studio-backend`
  - **Environment**: `Node`
  - **Build Command**: `cd backend && npm install`
  - **Start Command**: `cd backend && npm start`
  - **Root Directory**: `.`
- [ ] Ajouter les variables d'environnement:
  - `SUPABASE_URL` = `https://scivnqshdsgrmikwzsed.supabase.co`
  - `SUPABASE_KEY` = (clé anonyme Supabase)
  - `SUPABASE_SERVICE_KEY` = (clé de service Supabase)
  - `JWT_SECRET` = `bawi_studio_secret_key_2024_ultra_secure_change_this`
  - `ADMIN_PASSWORD_HASH` = (hash du mot de passe admin)
  - `PORT` = `5000`
- [ ] Vérifier le déploiement
- [ ] Tester le backend: https://bawi-studio-backend.onrender.com/api/health

## 🗄️ Configuration Supabase

- [ ] Vérifier que la table `portfolios` existe
- [ ] Vérifier que les politiques RLS sont correctes
- [ ] Vérifier que le bucket `portfolios` existe dans Storage
- [ ] Vérifier que les politiques RLS du bucket sont correctes
- [ ] Tester l'upload d'image depuis le dashboard admin

## 🧪 Tests de Production

- [ ] Tester le frontend: https://bawi-studio.vercel.app
- [ ] Tester le login admin
- [ ] Tester l'ajout d'un portfolio
- [ ] Vérifier que le portfolio s'affiche sur la page client
- [ ] Tester la modification d'un portfolio
- [ ] Tester la suppression d'un portfolio
- [ ] Tester le formulaire de contact
- [ ] Vérifier que les messages arrivent dans le dashboard

## 📱 Tests Cross-Browser

- [ ] Tester sur Chrome
- [ ] Tester sur Firefox
- [ ] Tester sur Safari
- [ ] Tester sur mobile (iPhone/Android)
- [ ] Vérifier la responsive design

## 🔒 Sécurité

- [ ] Vérifier que les clés API ne sont pas exposées
- [ ] Vérifier que CORS est correctement configuré
- [ ] Vérifier que les politiques RLS sont restrictives
- [ ] Vérifier que le mot de passe admin est sécurisé
- [ ] Vérifier que JWT_SECRET est unique et sécurisé

## 📊 Performance

- [ ] Vérifier que le frontend charge rapidement
- [ ] Vérifier que les images s'affichent correctement
- [ ] Vérifier que le backend répond rapidement
- [ ] Vérifier les logs de Vercel et Render

## 🚀 Mise en Production

- [ ] Tous les tests sont passés
- [ ] Tous les secrets sont configurés
- [ ] Le code est sur GitHub
- [ ] Le frontend est sur Vercel
- [ ] Le backend est sur Render
- [ ] Les URLs sont correctes dans la configuration

## 📞 Support

Si tu rencontres des problèmes:

1. **Frontend ne charge pas**: Vérifier les logs Vercel
2. **Backend ne répond pas**: Vérifier les logs Render
3. **Images ne s'affichent pas**: Vérifier Supabase Storage
4. **Login ne fonctionne pas**: Vérifier les variables d'environnement
5. **Erreur CORS**: Vérifier la configuration CORS du backend

## 🎉 Félicitations!

Ton site est maintenant en production! 🚀

**URLs de production:**
- Frontend: https://bawi-studio.vercel.app
- Backend: https://bawi-studio-backend.onrender.com
- Admin: https://bawi-studio.vercel.app/admin

**Pour mettre à jour le code:**
```bash
git add .
git commit -m "Description des changements"
git push origin main
```

Les changements seront automatiquement déployés sur Vercel et Render!
