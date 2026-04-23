# Structure du Projet BAWI-STUDIO

## 📁 Arborescence Complète

```
bawi-studio/
│
├── 📂 frontend/                          # Application React (Vite)
│   ├── 📂 src/
│   │   ├── 📂 components/               # Composants React réutilisables
│   │   │   ├── About.jsx / About.css
│   │   │   ├── AcademicSection.jsx / AcademicSection.css
│   │   │   ├── Contact.jsx / Contact.css
│   │   │   ├── Footer.jsx / Footer.css
│   │   │   ├── Header.jsx / Header.css
│   │   │   ├── Hero.jsx / Hero.css
│   │   │   ├── ImageModal.jsx / ImageModal.css
│   │   │   ├── Portfolio.jsx / Portfolio.css
│   │   │   ├── Services.jsx / Services.css
│   │   │   ├── Testimonials.jsx / Testimonials.css
│   │   │   ├── WhatsAppButton.jsx / WhatsAppButton.css
│   │   │   └── WhyUs.jsx / WhyUs.css
│   │   │
│   │   ├── 📂 pages/                   # Pages principales
│   │   │   ├── AdminLogin.jsx / AdminLogin.css
│   │   │   ├── AdminDashboard.jsx / AdminDashboard.css
│   │   │   └── PortfolioManager.jsx / PortfolioManager.css
│   │   │
│   │   ├── 📂 context/                 # Context API
│   │   │   └── LanguageContext.jsx     # Gestion de la langue (FR/EN)
│   │   │
│   │   ├── 📂 data/                    # Données statiques
│   │   │   └── countryCodes.js         # Codes pays pour formulaires
│   │   │
│   │   ├── App.jsx                     # Composant principal
│   │   ├── main.jsx                    # Point d'entrée React
│   │   ├── index.css                   # Styles globaux
│   │   ├── config.js                   # Configuration API
│   │   └── translations.js             # Traductions FR/EN
│   │
│   ├── 📂 public/                      # Fichiers statiques
│   │   ├── 📂 images/                  # Images du portfolio
│   │   ├── favicon.svg
│   │   ├── manifest.json
│   │   ├── service-worker.js
│   │   └── logo-instructions.txt
│   │
│   ├── package.json                    # Dépendances frontend
│   ├── vite.config.js                  # Configuration Vite
│   ├── index.html                      # HTML principal
│   ├── vercel.json                     # Configuration Vercel
│   ├── .env.example                    # Variables d'environnement exemple
│   └── .gitignore                      # Fichiers à ignorer
│
├── 📂 backend/                          # API Node.js/Express
│   ├── server.js                       # Serveur Express
│   ├── package.json                    # Dépendances backend
│   ├── .env                            # Variables d'environnement (production)
│   ├── .env.example                    # Variables d'environnement exemple
│   ├── generate-hash.js                # Utilitaire pour hasher les mots de passe
│   ├── Procfile                        # Configuration Heroku
│   ├── render.yaml                     # Configuration Render
│   └── supabase-setup.sql              # Script de configuration Supabase
│
├── 📂 docs/                             # Documentation
│   ├── START_HERE.md                   # Point de départ
│   ├── API_DOCUMENTATION.md            # Documentation API
│   ├── DEPLOYMENT_GUIDE.md             # Guide de déploiement
│   ├── ENVIRONMENT_SETUP.md            # Configuration environnement
│   └── ... (autres fichiers de doc)
│
├── 📂 .git/                             # Historique Git
├── 📂 dist/                             # Build frontend (généré)
│
├── .gitignore                           # Fichiers à ignorer (racine)
├── README.md                            # Documentation principale
├── RESTRUCTURATION.md                   # Détails de la restructuration
├── STRUCTURE.md                         # Ce fichier
├── install.bat                          # Script installation Windows
├── install.sh                           # Script installation Linux/Mac
├── LICENSE                              # Licence du projet
└── render.env.example                   # Variables Render exemple
```

## 🎯 Points Clés

### Frontend (`frontend/`)
- **Framework**: React 18 + Vite
- **Routing**: React Router v6
- **Styles**: CSS pur (pas de framework CSS)
- **Multilingue**: Français et Anglais
- **Déploiement**: Vercel, Netlify

### Backend (`backend/`)
- **Framework**: Express.js
- **Base de données**: Supabase (PostgreSQL)
- **Authentification**: JWT
- **Déploiement**: Render, Heroku

### Configuration
- **`.env` uniquement dans `backend/`** ✅
- **`.gitignore` à la racine** ✅
- **`package.json` séparé par dossier** ✅
- **`node_modules/` ignoré pour les deux** ✅

## 🚀 Commandes Utiles

### Installation
```bash
# Installation complète
./install.sh          # Linux/Mac
install.bat           # Windows

# Ou manuellement
cd frontend && npm install
cd ../backend && npm install
```

### Développement
```bash
# Frontend
cd frontend && npm run dev

# Backend
cd backend && npm run dev
```

### Build
```bash
# Frontend
cd frontend && npm run build

# Backend (pas de build nécessaire)
```

## 📝 Variables d'Environnement

### Frontend (`frontend/.env`)
```
VITE_API_URL=http://localhost:5000
```

### Backend (`backend/.env`)
```
PORT=5000
SUPABASE_URL=...
SUPABASE_KEY=...
JWT_SECRET=...
```

## 🔄 Flux de Développement

1. **Frontend** → Vite dev server sur `http://localhost:5173`
2. **Backend** → Express server sur `http://localhost:5000`
3. **API** → Appels depuis frontend vers backend
4. **Base de données** → Supabase (cloud)

## 📦 Dépendances Principales

### Frontend
- react@18.3.1
- react-dom@18.3.1
- react-router-dom@6.20.0
- @supabase/supabase-js@2.103.0
- vite@5.0.0

### Backend
- express@4.18.2
- @supabase/supabase-js@2.38.4
- jsonwebtoken@9.0.0
- bcryptjs@2.4.3
- cors@2.8.5

## ✅ Checklist de Configuration

- [ ] Cloner le repository
- [ ] Exécuter `./install.sh` ou `install.bat`
- [ ] Configurer `backend/.env`
- [ ] Configurer `frontend/.env`
- [ ] Démarrer le backend: `cd backend && npm run dev`
- [ ] Démarrer le frontend: `cd frontend && npm run dev`
- [ ] Vérifier que l'API répond: `http://localhost:5000/api/health`
- [ ] Vérifier que le frontend charge: `http://localhost:5173`
