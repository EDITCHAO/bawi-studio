# Script PowerShell pour démarrer le backend sur Windows

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Démarrage du Backend BAWI STUDIO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier que Python est installé
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✅ Python trouvé: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ ERREUR: Python n'est pas installé ou pas dans le PATH" -ForegroundColor Red
    Read-Host "Appuyez sur Entrée pour quitter"
    exit 1
}

# Vérifier que Flask est installé
Write-Host ""
Write-Host "Vérification des dépendances..." -ForegroundColor Yellow
try {
    python -c "import flask" 2>&1 | Out-Null
    Write-Host "✅ Dépendances OK" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Installation des dépendances..." -ForegroundColor Yellow
    pip install -r requirements.txt
}

# Démarrer le backend
Write-Host ""
Write-Host "Démarrage du serveur..." -ForegroundColor Cyan
Write-Host ""

python run_backend.py

Read-Host "Appuyez sur Entrée pour quitter"
