@echo off
echo Démarrage de Bawi Studio en mode développement...
echo.

REM Vérifier si Node.js est installé
node --version >nul 2>&1
if errorlevel 1 (
    echo Erreur: Node.js n'est pas installé
    pause
    exit /b 1
)

REM Installer les dépendances si nécessaire
if not exist "node_modules" (
    echo Installation des dépendances frontend...
    call npm install
)

if not exist "backend\node_modules" (
    echo Installation des dépendances backend...
    cd backend
    call npm install
    cd ..
)

REM Démarrer le backend dans une nouvelle fenêtre
echo Démarrage du backend...
start cmd /k "cd backend && npm start"

REM Attendre un peu que le backend démarre
timeout /t 3 /nobreak

REM Démarrer le frontend
echo Démarrage du frontend...
call npm run dev

pause
