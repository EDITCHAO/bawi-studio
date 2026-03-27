"""
Script pour vérifier le contenu de la base de données
"""
import sqlite3
from datetime import datetime

DB_FILE = 'bawi_studio.db'

def check_database():
    """Vérifier le contenu de la base de données"""
    try:
        connection = sqlite3.connect(DB_FILE)
        cursor = connection.cursor()
        
        print("=" * 60)
        print("📊 VÉRIFICATION DE LA BASE DE DONNÉES")
        print("=" * 60)
        print()
        
        # Vérifier les admins
        cursor.execute("SELECT COUNT(*) FROM admins")
        admin_count = cursor.fetchone()[0]
        print(f"👤 Administrateurs: {admin_count}")
        
        if admin_count > 0:
            cursor.execute("SELECT username, email, created_at FROM admins")
            for row in cursor.fetchall():
                print(f"   - {row[0]} ({row[1]}) - Créé le {row[2]}")
        print()
        
        # Vérifier les messages clients
        cursor.execute("SELECT COUNT(*) FROM client_messages")
        client_count = cursor.fetchone()[0]
        print(f"💼 Messages Clients: {client_count}")
        
        if client_count > 0:
            cursor.execute("""
                SELECT status, COUNT(*) 
                FROM client_messages 
                GROUP BY status
            """)
            print("   Par statut:")
            for row in cursor.fetchall():
                print(f"   - {row[0]}: {row[1]}")
            
            cursor.execute("""
                SELECT domain, COUNT(*) 
                FROM client_messages 
                GROUP BY domain
            """)
            print("   Par domaine:")
            for row in cursor.fetchall():
                domain_labels = {
                    'company': '🏢 Entreprise',
                    'student': '🎓 Étudiant',
                    'individual': '👤 Particulier',
                    'ngo': '🤝 ONG'
                }
                label = domain_labels.get(row[0], row[0])
                print(f"   - {label}: {row[1]}")
        print()
        
        # Vérifier les messages généraux
        cursor.execute("SELECT COUNT(*) FROM general_messages")
        general_count = cursor.fetchone()[0]
        print(f"📧 Messages Généraux: {general_count}")
        
        if general_count > 0:
            cursor.execute("""
                SELECT status, COUNT(*) 
                FROM general_messages 
                GROUP BY status
            """)
            print("   Par statut:")
            for row in cursor.fetchall():
                print(f"   - {row[0]}: {row[1]}")
            
            cursor.execute("""
                SELECT category, COUNT(*) 
                FROM general_messages 
                GROUP BY category
            """)
            print("   Par catégorie:")
            for row in cursor.fetchall():
                print(f"   - {row[0]}: {row[1]}")
        print()
        
        # Vérifier les statistiques
        cursor.execute("SELECT COUNT(*) FROM statistics")
        stats_count = cursor.fetchone()[0]
        print(f"📈 Entrées de statistiques: {stats_count}")
        print()
        
        # Vérifier les logs
        cursor.execute("SELECT COUNT(*) FROM admin_logs")
        logs_count = cursor.fetchone()[0]
        print(f"📝 Logs d'activité: {logs_count}")
        print()
        
        # Afficher les 5 derniers messages clients
        if client_count > 0:
            print("=" * 60)
            print("📋 5 DERNIERS MESSAGES CLIENTS")
            print("=" * 60)
            cursor.execute("""
                SELECT name, email, domain, project_type, status, created_at
                FROM client_messages
                ORDER BY created_at DESC
                LIMIT 5
            """)
            for i, row in enumerate(cursor.fetchall(), 1):
                print(f"\n{i}. {row[0]} ({row[1]})")
                print(f"   Domaine: {row[2]} | Projet: {row[3]} | Statut: {row[4]}")
                print(f"   Date: {row[5]}")
        
        # Afficher les 5 derniers messages généraux
        if general_count > 0:
            print()
            print("=" * 60)
            print("📋 5 DERNIERS MESSAGES GÉNÉRAUX")
            print("=" * 60)
            cursor.execute("""
                SELECT sender_name, sender_email, subject, category, status, created_at
                FROM general_messages
                ORDER BY created_at DESC
                LIMIT 5
            """)
            for i, row in enumerate(cursor.fetchall(), 1):
                print(f"\n{i}. {row[0]} ({row[1]})")
                print(f"   Sujet: {row[2]}")
                print(f"   Catégorie: {row[3]} | Statut: {row[4]}")
                print(f"   Date: {row[5]}")
        
        print()
        print("=" * 60)
        print("✅ VÉRIFICATION TERMINÉE")
        print("=" * 60)
        print()
        
        if client_count == 0 and general_count == 0:
            print("⚠️  AUCUNE DONNÉE TROUVÉE!")
            print()
            print("Pour ajouter des données de test, exécute:")
            print("   python add_test_data.py")
        else:
            print("🎉 La base de données contient des données!")
            print()
            print("Pour voir le dashboard:")
            print("   1. Démarre le backend: python app.py")
            print("   2. Démarre le frontend: npm run dev")
            print("   3. Ouvre: http://localhost:5173/admin")
            print("   4. Connecte-toi: euloge / 20-86")
        
        cursor.close()
        connection.close()
        
    except sqlite3.Error as e:
        print(f"❌ Erreur SQLite: {e}")
    except Exception as e:
        print(f"❌ Erreur: {e}")

if __name__ == "__main__":
    check_database()
