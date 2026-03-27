# 🚀 Guide de Démarrage du Backend

## Prérequis

✅ XAMPP doit être démarré (Apache + MySQL)
✅ Python 3.8+ doit être installé
✅ Les dépendances Python doivent être installées

## Installation des dépendances

```bash
pip install -r requirements.txt
```

## Démarrage du Backend

### Option 1: Avec Python (Recommandé)

```bash
python run_backend.py
```

### Option 2: Avec le script batch (Windows)

Double-cliquez sur `start_backend.bat`

### Option 3: Avec PowerShell (Windows)

```powershell
.\start_backend.ps1
```

## Vérification

Le backend devrait afficher:

```
======================================================================
🚀 DÉMARRAGE DU BACKEND - BAWI STUDIO
======================================================================

📍 Backend disponible sur:
   → http://localhost:5000
   → http://127.0.0.1:5000
   → http://192.168.1.81:5000

📋 Routes disponibles:
   → POST /api/contact
   → POST /api/admin/login
   → GET  /api/admin/stats
   → GET  /api/admin/client-messages
   → GET  /api/admin/general-messages

⚠️  Pour arrêter: Ctrl+C
======================================================================

🔄 Démarrage du serveur Flask...
 * Running on http://0.0.0.0:5000
```

## Dépannage

### Erreur: "Port 5000 already in use"

Le port 5000 est déjà utilisé. Tuez le processus:

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :5000
kill -9 <PID>
```

### Erreur: "Erreur de connexion à la base de données"

1. Vérifiez que XAMPP est démarré
2. Vérifiez que MySQL est en cours d'exécution
3. Vérifiez que la base `bawi_studio` existe
4. Vérifiez les identifiants dans `.env`

### Erreur: "ModuleNotFoundError"

Installez les dépendances:

```bash
pip install -r requirements.txt
```

## Accès au Backend

Une fois démarré, le backend est accessible sur:

- **Local**: http://localhost:5000
- **Réseau**: http://192.168.1.81:5000

## Endpoints disponibles

### Authentification
- `POST /api/admin/login` - Connexion admin

### Messages Clients
- `GET /api/admin/client-messages` - Lister les messages clients
- `PUT /api/admin/client-messages/<id>` - Mettre à jour un message
- `DELETE /api/admin/client-messages/<id>` - Supprimer un message

### Messages Généraux
- `GET /api/admin/general-messages` - Lister les messages acceptés
- `PUT /api/admin/general-messages/<id>` - Mettre à jour un message
- `DELETE /api/admin/general-messages/<id>` - Supprimer un message

### Corbeille
- `GET /api/admin/trash` - Lister les messages supprimés
- `POST /api/admin/trash/<id>/restore` - Restaurer un message
- `DELETE /api/admin/trash/<id>` - Supprimer définitivement

### Statistiques
- `GET /api/admin/stats` - Obtenir les statistiques

### Contact (Public)
- `POST /api/contact` - Soumettre un message de contact
