@echo off
REM Script de déploiement pour Bawi Studio (Windows)
REM Usage: deploy.bat "Message de commit"

if "%1"=="" (
  echo ❌ Erreur: Veuillez fournir un message de commit
  echo Usage: deploy.bat "Message de commit"
  exit /b 1
)

echo 🚀 Déploiement de Bawi Studio...

REM Vérifier que tout est à jour
echo 📦 Vérification des dépendances...
call npm install
cd backend
call npm install
cd ..

REM Vérifier les erreurs de build
echo 🔍 Vérification du build frontend...
call npm run build

if errorlevel 1 (
  echo ❌ Erreur de build frontend
  exit /b 1
)

REM Pousser vers GitHub
echo 📤 Envoi vers GitHub...
git add .
git commit -m "%1"
git push origin main

if errorlevel 1 (
  echo ❌ Erreur lors du push vers GitHub
  exit /b 1
) else (
  echo ✅ Déploiement réussi!
  echo 📍 Frontend: https://bawi-studio.vercel.app
  echo 📍 Backend: https://bawi-studio-backend.onrender.com
  echo ⏳ Les changements seront en ligne dans 1-2 minutes...
)
