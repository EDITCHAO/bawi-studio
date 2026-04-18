# Post-Déploiement - Bawi Studio

## ✅ Après le déploiement

### Immédiatement après (1 heure)

#### 1. Vérifier les logs

```bash
# Render (Backend)
1. Aller sur https://render.com
2. Sélectionner le service
3. Aller dans Logs
4. Vérifier qu'il n'y a pas d'erreurs

# Vercel (Frontend)
1. Aller sur https://vercel.com
2. Sélectionner le projet
3. Aller dans Deployments
4. Vérifier les logs
```

#### 2. Tester les endpoints

```bash
# Health check
curl https://bawi-studio-backend.onrender.com/api/health

# Portfolios
curl https://bawi-studio-backend.onrender.com/api/portfolios
```

#### 3. Tester le frontend

1. Ouvrir https://bawi-studio.vercel.app
2. Vérifier que le site se charge
3. Tester le formulaire de contact
4. Tester l'admin login

#### 4. Vérifier la base de données

1. Aller sur https://supabase.com
2. Sélectionner le projet
3. Aller dans Table Editor
4. Vérifier que les données arrivent

### Après 24 heures

#### 1. Vérifier la stabilité

```bash
# Vérifier les logs
# Pas d'erreurs répétées
# Performance stable
# Pas de fuites mémoire
```

#### 2. Vérifier les performances

```bash
# Frontend
1. Ouvrir https://bawi-studio.vercel.app
2. Appuyer sur F12
3. Aller dans Performance
4. Enregistrer une session
5. Analyser les résultats

# Backend
1. Aller sur https://render.com
2. Sélectionner le service
3. Vérifier les métriques
```

### Après 1 semaine

#### 1. Audit de sécurité

```bash
# Vérifier les dépendances
npm audit

# Vérifier les logs
# Pas d'erreurs de sécurité
# Pas d'accès non autorisés
```

#### 2. Revue des performances

```bash
# Vérifier les temps de réponse
# Vérifier l'utilisation des ressources
# Vérifier les erreurs
```

## 📊 Monitoring

### Configurer les alertes

#### Render
1. Aller sur https://render.com
2. Sélectionner le service
3. Aller dans Settings > Alerts
4. Configurer les alertes

#### Vercel
1. Aller sur https://vercel.com
2. Sélectionner le projet
3. Aller dans Settings > Alerts
4. Configurer les alertes

## 📋 Checklist post-déploiement

### Immédiatement après
- [ ] Logs vérifiés
- [ ] Endpoints testés
- [ ] Frontend accessible
- [ ] Base de données reçoit les données
- [ ] Pas d'erreurs critiques

### Après 24 heures
- [ ] Stabilité vérifiée
- [ ] Performances acceptables
- [ ] Sécurité vérifiée
- [ ] Pas d'erreurs répétées

### Après 1 semaine
- [ ] Audit de sécurité
- [ ] Revue des performances
- [ ] Revue des données
- [ ] Alertes configurées
- [ ] Monitoring actif

---

**Dernière mise à jour**: 2026-04-18
