@echo off
REM Script pour démarrer le backend sur Windows

echo.
echo ========================================
echo Démarrage du Backend BAWI STUDIO
echo ========================================
echo.

REM Vérifier que Python est installé
python --version >nul 2>&1
if errorlevel 1 (
    echo ERREUR: Python n'est pas installé ou pas dans le PATH
    pause
    exit /b 1
)

REM Vérifier que les dépendances sont installées
echo Vérification des dépendances...
python -c "import flask" >nul 2>&1
if errorlevel 1 (
    echo Installation des dépendances...
    pip install -r requirements.txt
)

REM Démarrer le backend
echo.
echo Démarrage du serveur...
echo.
python run_backend.py

pause
