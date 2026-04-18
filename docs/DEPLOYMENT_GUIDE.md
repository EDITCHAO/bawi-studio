# Guide de Déploiement - Bawi Studio

## Prérequis

- Compte GitHub avec le repo
- Compte Vercel (pour le frontend)
- Compte Render (pour le backend)
- Compte Supabase (base de données)

## Étape 1: Préparer Supabase

1. Créer un projet Supabase
2. Récupérer les clés d'accès
3. Créer les tables nécessaires

## Étape 2: Déployer le Backend sur Render

1. Aller sur render.com
2. Créer un Web Service
3. Connecter le repo GitHub
4. Configurer les variables d'environnement
5. Déployer

## Étape 3: Générer le hash du mot de passe admin

```bash
cd backend
node generate-hash.js
```

## Étape 4: Déployer le Frontend sur Vercel

1. Aller sur vercel.com
2. Importer le projet GitHub
3. Configurer les variables d'environnement
4. Déployer

## Étape 5: Configurer les domaines personnalisés

### Backend (Render)
1. Aller dans Settings > Custom Domain
2. Ajouter votre domaine
3. Configurer les DNS records

### Frontend (Vercel)
1. Aller dans Settings > Domains
2. Ajouter votre domaine
3. Configurer les DNS records

## Vérification du déploiement

### Backend
```bash
curl https://bawi-studio-backend.onrender.com/api/health
```

### Frontend
Accéder à l'URL Vercel dans le navigateur

## Mise à jour après déploiement

- **Frontend**: Chaque push sur `main` déclenche un redéploiement automatique sur Vercel
- **Backend**: Chaque push sur `main` déclenche un redéploiement automatique sur Render
