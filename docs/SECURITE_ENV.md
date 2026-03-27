# 🔐 SÉCURITÉ - VARIABLES D'ENVIRONNEMENT

## ⚠️ IMPORTANT: NE PAS EXPOSER LES SECRETS

Les fichiers `.env` contiennent des informations sensibles:
- ❌ Mots de passe
- ❌ Clés API
- ❌ Secrets JWT
- ❌ Credentials MySQL

**Ces fichiers NE DOIVENT JAMAIS être sur GitHub!**

---

## ✅ CE QUI EST FAIT

### 1. `.gitignore` Configuré
Les fichiers `.env` sont ignorés par Git:
```
.env
.env.local
backend/.env
```

**Vérifier:**
```bash
cat .gitignore | grep ".env"
```

### 2. `.env.example` Créés
Des fichiers d'exemple SANS secrets:
- ✅ `.env.example` - Frontend
- ✅ `backend/.env.example` - Backend

**Ces fichiers SONT sur GitHub** pour montrer la structure.

### 3. Fichiers Réels Locaux
Les vrais fichiers `.env` restent sur ton ordinateur:
- ✅ `.env` - Ton ordinateur seulement
- ✅ `backend/.env` - Ton ordinateur seulement

---

## 🚀 COMMENT DÉPLOYER EN SÉCURITÉ

### Étape 1: Créer les Fichiers `.env` Localement

**Frontend (.env):**
```env
VITE_API_URL=https://bawi-api.up.railway.app
```

**Backend (backend/.env):**
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

### Étape 2: Configurer sur Vercel

1. Va sur https://vercel.com/dashboard
2. Clique sur `bawi-studio`
3. Va dans **Settings** → **Environment Variables**
4. Ajoute:
   - `VITE_API_URL` = `https://bawi-api.up.railway.app`

### Étape 3: Configurer sur Railway

1. Va sur https://railway.app
2. Va dans ton projet
3. Clique **Variables**
4. Ajoute:
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

---

## 📋 FICHIERS SUR GITHUB

### ✅ À PARTAGER (Sans secrets)
```
.env.example              ← Exemple frontend
backend/.env.example      ← Exemple backend
.gitignore               ← Fichiers ignorés
README.md                ← Documentation
docs/                    ← Documentation
src/                     ← Code source
backend/                 ← Code source
```

### ❌ À NE PAS PARTAGER (Secrets)
```
.env                     ← Secrets frontend
backend/.env             ← Secrets backend
node_modules/            ← Dépendances
dist/                    ← Build
backend/__pycache__/     ← Cache Python
```

---

## 🔍 VÉRIFIER QUE LES SECRETS NE SONT PAS SUR GITHUB

### Vérifier que `.env` n'est pas tracké

```bash
# Vérifier que .env est ignoré
git check-ignore .env
git check-ignore backend/.env

# Résultat attendu:
# .env
# backend/.env
```

### Vérifier que les secrets ne sont pas dans l'historique

```bash
# Chercher les secrets dans l'historique
git log -p | grep -i "password\|secret\|token"

# Résultat attendu: (rien)
```

### Vérifier sur GitHub

1. Va sur https://github.com/EDITCHAO/bawi-studio
2. Cherche les fichiers `.env`
3. **Résultat attendu:** Pas de fichiers `.env` visibles ✅

---

## 🆘 SI LES SECRETS SONT EXPOSÉS

### Si tu as accidentellement poussé `.env`

```bash
# 1. Retirer du tracking
git rm --cached .env backend/.env

# 2. Ajouter à .gitignore
echo ".env" >> .gitignore
echo "backend/.env" >> .gitignore

# 3. Commit
git commit -m "Remove .env files from tracking"

# 4. Pousser
git push origin main

# 5. IMPORTANT: Changer les secrets!
# - Générer une nouvelle JWT_SECRET_KEY
# - Changer le mot de passe admin
# - Mettre à jour sur Railway et Vercel
```

### Si quelqu'un a vu tes secrets

1. **Changer immédiatement:**
   - JWT_SECRET_KEY
   - Mot de passe admin
   - Credentials MySQL

2. **Mettre à jour:**
   - Railway
   - Vercel
   - Ton ordinateur

3. **Vérifier:**
   - Pas d'accès non autorisé
   - Logs du backend
   - Logs de Railway

---

## 📝 BONNES PRATIQUES

### ✅ À FAIRE
- ✅ Garder `.env` local seulement
- ✅ Utiliser `.env.example` sur GitHub
- ✅ Générer des clés sécurisées (min 32 caractères)
- ✅ Changer les secrets régulièrement
- ✅ Utiliser des variables d'environnement sur les plateformes
- ✅ Vérifier `.gitignore` avant de pousser

### ❌ À NE PAS FAIRE
- ❌ Pousser `.env` sur GitHub
- ❌ Commiter les secrets
- ❌ Partager les secrets par email
- ❌ Utiliser des mots de passe faibles
- ❌ Réutiliser les mêmes secrets partout
- ❌ Laisser les secrets dans le code

---

## 🔐 SECRETS ACTUELS

### Frontend
```env
VITE_API_URL=https://bawi-api.up.railway.app
```
**Sécurité:** ✅ Pas de secret

### Backend
```env
JWT_SECRET_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
ADMIN_USERNAME=euloge
ADMIN_PASSWORD=20-86
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=bawi_studio
```
**Sécurité:** ✅ Fichier ignoré par Git

---

## 📚 FICHIERS IMPORTANTS

| Fichier | Contenu | Sur GitHub |
|---------|---------|-----------|
| `.env` | Secrets frontend | ❌ Non |
| `.env.example` | Exemple frontend | ✅ Oui |
| `backend/.env` | Secrets backend | ❌ Non |
| `backend/.env.example` | Exemple backend | ✅ Oui |
| `.gitignore` | Fichiers ignorés | ✅ Oui |

---

## ✅ CHECKLIST SÉCURITÉ

- [ ] `.env` créé localement (pas sur GitHub)
- [ ] `backend/.env` créé localement (pas sur GitHub)
- [ ] `.env.example` sur GitHub (sans secrets)
- [ ] `backend/.env.example` sur GitHub (sans secrets)
- [ ] `.gitignore` contient `.env`
- [ ] JWT_SECRET_KEY généré (min 32 caractères)
- [ ] Mot de passe admin changé
- [ ] Variables configurées sur Vercel
- [ ] Variables configurées sur Railway
- [ ] Pas de secrets dans l'historique Git

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
.gitignore             ← Fichiers ignorés
```

### Fichiers Plateformes (Vercel/Railway)
```
Variables d'environnement configurées
```

**Résultat:** Tes secrets sont sécurisés! 🔐

---

**Version:** 1.0  
**Date:** 27 mars 2026  
**Status:** ✅ SÉCURISÉ

