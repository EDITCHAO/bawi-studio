# 📝 Commandes Git pour la Restructuration

## Commit Initial de la Restructuration

```bash
# Ajouter tous les fichiers
git add .

# Commit avec message descriptif
git commit -m "refactor: restructure project into monorepo with separate frontend and backend

- Move React app to frontend/ directory
- Keep Express backend in backend/ directory
- Each folder has its own package.json
- .env only in backend/
- .gitignore at root ignores both node_modules/
- Add installation scripts and documentation"

# Pousser vers le repository
git push origin main
```

## Commandes Utiles

### Voir les changements
```bash
git status
git diff
```

### Voir l'historique
```bash
git log --oneline
```

### Annuler les changements (si nécessaire)
```bash
# Annuler les modifications non commitées
git checkout .

# Annuler le dernier commit (garder les fichiers)
git reset --soft HEAD~1

# Annuler le dernier commit (supprimer les fichiers)
git reset --hard HEAD~1
```

## Workflow de Développement

### Créer une branche pour une nouvelle fonctionnalité
```bash
git checkout -b feature/nom-de-la-fonctionnalite
```

### Committer les changements
```bash
git add .
git commit -m "feat: description de la fonctionnalité"
```

### Pousser la branche
```bash
git push origin feature/nom-de-la-fonctionnalite
```

### Créer une Pull Request
```bash
# Sur GitHub, GitLab, etc.
# Créer une PR depuis votre branche vers main
```

## Bonnes Pratiques

### Messages de Commit
```
feat: ajouter une nouvelle fonctionnalité
fix: corriger un bug
refactor: restructurer le code
docs: mettre à jour la documentation
style: changements de style (pas de logique)
test: ajouter ou modifier des tests
chore: tâches de maintenance
```

### Exemple de Commit
```bash
git commit -m "feat: add language switcher to header

- Add toggle button in Header component
- Update LanguageContext to handle language changes
- Add translations for new UI elements
- Update CSS for language switcher styling"
```

## Ignorer les Fichiers

Le `.gitignore` à la racine ignore déjà:
- `frontend/node_modules/`
- `backend/node_modules/`
- `backend/.env`
- `.env.local`
- `dist/`
- `build/`

Pas besoin de modifier `.gitignore` pour ces fichiers.

## Vérifier avant de Pousser

```bash
# Vérifier les fichiers à committer
git status

# Voir les changements
git diff

# Voir les changements à committer
git diff --cached

# Voir les commits non poussés
git log origin/main..HEAD
```

## Récupérer les Changements du Repository

```bash
# Récupérer les changements
git fetch origin

# Fusionner les changements
git merge origin/main

# Ou en une seule commande
git pull origin main
```

## Résoudre les Conflits

```bash
# Voir les fichiers en conflit
git status

# Éditer les fichiers en conflit
# Puis ajouter et committer
git add .
git commit -m "resolve: merge conflicts"
```

## Branches Principales

- `main` - Branche de production
- `develop` - Branche de développement (optionnel)
- `feature/*` - Branches de fonctionnalités
- `fix/*` - Branches de corrections de bugs
- `hotfix/*` - Branches de corrections urgentes

## Exemple de Workflow Complet

```bash
# 1. Créer une branche
git checkout -b feature/add-portfolio-filter

# 2. Faire des changements
# ... modifier les fichiers ...

# 3. Committer les changements
git add .
git commit -m "feat: add portfolio filter functionality

- Add filter buttons to Portfolio component
- Implement filtering logic
- Update styles for filter buttons"

# 4. Pousser la branche
git push origin feature/add-portfolio-filter

# 5. Créer une Pull Request sur GitHub/GitLab
# ... créer la PR via l'interface web ...

# 6. Après approbation, fusionner
git checkout main
git pull origin main
git merge feature/add-portfolio-filter
git push origin main

# 7. Supprimer la branche locale
git branch -d feature/add-portfolio-filter

# 8. Supprimer la branche distante
git push origin --delete feature/add-portfolio-filter
```

## Commandes Avancées

### Rebase (alternative à merge)
```bash
git rebase origin/main
```

### Cherry-pick (appliquer un commit spécifique)
```bash
git cherry-pick <commit-hash>
```

### Stash (sauvegarder les changements temporairement)
```bash
# Sauvegarder
git stash

# Récupérer
git stash pop

# Voir les stash
git stash list
```

### Amend (modifier le dernier commit)
```bash
git add .
git commit --amend --no-edit
```

## Aide

```bash
# Aide générale
git help

# Aide pour une commande spécifique
git help commit
```

---

**Bon développement!** 🚀
