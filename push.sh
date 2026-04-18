#!/bin/bash

echo "🚀 Pousser vers GitHub..."
echo ""

echo "1️⃣ Ajouter tous les fichiers..."
git add -A

echo "2️⃣ Commiter les changements..."
git commit -m "Nettoyage et organisation du projet - Documentation dans docs/"

echo "3️⃣ Pousser vers GitHub..."
git push origin main

echo ""
echo "✅ Terminé!"
echo ""
echo "Vérifier sur GitHub: https://github.com/EDITCHAO/bawi-studio"
