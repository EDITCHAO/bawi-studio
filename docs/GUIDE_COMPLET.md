# 📚 GUIDE COMPLET - BAWI-STUDIO

## 🚀 Démarrage Rapide

### Lancer le projet
```bash
# Terminal 1 - Backend
cd backend
python app.py

# Terminal 2 - Frontend
npm run dev
```

### Accès
- **Site:** http://localhost:5173
- **Dashboard Admin:** http://localhost:5173/admin/dashboard
- **Identifiants:** euloge / 20-86

---

## 📊 DASHBOARD ADMIN

### 5 Sections Principales

1. **Vue d'ensemble** - Statistiques globales
2. **Messages Clients** - Entreprises, Particuliers, ONG (sans étudiants)
3. **Messages Étudiants** - Projets académiques séparés
4. **Messages Acceptés** - Projets validés
5. **Corbeille** - Messages supprimés (récupérables)

### Fonctionnalités

#### 🔍 Recherche et Filtres
- Barre de recherche par nom/email
- Filtre par statut (Nouveau, Lu, En cours, Terminé, Archivé)
- Compteurs en temps réel

#### 🎯 Actions sur les Messages
- **✓ Accepter** (vert) - Déplace vers Messages Acceptés
- **👁️ Voir** (bleu) - Ouvre modal avec détails complets
- **🗑️ Supprimer** (rouge) - Déplace vers Corbeille

#### 📝 Gestion des Statuts
Menu déroulant pour changer le statut:
- Nouveau → Lu → En cours → Terminé → Archivé

#### 🗑️ Corbeille
- Restaurer les messages supprimés
- Supprimer définitivement
- Vider la corbeille complètement

---

## 🔄 WORKFLOWS

### Traiter un nouveau message client
1. Filtre par "Nouveau"
2. Clique sur "Voir détails"
3. Lis le message complet
4. Change le statut en "Lu"
5. Si accepté: clique sur "Accepter" → va dans Messages Acceptés
6. Si refusé: clique sur "Supprimer" → va dans Corbeille

### Récupérer un message supprimé
1. Va dans "Corbeille"
2. Trouve le message
3. Clique sur "Restaurer"
4. Le message retourne dans sa section d'origine

---

## 💾 BASE DE DONNÉES

### Tables SQLite
- `admins` - Comptes administrateurs
- `client_messages` - Messages clients et étudiants
- `general_messages` - Messages acceptés
- `deleted_messages` - Corbeille
- `statistics` - Statistiques
- `admin_logs` - Logs d'activité

### Scripts Utiles
```bash
cd backend

# Vérifier la base de données
python check_database.py

# Ajouter des données de test
python add_test_data.py
```

---

## 🎨 INTERFACE

### Couleurs des Statuts
- **Nouveau** - Bleu (#60a5fa)
- **Lu** - Violet (#c084fc)
- **En cours** - Orange (#fbbf24)
- **Terminé** - Vert (#34d399)
- **Archivé** - Gris (#94a3b8)

### Boutons d'Action
- **Accepter** - Vert (#10b981)
- **Voir** - Bleu (#667eea)
- **Supprimer** - Rouge (#ef4444)
- **Restaurer** - Bleu (#667eea)

---

## 📞 CONTACT

- **Email:** editchaosam@gmail.com
- **Téléphone:** +228 99 25 38 43
- **WhatsApp:** +228 99 25 38 43
- **Localisation:** Lomé, Togo

---

## 🐛 DÉPANNAGE

### Dashboard vide
1. Appuie sur F5
2. Clique sur "Actualiser"
3. Vérifie que le backend tourne
4. Exécute `python check_database.py`

### Backend ne démarre pas
```bash
cd backend
pip install -r requirements.txt
python app.py
```

### Erreur de connexion
- Vérifie que les deux serveurs tournent
- Backend: http://localhost:5000
- Frontend: http://localhost:5173

---

**Projet réalisé avec succès! 🎉**
