# 🆘 Guide de Dépannage - Render & Vercel

## 🔴 Problèmes Courants et Solutions

### 1. Erreur: "Variables d'environnement manquantes"

**Symptôme:**
```
❌ ERREUR: Variables d'environnement manquantes: SUPABASE_URL, SUPABASE_KEY, ...
```

**Cause:**
Les variables d'environnement ne sont pas définies sur Render.

**Solution:**
1. Allez au dashboard Render
2. Sélectionnez votre service `bawi-studio-backend`
3. Allez à "Environment"
4. Vérifiez que toutes les variables sont présentes:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `SUPABASE_SERVICE_KEY`
   - `JWT_SECRET`
   - `ADMIN_PASSWORD_HASH`
5. Redéployez le service

---

### 2. Erreur CORS: "Access to XMLHttpRequest blocked"

**Symptôme:**
```
Access to XMLHttpRequest at 'https://bawi-studio-backend.onrender.com/api/contact' 
from origin 'https://bawi-studio.vercel.app' has been blocked by CORS policy
```

**Cause:**
L'URL du frontend n'est pas dans la liste CORS du backend.

**Solution:**
1. Vérifiez que `https://bawi-studio.vercel.app` est dans `backend/server.js` corsOrigins
2. Si ce n'est pas le cas, ajoutez-le:
   ```javascript
   const corsOrigins = [
     // ... autres URLs
     'https://bawi-studio.vercel.app',
   ];
   ```
3. Commitez et poussez vers GitHub
4. Render redéploiera automatiquement

---

### 3. Erreur: "Cannot connect to Supabase"

**Symptôme:**
```
Error: Failed to connect to Supabase
Error: Invalid API key
```

**Cause:**
Les clés Supabase sont incorrectes ou le projet est suspendu.

**Solution:**
1. Allez au dashboard Supabase
2. Vérifiez que votre projet est actif
3. Récupérez les clés correctes:
   - `SUPABASE_URL` - URL du projet
   - `SUPABASE_KEY` - Clé anon (publique)
   - `SUPABASE_SERVICE_KEY` - Clé de service (privée)
4. Mettez à jour les variables sur Render
5. Redéployez

---

### 4. Erreur: "Mot de passe admin invalide"

**Symptôme:**
```
❌ Mot de passe invalide
```

**Cause:**
Le `ADMIN_PASSWORD_HASH` est incorrect ou le mot de passe est mauvais.

**Solution:**
1. Générez un nouveau hash bcrypt:
   ```bash
   node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('votre_nouveau_mot_de_passe', 10, (err, hash) => console.log(hash));"
   ```
2. Mettez à jour `ADMIN_PASSWORD_HASH` sur Render
3. Redéployez
4. Essayez de vous connecter avec le nouveau mot de passe

---

### 5. Erreur: "Le formulaire ne soumet pas"

**Symptôme:**
Le formulaire de contact ne soumet pas et rien ne se passe.

**Cause:**
Le backend n'est pas accessible ou l'API URL est incorrecte.

**Solution:**
1. Vérifiez que le backend est en cours d'exécution:
   ```bash
   curl https://bawi-studio-backend.onrender.com/api/health
   ```
2. Vérifiez que `VITE_API_URL` est défini sur Vercel:
   ```
   VITE_API_URL=https://bawi-studio-backend.onrender.com
   ```
3. Ouvrez la console du navigateur (F12) et vérifiez les erreurs
4. Vérifiez les logs Vercel pour les erreurs de build

---

### 6. Erreur: "Les images ne se chargent pas"

**Symptôme:**
Les images du portfolio ne s'affichent pas.

**Cause:**
Les URLs Supabase Storage sont incorrectes ou les buckets ne sont pas configurés.

**Solution:**
1. Vérifiez que les buckets existent dans Supabase:
   - `cahiers-de-charge`
   - `portfolios`
2. Vérifiez que les images sont uploadées dans les buckets
3. Vérifiez que les URLs sont correctes dans la base de données
4. Vérifiez les permissions Supabase Storage (public ou privé)

---

### 7. Erreur: "Le service Render s'arrête après 15 minutes"

**Symptôme:**
Le backend fonctionne pendant 15 minutes puis s'arrête.

**Cause:**
Render Free Plan met les services en veille après 15 minutes d'inactivité.

