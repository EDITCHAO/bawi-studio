# Restructuration du Projet BAWI-STUDIO

## Résumé des Changements

Le projet a été restructuré en une architecture **monorepo** avec séparation claire entre frontend et backend.

## Nouvelle Structure

```
bawi-studio/
├── frontend/                    # Application React (Vite)
│   ├── src/
│   │   ├── components/         # 12 composants React
│   │   ├── pages/              # Pages Admin (3 fichiers)
│   │   ├── context/            # LanguageContext
│   │   ├── data/               # countryCodes.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   │   ├── config.js
│   │   └── translations.js
│   ├── public/                 # Fichiers statiques (images, favicon, etc.)
│   ├── package.json            # Dépendances frontend
│   ├── vite.config.js
│   ├── index.html
│   ├── vercel.json
│   ├── .env.example
│   └── .gitignore
│
├── backend/                    # API Node.js/Express
│   ├── server.js
│   ├── package.json            # Dépendances backend
│   ├── .env                    # Variables d'environnement (production)
│   ├── .env.example
│   ├── Procfile
│   ├── render.yaml
│   └── supabase-setup.sql
│
├── .gitignore                  # Ignore les deux node_modules/
├── README.md                   # Documentation principale
└── docs/                       # Documentation détaillée
```

## Fichiers Supprimés à la Racine

- ✅ `src/` → Déplacé vers `frontend/src/`
- ✅ `public/` → Déplacé vers `frontend/public/`
- ✅ `package.json` → Séparé en `frontend/package.json` et `backend/package.json`
- ✅ `package-lock.json` → Supprimé (chaque dossier a le sien)
- ✅ `vite.config.js` → Déplacé vers `frontend/vite.config.js`
- ✅ `index.html` → Déplacé vers `frontend/index.html`
- ✅ `vercel.json` → Déplacé vers `frontend/vercel.json`
- ✅ `.env` → Gardé uniquement dans `backend/.env`
- ✅ `.env.example` → Séparé en `frontend/.env.example` et `backend/.env.example`
- ✅ `node_modules/` → Supprimé (sera créé lors de `npm install` dans chaque dossier)

## Fichiers Conservés à la Racine

- `.gitignore` - Ignore les deux `node_modules/` et les `.env` du backend
- `README.md` - Documentation principale
- `docs/` - Documentation détaillée
- `LICENSE` - Licence du projet
- `.git/` - Historique Git

## Installation et Démarrage

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm run dev
```

## Variables d'Environnement

### Frontend (`frontend/.env`)
```
VITE_API_URL=http://localhost:5000
```

### Backend (`backend/.env`)
Voir `backend/.env.example` pour les variables requises

## Avantages de cette Structure

1. **Séparation claire** : Frontend et backend sont indépendants
2. **Déploiement flexible** : Chaque partie peut être déployée séparément
3. **Gestion des dépendances** : Chaque dossier gère ses propres dépendances
4. **Scalabilité** : Facile d'ajouter d'autres services (API, workers, etc.)
5. **Environnements** : `.env` uniquement dans backend comme demandé

## Prochaines Étapes

1. Installer les dépendances : `npm install` dans `frontend/` et `backend/`
2. Configurer les variables d'environnement
3. Tester le démarrage des deux services
4. Mettre à jour les scripts de déploiement (Vercel, Render, etc.)
