#!/bin/bash

echo "🚀 Installation de BAWI-STUDIO"
echo "================================"

# Installer les dépendances du frontend
echo ""
echo "📦 Installation du frontend..."
cd frontend
npm install
cd ..

# Installer les dépendances du backend
echo ""
echo "📦 Installation du backend..."
cd backend
npm install
cd ..

echo ""
echo "✅ Installation terminée!"
echo ""
echo "Pour démarrer le projet:"
echo "  Frontend:  cd frontend && npm run dev"
echo "  Backend:   cd backend && npm run dev"
