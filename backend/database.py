import sqlite3
import os
from dotenv import load_dotenv

load_dotenv()

DB_FILE = os.getenv('DB_FILE', 'bawi_studio.db')

def get_db_connection():
    """Créer une connexion à la base de données SQLite"""
    try:
        connection = sqlite3.connect(DB_FILE)
        connection.row_factory = sqlite3.Row  # Pour avoir des résultats en dictionnaire
        return connection
    except Exception as e:
        print(f"Erreur de connexion à SQLite: {e}")
        return None

def init_database():
    """Initialiser la base de données et créer les tables"""
    try:
        connection = sqlite3.connect(DB_FILE)
        cursor = connection.cursor()
        
        # Table des administrateurs
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS admins (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                email TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_login TIMESTAMP,
                is_active INTEGER DEFAULT 1
            )
        """)
        
        # Table des messages clients (formulaire de contact)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS client_messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                contact TEXT NOT NULL,
                domain TEXT NOT NULL CHECK(domain IN ('company', 'student', 'individual', 'ngo')),
                project_type TEXT NOT NULL CHECK(project_type IN ('web', 'mobile', 'design', 'other')),
                budget TEXT,
                deadline TEXT,
                message TEXT NOT NULL,
                status TEXT DEFAULT 'new' CHECK(status IN ('new', 'read', 'in_progress', 'completed', 'archived')),
                priority TEXT DEFAULT 'medium' CHECK(priority IN ('low', 'medium', 'high', 'urgent')),
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Index pour client_messages
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_client_status ON client_messages(status)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_client_domain ON client_messages(domain)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_client_created ON client_messages(created_at)")
        
        # Table des autres messages (messages généraux, questions, etc.)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS general_messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                sender_name TEXT NOT NULL,
                sender_email TEXT NOT NULL,
                sender_contact TEXT,
                subject TEXT NOT NULL,
                message TEXT NOT NULL,
                category TEXT DEFAULT 'question' CHECK(category IN ('question', 'feedback', 'complaint', 'other')),
                status TEXT DEFAULT 'new' CHECK(status IN ('new', 'read', 'replied', 'archived')),
                admin_reply TEXT,
                replied_at TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Index pour general_messages
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_general_status ON general_messages(status)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_general_category ON general_messages(category)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_general_created ON general_messages(created_at)")
        
        # Table des statistiques
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS statistics (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date DATE NOT NULL UNIQUE,
                total_messages INTEGER DEFAULT 0,
                client_messages INTEGER DEFAULT 0,
                general_messages INTEGER DEFAULT 0,
                new_messages INTEGER DEFAULT 0,
                completed_messages INTEGER DEFAULT 0
            )
        """)
        
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_stats_date ON statistics(date)")
        
        # Table des logs d'activité admin
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS admin_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                admin_id INTEGER NOT NULL,
                action TEXT NOT NULL,
                details TEXT,
                ip_address TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
            )
        """)
        
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_logs_admin ON admin_logs(admin_id)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_logs_created ON admin_logs(created_at)")
        
        connection.commit()
        print("✅ Base de données SQLite initialisée avec succès!")
        print(f"📁 Fichier de base de données: {DB_FILE}")
        
        # Créer l'admin par défaut
        create_default_admin(cursor, connection)
        
        cursor.close()
        connection.close()
        
    except Exception as e:
        print(f"❌ Erreur lors de l'initialisation de la base de données: {e}")

def create_default_admin(cursor, connection):
    """Créer l'administrateur par défaut"""
    import bcrypt
    
    username = os.getenv('ADMIN_USERNAME', 'euloge')
    password = os.getenv('ADMIN_PASSWORD', '20-86')
    
    # Vérifier si l'admin existe déjà
    cursor.execute("SELECT id FROM admins WHERE username = ?", (username,))
    if cursor.fetchone():
        print(f"ℹ️  Admin '{username}' existe déjà")
        return
    
    # Hasher le mot de passe
    password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    
    # Insérer l'admin
    cursor.execute(
        "INSERT INTO admins (username, password_hash, email) VALUES (?, ?, ?)",
        (username, password_hash.decode('utf-8'), 'editchaosam@gmail.com')
    )
    connection.commit()
    print(f"✅ Admin créé: {username} / {password}")

if __name__ == "__main__":
    print("🚀 Initialisation de la base de données SQLite...")
    init_database()