**Solution:**
1. Mettez à niveau vers un plan payant
2. Ou utilisez un service de "keep-alive" pour faire des requêtes régulières
3. Ou acceptez que le service s'endorme et se réveille à la première requête

---

### 8. Erreur: "Build échoue sur Vercel"

**Symptôme:**
```
Build failed: npm run build exited with code 1
```

**Cause:**
Il y a une erreur dans le code ou les dépendances manquent.

**Solution:**
1. Testez localement:
   ```bash
   cd frontend
   npm install
   npm run build
   ```
2. Vérifiez les erreurs affichées
3. Corrigez les erreurs
4. Commitez et poussez vers GitHub
5. Vercel redéploiera automatiquement

---

### 9. Erreur: "Build échoue sur Render"

**Symptôme:**
```
Build failed: npm install exited with code 1
```

**Cause:**
Il y a une erreur dans les dépendances ou le package.json.

**Solution:**
1. Testez localement:
   ```bash
   cd backend
   npm install
   ```
2. Vérifiez les erreurs affichées
3. Corrigez les erreurs (versions incompatibles, etc.)
4. Commitez et poussez vers GitHub
5. Render redéploiera automatiquement

---

### 10. Erreur: "JWT Token invalide"

**Symptôme:**
```
❌ Token invalide
```

**Cause:**
Le `JWT_SECRET` est incorrect ou le token a expiré.

**Solution:**
1. Vérifiez que le `JWT_SECRET` est le même sur Render et dans le code
2. Générez un nouveau `JWT_SECRET`:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
3. Mettez à jour sur Render
4. Redéployez
5. Reconnectez-vous

---

## 🔍 Diagnostic Rapide

### Vérifier que le backend fonctionne
```bash
# Health check
curl https://bawi-studio-backend.onrender.com/api/health

# Résultat attendu:
# {"status":"ok","message":"Backend is running"}
```

### Vérifier que le frontend se charge
```bash
# Ouvrez dans le navigateur
https://bawi-studio.vercel.app

# Vérifiez la console (F12) pour les erreurs
```

### Vérifier la connexion Supabase
```bash
# Testez localement
cd backend
npm run verify

# Résultat attendu:
# ✅ Toutes les variables d'environnement requises sont présentes!
```

### Vérifier les logs Render
1. Allez au dashboard Render
2. Sélectionnez votre service
3. Allez à "Logs"
4. Cherchez les erreurs

### Vérifier les logs Vercel
1. Allez au dashboard Vercel
2. Allez à "Deployments"
3. Sélectionnez le dernier déploiement
4. Allez à "Logs"
5. Cherchez les erreurs

---

## 📋 Checklist de Dépannage

- [ ] Vérifiez que toutes les variables d'environnement sont définies
- [ ] Vérifiez que le backend est accessible
- [ ] Vérifiez que le frontend se charge
- [ ] Vérifiez la console du navigateur pour les erreurs
- [ ] Vérifiez les logs Render et Vercel
- [ ] Testez localement pour reproduire le problème
- [ ] Vérifiez que les clés Supabase sont correctes
- [ ] Vérifiez que les tables Supabase existent
- [ ] Vérifiez que les buckets Supabase existent
- [ ] Vérifiez que le JWT_SECRET est correct
- [ ] Vérifiez que l'ADMIN_PASSWORD_HASH est correct

---

## 🆘 Besoin d'Aide?

Si vous ne trouvez pas la solution:

1. **Consultez les logs:**
   - Render: Dashboard → Logs
   - Vercel: Dashboard → Deployments → Logs
   - Supabase: Dashboard → Logs

2. **Testez localement:**
   ```bash
   npm run dev
   ```

3. **Vérifiez les variables d'environnement:**
   ```bash
   cd backend
   npm run verify
   ```

4. **Consultez la documentation:**
   - Render: https://render.com/docs
   - Vercel: https://vercel.com/docs
   - Supabase: https://supabase.com/docs

5. **Contactez le support:**
   - Render: https://render.com/support
   - Vercel: https://vercel.com/support
   - Supabase: https://supabase.com/support

---

## 💡 Conseils Utiles

- Gardez les logs ouverts pendant le déploiement
- Testez toujours localement avant de déployer
- Utilisez des noms de variables d'environnement clairs
- Documentez vos changements
- Faites des commits réguliers
- Utilisez des branches pour les nouvelles fonctionnalités

