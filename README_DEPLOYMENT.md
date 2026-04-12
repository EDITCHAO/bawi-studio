# Guide de Déploiement - Bawi Studio

Ce guide explique comment déployer Bawi Studio sur GitHub, Vercel (frontend) et Render (backend).

## 📋 Prérequis

- Compte GitHub
- Compte Vercel
- Compte Render
- Compte Supabase
- Git installé localement

## 🚀 Étape 1: Préparer le code pour GitHub

### 1.1 Initialiser le repository Git (si pas déjà fait)

```bash
git init
git add .
git commit -m "Initial commit: Bawi Studio project"
```

### 1.2 Créer un repository sur GitHub

1. Va sur https://github.com/new
2. Crée un nouveau repository: `bawi-studio`
3. Ne sélectionne pas "Initialize with README" (on a déjà un repo local)

### 1.3 Pousser le code vers GitHub

```bash
git remote add origin https://github.com/[TON_USERNAME]/bawi-studio.git
git branch -M main
git push -u origin main
```

## 🌐 Étape 2: Déployer le Frontend sur Vercel

### 2.1 Connecter Vercel à GitHub

1. Va sur https://vercel.com
2. Clique sur "New Project"
3. Sélectionne "Import Git Repository"
4. Connecte ton compte GitHub
5. Sélectionne le repository `bawi-studio`

### 2.2 Configurer les variables d'environnement

1. Dans Vercel, va à "Settings" → "Environment Variables"
2. Ajoute:
   - **Nom**: `VITE_API_URL`
   - **Valeur**: `https://bawi-studio-backend.onrender.com` (ou l'URL de ton backend Render)

### 2.3 Configurer le build

1. **Framework Preset**: Vite
2. **Build Command**: `npm run build`
3. **Output Directory**: `dist`
4. **Install Command**: `npm install`

### 2.4 Déployer

Clique sur "Deploy" et attends que le déploiement se termine.

**URL du frontend**: `https://bawi-studio.vercel.app` (ou ton domaine personnalisé)

## 🔧 Étape 3: Déployer le Backend sur Render

### 3.1 Créer un service Web sur Render

1. Va sur https://render.com
2. Clique sur "New +" → "Web Service"
3. Sélectionne "Deploy an existing repository"
4. Connecte ton compte GitHub
5. Sélectionne le repository `bawi-studio`

### 3.2 Configurer le service

1. **Name**: `bawi-studio-backend`
2. **Environment**: `Node`
3. **Build Command**: `cd backend && npm install`
4. **Start Command**: `cd backend && npm start`
5. **Root Directory**: `.` (racine du projet)

### 3.3 Ajouter les variables d'environnement

Va à "Environment" et ajoute:

```
SUPABASE_URL=https://scivnqshdsgrmikwzsed.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
JWT_SECRET=bawi_studio_secret_key_2024_ultra_secure_change_this
PORT=5000
```

### 3.4 Déployer

Clique sur "Create Web Service" et attends le déploiement.

**URL du backend**: `https://bawi-studio-backend.onrender.com`

## 🔄 Étape 4: Mettre à jour les URLs

### 4.1 Mettre à jour le frontend

1. Va dans `src/config.js`
2. Change `API_URL` pour utiliser l'URL de production:

```javascript
export const API_URL = import.meta.env.VITE_API_URL || 'https://bawi-studio-backend.onrender.com';
```

### 4.2 Mettre à jour CORS dans le backend

1. Va dans `backend/server.js`
2. Ajoute l'URL de Vercel à la liste CORS:

```javascript
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://bawi-studio.vercel.app',
    'https://www.bawi-studio.com',
    'https://bawi-studio.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
```

## 📝 Étape 5: Mettre à jour après chaque changement

### Pour mettre à jour le code:

```bash
# Faire les changements localement
git add .
git commit -m "Description des changements"
git push origin main
```

Vercel et Render vont automatiquement redéployer!

## 🔐 Sécurité

### Variables sensibles à ne JAMAIS commiter:

- `.env` (fichier local)
- `backend/.env` (fichier local)
- Clés API
- Tokens JWT

Ces fichiers sont dans `.gitignore` et ne seront pas poussés vers GitHub.

### Utiliser `.env.example`:

Utilise `.env.example` pour montrer quelles variables sont nécessaires sans révéler les valeurs réelles.

## 🧪 Tester après le déploiement

1. **Frontend**: Va sur https://bawi-studio.vercel.app
2. **Backend**: Va sur https://bawi-studio-backend.onrender.com/api/health
3. **Admin**: Va sur https://bawi-studio.vercel.app/admin et teste le login

## 📞 Dépannage

### Le frontend ne peut pas se connecter au backend

- Vérifie que `VITE_API_URL` est correctement défini dans Vercel
- Vérifie que le backend est en ligne sur Render
- Vérifie les logs du backend sur Render

### Le backend ne démarre pas

- Vérifie les variables d'environnement sur Render
- Vérifie les logs de build sur Render
- Assure-toi que `npm start` fonctionne localement

### Les images ne s'affichent pas

- Vérifie que Supabase Storage est configuré correctement
- Vérifie que les URLs des images sont correctes
- Vérifie les politiques RLS de Supabase

## 🎉 Félicitations!

Ton site est maintenant en production! 🚀

Pour plus d'aide:
- Vercel: https://vercel.com/docs
- Render: https://render.com/docs
- Supabase: https://supabase.com/docs
