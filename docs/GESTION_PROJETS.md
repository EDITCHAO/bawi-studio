# 📋 Guide de Gestion des Projets

## 🎯 Vue d'ensemble

La section "Projets" du dashboard permet de gérer votre portfolio de réalisations. Vous pouvez ajouter, modifier, supprimer et organiser vos projets.

---

## 🚀 Démarrage

### 1. Créer la Table des Projets

Avant de commencer, exécutez le script de création de la table:

```bash
cd backend
python create_projects_table.py
```

Vous devriez voir:
```
✅ Table 'projects' créée avec succès!
✅ Projets d'exemple ajoutés!
```

### 2. Accéder à la Section Projets

1. Connectez-vous au dashboard admin
2. Cliquez sur "Projets" dans le menu latéral
3. Vous verrez la liste de vos projets

---

## ➕ Ajouter un Nouveau Projet

### Étapes

1. Cliquez sur le bouton **"+ Nouveau Projet"**
2. Remplissez le formulaire:
   - **Titre** (obligatoire): Nom du projet
   - **Description**: Détails du projet
   - **Catégorie**: Type de projet (Site Vitrine, E-commerce, etc.)
   - **Nom du Client**: Qui a commandé le projet
   - **URL de l'Image**: Lien vers l'image du projet
   - **URL du Projet**: Lien vers le projet en ligne
   - **Technologies**: Langages/frameworks utilisés
   - **Statut**: Brouillon, Publié ou Archivé
   - **Ordre d'Affichage**: Position dans la liste (0 = premier)
   - **Mettre en avant**: Cocher pour le marquer comme vedette

3. Cliquez sur **"Créer"**

### Exemple

```
Titre: Site Vitrine - Agence XYZ
Description: Un site vitrine moderne et responsive pour une agence de marketing
Catégorie: Site Vitrine
Nom du Client: Agence XYZ
URL de l'Image: https://example.com/images/project1.jpg
URL du Projet: https://agencexyz.com
Technologies: React, Tailwind CSS, Node.js
Statut: Publié
Ordre: 1
Vedette: ✓ Coché
```

---

## ✏️ Modifier un Projet

### Étapes

1. Trouvez le projet dans la liste
2. Cliquez sur le bouton **"Modifier"**
3. Modifiez les informations
4. Cliquez sur **"Mettre à jour"**

---

## 🗑️ Supprimer un Projet

### Étapes

1. Trouvez le projet dans la liste
2. Cliquez sur le bouton **"Supprimer"**
3. Confirmez la suppression

⚠️ **Attention**: Cette action est irréversible!

---

## 📊 Structure des Données

### Champs du Projet

| Champ | Type | Description |
|-------|------|-------------|
| `id` | INT | Identifiant unique |
| `title` | VARCHAR(255) | Titre du projet |
| `description` | LONGTEXT | Description détaillée |
| `category` | VARCHAR(100) | Catégorie (Site Vitrine, E-commerce, etc.) |
| `client_name` | VARCHAR(255) | Nom du client |
| `image_url` | VARCHAR(500) | URL de l'image du projet |
| `project_url` | VARCHAR(500) | URL du projet en ligne |
| `technologies` | VARCHAR(500) | Technologies utilisées |
| `status` | ENUM | draft, published, archived |
| `featured` | BOOLEAN | Projet vedette (oui/non) |
| `order_index` | INT | Ordre d'affichage |
| `created_at` | TIMESTAMP | Date de création |
| `updated_at` | TIMESTAMP | Date de modification |

---

## 🔌 API Endpoints

### Récupérer tous les projets

```
GET /api/admin/projects
```

**Réponse:**
```json
[
  {
    "id": 1,
    "title": "Site Vitrine",
    "description": "Un site vitrine moderne...",
    "category": "Site Vitrine",
    "client_name": "Client 1",
    "image_url": "https://...",
    "project_url": "https://...",
    "technologies": "React, CSS",
    "status": "published",
    "featured": true,
    "order_index": 1,
    "created_at": "2024-03-25T10:00:00",
    "updated_at": "2024-03-25T10:00:00"
  }
]
```

### Créer un projet

```
POST /api/admin/projects
Content-Type: application/json

{
  "title": "Nouveau Projet",
  "description": "Description...",
  "category": "Site Vitrine",
  "client_name": "Client",
  "image_url": "https://...",
  "project_url": "https://...",
  "technologies": "React, Node.js",
  "status": "draft",
  "featured": false,
  "order_index": 0
}
```

### Récupérer un projet

```
GET /api/admin/projects/{id}
```

### Mettre à jour un projet

