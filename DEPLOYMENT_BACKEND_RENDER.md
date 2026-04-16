# Guide de Déploiement du Backend sur Render

## 🚀 Étapes de déploiement

### 1. Créer un compte Render
- Allez sur [render.com](https://render.com)
- Connectez-vous avec GitHub
- Créez un nouveau service Web

### 2. Configurer le service Web

**Paramètres de base :**
- **Name** : `bawi-studio-backend`
- **Repository** : Sélectionnez votre repo GitHub
- **Branch** : `main`
- **Runtime** : `Node`
- **Build Command** : `npm install`
- **Start Command** : `npm start`
- **Plan** : Free (ou payant selon vos besoins)

### 3. Ajouter les variables d'environnement

Dans la section "Environment", ajoutez :

```
SUPABASE_URL=https://scivnqshdsgrmikwzsed.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjaXZucXNoZHNncm1pa3d6c2VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4MjQ0MzksImV4cCI6MjA5MTQwMDQzOX0.EfwPg1cBIDdXMr69WQu1puGkcSzWy-pLL3IfRChlhvQ
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjaXZucXNoZHNncm1pa3d6c2VkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTgyNDQzOSwiZXhwIjoyMDkxNDAwNDM5fQ.miBuHuCO-Boq1pAi68XQ8HwNo_k0wjvg3WUNpKJFNNg
JWT_SECRET=bawi_studio_secret_key_2024_ultra_secure_change_this
ADMIN_PASSWORD_HASH=$2a$10$xLP94zxSUUnl.GG/iCxgEe0saLsWm..6.ioiRvlVCgeK9vYLSn6YG
PORT=10000
```

### 4. Déployer

- Cliquez sur "Create Web Service"
- Render va automatiquement déployer votre backend
- Attendez que le déploiement soit terminé
- Notez l'URL du service (ex: `https://bawi-studio-backend.onrender.com`)

### 5. Mettre à jour le frontend

Dans le fichier `.env` du frontend :

```env
VITE_API_URL=https://bawi-studio-backend.onrender.com
```

Puis redéployez le frontend sur Vercel.

## ✅ Vérification

### Tester la santé du backend

```bash
curl https://bawi-studio-backend.onrender.com/api/health
```

Réponse attendue :
```json
{"status":"ok","message":"Backend is running"}
```

### Tester la connexion admin

```bash
curl -X POST https://bawi-studio-backend.onrender.com/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"password":"20-86"}'
```

### Tester les portfolios

```bash
curl https://bawi-studio-backend.onrender.com/api/portfolios
```

## 🔧 Dépannage

### Le backend ne démarre pas

1. Vérifiez les logs dans Render
2. Vérifiez que toutes les variables d'environnement sont définies
3. Vérifiez que le fichier `server.js` existe dans le répertoire `backend`

### Les portfolios ne s'affichent pas

1. Vérifiez que la table `portfolios` existe dans Supabase
2. Exécutez le script `setup-portfolios.js` pour ajouter les données
3. Vérifiez que l'endpoint `/api/portfolios` retourne les données

### Erreur de connexion admin

1. Vérifiez que le mot de passe est correct : `20-86`
2. Vérifiez que le hash du mot de passe est correct dans les variables d'environnement
3. Vérifiez que le JWT_SECRET est le même sur le backend et le frontend

## 📝 Notes importantes

- Le backend Render peut prendre quelques secondes pour démarrer après un déploiement
- Les plans gratuits de Render peuvent être mis en veille après 15 minutes d'inactivité
- Assurez-vous que le CORS est bien configuré pour accepter les requêtes de Vercel

## 🔐 Sécurité

- Ne commitez jamais les variables d'environnement dans Git
- Utilisez les secrets de Render pour stocker les clés sensibles
- Changez le JWT_SECRET en production
- Changez le mot de passe admin en production

