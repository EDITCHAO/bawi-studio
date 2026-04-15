# 🔐 Référence des Variables d'Environnement

## Backend (Render) - `backend/.env`

Ces variables doivent être définies dans le dashboard Render:

```env
# Configuration Supabase
SUPABASE_URL=https://scivnqshdsgrmikwzsed.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjaXZucXNoZHNncm1pa3d6c2VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4MjQ0MzksImV4cCI6MjA5MTQwMDQzOX0.EfwPg1cBIDdXMr69WQu1puGkcSzWy-pLL3IfRChlhvQ
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjaXZucXNoZHNncm1pa3d6c2VkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTgyNDQzOSwiZXhwIjoyMDkxNDAwNDM5fQ.miBuHuCO-Boq1pAi68XQ8HwNo_k0wjvg3WUNpKJFNNg

# Configuration JWT
JWT_SECRET=bawi_studio_secret_key_2024_ultra_secure_change_this

# Configuration Admin - Hash du mot de passe "20-86"
ADMIN_PASSWORD_HASH=$2a$10$xLP94zxSUUnl.GG/iCxgEe0saLsWm..6.ioiRvlVCgeK9vYLSn6YG

# Port du serveur
PORT=5000
```

### Explication des variables:

| Variable | Description | Valeur |
|----------|-------------|--------|
| `SUPABASE_URL` | URL de la base de données Supabase | `https://scivnqshdsgrmikwzsed.supabase.co` |
| `SUPABASE_KEY` | Clé publique Supabase (anon) | Voir ci-dessus |
| `SUPABASE_SERVICE_KEY` | Clé de service Supabase (admin) | Voir ci-dessus |
| `JWT_SECRET` | Secret pour signer les tokens JWT | `bawi_studio_secret_key_2024_ultra_secure_change_this` |
| `ADMIN_PASSWORD_HASH` | Hash bcrypt du mot de passe admin | Hash de `20-86` |
| `PORT` | Port du serveur | `5000` |

---

## Frontend (Vercel) - Variables d'environnement

Ces variables doivent être définies dans le dashboard Vercel:

### Production

```
VITE_API_URL=https://bawi-studio-backend.onrender.com
```

### Preview & Development

```
VITE_API_URL=https://bawi-studio-backend.onrender.com
```

### Explication:

| Variable | Description | Valeur |
|----------|-------------|--------|
| `VITE_API_URL` | URL du backend | URL du service Render (ex: `https://bawi-studio-backend.onrender.com`) |

---

## Comment ajouter les variables sur Render

1. Allez sur https://dashboard.render.com
2. Sélectionnez le service `bawi-studio-backend`
3. Cliquez sur **Environment**
4. Cliquez sur **Add Environment Variable**
5. Remplissez:
   - **Key**: Nom de la variable (ex: `SUPABASE_URL`)
   - **Value**: Valeur de la variable
6. Cliquez sur **Save**
7. Le service redémarrera automatiquement

---

## Comment ajouter les variables sur Vercel

1. Allez sur https://vercel.com/dashboard
2. Sélectionnez le projet `bawi-studio`
3. Cliquez sur **Settings**
4. Cliquez sur **Environment Variables**
5. Cliquez sur **Add New**
6. Remplissez:
   - **Name**: Nom de la variable (ex: `VITE_API_URL`)
   - **Value**: Valeur de la variable
   - **Environments**: Sélectionnez Production, Preview, Development
7. Cliquez sur **Save**
8. Redéployez le projet

---

## ⚠️ Sécurité

- **Ne jamais** commiter les variables d'environnement dans Git
- **Ne jamais** partager les clés Supabase publiquement
- Les variables sont stockées de manière sécurisée sur Render et Vercel
- Changez `JWT_SECRET` en production avec une valeur plus sécurisée

---

## 🔄 Mise à jour des variables

Si vous devez mettre à jour une variable:

1. Allez sur le dashboard (Render ou Vercel)
2. Modifiez la variable
3. Sauvegardez
4. Le service redémarrera automatiquement

