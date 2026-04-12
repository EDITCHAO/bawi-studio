#!/bin/bash

# Script de déploiement pour Bawi Studio
# Usage: ./deploy.sh "Message de commit"

if [ -z "$1" ]; then
  echo "❌ Erreur: Veuillez fournir un message de commit"
  echo "Usage: ./deploy.sh \"Message de commit\""
  exit 1
fi

echo "🚀 Déploiement de Bawi Studio..."

# Vérifier que tout est à jour
echo "📦 Vérification des dépendances..."
npm install
cd backend && npm install && cd ..

# Vérifier les erreurs de build
echo "🔍 Vérification du build frontend..."
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Erreur de build frontend"
  exit 1
fi

# Pousser vers GitHub
echo "📤 Envoi vers GitHub..."
git add .
git commit -m "$1"
git push origin main

if [ $? -eq 0 ]; then
  echo "✅ Déploiement réussi!"
  echo "📍 Frontend: https://bawi-studio.vercel.app"
  echo "📍 Backend: https://bawi-studio-backend.onrender.com"
  echo "⏳ Les changements seront en ligne dans 1-2 minutes..."
else
  echo "❌ Erreur lors du push vers GitHub"
  exit 1
fi
