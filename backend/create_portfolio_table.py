"""
Script pour créer la table du portfolio visible aux clients
"""
import mysql.connector
from dotenv import load_dotenv
import os

load_dotenv()

try:
    # Connexion à MySQL
    conn = mysql.connector.connect(
        host=os.getenv('MYSQL_HOST', 'localhost'),
        user=os.getenv('MYSQL_USER', 'root'),
        password=os.getenv('MYSQL_PASSWORD', ''),
        database=os.getenv('MYSQL_DATABASE', 'bawi_studio')
    )
    
    cursor = conn.cursor()
    
    # Vérifier que la table projects existe
    cursor.execute("SHOW TABLES LIKE 'projects'")
    if not cursor.fetchone():
        print("⚠️  La table 'projects' n'existe pas. Création en cours...")
        create_projects_query = """
        CREATE TABLE IF NOT EXISTS projects (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description LONGTEXT,
            category VARCHAR(100),
            client_name VARCHAR(255),
            image_url VARCHAR(500),
            project_url VARCHAR(500),
            technologies VARCHAR(500),
            status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
            featured BOOLEAN DEFAULT FALSE,
            order_index INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        """
        cursor.execute(create_projects_query)
        conn.commit()
        print("✅ Table 'projects' créée!")
    
    # Créer la table du portfolio
    create_table_query = """
    CREATE TABLE IF NOT EXISTS portfolio (
        id INT AUTO_INCREMENT PRIMARY KEY,
        project_id INT NOT NULL,
        image_filename VARCHAR(255) NOT NULL,
        order_index INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    """
    
    cursor.execute(create_table_query)
    conn.commit()
    
    print("✅ Table 'portfolio' créée avec succès!")
    
    cursor.close()
    conn.close()
    
except mysql.connector.Error as err:
    if err.errno == 1050:
        print("⚠️  La table 'portfolio' existe déjà")
    else:
        print(f"❌ Erreur MySQL: {err}")
except Exception as e:
    print(f"❌ Erreur: {e}")
