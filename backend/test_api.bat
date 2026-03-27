@echo off
REM Script pour tester l'API du backend

echo.
echo ==========================================
echo Test de l'API Backend
echo ==========================================
echo.

REM Test 1: Vérifier que le backend répond
echo 1. Test de connexion au backend...
echo.
curl -s -o nul -w "Status: %%{http_code}\n" http://192.168.1.66:5000/api/admin/stats

REM Test 2: Essayer de se connecter
echo.
echo 2. Test de connexion admin...
echo.
curl -X POST http://192.168.1.66:5000/api/admin/login ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"euloge\",\"password\":\"20-86\"}" ^
  -w "\nStatus: %%{http_code}\n"

echo.
echo ==========================================
echo.
pause
