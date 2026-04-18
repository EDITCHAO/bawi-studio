# Documentation API - Bawi Studio

## Base URL

- **Développement**: `http://localhost:5000`
- **Production**: `https://bawi-studio-backend.onrender.com`

## Authentification

Les endpoints admin utilisent JWT (JSON Web Tokens).

### Obtenir un token

```bash
POST /api/admin/login
Content-Type: application/json

{
  "username": "admin",
  "password": "votre_mot_de_passe"
}
```

### Utiliser le token

Ajouter le header `Authorization` à chaque requête admin:

```bash
Authorization: Bearer <token>
```

## Endpoints publics

### Health Check

```bash
GET /api/health
```

### Soumettre un message de contact

```bash
POST /api/contact
Content-Type: multipart/form-data

Body:
- name: string (requis)
- email: string (requis)
- message: string (requis)
```

### Récupérer les portfolios

```bash
GET /api/portfolios
```

## Endpoints admin (authentifiés)

### Récupérer les statistiques

```bash
GET /api/admin/stats
Authorization: Bearer <token>
```

### Récupérer tous les messages

```bash
GET /api/admin/client-messages
Authorization: Bearer <token>
```

### Créer un portfolio

```bash
POST /api/admin/portfolios
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "title": "Nom du projet",
  "description": "Description du projet",
  "image_url": "https://...",
  "category": "web"
}
```

## Codes d'erreur

| Code | Signification |
|------|---------------|
| 200 | OK |
| 201 | Créé |
| 400 | Requête invalide |
| 401 | Non authentifié |
| 403 | Non autorisé |
| 404 | Non trouvé |
| 500 | Erreur serveur |
