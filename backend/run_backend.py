"""
Script simple pour démarrer le backend avec gestion des erreurs
"""
import sys
import traceback
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv()

try:
    print("=" * 70)
    print("🚀 DÉMARRAGE DU BACKEND - BAWI STUDIO")
    print("=" * 70)
    print()
    
    # Importer après avoir chargé les variables d'environnement
    print("📦 Chargement des modules...")
    from app_mysql import app
    print("   ✅ app_mysql chargé")
    
    print()
    print("📍 Backend disponible sur:")
    print("   → http://localhost:5000")
    print("   → http://127.0.0.1:5000")
    print("   → http://192.168.1.81:5000")
    print()
    print("📋 Routes disponibles:")
    print("   → POST /api/contact")
    print("   → POST /api/admin/login")
    print("   → GET  /api/admin/stats")
    print("   → GET  /api/admin/client-messages")
    print("   → GET  /api/admin/general-messages")
    print()
    print("⚠️  Pour arrêter: Ctrl+C")
    print("=" * 70)
    print()
    
    # Démarrer Flask sans debug pour éviter le rechargement
    print("🔄 Démarrage du serveur Flask...")
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=False,  # Pas de debug pour éviter les problèmes
        use_reloader=False  # Pas de rechargement automatique
    )
    
except ImportError as e:
    print(f"\n❌ ERREUR D'IMPORT: {e}")
    print("\n💡 Solutions:")
    print("   1. Vérifiez que tous les fichiers Python existent")
    print("   2. Installez les dépendances: pip install -r requirements.txt")
    traceback.print_exc()
    sys.exit(1)
    
except Exception as e:
    print(f"\n❌ ERREUR: {e}")
    print("\n💡 Vérifiez:")
    print("   1. Que XAMPP est démarré (MySQL)")
    print("   2. Que la base de données 'bawi_studio' existe")
    print("   3. Les identifiants MySQL dans .env")
    traceback.print_exc()
    sys.exit(1)

