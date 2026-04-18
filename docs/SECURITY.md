# Politique de Sécurité - Bawi Studio

## 🔐 Signaler une vulnérabilité

Si vous découvrez une vulnérabilité de sécurité, **ne la publiez pas publiquement**.

Veuillez envoyer un email à: **security@bawi-studio.com**

## 🛡️ Mesures de sécurité

### Authentification

- ✅ JWT pour l'authentification
- ✅ Bcrypt pour les mots de passe
- ✅ Tokens avec expiration (24h)
- ✅ Validation des tokens à chaque requête

### Données

- ✅ HTTPS en production
- ✅ Chiffrement des données sensibles
- ✅ RLS (Row Level Security) sur Supabase
- ✅ Backups réguliers

### API

- ✅ CORS configuré
- ✅ Validation des entrées
- ✅ Gestion des erreurs
- ✅ Rate limiting (à implémenter)

### Code

- ✅ Pas de secrets dans le code
- ✅ Dépendances à jour
- ✅ Audit de sécurité régulier
- ✅ Tests de sécurité

## 🔑 Gestion des clés

### Bonnes pratiques

- ✅ Clés fortes et uniques
- ✅ Stockage sécurisé
- ✅ Rotation régulière
- ✅ Clés différentes pour dev/prod

### À ne pas faire

- ❌ Partager les clés
- ❌ Commiter les clés
- ❌ Utiliser des clés faibles
- ❌ Utiliser les mêmes clés partout

## 📋 Checklist de sécurité

### Avant le déploiement

- [ ] Pas de secrets dans le code
- [ ] Variables d'environnement configurées
- [ ] HTTPS activé
- [ ] CORS configuré
- [ ] Authentification testée
- [ ] Validation des entrées testée
- [ ] Gestion des erreurs testée

### Après le déploiement

- [ ] Logs vérifiés
- [ ] Pas d'erreurs de sécurité
- [ ] Certificats SSL valides
- [ ] Backups fonctionnels
- [ ] Monitoring activé

---

**Dernière mise à jour**: 2026-04-18
