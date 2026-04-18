# Bawi Studio

Portfolio et plateforme de gestion de projets pour Bawi Studio.

## Architecture

- **Frontend**: React + Vite (déployé sur Vercel)
- **Backend**: Node.js + Express (déployé sur Render)
- **Base de données**: Supabase PostgreSQL
- **Stockage**: Supabase Storage

## Déploiement

### Frontend (Vercel)

1. Connecter le repo GitHub à Vercel
2. Configurer les variables d'environnement
3. Vercel déploiera automatiquement à chaque push sur main

### Backend (Render)

1. Créer un nouveau Web Service sur Render
2. Connecter le repo GitHub
3. Configurer les variables d'environnement

## Développement local

```bash
# Frontend
npm install
npm run dev

# Backend
cd backend
npm install
npm run dev
```

## Scripts disponibles

### Frontend
- `npm run dev` - Démarrer le serveur de développement
- `npm run build` - Build pour la production
- `npm run preview` - Prévisualiser le build

### Backend
- `npm start` - Démarrer le serveur
- `npm run dev` - Démarrer en mode watch
