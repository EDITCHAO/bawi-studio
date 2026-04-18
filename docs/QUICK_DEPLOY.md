# Déploiement Rapide - Bawi Studio

## 🚀 Déploiement en 5 étapes

### Étape 1: Préparer Supabase (5 min)

1. Aller sur https://supabase.com
2. Créer un nouveau projet
3. Exécuter le script SQL
4. Récupérer les clés

### Étape 2: Générer le hash du mot de passe admin (2 min)

```bash
cd backend
npm install
node generate-hash.js
```

### Étape 3: Déployer le Backend sur Render (10 min)

1. Aller sur https://render.com
2. Créer un Web Service
3. Configurer les variables d'environnement
4. Déployer

### Étape 4: Déployer le Frontend sur Vercel (10 min)

1. Aller sur https://vercel.com
2. Importer le projet GitHub
3. Configurer les variables d'environnement
4. Déployer

### Étape 5: Tester (5 min)

1. Ouvrir le frontend
2. Tester le formulaire de contact
3. Vérifier les logs

## ✅ Vérification

### Backend
```bash
curl https://bawi-studio-backend.onrender.com/api/health
```

### Frontend
- Accéder à l'URL Vercel
- Vérifier que tout se charge correctement

---

**Temps total estimé**: 30-40 minutes
