"""
Script pour ajouter la table corbeille (deleted_messages)
"""
import sqlite3

DB_FILE = 'bawi_studio.db'

def add_trash_table():
    """Ajouter la table deleted_messages"""
    connection = sqlite3.connect(DB_FILE)
    cursor = connection.cursor()
    
    print("🗑️ Création de la table corbeille...")
    
    # Table des messages supprimés (corbeille)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS deleted_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            original_id INTEGER NOT NULL,
            original_type TEXT NOT NULL CHECK(original_type IN ('client', 'general')),
            name TEXT,
            email TEXT,
            contact TEXT,
            domain TEXT,
            project_type TEXT,
            budget TEXT,
            deadline TEXT,
            subject TEXT,
            category TEXT,
            message TEXT NOT NULL,
            status TEXT,
            original_created_at TIMESTAMP,
            deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            deleted_by INTEGER,
            FOREIGN KEY (deleted_by) REFERENCES admins(id) ON DELETE SET NULL
        )
    """)
    
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_deleted_type ON deleted_messages(original_type)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_deleted_date ON deleted_messages(deleted_at)")
    
    connection.commit()
    cursor.close()
    connection.close()
    
    print("✅ Table corbeille créée avec succès!")
    print("📊 La corbeille peut maintenant stocker les messages supprimés")
    print("🔄 Les messages peuvent être restaurés ou supprimés définitivement")

if __name__ == "__main__":
    add_trash_table()
