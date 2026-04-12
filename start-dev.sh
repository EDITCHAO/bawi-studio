#!/bin/bash

echo "Démarrage de Bawi Studio en mode développement..."
echo ""

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "Erreur: Node.js n'est pas installé"
    exit 1
fi

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo "Installation des dépendances frontend..."
    npm install
fi

if [ ! -d "backend/node_modules" ]; then
    echo "Installation des dépendances backend..."
    cd backend
    npm install
    cd ..
fi

# Démarrer le backend en arrière-plan
echo "Démarrage du backend..."
cd backend
npm start &
BACKEND_PID=$!
cd ..

# Attendre un peu que le backend démarre
sleep 3

# Démarrer le frontend
echo "Démarrage du frontend..."
npm run dev

# Nettoyer à la fermeture
trap "kill $BACKEND_PID" EXIT
