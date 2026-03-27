# 🚀 GUIDE DE DÉPLOIEMENT - BAWI-STUDIO

## 📋 TABLE DES MATIÈRES

1. [Étape 1: Préparation](#étape-1-préparation)
2. [Étape 2: Configuration Sécurité](#étape-2-configuration-sécurité)
3. [Étape 3: Base de Données](#étape-3-base-de-données)
4. [Étape 4: Build Frontend](#étape-4-build-frontend)
5. [Étape 5: Déployer Frontend](#étape-5-déployer-frontend)
6. [Étape 6: Déployer Backend](#étape-6-déployer-backend)
7. [Étape 7: Configuration Domaine](#étape-7-configuration-domaine)
8. [Étape 8: Testing](#étape-8-testing)
9. [Maintenance](#maintenance)

---

## ÉTAPE 1: PRÉPARATION

### 1.1 Vérifier les Fichiers Essentiels

Avant de commencer, vérifier que tu as tous ces fichiers:

**Backend:**
- ✅ `backend/app_mysql.py` - Application Flask
- ✅ `backend/database_mysql.py` - Connexion MySQL
- ✅ `backend/requirements.txt` - Dépendances Python
- ✅ `backend/.env` - Configuration (à mettre à jour)
- ✅ `backend/create_mysql_database.py` - Script DB
- ✅ `backend/create_projects_table.py` - Script projets
- ✅ `backend/create_portfolio_table.py` - Script portfolio

**Frontend:**
- ✅ `package.json` - Dépendances Node
- ✅ `vite.config.js` - Configuration Vite
- ✅ `.env` - Configuration (à mettre à jour)
- ✅ `src/` - Tous les composants
- ✅ `public/images/` - Dossier pour les uploads

### 1.2 Créer les Comptes Nécessaires

1. **Vercel** (Frontend): https://vercel.com
2. **Railway** (Backend): https://railway.app
3. **GitHub** (Repo): https://github.com (si pas déjà fait)

---

## ÉTAPE 2: CONFIGURATION SÉCURITÉ

### 2.1 Générer JWT_SECRET_KEY Sécurisé

Ouvrir le terminal et exécuter:

```bash
# Linux/Mac
openssl rand -hex 32

# Windows PowerShell
[System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

**Copier le résultat généré** (exemple: `a1b2c3d4e5f6...`)

### 2.2 Mettre à Jour backend/.env

Ouvrir le fichier `backend/.env` et remplacer:

```env
# AVANT
JWT_SECRET_KEY=bawi_studio_secret_key_2024_ultra_secure_change_this
ADMIN_PASSWORD=20-86

# APRÈS
JWT_SECRET_KEY=votre_clé_générée_ici
ADMIN_PASSWORD=nouveau_mot_de_passe_très_sécurisé
```

**Exemple complet:**
```env
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=bawi_studio
MYSQL_PORT=3306
JWT_SECRET_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
ADMIN_USERNAME=euloge
ADMIN_PASSWORD=MonMotDePasse123!
```

### 2.3 Mettre à Jour .env (Frontend)

Ouvrir le fichier `.env` à la racine et remplacer:

```env
# AVANT
VITE_API_URL=http://192.168.1.81:5000

# APRÈS
VITE_API_URL=https://bawi-api.up.railway.app
```

---

## ÉTAPE 3: BASE DE DONNÉES

### 3.1 Initialiser la Base de Données MySQL

Ouvrir le terminal et exécuter:

```bash
# Aller dans le dossier backend
cd backend

# 1. Créer la base de données
python create_mysql_database.py
```

**Résultat attendu:**
```
✅ Table 'admins' créée avec succès!
✅ Table 'client_messages' créée avec succès!
✅ Table 'general_messages' créée avec succès!
✅ Table 'deleted_messages' créée avec succès!
✅ Table 'statistics' créée avec succès!
✅ Table 'admin_logs' créée avec succès!
```

### 3.2 Créer la Table des Projets

```bash
python create_projects_table.py
```

**Résultat attendu:**
```
✅ Table 'projects' créée avec succès!
✅ Projets d'exemple ajoutés!
```

### 3.3 Créer la Table du Portfolio

```bash
python create_portfolio_table.py
```

**Résultat attendu:**
```
✅ Table 'portfolio' créée avec succès!
```

### 3.4 Vérifier la Base de Données

```bash
python check_database.py
```

**Résultat attendu:**
```
✅ Connecté à MySQL Server version X.X.X
✅ Base de données active: bawi_studio
✅ Tables trouvées: 8
   - admins
   - client_messages
   - general_messages
   - deleted_messages
   - statistics
   - admin_logs
   - projects
   - portfolio
```

---

## ÉTAPE 4: BUILD FRONTEND

### 4.1 Construire le Frontend pour Production

Ouvrir le terminal à la racine du projet et exécuter:

```bash
npm run build
```

**Résultat attendu:**
```
✓ 1234 modules transformed
✓ built in 45.23s
```

Un dossier `dist/` est créé avec tous les fichiers optimisés.

### 4.2 Vérifier le Build

```bash
# Vérifier que le dossier dist existe
ls -la dist/

# Vérifier les fichiers
ls dist/
```

**Résultat attendu:**
```
index.html
assets/
  - main.xxxxx.js
  - style.xxxxx.css
```

---

## ÉTAPE 5: DÉPLOYER FRONTEND

### 5.1 Installer Vercel CLI

```bash
npm install -g vercel
```

### 5.2 Déployer sur Vercel

```bash
# À la racine du projet
vercel --prod
```

**Suivre les instructions:**
```
? Set up and deploy? Yes
? Which scope? [Ton compte]
? Link to existing project? No
? What's your project's name? bawi-studio
? In which directory is your code? ./
? Want to modify these settings? No
```

**Résultat attendu:**
```
✓ Production: https://bawi-studio.vercel.app
```

### 5.3 Configurer Variables d'Environnement dans Vercel

1. Va sur https://vercel.com/dashboard
2. Clique sur ton projet `bawi-studio`
3. Va dans **Settings** → **Environment Variables**
4. Ajoute:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://bawi-api.up.railway.app`
5. Clique **Save**

### 5.4 Redéployer pour Appliquer les Variables

```bash
vercel --prod
```

**URL Frontend:** `https://bawi-studio.vercel.app`

---

## ÉTAPE 6: DÉPLOYER BACKEND

### 6.1 Créer Procfile pour Railway

Créer un fichier `Procfile` dans le dossier `backend/`:

```
web: python app_mysql.py
```

### 6.2 Créer runtime.txt

Créer un fichier `runtime.txt` dans le dossier `backend/`:

```
python-3.11.0
```

### 6.3 Déployer sur Railway

1. Va sur https://railway.app
2. Clique **New Project**
3. Sélectionne **Deploy from GitHub repo**
4. Connecte ton compte GitHub
5. Choisis ton repo `bawi-studio`
6. Railway détecte Python automatiquement
7. Attends le déploiement (2-3 minutes)

### 6.4 Configurer Variables d'Environnement dans Railway

1. Va dans ton projet Railway
2. Clique sur **Variables**
3. Ajoute ces variables:

```
JWT_SECRET_KEY=votre_clé_générée
ADMIN_USERNAME=euloge
ADMIN_PASSWORD=votre_nouveau_mot_de_passe
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=bawi_studio
MYSQL_PORT=3306
```

4. Clique **Save**

### 6.5 Redéployer pour Appliquer les Variables

1. Va dans **Deployments**
2. Clique sur le dernier déploiement
3. Clique **Redeploy**
4. Attends que le déploiement se termine

**URL Backend:** `https://bawi-api.up.railway.app`

---

## ÉTAPE 7: CONFIGURATION DOMAINE

### 7.1 Acheter un Domaine (Optionnel)

Si tu veux un domaine personnalisé (ex: bawi-studio.com):

1. Va sur https://namecheap.com ou https://domains.google
2. Cherche ton domaine
3. Achète-le (~12€/an)

### 7.2 Configurer le Domaine avec Vercel

1. Va sur https://vercel.com/dashboard
2. Clique sur ton projet `bawi-studio`
3. Va dans **Settings** → **Domains**
4. Clique **Add Domain**
5. Entre ton domaine: `bawi-studio.com`
6. Suis les instructions pour configurer le DNS

**Attendre 24-48h pour la propagation DNS**

---

## ÉTAPE 8: TESTING

### 8.1 Tester le Backend

Ouvrir le navigateur et aller à:

```
https://bawi-api.up.railway.app/api/test
```

**Résultat attendu:**
```json
{
  "status": "ok",
  "message": "Backend fonctionne correctement!",
  "timestamp": "2026-03-27T10:30:00"
}
```

### 8.2 Tester le Frontend

Ouvrir le navigateur et aller à:

```
https://bawi-studio.vercel.app
```

**Vérifier:**
- ✅ Page charge correctement
- ✅ Tous les éléments s'affichent
- ✅ Formulaire de contact visible
- ✅ Responsive sur mobile

### 8.3 Tester le Login Admin

1. Aller à: `https://bawi-studio.vercel.app/admin`
2. Login avec:
   - **Username:** `euloge`
   - **Password:** `votre_nouveau_mot_de_passe`

**Vérifier:**
- ✅ Login fonctionne
- ✅ Dashboard s'affiche
- ✅ Tous les onglets visibles

### 8.4 Tester les Fonctionnalités

**Tester Projets:**
1. Aller dans l'onglet **Projets**
2. Cliquer **+ Nouveau Projet**
3. Remplir le formulaire
4. Cliquer **Créer**
5. Vérifier que le projet apparaît

**Tester Portfolio:**
1. Aller dans l'onglet **Portfolio**
2. Cliquer **+ Ajouter au Portfolio**
3. Sélectionner un projet
4. Uploader une image
5. Cliquer **Ajouter**
6. Vérifier que le projet apparaît dans le portfolio

**Tester Upload Images:**
1. Vérifier que les images s'affichent correctement
2. Vérifier que les images sont dans `public/images/`

### 8.5 Tester sur Mobile

1. Ouvrir sur téléphone: `https://bawi-studio.vercel.app`
2. Vérifier le responsive design
3. Tester le menu hamburger
4. Tester les formulaires

---

## MAINTENANCE

### 9.1 Monitoring

**Vérifier que tout fonctionne:**

```bash
# Tester le backend
curl https://bawi-api.up.railway.app/api/health

# Tester le frontend
curl -I https://bawi-studio.vercel.app
```

### 9.2 Sauvegardes

**Exporter la base de données:**

```bash
mysqldump -u root -p bawi_studio > backup_bawi_studio.sql
```

**Importer la base de données:**

```bash
mysql -u root -p bawi_studio < backup_bawi_studio.sql
```

### 9.3 Mises à Jour

**Mettre à jour les dépendances:**

```bash
# Frontend
npm update
npm audit fix

# Backend
pip list --outdated
pip install --upgrade package-name
```

### 9.4 Logs

**Consulter les logs:**

**Vercel:**
```bash
vercel logs
```

**Railway:**
- Va dans ton projet Railway
- Clique **Deployments**
- Clique sur le déploiement
- Clique **View Logs**

---

## 📋 CHECKLIST FINALE

### Avant la Mise en Ligne
- [ ] JWT_SECRET_KEY généré
- [ ] Mot de passe admin changé
- [ ] .env frontend mis à jour
- [ ] .env backend mis à jour
- [ ] Base de données initialisée
- [ ] Frontend buildé
- [ ] Frontend déployé sur Vercel
- [ ] Backend déployé sur Railway
- [ ] Variables d'environnement configurées

### Après la Mise en Ligne
- [ ] Backend répond (API test)
- [ ] Frontend charge
- [ ] Login admin fonctionne
- [ ] Projets fonctionnent
- [ ] Portfolio fonctionne
- [ ] Upload images fonctionne
- [ ] Responsive sur mobile
- [ ] Pas d'erreurs dans la console

---

## 🆘 DÉPANNAGE

### Erreur: "Can't create table portfolio"

**Solution:**
```bash
cd backend
python create_projects_table.py
python create_portfolio_table.py
```

### Erreur: "CORS error"

**Solution:**
- Attendre 5 minutes que Railway redéploie
- Vérifier que `VITE_API_URL` est correct dans Vercel

### Erreur: "Login ne fonctionne pas"

**Solution:**
- Vérifier que `ADMIN_PASSWORD` est mis à jour dans Railway
- Vérifier que la base de données est initialisée

### Erreur: "Images ne s'affichent pas"

**Solution:**
```bash
mkdir -p public/images
chmod 755 public/images
```

### Erreur: "Application Error" sur Railway

**Solution:**
1. Va dans Railway → Deployments
2. Clique sur le déploiement
3. Clique **View Logs**
4. Cherche l'erreur
5. Corrige et redéploie

---

## 📞 URLS FINALES

**Frontend:** `https://bawi-studio.vercel.app`  
**Backend:** `https://bawi-api.up.railway.app`  
**Admin:** `https://bawi-studio.vercel.app/admin`  

---

## 💰 COÛTS

| Service | Coût |
|---------|------|
| Frontend (Vercel) | Gratuit |
| Backend (Railway) | Gratuit |
| Base de données | Gratuit |
| Domaine (optionnel) | ~12€/an |
| **TOTAL** | **Gratuit ou ~1€/mois** |

---

**Document créé le:** 27 mars 2026  
**Version:** 2.0 (Étapes détaillées avec MySQL, Portfolio, Projects)  
**Auteur:** BAWI-STUDIO

🚀 **Bon déploiement!** 🚀

