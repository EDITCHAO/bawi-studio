#!/bin/bash

echo "🚀 Démarrage des serveurs..."

# Démarrer le backend
echo "📦 Démarrage du backend..."
cd backend
npm run dev &
BACKEND_PID=$!

# Attendre un peu
sleep 3

# Démarrer le frontend
echo "🎨 Démarrage du frontend..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo "✅ Serveurs démarrés!"
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "Frontend: http://localhost:5173"
echo "Backend: http://localhost:5000"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter les serveurs"

# Attendre l'arrêt
wait
