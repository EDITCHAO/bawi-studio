"""
Script simple pour vérifier la configuration sans dépendances externes
"""
import sys
import os
from dotenv import load_dotenv

load_dotenv()

def check_mysql():
    """Vérifier la connexion MySQL"""
    print("=" * 60)
    print("🔍 VÉRIFICATION MYSQL")
    print("=" * 60)
    
    try:
        import mysql.connector
        
        print("\n📡 Tentative de connexion à MySQL...")
        print(f"   Host: {os.getenv('MYSQL_HOST', 'localhost')}")
        print(f"   User: {os.getenv('MYSQL_USER', 'root')}")
        print(f"   Database: {os.getenv('MYSQL_DATABASE', 'bawi_studio')}")
        print(f"   Port: {os.getenv('MYSQL_PORT', 3306)}")
        
        conn = mysql.connector.connect(
            host=os.getenv('MYSQL_HOST', 'localhost'),
            user=os.getenv('MYSQL_USER', 'root'),
            password=os.getenv('MYSQL_PASSWORD', ''),
            database=os.getenv('MYSQL_DATABASE', 'bawi_studio'),
            port=int(os.getenv('MYSQL_PORT', 3306)),
            connect_timeout=5
        )
        
        print("\n✅ Connexion MySQL réussie!")
        
        cursor = conn.cursor()
        
        # Vérifier les tables
        cursor.execute("""
            SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES 
            WHERE TABLE_SCHEMA = %s
        """, (os.getenv('MYSQL_DATABASE', 'bawi_studio'),))
        
        tables = cursor.fetchall()
        print(f"\n📊 Tables trouvées: {len(tables)}")
        for table in tables:
            print(f"   - {table[0]}")
        
        # Vérifier les admins
        cursor.execute("SELECT COUNT(*) FROM admins")
        admin_count = cursor.fetchone()[0]
        print(f"\n👤 Nombre d'admins: {admin_count}")
        
        if admin_count > 0:
            cursor.execute("SELECT username FROM admins LIMIT 1")
            admin = cursor.fetchone()
            print(f"   Admin trouvé: {admin[0]}")
        
        cursor.close()
        conn.close()
        return True
        
    except Exception as e:
        print(f"\n❌ Erreur MySQL: {e}")
        print("\n💡 Solutions:")
        print("   1. Vérifiez que XAMPP est démarré (Apache + MySQL)")
        print("   2. Vérifiez que la base 'bawi_studio' existe")
        print("   3. Vérifiez les identifiants MySQL dans .env")
        return False

def check_flask():
    """Vérifier que Flask est installé"""
    print("\n" + "=" * 60)
    print("🔍 VÉRIFICATION FLASK")
    print("=" * 60)
    
    try:
        import flask
        print(f"\n✅ Flask est installé (version {flask.__version__})")
        return True
    except ImportError:
        print("\n❌ Flask n'est pas installé")
        print("   Installez avec: pip install flask flask-cors flask-jwt-extended")
        return False

def main():
    print("\n🚀 VÉRIFICATION DE LA CONFIGURATION\n")
    
    flask_ok = check_flask()
    mysql_ok = check_mysql()
    
    print("\n" + "=" * 60)
    print("📋 RÉSUMÉ")
    print("=" * 60)
    print(f"Flask:  {'✅ OK' if flask_ok else '❌ ERREUR'}")
    print(f"MySQL:  {'✅ OK' if mysql_ok else '❌ ERREUR'}")
    
    if flask_ok and mysql_ok:
        print("\n✅ Configuration OK! Vous pouvez démarrer le backend:")
        print("   python run_backend.py")
    else:
        print("\n❌ Veuillez corriger les erreurs ci-dessus")

if __name__ == '__main__':
    main()