```
PUT /api/admin/projects/{id}
Content-Type: application/json

{
  "title": "Titre modifié",
  "description": "Description modifiée...",
  ...
}
```

### Supprimer un projet

```
DELETE /api/admin/projects/{id}
```

---

## 💡 Bonnes Pratiques

### Images

- ✅ Utilisez des images de haute qualité (au moins 800x600px)
- ✅ Optimisez les images pour le web (< 500KB)
- ✅ Utilisez des formats modernes (WebP, JPEG)
- ❌ Évitez les images trop grandes

### Descriptions

- ✅ Soyez descriptif et clair
- ✅ Mentionnez les défis et solutions
- ✅ Incluez les résultats/impact
- ❌ Évitez les descriptions trop longues

### Technologies

- ✅ Listez les technologies principales
- ✅ Séparez par des virgules
- ✅ Soyez spécifique (React 18, Node.js 18, etc.)
- ❌ N'incluez pas les outils mineurs

### Ordre d'Affichage

- 0 = Premier projet
- 1 = Deuxième projet
- etc.

Les projets avec le même ordre sont triés par date de création (plus récent en premier).

---

## 🎨 Statuts

### Brouillon (draft)
- Projet en cours de création
- Non visible sur le site public
- Peut être modifié librement

### Publié (published)
- Projet visible sur le site public
- Affiché dans le portfolio
- Peut être modifié

### Archivé (archived)
- Projet ancien ou inactif
- Non visible sur le site public
- Conservé pour l'historique

---

## ⭐ Projets Vedettes

Les projets marqués comme "vedette" sont:
- Affichés en premier
- Mis en avant sur le site
- Utilisés dans les sections spéciales

**Conseil**: Marquez vos meilleurs projets comme vedettes!

---

## 📱 Affichage Responsive

La grille des projets s'adapte à tous les écrans:

- **Desktop**: 3-4 projets par ligne
- **Tablette**: 2 projets par ligne
- **Mobile**: 1 projet par ligne

---

## 🔍 Filtrage et Recherche

Actuellement, les projets sont affichés dans l'ordre d'affichage. 

**Prochaines améliorations:**
- Filtrer par catégorie
- Filtrer par statut
- Rechercher par titre
- Trier par date

---

## 🐛 Dépannage

### Le bouton "Nouveau Projet" n'apparaît pas

- Vérifiez que vous êtes connecté
- Vérifiez que vous êtes sur l'onglet "Projets"
- Rafraîchissez la page

### Les projets ne s'affichent pas

- Vérifiez que la table a été créée: `python create_projects_table.py`
- Vérifiez que le backend est en cours d'exécution
- Vérifiez la console du navigateur pour les erreurs

### Les images ne s'affichent pas

- Vérifiez que l'URL est correcte
- Vérifiez que l'image est accessible publiquement
- Essayez une autre URL

### Erreur lors de la sauvegarde

- Vérifiez que tous les champs obligatoires sont remplis
- Vérifiez que le backend est en cours d'exécution
- Vérifiez la console du navigateur pour les erreurs

---

## 📚 Exemples de Projets

### Site Vitrine

```
Titre: Site Vitrine - Boutique Artisanale
Description: Un site vitrine élégant pour une boutique artisanale locale. 
             Présentation des produits, galerie photos, formulaire de contact.
Catégorie: Site Vitrine
Client: Boutique Artisanale "Les Créations"
Technologies: React, Tailwind CSS, Framer Motion
Statut: Publié
Vedette: Oui
```

### E-commerce

```
Titre: Plateforme E-commerce - Mode
Description: Plateforme e-commerce complète pour une marque de mode.
             Catalogue produits, panier, paiement, gestion des commandes.
Catégorie: E-commerce
Client: Marque de Mode "StyleHub"
Technologies: React, Node.js, MongoDB, Stripe
Statut: Publié
Vedette: Oui
```

### Application Mobile

```
Titre: Application Mobile - Fitness
Description: Application mobile de suivi fitness avec exercices, 
             plans d'entraînement et statistiques.
Catégorie: Application Mobile
Client: Startup Fitness "FitTrack"
Technologies: React Native, Firebase, Redux
Statut: Publié
Vedette: Non
```

---

## 🎯 Prochaines Étapes

1. ✅ Créer la table des projets
2. ✅ Ajouter vos premiers projets
3. ⏳ Afficher les projets sur le site public
4. ⏳ Ajouter des filtres et recherche
5. ⏳ Intégrer avec le portfolio page

---

## 📞 Support

Pour toute question ou problème, consultez:
- La console du navigateur (F12)
- Les logs du backend
- La documentation de l'API

---

**Dernière mise à jour: Mars 2024**
