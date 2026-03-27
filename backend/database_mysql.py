import mysql.connector
from mysql.connector import Error
import os
from dotenv import load_dotenv

load_dotenv()

# Configuration MySQL
MYSQL_CONFIG = {
    'host': os.getenv('MYSQL_HOST', 'localhost'),
    'user': os.getenv('MYSQL_USER', 'root'),
    'password': os.getenv('MYSQL_PASSWORD', ''),
    'database': os.getenv('MYSQL_DATABASE', 'bawi_studio'),
    'port': int(os.getenv('MYSQL_PORT', 3306))
}

def get_db_connection():
    """Créer une connexion à la base de données MySQL"""
    try:
        connection = mysql.connector.connect(**MYSQL_CONFIG)
        if connection.is_connected():
            return connection
    except Error as e:
        print(f"Erreur de connexion à MySQL: {e}")
        return None

def dict_from_row(cursor, row):
    """Convertir une ligne MySQL en dictionnaire"""
    if row is None:
        return None
    columns = [column[0] for column in cursor.description]
    return dict(zip(columns, row))

def init_database():
    """Vérifier la connexion à la base de données MySQL"""
    try:
        connection = get_db_connection()
        if connection and connection.is_connected():
            db_info = connection.get_server_info()
            print(f"✅ Connecté à MySQL Server version {db_info}")
            
            cursor = connection.cursor()
            cursor.execute("SELECT DATABASE();")
            record = cursor.fetchone()
            print(f"✅ Base de données active: {record[0]}")
            
            # Vérifier les tables
            cursor.execute("SHOW TABLES;")
            tables = cursor.fetchall()
            print(f"✅ Tables trouvées: {len(tables)}")
            for table in tables:
                print(f"   - {table[0]}")
            
            cursor.close()
            connection.close()
            return True
        else:
            print("❌ Impossible de se connecter à MySQL")
            return False
            
    except Error as e:
        print(f"❌ Erreur lors de la vérification de la base de données: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Vérification de la connexion MySQL...")
    init_database()
