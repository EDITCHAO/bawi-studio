# 🚀 GUIDE DE DÉPLOIEMENT SÉCURISÉ - BAWI-STUDIO

## ⚠️ IMPORTANT: SÉCURITÉ D'ABORD

Avant de déployer, assure-toi que:
- ✅ Les fichiers `.env` ne sont PAS sur GitHub
- ✅ Les secrets sont générés localement
- ✅ Les variables sont configurées sur les plateformes

---

## 📋 ÉTAPES DE DÉPLOIEMENT SÉCURISÉ

### ÉTAPE 1: Préparer les Fichiers Locaux

**1.1 Créer `.env` (Frontend)**

À la racine du projet, créer un fichier `.env`:

```env
VITE_API_URL=https://bawi-api.up.railway.app
```

**1.2 Créer `backend/.env` (Backend)**

Dans le dossier `backend/`, créer un fichier `.env`:

```env
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=bawi_studio
MYSQL_PORT=3306
JWT_SECRET_KEY=votre_clé_générée_ici
ADMIN_USERNAME=euloge
ADMIN_PASSWORD=20-86
```

**1.3 Générer JWT_SECRET_KEY Sécurisé**

```bash
# Linux/Mac
openssl rand -hex 32

# Windows PowerShell
[System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

Copier le résultat et remplacer dans `backend/.env`:
```env
JWT_SECRET_KEY=votre_clé_générée_ici
```

**1.4 Vérifier que `.env` n'est pas sur GitHub**

```bash
# Vérifier que .env est ignoré
git check-ignore .env
git check-ignore backend/.env

# Résultat attendu:
# .env
# backend/.env
```

---

### ÉTAPE 2: Initialiser la Base de Données

```bash
cd backend

# 1. Créer la base de données
python create_mysql_database.py

# 2. Créer la table des projets
python create_projects_table.py

# 3. Créer la table du portfolio
python create_portfolio_table.py

# 4. Vérifier
python check_database.py
```

---

### ÉTAPE 3: Build Frontend

```bash
npm run build
```

---

### ÉTAPE 4: Déployer Frontend sur Vercel

```bash
npm install -g vercel
vercel --prod
```

**Après le déploiement:**

1. Va sur https://vercel.com/dashboard
2. Clique sur `bawi-studio`
3. Va dans **Settings** → **Environment Variables**
4. Ajoute:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://bawi-api.up.railway.app`
5. Clique **Save**
6. Redéploie: `vercel --prod`

---

### ÉTAPE 5: Déployer Backend sur Railway

**5.1 Créer Procfile**

Dans `backend/`, créer `Procfile`:
```
web: python app_mysql.py
```

**5.2 Créer runtime.txt**

Dans `backend/`, créer `runtime.txt`:
```
python-3.11.0
```

**5.3 Pousser vers GitHub**

```bash
git add backend/Procfile backend/runtime.txt
git commit -m "Add Railway configuration files"
git push origin main
```

**5.4 Déployer sur Railway**

1. Va sur https://railway.app
2. Clique **New Project**
3. Clique **Deploy from GitHub repo**
4. Connecte ton compte GitHub
5. Sélectionne `bawi-studio`
6. Railway détecte Python automatiquement
7. Attends le déploiement (2-3 minutes)

**5.5 Configurer Variables d'Environnement**

1. Va dans ton projet Railway
2. Clique **Variables**
3. Ajoute:
   ```
   JWT_SECRET_KEY=votre_clé_générée
   ADMIN_USERNAME=euloge
   ADMIN_PASSWORD=20-86
   MYSQL_HOST=localhost
   MYSQL_USER=root
   MYSQL_PASSWORD=
   MYSQL_DATABASE=bawi_studio
   MYSQL_PORT=3306
   ```
4. Clique **Save**
5. Redéploie

---

### ÉTAPE 6: Tester

**6.1 Tester le Backend**

```bash
curl https://bawi-api.up.railway.app/api/test
```

**Résultat attendu:**
```json
{
  "status": "ok",
  "message": "Backend fonctionne correctement!",
  "timestamp": "2026-03-27T10:30:00"
}
```

**6.2 Tester le Frontend**

Ouvrir: `https://bawi-studio.vercel.app`

**6.3 Tester le Login Admin**

1. Aller à: `https://bawi-studio.vercel.app/admin`
2. Login avec:
   - **Username:** `euloge`
   - **Password:** `20-86`

**6.4 Tester les Fonctionnalités**

- ✅ Ajouter un projet
- ✅ Ajouter au portfolio
- ✅ Upload image
- ✅ Responsive sur mobile

---

## 🔐 SÉCURITÉ: CHECKLIST

### Avant de Déployer
- [ ] `.env` créé localement (pas sur GitHub)
- [ ] `backend/.env` créé localement (pas sur GitHub)
- [ ] JWT_SECRET_KEY généré (min 32 caractères)
- [ ] Mot de passe admin = `20-86`
- [ ] `.gitignore` contient `.env`
- [ ] Pas de secrets dans le code

### Après le Déploiement
- [ ] Variables configurées sur Vercel
- [ ] Variables configurées sur Railway
- [ ] Backend répond
- [ ] Frontend charge
- [ ] Login fonctionne
- [ ] Pas d'erreurs CORS

---

## 📝 FICHIERS À POUSSER SUR GITHUB

```bash
# Ajouter les fichiers de configuration
git add backend/Procfile backend/runtime.txt

# Commit
git commit -m "Add deployment configuration"

# Pousser
git push origin main
```

**Fichiers poussés:**
- ✅ `backend/Procfile`
- ✅ `backend/runtime.txt`
- ✅ `.env.example`
- ✅ `backend/.env.example`

**Fichiers NON poussés:**
- ❌ `.env`
- ❌ `backend/.env`

---

## 🆘 DÉPANNAGE

### Erreur: "CORS error"
- Vérifier que `VITE_API_URL` est correct dans Vercel
- Attendre 5 minutes que Railway redéploie

### Erreur: "Login ne fonctionne pas"
- Vérifier que `ADMIN_PASSWORD=20-86` dans Railway
- Vérifier que la base de données est initialisée

### Erreur: "Application Error" sur Railway
1. Va dans Railway → Deployments
2. Clique sur le déploiement
3. Clique **View Logs**
4. Cherche l'erreur

---

## 📞 URLS FINALES

**Frontend:** `https://bawi-studio.vercel.app`  
**Backend:** `https://bawi-api.up.railway.app`  
**Admin:** `https://bawi-studio.vercel.app/admin`  

**Login Admin:**
- Username: `euloge`
- Password: `20-86`

---

## 🎯 RÉSUMÉ

### Fichiers Locaux (Ton Ordinateur)
```
.env                    ← Secrets frontend
backend/.env            ← Secrets backend
```

### Fichiers GitHub (Public)
```
.env.example            ← Exemple frontend
backend/.env.example    ← Exemple backend
backend/Procfile        ← Configuration Railway
backend/runtime.txt     ← Configuration Railway
```

### Fichiers Plateformes (Vercel/Railway)
```
Variables d'environnement configurées
```

---

**Version:** 1.0  
**Date:** 27 mars 2026  
**Status:** ✅ SÉCURISÉ

