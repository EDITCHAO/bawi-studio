"""
Script d'installation automatique de la base de données MySQL
Pour Bawi Studio
"""
import mysql.connector
from mysql.connector import Error
import os
from dotenv import load_dotenv

load_dotenv()

def check_mysql_connection():
    """Vérifier si MySQL est accessible"""
    try:
        connection = mysql.connector.connect(
            host=os.getenv('MYSQL_HOST', 'localhost'),
            user=os.getenv('MYSQL_USER', 'root'),
            password=os.getenv('MYSQL_PASSWORD', ''),
            port=int(os.getenv('MYSQL_PORT', 3306))
        )
        if connection.is_connected():
            print("✅ Connexion à MySQL réussie!")
            return connection
    except Error as e:
        print(f"❌ Erreur de connexion à MySQL: {e}")
        print("\n⚠️  Assure-toi que:")
        print("   1. XAMPP est démarré")
        print("   2. MySQL est en cours d'exécution (vert dans XAMPP)")
        print("   3. Les identifiants dans .env sont corrects")
        return None

def create_database_and_tables(connection):
    """Créer la base de données et les tables"""
    try:
        cursor = connection.cursor()
        
        print("\n📋 Lecture du fichier mysql_setup.sql...")
        
        # Lire le fichier SQL
        with open('mysql_setup.sql', 'r', encoding='utf-8') as file:
            sql_content = file.read()
        
        print("⚙️  Exécution des commandes SQL...")
        
        # Exécuter le script SQL complet
        # Séparer par point-virgule et exécuter chaque commande
        for statement in sql_content.split(';'):
            statement = statement.strip()
            if statement and not statement.startswith('--'):
                try:
                    cursor.execute(statement)
                except Error as e:
                    # Ignorer certaines erreurs mineures
                    if "Unknown database" not in str(e):
                        pass
        
        connection.commit()
        print("✅ Base de données et tables créées!")
        cursor.close()
        return True
        
    except FileNotFoundError:
        print("❌ Fichier mysql_setup.sql non trouvé!")
        print("   Assure-toi d'être dans le dossier 'backend'")
        return False
    except Error as e:
        print(f"❌ Erreur lors de l'exécution du SQL: {e}")
        return False

def execute_sql_file(connection):
    """Exécuter le fichier SQL pour créer les tables"""
    try:
        cursor = connection.cursor()
        
        # Utiliser la base de données
        cursor.execute("USE bawi_studio")
        
        print("\n📋 Vérification des tables...")
        
        # Vérifier les tables créées
        cursor.execute("SHOW TABLES")
        tables = cursor.fetchall()
        
        print(f"✅ Tables créées ({len(tables)}):")
        for table in tables:
            print(f"   ✓ {table[0]}")
        
        # Vérifier l'admin
        cursor.execute("SELECT username, email FROM admins")
        admin = cursor.fetchone()
        if admin:
            print(f"\n👤 Administrateur créé:")
            print(f"   Username: {admin[0]}")
            print(f"   Email: {admin[1]}")
            print(f"   Password: 20-86")
        
        # Vérifier les données de test
        cursor.execute("SELECT COUNT(*) FROM client_messages")
        client_count = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM general_messages")
        general_count = cursor.fetchone()[0]
        
        print(f"\n📧 Données de test:")
        print(f"   Messages clients: {client_count}")
        print(f"   Messages généraux: {general_count}")
        
        cursor.close()
        return True
        
    except Error as e:
        print(f"❌ Erreur lors de la vérification: {e}")
        return False

def main():
    """Fonction principale"""
    print("=" * 60)
    print("🚀 INSTALLATION DE LA BASE DE DONNÉES MYSQL")
    print("   Projet: Bawi Studio")
    print("=" * 60)
    
    # Vérifier la connexion
    connection = check_mysql_connection()
    if not connection:
        return
    
    # Créer la base de données et les tables
    if not create_database_and_tables(connection):
        connection.close()
        return
    
    # Fermer et rouvrir la connexion avec la nouvelle base
    connection.close()
    
    try:
        connection = mysql.connector.connect(
            host=os.getenv('MYSQL_HOST', 'localhost'),
            user=os.getenv('MYSQL_USER', 'root'),
            password=os.getenv('MYSQL_PASSWORD', ''),
            database='bawi_studio',
            port=int(os.getenv('MYSQL_PORT', 3306))
        )
    except Error as e:
        print(f"❌ Erreur de reconnexion: {e}")
        return
    
    # Vérifier les tables
    if not execute_sql_file(connection):
        connection.close()
        return
    
    connection.close()
    
    print("\n" + "=" * 60)
    print("🎉 INSTALLATION TERMINÉE AVEC SUCCÈS!")
    print("=" * 60)
    print("\n📝 Prochaines étapes:")
    print("   1. Teste la connexion: python database_mysql.py")
    print("   2. Lance le backend: python app_mysql.py")
    print("   3. Lance le frontend: npm run dev")
    print("   4. Accède au dashboard: http://localhost:5173/admin")
    print("   5. Connecte-toi: euloge / 20-86")
    print("\n✨ Bon développement!")

if __name__ == "__main__":
    main()
