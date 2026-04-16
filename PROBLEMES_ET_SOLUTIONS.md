# Problèmes et Solutions

## 🔴 Problème 1 : Portfolios vides en production (Vercel)

### Cause
La table `portfolios` n'existait pas dans Supabase et aucune donnée n'était présente.

### Solution appliquée
✅ **Créé et exécuté le script `setup-portfolios.js`** qui :
1. Crée la table `portfolios` dans Supabase
2. Ajoute 6 portfolios de test
3. Configure les permissions RLS

### Vérification
```bash
# En local
node backend/setup-portfolios.js

# Résultat
✅ Données insérées avec succès: 6 portfolios
```

### Prochaines étapes
1. Vérifier que les portfolios s'affichent sur http://localhost:5173/
2. Redéployer le backend sur Render
3. Vérifier que les portfolios s'affichent sur https://bawi-studio.vercel.app

---

## 🔴 Problème 2 : Erreur de connexion admin en production

### Cause
Le backend Render n'est peut-être pas accessible ou les variables d'environnement ne sont pas configurées correctement.

### Diagnostic
1. Vérifier que le backend Render est en ligne
2. Vérifier que les variables d'environnement sont définies
3. Vérifier que le mot de passe admin est correct

### Solution
1. **Vérifier le backend Render** :
   ```bash
   curl https://bawi-studio-backend.onrender.com/api/health
   ```

2. **Vérifier les variables d'environnement** dans Render :
   - SUPABASE_URL ✓
   - SUPABASE_KEY ✓
   - SUPABASE_SERVICE_KEY ✓
   - JWT_SECRET ✓
   - ADMIN_PASSWORD_HASH ✓
   - PORT = 10000 ✓

3. **Tester la connexion admin** :
   ```bash
   curl -X POST https://bawi-studio-backend.onrender.com/api/admin/login \
     -H "Content-Type: application/json" \
     -d '{"password":"20-86"}'
   ```

### Prochaines étapes
1. Vérifier que le backend Render est bien déployé
2. Vérifier que toutes les variables d'environnement sont définies
3. Redéployer le backend si nécessaire
4. Tester la connexion admin sur Vercel

---

## 🟡 Problème 3 : Avertissement Font Awesome (Firefox)

### Cause
Firefox bloque l'accès au stockage local pour les ressources externes de CDN.

### Impact
Aucun impact fonctionnel - c'est juste un avertissement de sécurité.

### Solution (optionnelle)
Installer Font Awesome localement via npm pour éviter l'avertissement.

---

## ✅ Checklist de déploiement

- [ ] Vérifier que les portfolios s'affichent en local
- [ ] Vérifier que la connexion admin fonctionne en local
- [ ] Redéployer le backend sur Render
- [ ] Vérifier que le backend Render est en ligne
- [ ] Redéployer le frontend sur Vercel
- [ ] Vérifier que les portfolios s'affichent en production
- [ ] Vérifier que la connexion admin fonctionne en production
- [ ] Tester le formulaire de contact en production

---

## 📞 Contacts et ressources

- **Supabase** : https://supabase.com
- **Render** : https://render.com
- **Vercel** : https://vercel.com
- **Documentation Backend** : `backend/README.md`
- **Documentation Supabase** : `backend/SUPABASE_SETUP.md`

