# 📋 CAHIER DES CHARGES - BAWI-STUDIO

## 1. PRÉSENTATION DU PROJET

### 1.1 Contexte
 BAWI-STUDIO est une entreprise de développement web, mobile et logiciel basée à Lomé, Togo, ciblant l'Afrique de l'Ouest et au-delà.ojet consiste en la création d'un site vitrine professionnel avec un système de gestion administratif complet.

### 1.2 Objectifs
- Présenter les services de BAWI-STUDIO de manière professionnelle
- Permettre aux clients de contacter l'entreprise facilement
- Gérer les demandes clients via un dashboard administrateur
- Offrir un accompagnement spécifique aux étudiants
- Faciliter la communication via WhatsApp

### 1.3 Cible
- **Entreprises** - Sites web, e-commerce, applications métier
- **Particuliers** - Sites vitrines, portfolios, applications personnelles
- **Étudiants** - Accompagnement académique (projets de fin d'études)
- **ONG** - Plateformes web, gestion de projets humanitaires

---

## 2. SPÉCIFICATIONS FONCTIONNELLES

### 2.1 Site Public

#### 2.1.1 Page d'Accueil (One-Page)

**Header**
- Logo BAWI-STUDIO
- Navigation fixe avec ancres (Services, Portfolio, À propos, Contact)
- Sélecteur de langue FR/EN
- Bouton "Demander un devis"
- Menu hamburger responsive (mobile)
- Effet de rétrécissement au scroll

**Section Hero**
- Titre accrocheur bilingue
- Sous-titre mettant en avant l'expertise africaine
- 3 cartes flottantes animées:
  - Développement Web
  - Développement Mobile
  - Design UI/UX
- Bouton CTA vers le formulaire

**Section Services**
- 5 cartes de services avec icônes Font Awesome:
  1. Développement Web
  2. Développement Mobile
  3. Développement Logiciel
  4. Design UI/UX
  5. Accompagnement Académique
- Description courte pour chaque service
- Animations au survol

**Section Accompagnement Académique**
- Présentation dédiée aux étudiants
- Fond avec dégradé distinctif
- Exemples de projets académiques

**Section Portfolio**
- Grille de 6 projets professionnels:
  - E-Shop Afrique (E-commerce)
  - MediCare App (Mobile)
  - EduLearn Platform (Web)
  - AgriTech Dashboard
  - BankPro Mobile (Fintech)
  - RestoPro (Site Vitrine)
- Badges de technologies utilisées
- Dégradés de couleurs par projet

**Section À Propos**
- Présentation de l'entreprise
- Mission et vision
- Valeurs de l'entreprise

**Section Témoignages**
- Carrousel de témoignages clients
- Données de démonstration

**Section Contact**
- Formulaire intelligent avec validation Zod
- Champs conditionnels selon le domaine d'activité
- Informations de contact (email, téléphone, localisation)
- Liens réseaux sociaux

**Footer**
- Logo et liens rapides
- Informations de contact
- Lien admin discret (icône bouclier)
- Copyright

**Bouton WhatsApp Flottant**
- Position fixe en bas à droite
- Animation de pulsation
- Lien vers WhatsApp Business

#### 2.1.2 Formulaire de Contact

**Champs Communs**
- Nom (requis)
- Email (requis, validation)
- Contact/Téléphone (requis)
- Domaine d'activité (requis):
  - Entreprise
  - Étudiant
  - Particulier
  - ONG
- Type de projet (requis):
  - Site vitrine
  - E-commerce
  - Application mobile
  - Design UI/UX
  - Autre
- Message (requis)

**Champs Conditionnels**
- Budget estimé (désactivé pour étudiants):
  - 500-1000€
  - 1000-3000€
  - 3000-5000€
  - 5000-10000€
  - 10000+€
- Délai souhaité (désactivé pour étudiants):
  - 1-3 mois
  - 3-6 mois
  - 6+ mois

**Validation**
- Validation en temps réel avec Zod
- Messages d'erreur en français
- Confirmation d'envoi

#### 2.1.3 Système Bilingue
- Français (par défaut)
- Anglais
- Basculement instantané via Context API
- Toutes les sections traduites
- Persistance du choix de langue

---

### 2.2 Dashboard Administrateur

#### 2.2.1 Authentification

**Page de Connexion**
- Design moderne avec fond sombre
- Formulaire avec username et password
- Validation des identifiants
- Gestion des erreurs
- Lien "Retour au site"

**Identifiants par Défaut**
- Username: euloge
- Password: 20-86

**Sécurité**
- Authentification JWT (24h)
- Mots de passe hachés avec bcrypt
- Routes protégées
- Logs d'activité

#### 2.2.2 Interface Dashboard

**Sidebar (Barre Latérale)**
- Logo BAWI-STUDIO
- 5 boutons de navigation:
  1. Vue d'ensemble
  2. Messages Clients
  3. Messages Étudiants
  4. Messages Acceptés
  5. Corbeille
- Badges de notification (nouveaux messages)
- Informations admin (nom d'utilisateur)
- Bouton de déconnexion

**En-tête de Section**
- Titre de la section active
- Barre de recherche (nom/email)
- Filtre par statut
- Bouton "Actualiser"
- Bouton "Vider la corbeille" (section Corbeille)

#### 2.2.3 Section Vue d'Ensemble

**Cartes de Statistiques**
- Messages Clients (total + nouveaux)
- Messages Généraux (total + nouveaux)
- Projets En Cours
- Icônes Font Awesome colorées
- Animations au survol

**Messages Récents**
- Liste des 10 derniers messages
- Nom, domaine, type de projet
- Badges de statut colorés
- Date de réception

#### 2.2.4 Section Messages Clients

**Filtres et Recherche**
- Recherche par nom ou email
- Filtre par statut (Tous, Nouveau, Lu, En cours, Terminé, Archivé)
- Compteurs par statut

**Tableau des Messages**
- Colonnes:
  - Nom
  - Email
  - Domaine (avec icônes: 🏢 🎓 👤 🤝)
  - Type de projet
  - Budget
  - Statut (menu déroulant modifiable)
  - Date
  - Actions
- Tri par date (plus récent en premier)
- Exclusion des messages étudiants

**Actions par Message**
- ✓ Accepter (vert) - Déplace vers Messages Acceptés
- 👁️ Voir (bleu) - Ouvre modal de détails
- 🗑️ Supprimer (rouge) - Déplace vers Corbeille

#### 2.2.5 Section Messages Étudiants

**Caractéristiques**
- Séparation complète des messages clients
- Affichage du message complet (tronqué dans le tableau)
- Pas de champs Budget et Délai
- Mêmes actions que Messages Clients

**Tableau Spécifique**
- Colonnes adaptées aux étudiants
- Contact visible
- Message visible (tronqué)

#### 2.2.6 Section Messages Acceptés

**Fonctionnalité**
- Regroupe les projets acceptés
- Messages déplacés depuis Clients ou Étudiants
- Gestion du statut
- Suppression vers Corbeille

**Informations Affichées**
- Nom de l'expéditeur
- Email
- Sujet (généré automatiquement)
- Catégorie
- Statut (modifiable)
- Date

#### 2.2.7 Section Corbeille

**Fonctionnalités**
- Stockage temporaire des messages supprimés
- Restauration possible
- Suppression définitive
- Vidage complet de la corbeille

**Message d'Information**
- Avertissement sur la durée de conservation (30 jours)
- Explication des actions possibles

**Tableau**
- Type (Client ou Accepté)
- Nom
- Email
- Sujet/Projet
- Date de suppression
- Actions (Restaurer, Supprimer définitivement)

**Bouton Vider la Corbeille**
- Suppression en masse
- Confirmation obligatoire
- Action irréversible

#### 2.2.8 Modal de Détails

**Affichage Complet**
- Toutes les informations du message
- Message complet (non tronqué)
- Design moderne avec fond sombre
- Fermeture par clic extérieur ou bouton X

**Actions**
- Bouton "Fermer"
- Bouton "Marquer comme lu"

#### 2.2.9 Gestion des Statuts

**Statuts Disponibles**
- **Nouveau** (bleu) - Message non lu
- **Lu** (violet) - Message consulté
- **En cours** (orange) - Projet en cours de réalisation
- **Terminé** (vert) - Projet complété
- **Archivé** (gris) - Message archivé

**Modification**
- Menu déroulant dans chaque ligne
- Mise à jour en temps réel
- Pas de rechargement de page

---

## 3. SPÉCIFICATIONS TECHNIQUES

### 3.1 Frontend

**Technologies**
- React 18.2.0
- React Router DOM 6.x
- Vite 5.0.0
- Zod 3.22.4 (validation)
- Font Awesome 6.5 (icônes)
- CSS3 moderne

**Architecture**
- Single Page Application (SPA)
- Composants réutilisables
- Context API pour l'internationalisation
- Routing avec React Router

**Responsive Design**
- Mobile First
- Breakpoints: 768px (tablet), 1024px (desktop)
- Menu hamburger sur mobile
- Tableaux scrollables sur petits écrans

**Performance**
- Lazy loading des images
- Code splitting
- Build optimisé avec Vite
- CSS minifié

### 3.2 Backend

**Technologies**
- Python 3.x
- Flask (framework web)
- Flask-CORS (gestion CORS)
- Flask-JWT-Extended (authentification)
- SQLite3 (base de données embarquée)
- bcrypt (hachage des mots de passe)
- python-dotenv (variables d'environnement)

**Architecture API REST**
- Routes RESTful
- Réponses JSON
- Codes HTTP standards
- Gestion des erreurs

**Endpoints Principaux**
```
POST   /api/admin/login                    # Connexion admin
GET    /api/admin/stats                    # Statistiques
GET    /api/admin/client-messages          # Liste messages clients
PUT    /api/admin/client-messages/:id      # Modifier message
DELETE /api/admin/client-messages/:id      # Supprimer message
GET    /api/admin/general-messages         # Liste messages acceptés
POST   /api/admin/accept-client-message    # Accepter un message
GET    /api/admin/trash                    # Liste corbeille
POST   /api/admin/trash/:id/restore        # Restaurer message
DELETE /api/admin/trash/empty              # Vider corbeille
POST   /api/contact                        # Soumettre message (public)
```

### 3.3 Base de Données

**Type**
- SQLite3 (embarqué, pas de serveur externe)
- Fichier: `backend/bawi_studio.db`
- Création automatique au premier lancement

**Tables**

**admins**
```sql
id, username, password_hash, email, created_at, last_login, is_active
```

**client_messages**
```sql
id, name, email, contact, domain, project_type, budget, deadline,
message, status, priority, notes, created_at, updated_at
```

**general_messages**
```sql
id, sender_name, sender_email, sender_contact, subject, message,
category, status, admin_reply, replied_at, created_at, updated_at
```

**deleted_messages**
```sql
id, original_id, original_type, name, email, contact, domain,
project_type, budget, deadline, subject, category, message, status,
original_created_at, deleted_at, deleted_by
```

**statistics**
```sql
id, date, total_messages, client_messages, general_messages,
new_messages, completed_messages
```

**admin_logs**
```sql
id, admin_id, action, details, ip_address, created_at
```

**Index**
- Index sur les statuts
- Index sur les dates
- Index sur les domaines
- Index sur les types

### 3.4 Sécurité

**Authentification**
- JWT avec expiration 24h
- Tokens stockés dans localStorage
- Validation côté serveur

**Mots de Passe**
- Hachage bcrypt
- Salt automatique
- Pas de stockage en clair

**Validation**
- Validation Zod côté frontend
- Validation Flask côté backend
- Protection contre les injections SQL
- Sanitisation des entrées

**CORS**
- Configuration Flask-CORS
- Origines autorisées définies
- Headers sécurisés

**Logs**
- Enregistrement de toutes les actions admin
- IP address tracking
- Horodatage précis

---

## 4. CONTRAINTES ET EXIGENCES

### 4.1 Contraintes Techniques

**Navigateurs Supportés**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Résolutions**
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px+

**Performance**
- Temps de chargement < 3s
- First Contentful Paint < 1.5s
- Time to Interactive < 3.5s

### 4.2 Contraintes Fonctionnelles

**Disponibilité**
- 99% uptime
- Sauvegarde quotidienne de la base de données
- Logs d'erreur

**Capacité**
- Support de 1000+ messages
- 10+ admins simultanés
- Recherche rapide (< 1s)

**Maintenance**
- Scripts de vérification
- Scripts de données de test
- Documentation complète

### 4.3 Exigences Non Fonctionnelles

**Ergonomie**
- Interface intuitive
- Feedback visuel immédiat
- Messages d'erreur clairs
- Confirmations pour actions critiques

**Accessibilité**
- Contraste suffisant (WCAG AA)
- Navigation au clavier
- Labels ARIA
- Textes alternatifs

**Évolutivité**
- Code modulaire
- Composants réutilisables
- API extensible
- Base de données scalable

---

## 5. LIVRABLES

### 5.1 Code Source

**Frontend**
- Code React complet
- Composants documentés
- Styles CSS organisés
- Configuration Vite

**Backend**
- Code Python Flask
- Routes API documentées
- Scripts utilitaires
- Configuration environnement

### 5.2 Documentation

**Utilisateur**
- Guide complet (docs/GUIDE_COMPLET.md)
- Guide de démarrage (DEMARRAGE.txt)
- README principal

**Technique**
- Structure du projet (docs/STRUCTURE.md)
- Cahier des charges (ce document)
- Changelog (docs/CHANGELOG.md)
- README backend

### 5.3 Base de Données

- Schéma SQLite
- Scripts de création
- Scripts de test
- Données de démonstration

### 5.4 Configuration

- Fichiers .env (exemples)
- Configuration Vite
- Configuration Flask
- .gitignore

---

## 6. PLANNING ET JALONS

### Phase 1: Site Public (Complété)
- ✅ Structure HTML/CSS
- ✅ Composants React
- ✅ Système bilingue
- ✅ Formulaire de contact
- ✅ Responsive design

### Phase 2: Backend (Complété)
- ✅ API Flask
- ✅ Base de données SQLite
- ✅ Authentification
- ✅ Routes CRUD

### Phase 3: Dashboard Admin (Complété)
- ✅ Interface dashboard
- ✅ Gestion des messages
- ✅ Statistiques
- ✅ Recherche et filtres

### Phase 4: Fonctionnalités Avancées (Complété)
- ✅ Séparation Clients/Étudiants
- ✅ Messages Acceptés
- ✅ Corbeille avec restauration
- ✅ Modal de détails
- ✅ Gestion des statuts

### Phase 5: Optimisation (Complété)
- ✅ Nettoyage du code
- ✅ Documentation complète
- ✅ Tests et validation
- ✅ Préparation production

---

## 7. MAINTENANCE ET ÉVOLUTION

### 7.1 Maintenance Préventive

**Quotidienne**
- Vérification des logs
- Monitoring des erreurs
- Sauvegarde base de données

**Hebdomadaire**
- Nettoyage de la corbeille
- Vérification des performances
- Mise à jour des statistiques

**Mensuelle**
- Revue des logs d'activité
- Optimisation base de données
- Mise à jour des dépendances

### 7.2 Évolutions Possibles

**Court Terme**
- Notifications email pour nouveaux messages
- Export des messages en CSV/Excel
- Graphiques de statistiques avancés
- Réponses directes depuis le dashboard

**Moyen Terme**
- Gestion multi-admin avec rôles
- Système de tickets
- Chat en temps réel
- Application mobile admin

**Long Terme**
- Intelligence artificielle pour tri automatique
- Intégration CRM
- API publique pour partenaires
- Tableau de bord client

---

## 8. CONTACTS ET SUPPORT

### 8.1 Équipe Projet

**Client**
- Entreprise: BAWI-STUDIO
- Contact: editchaosam@gmail.com
- Téléphone: +228 99 25 38 43
- Localisation: Lomé, Togo

**Développement**
- Développeur: Kiro AI Assistant
- Date de réalisation: Février 2026
- Version: 1.0.0

### 8.2 Support Technique

**Documentation**
- Guide complet: docs/GUIDE_COMPLET.md
- Structure: docs/STRUCTURE.md
- Changelog: docs/CHANGELOG.md

**Scripts Utiles**
- Vérification DB: `python backend/check_database.py`
- Données de test: `python backend/add_test_data.py`

---

## 9. ANNEXES

### 9.1 Glossaire

- **SPA**: Single Page Application
- **JWT**: JSON Web Token
- **CRUD**: Create, Read, Update, Delete
- **API**: Application Programming Interface
- **REST**: Representational State Transfer
- **CORS**: Cross-Origin Resource Sharing
- **ONG**: Organisation Non Gouvernementale

### 9.2 Références

- React Documentation: https://react.dev
- Flask Documentation: https://flask.palletsprojects.com
- SQLite Documentation: https://www.sqlite.org/docs.html
- Font Awesome: https://fontawesome.com

---

**Document rédigé le:** 23 février 2026  
**Version:** 1.0  
**Statut:** Projet Complété ✅

---

© 2026 BAWI-STUDIO. Tous droits réservés.
