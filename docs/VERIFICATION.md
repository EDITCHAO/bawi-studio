# Vérification - Bawi Studio

## ✅ Vérification du projet

### Avant le déploiement

#### 1. Vérifier la structure

```bash
ls -la | grep -E "README|package.json|vercel.json"
ls -la backend/ | grep -E "server.js|package.json|Procfile"
```

#### 2. Vérifier les dépendances

```bash
# Frontend
npm list

# Backend
cd backend
npm list
```

#### 3. Vérifier les variables d'environnement

```bash
# Frontend
cat .env

# Backend
cat backend/.env
```

#### 4. Vérifier le code

```bash
# Frontend
npm run build

# Backend
cd backend
npm run dev
```

### Pendant le développement

#### 1. Vérifier les logs

```bash
# Frontend
# Ouvrir la console du navigateur (F12)

# Backend
# Vérifier les logs dans le terminal
```

#### 2. Vérifier les endpoints

```bash
# Health check
curl http://localhost:5000/api/health

# Portfolios
curl http://localhost:5000/api/portfolios
```

### Avant le déploiement

#### 1. Vérifier le build

```bash
# Frontend
npm run build
ls -la dist/

# Backend
cd backend
npm install
```

#### 2. Vérifier les variables d'environnement

```bash
echo $VITE_API_URL
echo $SUPABASE_URL
echo $JWT_SECRET
echo $ADMIN_PASSWORD_HASH
```

#### 3. Vérifier la configuration

```bash
cat vercel.json
cat backend/render.yaml
cat backend/Procfile
```

### Après le déploiement

#### 1. Vérifier les logs

```bash
# Render
# Aller sur https://render.com
# Sélectionner le service
# Vérifier les logs

# Vercel
# Aller sur https://vercel.com
# Sélectionner le projet
# Vérifier les logs
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

## 🔍 Checklist de vérification

### Avant le développement
- [ ] Projet cloné
- [ ] Dépendances installées
- [ ] Variables d'environnement configurées
- [ ] Serveurs démarrés
- [ ] Site accessible

### Pendant le développement
- [ ] Pas d'erreurs dans la console
- [ ] Endpoints fonctionnent
- [ ] Base de données accessible
- [ ] Formulaire fonctionne
- [ ] Admin login fonctionne

### Avant le déploiement
- [ ] Build réussit
- [ ] Pas d'erreurs
- [ ] Variables d'environnement correctes
- [ ] Fichiers sensibles non commitées
- [ ] Configuration correcte

### Après le déploiement
- [ ] Logs vérifiés
- [ ] Endpoints fonctionnent
- [ ] Frontend accessible
- [ ] Formulaire fonctionne
- [ ] Base de données reçoit les données

---

**Dernière mise à jour**: 2026-04-18
