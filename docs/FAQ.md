# FAQ - Bawi Studio

## 🚀 Déploiement

### Q: Combien de temps prend le déploiement?
**R**: Environ 30-40 minutes pour la première fois.

### Q: Puis-je déployer sans Supabase?
**R**: Non, Supabase est nécessaire pour la base de données.

### Q: Comment redéployer après un changement?
**R**: Simplement faire un push sur la branche `main`.

## 🔐 Sécurité

### Q: Où stocker les clés secrètes?
**R**: Jamais dans le code source. Utiliser les fichiers `.env` localement et les dashboards Vercel/Render en production.

### Q: Comment générer une clé secrète forte?
**R**: Utiliser `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.

### Q: Que faire si une clé est compromise?
**R**: La rotationner immédiatement.

## 🐛 Dépannage

### Q: Le backend ne démarre pas
**R**: Vérifier les logs Render, vérifier les variables d'environnement, vérifier la connexion Supabase.

### Q: Le frontend ne se connecte pas au backend
**R**: Vérifier que `VITE_API_URL` est correct, vérifier les CORS, vérifier les logs du navigateur.

### Q: Les messages de contact ne s'enregistrent pas
**R**: Vérifier que la table `contact_messages` existe, vérifier les permissions RLS.

### Q: Erreur CORS
**R**: Vérifier que l'origine est dans la liste des origines autorisées.

## 💾 Base de données

### Q: Comment faire un backup?
**R**: Supabase fait des backups automatiques.

### Q: Comment restaurer un backup?
**R**: Aller dans Supabase > Backups > Restore.

## 👥 Utilisateurs

### Q: Comment changer le mot de passe admin?
**R**: Générer un nouveau hash avec `node generate-hash.js` et mettre à jour `ADMIN_PASSWORD_HASH`.

## 📧 Contact

### Q: Où sont stockés les messages de contact?
**R**: Dans la table `contact_messages` de Supabase.

## 🌐 Domaines

### Q: Comment ajouter un domaine personnalisé?
**R**: Aller dans Vercel/Render > Settings > Domains et configurer les DNS records.

---

**Besoin d'aide?** Consulter les fichiers de documentation ou contacter le support.
