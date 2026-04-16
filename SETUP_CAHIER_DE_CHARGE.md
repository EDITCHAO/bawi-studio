# Configuration du Cahier de Charge

## 🔧 Étapes pour ajouter la colonne à Supabase

### 1. Accéder à Supabase SQL Editor

1. Allez sur https://app.supabase.com
2. Connectez-vous avec vos identifiants
3. Sélectionnez votre projet **scivnqshdsgrmikwzsed**
4. Cliquez sur **SQL Editor** dans le menu de gauche

### 2. Exécuter la requête SQL

Collez cette requête dans l'éditeur SQL :

```sql
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS cahier_de_charge_url VARCHAR(500);
```

Puis cliquez sur le bouton **Run** (ou Ctrl+Enter)

### 3. Créer le bucket de stockage

1. Allez dans **Storage** dans le menu de gauche
2. Cliquez sur **Create a new bucket**
3. Nommez-le : `cahiers-de-charge`
4. Cochez **Public bucket** (pour pouvoir accéder aux fichiers)
5. Cliquez sur **Create bucket**

### 4. Configurer les permissions RLS

1. Allez dans **Storage** → **cahiers-de-charge**
2. Cliquez sur **Policies**
3. Créez une nouvelle politique :
   - **Name** : Allow public read
   - **Target roles** : anon, authenticated
   - **Allowed operations** : SELECT
   - **Policy expression** : `true`

4. Créez une deuxième politique :
   - **Name** : Allow authenticated upload
   - **Target roles** : authenticated
   - **Allowed operations** : INSERT, UPDATE, DELETE
   - **Policy expression** : `true`

### 5. Tester

1. Allez sur http://localhost:5173/
2. Remplissez le formulaire de contact
3. Sélectionnez un fichier (PDF, Word, Excel, TXT)
4. Envoyez le formulaire
5. Allez sur http://localhost:5173/admin/dashboard
6. Connectez-vous avec le mot de passe : `20-86`
7. Vous devriez voir le bouton "📄 Cahier de charge" dans les messages

## ✅ Vérification

Pour vérifier que tout fonctionne :

1. Ouvrez la console du navigateur (F12)
2. Allez dans l'onglet **Network**
3. Envoyez un formulaire avec un fichier
4. Vous devriez voir une requête POST vers `/api/contact`
5. La réponse devrait contenir `"success": true`

## 🐛 Dépannage

### Le fichier ne s'upload pas

- Vérifiez que le bucket `cahiers-de-charge` existe
- Vérifiez que les permissions RLS sont correctes
- Vérifiez la taille du fichier (max 10MB)
- Vérifiez le format du fichier (PDF, Word, Excel, TXT)

### Je ne vois pas le bouton "Cahier de charge"

- Vérifiez que la colonne `cahier_de_charge_url` a été ajoutée
- Vérifiez que le fichier a été uploadé avec succès
- Rafraîchissez la page du dashboard

### Le modal ne s'ouvre pas

- Vérifiez que l'URL du fichier est correcte
- Vérifiez que le fichier est accessible publiquement
- Vérifiez la console du navigateur pour les erreurs

## 📝 Notes

- Les fichiers sont stockés dans Supabase Storage
- Les URLs des fichiers sont sauvegardées dans la base de données
- Les fichiers sont accessibles publiquement
- Les fichiers peuvent être téléchargés directement depuis le dashboard
