"""
Script pour tester la connexion au serveur et à la base de données
"""
import requests
import sys
from dotenv import load_dotenv
import os

load_dotenv()

def test_backend():
    """Tester la connexion au backend"""
    print("=" * 60)
    print("🔍 TEST DE CONNEXION AU BACKEND")
    print("=" * 60)
    
    backend_url = "http://192.168.1.66:5000"
    
    try:
        print(f"\n📡 Tentative de connexion à {backend_url}...")
        response = requests.get(f"{backend_url}/api/admin/stats", timeout=5)
        
        if response.status_code == 200:
            print("✅ Backend est accessible!")
            print(f"   Status: {response.status_code}")
            return True
        else:
            print(f"⚠️  Backend répond mais avec erreur: {response.status_code}")
            print(f"   Réponse: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Impossible de se connecter au backend!")
        print(f"   Assurez-vous que le backend est en cours d'exécution sur {backend_url}")
        return False
    except requests.exceptions.Timeout:
        print("❌ Timeout - le backend met trop de temps à répondre")
        return False
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False

def test_mysql():
    """Tester la connexion MySQL"""
    print("\n" + "=" * 60)
    print("🔍 TEST DE CONNEXION MYSQL")
    print("=" * 60)
    
    try:
        import mysql.connector
        
        print("\n📡 Tentative de connexion à MySQL...")
        conn = mysql.connector.connect(
            host=os.getenv('MYSQL_HOST', 'localhost'),
            user=os.getenv('MYSQL_USER', 'root'),
            password=os.getenv('MYSQL_PASSWORD', ''),
            database=os.getenv('MYSQL_DATABASE', 'bawi_studio'),
            port=int(os.getenv('MYSQL_PORT', 3306)),
            connect_timeout=5
        )
        
        print("✅ Connexion MySQL réussie!")
        
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM admins")
        count = cursor.fetchone()[0]
        print(f"   Nombre d'admins: {count}")
        
        cursor.close()
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Erreur MySQL: {e}")
        print("\n💡 Solutions possibles:")
        print("   1. XAMPP n'est pas démarré (démarrez Apache + MySQL)")
        print("   2. La base de données 'bawi_studio' n'existe pas")
        print("   3. Les identifiants MySQL sont incorrects")
        return False

def main():
    print("\n🚀 DIAGNOSTIC DU SYSTÈME\n")
    
    backend_ok = test_backend()
    mysql_ok = test_mysql()
    
    print("\n" + "=" * 60)
    print("📊 RÉSUMÉ")
    print("=" * 60)
    print(f"Backend: {'✅ OK' if backend_ok else '❌ ERREUR'}")
    print(f"MySQL:   {'✅ OK' if mysql_ok else '❌ ERREUR'}")
    
    if backend_ok and mysql_ok:
        print("\n✅ Tout fonctionne! Vous pouvez vous connecter au dashboard.")
    else:
        print("\n❌ Il y a des problèmes à corriger.")
        if not backend_ok:
            print("\n💡 Pour démarrer le backend:")
            print("   cd backend")
            print("   python run_backend.py")
        if not mysql_ok:
            print("\n💡 Pour démarrer MySQL:")
            print("   1. Ouvrez XAMPP")
            print("   2. Cliquez sur 'Start' pour Apache et MySQL")
            print("   3. Vérifiez que la base 'bawi_studio' existe")

if __name__ == '__main__':
    main()
