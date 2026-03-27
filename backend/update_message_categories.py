"""
Script pour mettre à jour les catégories des messages existants dans general_messages
"""
import mysql.connector
from dotenv import load_dotenv
import os
import sys

load_dotenv()

def update_categories():
    """Mettre à jour les catégories des messages existants"""
    conn = None
    try:
        print("Connexion à MySQL...")
        # Connexion à MySQL
        conn = mysql.connector.connect(
            host=os.getenv('MYSQL_HOST', 'localhost'),
            user=os.getenv('MYSQL_USER', 'root'),
            password=os.getenv('MYSQL_PASSWORD', ''),
            database=os.getenv('MYSQL_DATABASE', 'bawi_studio'),
            port=int(os.getenv('MYSQL_PORT', 3306)),
            connect_timeout=5
        )
        
        print("Connexion réussie!")
        cursor = conn.cursor()
        
        # Mettre à jour les messages avec category NULL ou 'other' vers 'client'
        print("Mise à jour des catégories...")
        cursor.execute("""
            UPDATE general_messages 
            SET category = 'client' 
            WHERE category IS NULL OR category = 'other' OR category = ''
        """)
        
        updated = cursor.rowcount
        conn.commit()
        
        print(f"✅ {updated} messages mis à jour avec la catégorie 'client'")
        
        # Afficher les statistiques
        cursor.execute("SELECT category, COUNT(*) FROM general_messages GROUP BY category")
        stats = cursor.fetchall()
        
        print("\n📊 Statistiques des catégories:")
        for category, count in stats:
            print(f"   - {category}: {count} messages")
        
        cursor.close()
        conn.close()
        
        print("\n✅ Mise à jour terminée avec succès!")
        return True
        
    except mysql.connector.Error as err:
        print(f"❌ Erreur MySQL: {err}")
        return False
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False
    finally:
        if conn and conn.is_connected():
            conn.close()

if __name__ == '__main__':
    print("🔄 Mise à jour des catégories des messages...")
    success = update_categories()
    sys.exit(0 if success else 1)
