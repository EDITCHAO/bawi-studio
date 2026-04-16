#!/bin/bash

# Script de test des endpoints de l'API

API_URL="${1:-http://localhost:5000}"

echo "🧪 Test des endpoints de l'API"
echo "URL: $API_URL"
echo ""

# Test 1: Health check
echo "1️⃣  Test Health Check"
curl -s "$API_URL/api/health" | jq . || echo "Erreur"
echo ""

# Test 2: Récupérer les portfolios
echo "2️⃣  Test Récupération des Portfolios"
curl -s "$API_URL/api/portfolios" | jq . || echo "Erreur"
echo ""

# Test 3: Login admin
echo "3️⃣  Test Login Admin (mot de passe: 20-86)"
TOKEN=$(curl -s -X POST "$API_URL/api/admin/login" \
  -H "Content-Type: application/json" \
  -d '{"password":"20-86"}' | jq -r '.token')

if [ "$TOKEN" != "null" ] && [ ! -z "$TOKEN" ]; then
  echo "✅ Token obtenu: ${TOKEN:0:20}..."
  echo ""
  
  # Test 4: Récupérer les statistiques
  echo "4️⃣  Test Récupération des Statistiques"
  curl -s -H "Authorization: Bearer $TOKEN" "$API_URL/api/admin/stats" | jq . || echo "Erreur"
  echo ""
  
  # Test 5: Récupérer les messages
  echo "5️⃣  Test Récupération des Messages"
  curl -s -H "Authorization: Bearer $TOKEN" "$API_URL/api/admin/client-messages" | jq . || echo "Erreur"
else
  echo "❌ Erreur: Impossible d'obtenir le token"
fi

echo ""
echo "✅ Tests terminés"
