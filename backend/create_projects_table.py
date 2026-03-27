"""
Script pour créer la table des projets de réalisation
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
    
    # Créer la table des projets
    create_table_query = """
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
    
    cursor.execute(create_table_query)
    conn.commit()
    
    print("✅ Table 'projects' créée avec succès!")
    
    # Ajouter quelques projets d'exemple
    insert_example_query = """
    INSERT INTO projects (title, description, category, client_name, technologies, status, featured, order_index)
    VALUES 
    ('Site Vitrine', 'Un site vitrine moderne et responsive', 'Site Vitrine', 'Client 1', 'React, CSS, JavaScript', 'published', TRUE, 1),
    ('Application Mobile', 'Application mobile pour iOS et Android', 'Application Mobile', 'Client 2', 'React Native, Firebase', 'published', TRUE, 2),
    ('E-commerce', 'Plateforme e-commerce complète', 'E-commerce', 'Client 3', 'React, Node.js, MongoDB', 'published', FALSE, 3);
    """
    
    cursor.execute(insert_example_query)
    conn.commit()
    
    print("✅ Projets d'exemple ajoutés!")
    
    cursor.close()
    conn.close()
    
except mysql.connector.Error as err:
    if err.errno == 1050:
        print("⚠️  La table 'projects' existe déjà")
    else:
        print(f"❌ Erreur MySQL: {err}")
except Exception as e:
    print(f"❌ Erreur: {e}")
