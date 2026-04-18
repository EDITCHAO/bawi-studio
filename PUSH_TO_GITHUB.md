# 📤 Pousser vers GitHub

## Option 1: Utiliser le script (Recommandé)

### Windows

Double-cliquez sur `push.bat` ou exécutez:

```bash
push.bat
```

### Mac/Linux

```bash
chmod +x push.sh
./push.sh
```

## Option 2: Commandes manuelles

### Étape 1: Ajouter les fichiers

```bash
git add -A
```

### Étape 2: Commiter

```bash
git commit -m "Nettoyage et organisation du projet - Documentation dans docs/"
```

### Étape 3: Pousser

```bash
git push origin main
```

## Option 3: Utiliser VS Code

1. Ouvrir VS Code
2. Aller dans Source Control (Ctrl+Shift+G)
3. Cliquer sur "+" pour ajouter tous les fichiers
4. Écrire le message de commit
5. Cliquer sur "Commit"
6. Cliquer sur "Push"

## Option 4: Utiliser GitHub Desktop

1. Ouvrir GitHub Desktop
2. Voir les changements
3. Écrire le message de commit
4. Cliquer sur "Commit to main"
5. Cliquer sur "Push origin"

## ✅ Vérification

Après le push, vérifier sur GitHub:

1. Aller sur https://github.com/EDITCHAO/bawi-studio
2. Vérifier que les fichiers sont à jour
3. Vérifier que `docs/` contient tous les fichiers `.md`
4. Vérifier que le README.md pointe vers `docs/`

## 🚀 Prochaines étapes

Après le push:

1. Configurer Vercel (frontend)
2. Configurer Render (backend)
3. Configurer Supabase (base de données)
4. Déployer!

Voir [docs/QUICK_DEPLOY.md](docs/QUICK_DEPLOY.md) pour les détails.

---

**Dernière mise à jour**: 2026-04-18
