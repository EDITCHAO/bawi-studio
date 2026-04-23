# Guide de Déploiement - Render & Vercel

## 📋 Prérequis

- Compte GitHub avec le repository
- Compte Render (https://render.com)
- Compte Vercel (https://vercel.com)
- Supabase configuré avec les tables et clés d'API

---

## 🚀 Déploiement Backend sur Render

### Étape 1: Préparer les variables d'environnement

Vous aurez besoin de:
- `SUPABASE_URL` - URL de votre projet Supabase
- `SUPABASE_KEY` - Clé anon de Supabase
- `SUPABASE_SERVICE_KEY` - Clé de service de Supabase
- `JWT_SECRET` - Clé secrète pour les tokens JWT (générez une chaîne aléatoire)
- `ADMIN_PASSWORD_HASH` - Hash bcrypt du mot de passe admin

### Étape 2: Créer le service sur Render

1. Allez sur https://render.com et connectez-vous
2. Cliquez sur "New +" → "Web Service"
3. Connectez votre repository GitHub
4. Sélectionnez le repository `bawi-studio`
5. Configurez:
   - **Name**: `bawi-studio-backend`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (ou payant selon vos besoins)

### Étape 3: Ajouter les variables d'environnement

1. Dans le dashboard Render, allez à "Environment"
2. Ajoutez les variables:
   ```
   NODE_ENV=production
   PORT=10000
   SUPABASE_URL=<votre_url>
   SUPABASE_KEY=<votre_clé>
   SUPABASE_SERVICE_KEY=<votre_clé_service>
   JWT_SECRET=<votre_secret_jwt>
   ADMIN_PASSWORD_HASH=<votre_hash_bcrypt>
   ```

### Étape 4: Déployer

1. Cliquez sur "Deploy"
2. Attendez que le build se termine
3. Testez: `curl https://bawi-studio-backend.onrender.com/api/health`

**Résultat attendu:**
```json
{"status":"ok","message":"Backend is running"}
```

---

## 🌐 Déploiement Frontend sur Vercel

### Étape 1: Créer le projet sur Vercel

1. Allez sur https://vercel.com et connectez-vous
2. Cliquez sur "Add New..." → "Project"
3. Importez votre repository GitHub `bawi-studio`
4. Configurez:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Étape 2: Ajouter les variables d'environnement

1. Dans le dashboard Vercel, allez à "Settings" → "Environment Variables"
2. Ajoutez:
   ```
   VITE_API_URL=https://bawi-studio-backend.onrender.com
   ```

### Étape 3: Déployer

1. Cliquez sur "Deploy"
2. Attendez que le build se termine
3. Testez: Visitez `https://bawi-studio.vercel.app`

---

## ✅ Vérification Post-Déploiement

### Backend

```bash
# Health check
curl https://bawi-studio-backend.onrender.com/api/health

# Récupérer les portfolios
curl https://bawi-studio-backend.onrender.com/api/portfolios
```

### Frontend

1. Ouvrez https://bawi-studio.vercel.app
2. Vérifiez que les images se chargent
3. Testez le formulaire de contact
4. Vérifiez la console du navigateur pour les erreurs CORS

### Formulaire de Contact

1. Remplissez le formulaire
2. Soumettez
3. Vérifiez que le message est enregistré dans Supabase

### Admin Dashboard

1. Allez à https://bawi-studio.vercel.app/admin
2. Connectez-vous avec le mot de passe admin
3. Vérifiez que vous pouvez voir les messages

---

## 🔧 Dépannage

### Erreur: "Variables d'environnement manquantes"

**Cause**: Les variables d'environnement ne sont pas définies sur Render

**Solution**:
1. Allez au dashboard Render
2. Vérifiez que toutes les variables sont présentes
3. Redéployez

### Erreur CORS: "Access to XMLHttpRequest blocked"

**Cause**: L'URL du frontend n'est pas dans la liste CORS du backend

**Solution**:
1. Vérifiez que votre URL Vercel est dans `backend/server.js` corsOrigins
2. Redéployez le backend

### Erreur: "Cannot connect to Supabase"

**Cause**: Les clés Supabase sont incorrectes ou le projet est suspendu

**Solution**:
1. Vérifiez les clés dans le dashboard Render
2. Vérifiez que votre projet Supabase est actif
3. Testez les clés localement

### Le formulaire ne soumet pas

**Cause**: L'API backend n'est pas accessible

**Solution**:
1. Vérifiez que le backend est en cours d'exécution: `curl https://bawi-studio-backend.onrender.com/api/health`
2. Vérifiez la console du navigateur pour les erreurs
3. Vérifiez les logs du backend sur Render

---

## 📝 Notes Importantes

### Sécurité

- ⚠️ Ne commitez JAMAIS les fichiers `.env` avec les secrets
- ✅ Utilisez uniquement les variables d'environnement des plateformes
- ✅ Changez régulièrement le `JWT_SECRET` et `ADMIN_PASSWORD_HASH`

### Performance

- Render Free Plan: Peut s'endormir après 15 minutes d'inactivité
- Vercel: Déploiements illimités, performance optimale
- Supabase: Vérifiez les limites de votre plan

### Monitoring

- Render: Consultez les logs dans le dashboard
- Vercel: Consultez les logs de build et runtime
- Supabase: Vérifiez les statistiques d'utilisation

---

## 🔄 Mise à Jour du Code

### Pour mettre à jour le backend:

1. Poussez les changements vers GitHub
2. Render redéploiera automatiquement

### Pour mettre à jour le frontend:

1. Poussez les changements vers GitHub
2. Vercel redéploiera automatiquement

---

## 📞 Support

Si vous rencontrez des problèmes:

1. Vérifiez les logs sur Render et Vercel
2. Testez localement avec `npm run dev`
3. Vérifiez que toutes les variables d'environnement sont correctes
4. Consultez la documentation de Render et Vercel

