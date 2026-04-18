# Structure du Projet - Bawi Studio

## Vue d'ensemble

```
bawi-studio/
├── src/                          # Code source frontend
├── backend/                       # Code source backend
│   ├── server.js
│   ├── package.json
│   ├── generate-hash.js
│   ├── Procfile
│   ├── render.yaml
│   └── supabase-setup.sql
├── public/                        # Assets statiques
├── Configuration
│   ├── .env.example
│   ├── .gitignore
│   ├── vercel.json
│   └── package.json
└── Documentation
    ├── README.md
    ├── DEPLOYMENT_GUIDE.md
    └── ...
```

## Frontend (React + Vite)

### Composants principaux
- Header
- Hero
- Services
- Portfolio
- About
- Contact
- Footer

### Pages
- AdminLogin
- AdminDashboard
- PortfolioManager

## Backend (Node.js + Express)

### Endpoints principaux

#### Public
- `GET /api/health` - Vérification du serveur
- `GET /api/portfolios` - Liste des portfolios
- `POST /api/contact` - Soumettre un message de contact

#### Admin (authentifiés)
- `POST /api/admin/login` - Connexion admin
- `GET /api/admin/stats` - Statistiques
- `GET /api/admin/client-messages` - Liste des messages
- `GET /api/admin/portfolios` - Liste des portfolios (admin)
- `POST /api/admin/portfolios` - Créer un portfolio
- `PUT /api/admin/portfolios/:id` - Mettre à jour un portfolio
- `DELETE /api/admin/portfolios/:id` - Supprimer un portfolio

## Technologies utilisées

### Frontend
- React 18
- Vite
- React Router
- Supabase JS Client

### Backend
- Node.js
- Express
- Supabase
- JWT
- bcryptjs

### Infrastructure
- Vercel (Frontend)
- Render (Backend)
- Supabase (Database + Storage)
