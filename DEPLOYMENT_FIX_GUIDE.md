# 🚀 Guide Complet de Correction du Déploiement - Bawi Studio

## 📋 Résumé du Problème

Le déploiement actuel a un problème critique:
- **Frontend (Vercel)**: ✅ Déployé correctement
- **Backend (Render)**: ❌ Mauvaise application déployée (`bawi-permis` au lieu de `bawi-studio`)
- **Résultat**: Le frontend ne peut pas se connecter au backend, les portfolios ne s'affichent pas, le login admin ne fonctionne pas

---

## 🔧 ÉTAPE 1: Supprimer l'ancien service Render

1. Allez sur https://dashboard.render.com
2. Trouvez le service `bawi-permis-backend`
3. Cliquez sur le service
4. Allez dans **Settings** → **Danger Zone**
5. Cliquez sur **Delete Web Service**
6. Confirmez la suppression

---

## ✨ ÉTAPE 2: Créer un nouveau service Render pour Bawi Studio

### 2.1 Connecter le repository GitHub

1. Allez sur https://dashboard.render.com
2. Cliquez sur **New +** → **Web Service**
3. Sélectionnez **Connect a repository**
4. Cherchez `bawi-studio` et cliquez sur **Connect**

### 2.2 Configurer le service

Remplissez les champs comme suit:

| Champ | Valeur |
|-------|--------|
| **Name** | `bawi-studio-backend` |
| **Environment** | `Node` |
| **Region** | `Frankfurt (EU Central)` ou votre région préférée |
| **Branch** | `main` |
| **Build Command** | `cd backend && npm install` |
| **Start Command** | `cd backend && npm start` |
| **Root Directory** | `.` (laisser vide ou mettre `.`) |

### 2.3 Ajouter les variables d'environnement

Cliquez sur **Environment** et ajoutez ces variables:

```
SUPABASE_URL=https://scivnqshdsgrmikwzsed.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjaXZucXNoZHNncm1pa3d6c2VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4MjQ0MzksImV4cCI6MjA5MTQwMDQzOX0.EfwPg1cBIDdXMr69WQu1puGkcSzWy-pLL3IfRChlhvQ
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjaXZucXNoZHNncm1pa3d6c2VkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTgyNDQzOSwiZXhwIjoyMDkxNDAwNDM5fQ.miBuHuCO-Boq1pAi68XQ8HwNo_k0wjvg3WUNpKJFNNg
JWT_SECRET=bawi_studio_secret_key_2024_ultra_secure_change_this
ADMIN_PASSWORD_HASH=$2a$10$xLP94zxSUUnl.GG/iCxgEe0saLsWm..6.ioiRvlVCgeK9vYLSn6YG
PORT=5000
```

### 2.4 Créer le service

Cliquez sur **Create Web Service** et attendez le déploiement (5-10 minutes)

---

## 📝 ÉTAPE 3: Mettre à jour la configuration Frontend

Une fois le backend déployé, vous verrez l'URL du service (ex: `https://bawi-studio-backend.onrender.com`)

### 3.1 Mettre à jour `src/config.js`

Remplacez l'URL du backend:

```javascript
export const API_URL = import.meta.env.VITE_API_URL || 'https://bawi-studio-backend.onrender.com';
```

### 3.2 Ajouter la variable d'environnement à Vercel

1. Allez sur https://vercel.com/dashboard
2. Sélectionnez le projet `bawi-studio`
3. Allez dans **Settings** → **Environment Variables**
4. Ajoutez:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://bawi-studio-backend.onrender.com` (remplacez par votre URL Render)
   - **Environments**: Production, Preview, Development

### 3.3 Redéployer sur Vercel

1. Allez dans **Deployments**
2. Cliquez sur les trois points du dernier déploiement
3. Cliquez sur **Redeploy**

---

## ✅ ÉTAPE 4: Tester le déploiement

### 4.1 Tester le backend

Ouvrez dans votre navigateur:
```
https://bawi-studio-backend.onrender.com/api/health
```

Vous devriez voir:
```json
{"status":"ok","message":"Backend is running"}
```

### 4.2 Tester les portfolios

```
https://bawi-studio-backend.onrender.com/api/portfolios
```

Vous devriez voir un tableau JSON avec vos portfolios.

### 4.3 Tester le frontend

1. Allez sur https://bawi-studio.vercel.app
2. Vérifiez que les portfolios s'affichent
3. Testez le login admin avec:
   - **Username**: `euloge`
   - **Password**: `20-86`

---

## 🔐 Informations de Connexion Admin

- **URL Admin**: https://bawi-studio.vercel.app/admin
- **Username**: `euloge`
- **Password**: `20-86`

---

## 📊 Vérification des Endpoints

Tous ces endpoints doivent fonctionner:

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/health` | GET | Vérifier que le backend fonctionne |
| `/api/portfolios` | GET | Récupérer tous les portfolios (public) |
| `/api/contact` | POST | Soumettre un message de contact |
| `/api/admin/login` | POST | Se connecter en tant qu'admin |
| `/api/admin/portfolios` | GET | Récupérer les portfolios (admin) |
| `/api/admin/portfolios` | POST | Créer un portfolio (admin) |
| `/api/admin/client-messages` | GET | Récupérer les messages (admin) |

---

## 🆘 Dépannage

### Le backend ne démarre pas

1. Vérifiez les logs Render:
   - Allez sur le service Render
   - Cliquez sur **Logs**
   - Cherchez les erreurs

2. Vérifiez les variables d'environnement:
   - Toutes les variables doivent être présentes
   - Pas d'espaces supplémentaires

### Le frontend ne voit pas le backend

1. Vérifiez que `VITE_API_URL` est défini dans Vercel
2. Redéployez le frontend
3. Videz le cache du navigateur (Ctrl+Shift+Delete)

### Le login admin ne fonctionne pas

1. Vérifiez que `ADMIN_PASSWORD_HASH` est correct dans Render
2. Vérifiez que `JWT_SECRET` est défini
3. Testez avec les identifiants: `euloge` / `20-86`

---

## 📱 URLs Finales

- **Frontend**: https://bawi-studio.vercel.app
- **Backend**: https://bawi-studio-backend.onrender.com
- **Admin Dashboard**: https://bawi-studio.vercel.app/admin

---

## ✨ Prochaines Étapes

Une fois le déploiement vérifié:

1. ✅ Tester tous les endpoints
2. ✅ Ajouter des portfolios via le dashboard admin
3. ✅ Tester le formulaire de contact
4. ✅ Vérifier les messages dans le dashboard admin
5. ✅ Configurer un domaine personnalisé (optionnel)

