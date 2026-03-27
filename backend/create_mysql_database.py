"""
Script pour créer la base de données MySQL directement en Python
"""
import mysql.connector
from mysql.connector import Error
import os
from dotenv import load_dotenv
import bcrypt

load_dotenv()

def main():
    print("=" * 70)
    print("🚀 CRÉATION DE LA BASE DE DONNÉES MYSQL - BAWI STUDIO")
    print("=" * 70)
    print()
    
    # Configuration
    host = os.getenv('MYSQL_HOST', 'localhost')
    user = os.getenv('MYSQL_USER', 'root')
    password = os.getenv('MYSQL_PASSWORD', '')
    port = int(os.getenv('MYSQL_PORT', 3306))
    
    try:
        # Connexion au serveur MySQL
        print("📡 Connexion au serveur MySQL...")
        connection = mysql.connector.connect(
            host=host,
            user=user,
            password=password,
            port=port
        )
        
        if not connection.is_connected():
            print("❌ Impossible de se connecter à MySQL")
            return
        
        print("✅ Connecté à MySQL")
        cursor = connection.cursor()
        
        # Supprimer l'ancienne base si elle existe
        print("\n🗑️  Suppression de l'ancienne base (si elle existe)...")
        cursor.execute("DROP DATABASE IF EXISTS bawi_studio")
        
        # Créer la nouvelle base
        print("🔨 Création de la base de données 'bawi_studio'...")
        cursor.execute("CREATE DATABASE bawi_studio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
        
        # Utiliser la nouvelle base
        cursor.execute("USE bawi_studio")
        print("✅ Base de données créée!")
        
        # Créer les tables
        print("\n📋 Création des tables...")
        
        # Table admins
        print("   → admins...")
        cursor.execute("""
            CREATE TABLE admins (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                email VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_login TIMESTAMP NULL,
                is_active TINYINT(1) DEFAULT 1,
                INDEX idx_username (username),
                INDEX idx_is_active (is_active)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """)
        
        # Table client_messages
        print("   → client_messages...")
        cursor.execute("""
            CREATE TABLE client_messages (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL,
                contact VARCHAR(50) NOT NULL,
                domain ENUM('company', 'student', 'individual', 'ngo') NOT NULL,
                project_type ENUM('web', 'mobile', 'design', 'other') NOT NULL,
                budget VARCHAR(50),
                deadline VARCHAR(50),
                message TEXT NOT NULL,
                status ENUM('new', 'read', 'in_progress', 'completed', 'archived') DEFAULT 'new',
                priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_status (status),
                INDEX idx_domain (domain),
                INDEX idx_priority (priority),
                INDEX idx_created_at (created_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """)
        
        # Table general_messages
        print("   → general_messages...")
        cursor.execute("""
            CREATE TABLE general_messages (
                id INT AUTO_INCREMENT PRIMARY KEY,
                sender_name VARCHAR(100) NOT NULL,
                sender_email VARCHAR(100) NOT NULL,
                sender_contact VARCHAR(50),
                subject VARCHAR(200) NOT NULL,
                message TEXT NOT NULL,
                category ENUM('question', 'feedback', 'complaint', 'other') DEFAULT 'question',
                status ENUM('new', 'read', 'replied', 'archived') DEFAULT 'new',
                admin_reply TEXT,
                replied_at TIMESTAMP NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_status (status),
                INDEX idx_category (category),
                INDEX idx_created_at (created_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """)
        
        # Table deleted_messages
        print("   → deleted_messages...")
        cursor.execute("""
            CREATE TABLE deleted_messages (
                id INT AUTO_INCREMENT PRIMARY KEY,
                original_id INT NOT NULL,
                original_type ENUM('client', 'general') NOT NULL,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL,
                contact VARCHAR(50),
                domain VARCHAR(50),
                project_type VARCHAR(50),
                budget VARCHAR(50),
                deadline VARCHAR(50),
                subject VARCHAR(200),
                category VARCHAR(50),
                message TEXT NOT NULL,
                status VARCHAR(50),
                original_created_at TIMESTAMP NULL,
                deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                deleted_by INT,
                INDEX idx_original_type (original_type),
                INDEX idx_deleted_at (deleted_at),
                FOREIGN KEY (deleted_by) REFERENCES admins(id) ON DELETE SET NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """)
        
        # Table statistics
        print("   → statistics...")
        cursor.execute("""
            CREATE TABLE statistics (
                id INT AUTO_INCREMENT PRIMARY KEY,
                date DATE NOT NULL UNIQUE,
                total_messages INT DEFAULT 0,
                client_messages INT DEFAULT 0,
                general_messages INT DEFAULT 0,
                new_messages INT DEFAULT 0,
                completed_messages INT DEFAULT 0,
                INDEX idx_date (date)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """)
        
        # Table admin_logs
        print("   → admin_logs...")
        cursor.execute("""
            CREATE TABLE admin_logs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                admin_id INT NOT NULL,
                action VARCHAR(100) NOT NULL,
                details TEXT,
                ip_address VARCHAR(45),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_admin_id (admin_id),
                INDEX idx_action (action),
                INDEX idx_created_at (created_at),
                FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """)
        
        connection.commit()
        print("✅ Toutes les tables créées!")
        
        # Insérer l'administrateur
        print("\n👤 Création de l'administrateur...")
        password_hash = bcrypt.hashpw('20-86'.encode('utf-8'), bcrypt.gensalt())
        cursor.execute(
            "INSERT INTO admins (username, password_hash, email) VALUES (%s, %s, %s)",
            ('euloge', password_hash.decode('utf-8'), 'editchaosam@gmail.com')
        )
        connection.commit()
        print("✅ Administrateur créé: euloge / 20-86")
        
        # Insérer des données de test
        print("\n📧 Insertion des données de test...")
        
        # Messages clients
        client_messages = [
            ('Jean Dupont', 'jean.dupont@example.com', '+33612345678', 'company', 'web', '5000-10000€', '3 mois', 'Nous avons besoin d un site e-commerce pour notre boutique.', 'new', 'high'),
            ('Marie Martin', 'marie.martin@example.com', '+33698765432', 'student', 'mobile', '1000-3000€', '2 mois', 'Je cherche à développer une application mobile pour mon projet de fin d études.', 'new', 'medium'),
            ('Pierre Durand', 'pierre.durand@example.com', '+33687654321', 'individual', 'design', '500-1000€', '1 mois', 'J ai besoin d un logo et d une identité visuelle pour mon entreprise.', 'read', 'low'),
            ('Sophie Bernard', 'sophie.bernard@example.com', '+33676543210', 'ngo', 'web', '3000-5000€', '4 mois', 'Notre ONG a besoin d un site web pour présenter nos actions.', 'in_progress', 'high')
        ]
        
        for msg in client_messages:
            cursor.execute("""
                INSERT INTO client_messages 
                (name, email, contact, domain, project_type, budget, deadline, message, status, priority) 
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, msg)
        
        # Messages généraux
        general_messages = [
            ('Luc Petit', 'luc.petit@example.com', '+33665432109', 'Question sur vos services', 'Bonjour, je voudrais savoir si vous proposez des services de maintenance?', 'question', 'new'),
            ('Emma Roux', 'emma.roux@example.com', '+33654321098', 'Excellent travail!', 'Je tiens à vous remercier pour le travail exceptionnel réalisé sur mon site.', 'feedback', 'read')
        ]
        
        for msg in general_messages:
            cursor.execute("""
                INSERT INTO general_messages 
                (sender_name, sender_email, sender_contact, subject, message, category, status) 
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, msg)
        
        # Statistiques
        cursor.execute("""
            INSERT INTO statistics (date, total_messages, client_messages, general_messages, new_messages, completed_messages)
            VALUES
            (CURDATE(), 6, 4, 2, 5, 0),
            (DATE_SUB(CURDATE(), INTERVAL 1 DAY), 3, 2, 1, 2, 1),
            (DATE_SUB(CURDATE(), INTERVAL 2 DAY), 5, 3, 2, 3, 2)
        """)
        
        connection.commit()
        print("✅ Données de test insérées!")
        
        # Vérification finale
        print("\n📊 Vérification finale...")
        cursor.execute("SHOW TABLES")
        tables = cursor.fetchall()
        print(f"   Tables: {len(tables)}")
        
        cursor.execute("SELECT COUNT(*) FROM admins")
        print(f"   Admins: {cursor.fetchone()[0]}")
        
        cursor.execute("SELECT COUNT(*) FROM client_messages")
        print(f"   Messages clients: {cursor.fetchone()[0]}")
        
        cursor.execute("SELECT COUNT(*) FROM general_messages")
        print(f"   Messages généraux: {cursor.fetchone()[0]}")
        
        cursor.close()
        connection.close()
        
        print("\n" + "=" * 70)
        print("🎉 INSTALLATION TERMINÉE AVEC SUCCÈS!")
        print("=" * 70)
        print("\n📝 Prochaines étapes:")
        print("   1. Teste la connexion: python test_mysql_connection.py")
        print("   2. Lance le backend: python app_mysql.py")
        print("   3. Lance le frontend: npm run dev")
        print("   4. Accède au dashboard: http://localhost:5173/admin")
        print("   5. Connecte-toi: euloge / 20-86")
        print("\n✨ Bon développement!")
        
    except Error as e:
        print(f"\n❌ Erreur: {e}")
        print("\n⚠️  Vérifications:")
        print("  1. XAMPP est-il démarré?")
        print("  2. MySQL est-il en cours d'exécution?")
        print("  3. Les identifiants dans .env sont-ils corrects?")

if __name__ == "__main__":
    main()
