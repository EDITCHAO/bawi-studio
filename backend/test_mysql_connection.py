"""
Script simple pour tester la connexion MySQL
"""
import mysql.connector
from mysql.connector import Error
import os
from dotenv import load_dotenv

load_dotenv()

print("=" * 60)
print("🔍 TEST DE CONNEXION MYSQL")
print("=" * 60)
print()

# Configuration
host = os.getenv('MYSQL_HOST', 'localhost')
user = os.getenv('MYSQL_USER', 'root')
password = os.getenv('MYSQL_PASSWORD', '')
port = int(os.getenv('MYSQL_PORT', 3306))

print(f"Configuration:")
print(f"  Host: {host}")
print(f"  User: {user}")
print(f"  Port: {port}")
print(f"  Password: {'(vide)' if not password else '***'}")
print()

# Test 1: Connexion au serveur MySQL (sans base de données)
print("Test 1: Connexion au serveur MySQL...")
try:
    connection = mysql.connector.connect(
        host=host,
        user=user,
        password=password,
        port=port
    )
    
    if connection.is_connected():
        db_info = connection.get_server_info()
        print(f"✅ Connecté à MySQL Server version {db_info}")
        
        cursor = connection.cursor()
        
        # Lister les bases de données
        cursor.execute("SHOW DATABASES")
        databases = cursor.fetchall()
        print(f"\n📊 Bases de données disponibles ({len(databases)}):")
        for db in databases:
            print(f"   - {db[0]}")
        
        # Vérifier si bawi_studio existe
        cursor.execute("SHOW DATABASES LIKE 'bawi_studio'")
        result = cursor.fetchone()
        
        print()
        if result:
            print("✅ La base 'bawi_studio' existe!")
            
            # Vérifier les tables
            cursor.execute("USE bawi_studio")
            cursor.execute("SHOW TABLES")
            tables = cursor.fetchall()
            print(f"\n📋 Tables dans bawi_studio ({len(tables)}):")
            for table in tables:
                print(f"   - {table[0]}")
        else:
            print("⚠️  La base 'bawi_studio' n'existe pas encore!")
            print()
            print("Pour la créer, exécute:")
            print("  1. Ouvre phpMyAdmin: http://localhost/phpmyadmin")
            print("  2. Clique sur 'SQL'")
            print("  3. Copie le contenu de mysql_setup.sql")
            print("  4. Colle et clique 'Exécuter'")
            print()
            print("OU exécute:")
            print("  python setup_mysql.py")
        
        cursor.close()
        connection.close()
        
except Error as e:
    print(f"❌ Erreur de connexion: {e}")
    print()
    print("⚠️  Vérifications:")
    print("  1. XAMPP est-il démarré?")
    print("  2. MySQL est-il en cours d'exécution (vert dans XAMPP)?")
    print("  3. Le port 3306 est-il disponible?")
    print("  4. Les identifiants dans .env sont-ils corrects?")
    print()
    print("Pour démarrer MySQL:")
    print("  1. Ouvre XAMPP Control Panel")
    print("  2. Clique 'Start' à côté de MySQL")
    print("  3. Attends que MySQL devienne vert")

print()
print("=" * 60)
