# Bonnes Pratiques - Bawi Studio

## 🔐 Sécurité

### Variables d'environnement

✅ **À faire**:
- Utiliser des fichiers `.env` pour les variables locales
- Utiliser les dashboards Vercel/Render pour les variables de production
- Générer des clés fortes et uniques
- Rotationner les clés régulièrement

❌ **À ne pas faire**:
- Commiter les fichiers `.env`
- Partager les clés secrètes
- Utiliser les mêmes clés pour dev et production
- Stocker les clés dans le code source

### Authentification

✅ **À faire**:
- Utiliser JWT pour l'authentification
- Hasher les mots de passe avec bcrypt
- Valider les tokens à chaque requête
- Implémenter une expiration des tokens

❌ **À ne pas faire**:
- Stocker les mots de passe en clair
- Transmettre les mots de passe en URL
- Utiliser des tokens sans expiration

## 📝 Code

### Frontend

✅ **À faire**:
- Utiliser des composants réutilisables
- Gérer l'état avec Context API
- Valider les entrées utilisateur
- Gérer les erreurs correctement

❌ **À ne pas faire**:
- Hardcoder les URLs API
- Ignorer les erreurs
- Créer des composants trop gros

### Backend

✅ **À faire**:
- Valider les entrées
- Gérer les erreurs correctement
- Utiliser des middleware
- Logger les erreurs

❌ **À ne pas faire**:
- Faire confiance aux entrées utilisateur
- Ignorer les erreurs
- Exposer les détails des erreurs

## 🚀 Déploiement

### Avant le déploiement

✅ **À faire**:
- Tester localement
- Vérifier les logs
- Vérifier les variables d'environnement
- Faire un commit propre

❌ **À ne pas faire**:
- Déployer sans tester
- Déployer avec des erreurs
- Oublier les variables d'environnement

### Après le déploiement

✅ **À faire**:
- Vérifier les logs
- Tester les endpoints
- Vérifier les performances
- Monitorer les erreurs

❌ **À ne pas faire**:
- Ignorer les logs
- Oublier de tester
- Ignorer les erreurs
