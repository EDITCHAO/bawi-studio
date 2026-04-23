@echo off
echo 🚀 Demarrage des serveurs...

REM Demarrer le backend dans une nouvelle fenetre
echo 📦 Demarrage du backend...
start "Backend" cmd /k "cd backend && npm run dev"

REM Attendre un peu
timeout /t 3 /nobreak

REM Demarrer le frontend dans une nouvelle fenetre
echo 🎨 Demarrage du frontend...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ✅ Serveurs demarres!
echo.
echo Frontend: http://localhost:5173
echo Backend: http://localhost:5000
echo.
echo Fermez les fenetres pour arreter les serveurs
