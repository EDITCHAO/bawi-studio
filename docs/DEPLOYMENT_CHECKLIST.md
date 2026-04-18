# Checklist de Déploiement - Bawi Studio

## Avant le déploiement

- [ ] Tous les fichiers `.md` de documentation inutiles ont été supprimés
- [ ] Les fichiers de configuration sont à jour
- [ ] Les variables d'environnement sont correctement configurées
- [ ] Le code a été testé localement

## Configuration Supabase

- [ ] Projet Supabase créé
- [ ] Tables créées (contact_messages, portfolios)
- [ ] Clés d'accès récupérées

## Déploiement Backend (Render)

- [ ] Compte Render créé
- [ ] Repo GitHub connecté à Render
- [ ] Web Service créé
- [ ] Variables d'environnement configurées
- [ ] Service déployé avec succès

## Déploiement Frontend (Vercel)

- [ ] Compte Vercel créé
- [ ] Repo GitHub connecté à Vercel
- [ ] Projet importé
- [ ] Variables d'environnement configurées
- [ ] Projet déployé avec succès

## Tests post-déploiement

- [ ] Frontend accessible via Vercel
- [ ] Backend accessible via Render
- [ ] Formulaire de contact fonctionne
- [ ] Admin login fonctionne
- [ ] Portfolio se charge correctement
- [ ] Pas d'erreurs CORS

## Configuration des domaines personnalisés

- [ ] Domaine personnalisé configuré pour le frontend (Vercel)
- [ ] Domaine personnalisé configuré pour le backend (Render)
- [ ] DNS records configurés correctement
- [ ] SSL/TLS activé

## Maintenance

- [ ] Logs Render surveillés régulièrement
- [ ] Logs Vercel surveillés régulièrement
- [ ] Backups Supabase configurés
- [ ] Alertes configurées pour les erreurs
