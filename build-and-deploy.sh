#!/bin/bash

echo "🚀 Préparation au déploiement..."

# Vérifier que tout est à jour
echo "📦 Vérification des dépendances..."
npm install
cd backend
npm install
cd ..

# Build du frontend
echo "🔨 Build du frontend..."
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Erreur lors du build du frontend"
  exit 1
fi

echo "✅ Build réussi!"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Push sur GitHub : git push origin main"
echo "2. Vercel déploiera automatiquement le frontend"
echo "3. Render déploiera automatiquement le backend"
echo ""
echo "🌐 URLs de production :"
echo "Frontend : https://bawi-studio.vercel.app"
echo "Backend : https://bawi-studio-backend.onrender.com"
