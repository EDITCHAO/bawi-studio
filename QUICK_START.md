# 🚀 Quick Start - BAWI-STUDIO

## Installation Rapide

### Option 1: Script Automatique (Recommandé)

**Windows:**
```bash
install.bat
```

**Linux/Mac:**
```bash
chmod +x install.sh
./install.sh
```

### Option 2: Installation Manuelle

```bash
# Frontend
cd frontend
npm install

# Backend (dans un autre terminal)
cd backend
npm install
```

## Démarrage du Projet

### Terminal 1 - Frontend
```bash
cd frontend
npm run dev
```
→ Accédez à: **http://localhost:5173**

### Terminal 2 - Backend
```bash
cd backend
npm run dev
```
→ API disponible sur: **http://localhost:5000**

## Configuration Environnement

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000
```

### Backend (`backend/.env`)
```env
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
JWT_SECRET=your_jwt_secret
```

## Vérification

- [ ] Frontend charge sur http://localhost:5173
- [ ] Backend répond sur http://localhost:5000/api/health
- [ ] Pas d'erreurs dans la console
- [ ] Formulaire de contact fonctionne

## Commandes Utiles

### Frontend
```bash
cd frontend

# Développement
npm run dev

# Build production
npm run build

# Prévisualiser le build
npm run preview
```

### Backend
```bash
cd backend

# Développement (avec auto-reload)
npm run dev

# Production
npm start
```

## Structure Rapide

```
bawi-studio/
├── frontend/          # React + Vite
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/           # Express + Supabase
│   ├── server.js
│   └── package.json
└── .gitignore
```

## Dépannage

### Port déjà utilisé
```bash
# Frontend (changer le port)
cd frontend && npm run dev -- --port 3000

# Backend (changer le port dans .env)
PORT=3001 npm run dev
```

### Erreur de dépendances
```bash
# Supprimer node_modules et réinstaller
rm -rf frontend/node_modules backend/node_modules
npm install  # dans chaque dossier
```

### Erreur CORS
Vérifier que `VITE_API_URL` dans `frontend/.env` pointe vers le bon backend

## Documentation Complète

- 📖 [README.md](README.md) - Vue d'ensemble
- 📁 [STRUCTURE.md](STRUCTURE.md) - Arborescence détaillée
- 🔄 [RESTRUCTURATION.md](RESTRUCTURATION.md) - Détails des changements
- ✅ [VERIFICATION_STRUCTURE.md](VERIFICATION_STRUCTURE.md) - Checklist

## Support

Pour plus d'informations, consultez la documentation dans le dossier `docs/`

---

**Bon développement!** 🎉
