# Backend BAWI-STUDIO

API Flask avec SQLite pour le dashboard admin.

## Installation

```bash
pip install -r requirements.txt
```

## Démarrage

```bash
python app.py
```

API accessible sur http://localhost:5000

## Scripts Utiles

```bash
# Vérifier la base de données
python check_database.py

# Ajouter des données de test
python add_test_data.py
```

## Configuration

Fichier `.env`:
```env
JWT_SECRET_KEY=votre_cle_secrete
ADMIN_USERNAME=euloge
ADMIN_PASSWORD=20-86
```

## Base de données

SQLite embarqué - `bawi_studio.db` (créé automatiquement)

### Tables
- admins
- client_messages
- general_messages
- deleted_messages (corbeille)
- statistics
- admin_logs
