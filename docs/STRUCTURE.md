# 📁 Structure du Projet BAWI-STUDIO

## 🗂️ Organisation

```
bawi-studio/
├── docs/                          # Documentation
│   ├── GUIDE_COMPLET.md          # Guide utilisateur complet
│   └── STRUCTURE.md              # Ce fichier
│
├── backend/                       # API Flask
│   ├── app.py                    # Routes API
│   ├── database.py               # Configuration SQLite
│   ├── requirements.txt          # Dépendances Python
│   ├── .env                      # Variables d'environnement
│   ├── bawi_studio.db           # Base de données SQLite
│   ├── check_database.py        # Script de vérification
│   ├── add_test_data.py         # Script de données de test
│   └── add_trash_table.py       # Script table corbeille
│
├── src/                          # Code source React
│   ├── components/              # Composants du site
│   │   ├── Header.jsx
│   │   ├── Hero.jsx
│   │   ├── Services.jsx
│   │   ├── AcademicSection.jsx
│   │   ├── Portfolio.jsx
│   │   ├── About.jsx
│   │   ├── Testimonials.jsx
│   │   ├── Contact.jsx
│   │   ├── Footer.jsx
│   │   └── WhatsAppButton.jsx
│   │
│   ├── pages/                   # Pages admin
│   │   ├── AdminLogin.jsx
│   │   ├── AdminLogin.css
│   │   ├── AdminDashboard.jsx
│   │   └── AdminDashboard.css
│   │
│   ├── context/                 # Context API
│   │   └── LanguageContext.jsx
│   │
│   ├── translations.js          # Traductions FR/EN
│   ├── App.jsx                  # Composant principal
│   ├── main.jsx                 # Point d'entrée
│   └── index.css                # Styles globaux
│
├── public/                       # Fichiers statiques
├── node_modules/                # Dépendances npm
├── package.json                 # Configuration npm
├── vite.config.js              # Configuration Vite
├── index.html                   # HTML principal
├── .gitignore                   # Fichiers ignorés par Git
└── README.md                    # Documentation principale
```

## 📊 Base de Données

### Tables SQLite (bawi_studio.db)

1. **admins** - Comptes administrateurs
2. **client_messages** - Messages clients et étudiants
3. **general_messages** - Messages acceptés
4. **deleted_messages** - Corbeille
5. **statistics** - Statistiques quotidiennes
6. **admin_logs** - Logs d'activité

## 🎯 Points d'Entrée

- **Site public:** `src/App.jsx`
- **Dashboard admin:** `src/pages/AdminDashboard.jsx`
- **API backend:** `backend/app.py`
- **Base de données:** `backend/database.py`

## 📝 Fichiers de Configuration

- `package.json` - Dépendances et scripts npm
- `vite.config.js` - Configuration Vite
- `backend/requirements.txt` - Dépendances Python
- `backend/.env` - Variables d'environnement backend
- `.gitignore` - Fichiers ignorés par Git

## 🔧 Scripts Utiles

### Frontend
```bash
npm run dev      # Développement
npm run build    # Production
npm run preview  # Prévisualiser le build
```

### Backend
```bash
python app.py                # Démarrer l'API
python check_database.py     # Vérifier la DB
python add_test_data.py      # Ajouter des données
```

## 📦 Dépendances Principales

### Frontend
- React 18
- React Router DOM
- Vite
- Zod
- Font Awesome

### Backend
- Flask
- Flask-CORS
- Flask-JWT-Extended
- bcrypt
- SQLite3

---

**Structure optimisée et documentée! 📁**
