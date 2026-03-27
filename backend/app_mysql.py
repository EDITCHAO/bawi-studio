from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import bcrypt
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
from database_mysql import get_db_connection, dict_from_row, init_database
from werkzeug.utils import secure_filename
import shutil

load_dotenv()

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

# Configuration CORS améliorée
CORS(app, resources={
    r"/api/*": {
        "origins": ["*"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

jwt = JWTManager(app)

# Vérifier la connexion MySQL au démarrage
init_database()

# ==================== ROUTES DE TEST ====================

@app.route('/api/test', methods=['GET'])
def test():
    """Route de test pour vérifier que le backend fonctionne"""
    return jsonify({
        'status': 'ok',
        'message': 'Backend fonctionne correctement!',
        'timestamp': datetime.now().isoformat()
    }), 200

@app.route('/api/health', methods=['GET'])
def health():
    """Route de santé pour vérifier l'état du serveur"""
    try:
        conn = get_db_connection()
        if conn:
            conn.close()
            return jsonify({
                'status': 'healthy',
                'database': 'connected',
                'timestamp': datetime.now().isoformat()
            }), 200
        else:
            return jsonify({
                'status': 'unhealthy',
                'database': 'disconnected',
                'timestamp': datetime.now().isoformat()
            }), 500
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }), 500

# ==================== ROUTES D'AUTHENTIFICATION ====================

@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    """Connexion administrateur"""
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'error': 'Username et password requis'}), 400
    
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Erreur de connexion à la base de données'}), 500
    
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM admins WHERE username = %s AND is_active = 1", (username,))
    row = cursor.fetchone()
    
    if not row:
        cursor.close()
        conn.close()
        return jsonify({'error': 'Identifiants invalides'}), 401
    
    admin = dict_from_row(cursor, row)
    
    # Vérifier le mot de passe
    if not bcrypt.checkpw(password.encode('utf-8'), admin['password_hash'].encode('utf-8')):
        cursor.close()
        conn.close()
        return jsonify({'error': 'Identifiants invalides'}), 401
    
    # Mettre à jour last_login
    cursor.execute("UPDATE admins SET last_login = NOW() WHERE id = %s", (admin['id'],))
    conn.commit()
    
    # Log de connexion
    cursor.execute(
        "INSERT INTO admin_logs (admin_id, action, ip_address) VALUES (%s, %s, %s)",
        (admin['id'], 'login', request.remote_addr)
    )
    conn.commit()
    
    cursor.close()
    conn.close()
    
    # Créer le token JWT
    access_token = create_access_token(identity=admin['id'])
    
    return jsonify({
        'token': access_token,
        'admin': {
            'id': admin['id'],
            'username': admin['username'],
            'email': admin['email']
        }
    }), 200

# ==================== ROUTES MESSAGES CLIENTS ====================

@app.route('/api/admin/client-messages', methods=['GET'])
def get_client_messages():
    """Récupérer tous les messages clients"""
    status = request.args.get('status')
    domain = request.args.get('domain')
    
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Erreur de connexion à la base de données'}), 500
    
    cursor = conn.cursor()
    
    query = "SELECT * FROM client_messages WHERE 1=1"
    params = []
    
    if status:
        query += " AND status = %s"
        params.append(status)
    
    if domain:
        query += " AND domain = %s"
        params.append(domain)
    
    query += " ORDER BY created_at DESC"
    
    cursor.execute(query, params)
    messages = [dict_from_row(cursor, row) for row in cursor.fetchall()]
    
    cursor.close()
    conn.close()
    
    return jsonify(messages), 200

@app.route('/api/admin/client-messages/<int:message_id>', methods=['GET'])
def get_client_message(message_id):
    """Récupérer un message client spécifique"""
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Erreur de connexion à la base de données'}), 500
    
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM client_messages WHERE id = %s", (message_id,))
    row = cursor.fetchone()
    
    if not row:
        cursor.close()
        conn.close()
        return jsonify({'error': 'Message non trouvé'}), 404
    
    message = dict_from_row(cursor, row)
    
    # Marquer comme lu si nouveau
    if message['status'] == 'new':
        cursor.execute("UPDATE client_messages SET status = 'read' WHERE id = %s", (message_id,))
        conn.commit()
    
    cursor.close()
    conn.close()
    
    return jsonify(message), 200

@app.route('/api/admin/client-messages/<int:message_id>', methods=['PUT'])
def update_client_message(message_id):
    """Mettre à jour un message client"""
    data = request.get_json()
    admin_id = 1  # ID de l'admin par défaut
    
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Erreur de connexion à la base de données'}), 500
    
    cursor = conn.cursor()
    
    updates = []
    params = []
    
    if 'status' in data:
        updates.append("status = %s")
        params.append(data['status'])
    
    if 'priority' in data:
        updates.append("priority = %s")
        params.append(data['priority'])
    
    if 'notes' in data:
        updates.append("notes = %s")
        params.append(data['notes'])
    
    if not updates:
        cursor.close()
        conn.close()
        return jsonify({'error': 'Aucune donnée à mettre à jour'}), 400
    
    params.append(message_id)
    query = f"UPDATE client_messages SET {', '.join(updates)} WHERE id = %s"
    
    cursor.execute(query, params)
    conn.commit()
    
    # Log de l'action
    cursor.execute(
        "INSERT INTO admin_logs (admin_id, action, details) VALUES (%s, %s, %s)",
        (admin_id, 'update_client_message', f'Message ID: {message_id}')
    )
    conn.commit()
    
    cursor.close()
    conn.close()
    
    return jsonify({'message': 'Message mis à jour'}), 200

@app.route('/api/admin/client-messages/<int:message_id>', methods=['DELETE'])
def delete_client_message(message_id):
    """Déplacer un message client vers la corbeille"""
    admin_id = 1  # ID de l'admin par défaut
    
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Erreur de connexion à la base de données'}), 500
    
    cursor = conn.cursor()
    
    # Récupérer le message avant de le supprimer
    cursor.execute("SELECT * FROM client_messages WHERE id = %s", (message_id,))
    row = cursor.fetchone()
    
    if not row:
        cursor.close()
        conn.close()
        return jsonify({'error': 'Message non trouvé'}), 404
    
    message = dict_from_row(cursor, row)
    
    # Déplacer vers la corbeille
    cursor.execute("""
        INSERT INTO deleted_messages 
        (original_id, original_type, name, email, contact, domain, project_type, 
         budget, deadline, message, status, original_created_at, deleted_by)
        VALUES (%s, 'client', %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (
        message['id'], message['name'], message['email'], message['contact'],
        message['domain'], message['project_type'], message['budget'],
        message['deadline'], message['message'], message['status'],
        message['created_at'], admin_id
    ))
    
    # Supprimer de la table originale
    cursor.execute("DELETE FROM client_messages WHERE id = %s", (message_id,))
    conn.commit()
    
    # Log de l'action
    cursor.execute(
        "INSERT INTO admin_logs (admin_id, action, details) VALUES (%s, %s, %s)",
        (admin_id, 'move_to_trash', f'Client Message ID: {message_id}')
    )
    conn.commit()
    
    cursor.close()
    conn.close()
    
    return jsonify({'message': 'Message déplacé vers la corbeille'}), 200

# ==================== ROUTES MESSAGES GÉNÉRAUX ====================

@app.route('/api/admin/general-messages', methods=['GET'])
def get_general_messages():
    """Récupérer tous les messages généraux"""
    status = request.args.get('status')
    category = request.args.get('category')
    
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Erreur de connexion à la base de données'}), 500
    
    cursor = conn.cursor()
    
    query = "SELECT * FROM general_messages WHERE 1=1"
    params = []
    
    if status:
        query += " AND status = %s"
        params.append(status)
    
    if category:
        query += " AND category = %s"
        params.append(category)
    
    query += " ORDER BY created_at DESC"
    
    cursor.execute(query, params)
    messages = [dict_from_row(cursor, row) for row in cursor.fetchall()]
    
    cursor.close()
    conn.close()
    
    return jsonify(messages), 200

@app.route('/api/admin/general-messages/<int:message_id>', methods=['PUT'])
def update_general_message(message_id):
    """Mettre à jour un message général"""
    data = request.get_json()
    admin_id = 1  # ID de l'admin par défaut
    
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Erreur de connexion à la base de données'}), 500
    
    cursor = conn.cursor()
    
    updates = []
    params = []
    
    if 'status' in data:
        updates.append("status = %s")
        params.append(data['status'])
    
    if not updates:
        cursor.close()
        conn.close()
        return jsonify({'error': 'Aucune donnée à mettre à jour'}), 400
    
    params.append(message_id)
    query = f"UPDATE general_messages SET {', '.join(updates)} WHERE id = %s"
    
    cursor.execute(query, params)
    conn.commit()
    
    # Log de l'action
    cursor.execute(
        "INSERT INTO admin_logs (admin_id, action, details) VALUES (%s, %s, %s)",
        (admin_id, 'update_general_message', f'Message ID: {message_id}')
    )
    conn.commit()
    
    cursor.close()
    conn.close()
    
    return jsonify({'message': 'Message mis à jour'}), 200

@app.route('/api/admin/general-messages/<int:message_id>', methods=['DELETE'])
def delete_general_message(message_id):
    """Déplacer un message général vers la corbeille"""
    admin_id = 1

    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Erreur de connexion à la base de données'}), 500
    
    cursor = conn.cursor()
    
    # Récupérer le message avant de le supprimer
    cursor.execute("SELECT * FROM general_messages WHERE id = %s", (message_id,))
    row = cursor.fetchone()
    
    if not row:
        cursor.close()
        conn.close()
        return jsonify({'error': 'Message non trouvé'}), 404
    
    message = dict_from_row(cursor, row)
    
    # Déplacer vers la corbeille
    cursor.execute("""
        INSERT INTO deleted_messages 
        (original_id, original_type, name, email, contact, subject, category,
         message, status, original_created_at, deleted_by)
        VALUES (%s, 'general', %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (
        message['id'], message['sender_name'], message['sender_email'],
        message.get('sender_contact', ''), message['subject'], message['category'],
        message['message'], message['status'], message['created_at'], admin_id
    ))
    
    # Supprimer de la table originale
    cursor.execute("DELETE FROM general_messages WHERE id = %s", (message_id,))
    conn.commit()

    # Log de l'action
    cursor.execute(
        "INSERT INTO admin_logs (admin_id, action, details) VALUES (%s, %s, %s)",
        (admin_id, 'move_to_trash', f'General Message ID: {message_id}')
    )
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({'message': 'Message déplacé vers la corbeille'}), 200

@app.route('/api/admin/accept-client-message', methods=['POST'])
def accept_client_message():
    """Accepter un message client et le déplacer vers messages acceptés"""
    data = request.get_json()
    
    required_fields = ['client_message_id', 'sender_name', 'sender_email', 'subject', 'message']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Champ requis: {field}'}), 400
    
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Erreur de connexion à la base de données'}), 500
    
    cursor = conn.cursor()
    
    # Déterminer la catégorie basée sur le domaine
    domain = data.get('domain', 'other')
    if domain == 'student':
        category = 'student'
    else:
        category = 'client'
    
    # Créer le message dans general_messages
    cursor.execute("""
        INSERT INTO general_messages 
        (sender_name, sender_email, sender_contact, subject, message, category, status)
        VALUES (%s, %s, %s, %s, %s, %s, 'new')
    """, (
        data['sender_name'],
        data['sender_email'],
        data.get('sender_contact', ''),
        data['subject'],
        data['message'],
        category
    ))
    
    general_message_id = cursor.lastrowid
    
    # Supprimer le message client original
    cursor.execute("DELETE FROM client_messages WHERE id = %s", (data['client_message_id'],))
    
    conn.commit()
    
    # Log de l'action
    cursor.execute(
        "INSERT INTO admin_logs (admin_id, action, details) VALUES (%s, %s, %s)",
        (1, 'accept_client_message', f'Client Message ID: {data["client_message_id"]} -> General Message ID: {general_message_id}')
    )
    conn.commit()
    
    cursor.close()
    conn.close()
    
    return jsonify({
        'success': True,
        'message': 'Message accepté et déplacé',
        'general_message_id': general_message_id
    }), 201

# ==================== ROUTES CORBEILLE ====================

@app.route('/api/admin/trash', methods=['GET'])
def get_trash_messages():
    """Récupérer tous les messages dans la corbeille"""
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Erreur de connexion à la base de données'}), 500
    
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM deleted_messages ORDER BY deleted_at DESC")
    messages = [dict_from_row(cursor, row) for row in cursor.fetchall()]
    
    cursor.close()
    conn.close()
    
    return jsonify(messages), 200

@app.route('/api/admin/trash/<int:trash_id>/restore', methods=['POST'])
def restore_message(trash_id):
    """Restaurer un message de la corbeille"""
    admin_id = 1
    
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Erreur de connexion à la base de données'}), 500
    
    cursor = conn.cursor()
    
    # Récupérer le message de la corbeille
    cursor.execute("SELECT * FROM deleted_messages WHERE id = %s", (trash_id,))
    row = cursor.fetchone()
    
    if not row:
        cursor.close()
        conn.close()
        return jsonify({'error': 'Message non trouvé dans la corbeille'}), 404
    
    message = dict_from_row(cursor, row)
    
    # Restaurer selon le type
    if message['original_type'] == 'client':
        cursor.execute("""
            INSERT INTO client_messages 
            (name, email, contact, domain, project_type, budget, deadline, message, status, created_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            message['name'], message['email'], message['contact'], message['domain'],
            message['project_type'], message['budget'], message['deadline'],
            message['message'], message['status'], message['original_created_at']
        ))
    else:  # general
        cursor.execute("""
            INSERT INTO general_messages 
            (sender_name, sender_email, sender_contact, subject, category, message, status, created_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            message['name'], message['email'], message['contact'], message['subject'],
            message['category'], message['message'], message['status'], message['original_created_at']
        ))
    
    # Supprimer de la corbeille
    cursor.execute("DELETE FROM deleted_messages WHERE id = %s", (trash_id,))
    conn.commit()
    
    # Log
    cursor.execute(
        "INSERT INTO admin_logs (admin_id, action, details) VALUES (%s, %s, %s)",
        (admin_id, 'restore_from_trash', f'Trash ID: {trash_id}, Type: {message["original_type"]}')
    )
    conn.commit()
    
    cursor.close()
    conn.close()
    
    return jsonify({'message': 'Message restauré avec succès'}), 200

@app.route('/api/admin/trash/empty', methods=['DELETE'])
def empty_trash():
    """Vider complètement la corbeille"""
    admin_id = 1
    
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Erreur de connexion à la base de données'}), 500
    
    cursor = conn.cursor()
    
    # Compter les messages avant suppression
    cursor.execute("SELECT COUNT(*) FROM deleted_messages")
    count = cursor.fetchone()[0]
    
    # Supprimer tous les messages
    cursor.execute("DELETE FROM deleted_messages")
    conn.commit()
    
    # Log
    cursor.execute(
        "INSERT INTO admin_logs (admin_id, action, details) VALUES (%s, %s, %s)",
        (admin_id, 'empty_trash', f'{count} messages supprimés définitivement')
    )
    conn.commit()
    
    cursor.close()
    conn.close()
    
    return jsonify({'message': f'{count} messages supprimés définitivement'}), 200

@app.route('/api/admin/trash/<int:trash_id>', methods=['DELETE'])
def delete_permanently(trash_id):
    """Supprimer définitivement un message de la corbeille"""
    admin_id = 1
    
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Erreur de connexion à la base de données'}), 500
    
    cursor = conn.cursor()
    
    cursor.execute("DELETE FROM deleted_messages WHERE id = %s", (trash_id,))
    conn.commit()
    
    # Log
    cursor.execute(
        "INSERT INTO admin_logs (admin_id, action, details) VALUES (%s, %s, %s)",
        (admin_id, 'delete_permanently', f'Trash ID: {trash_id}')
    )
    conn.commit()
    
    cursor.close()
    conn.close()
    
    return jsonify({'message': 'Message supprimé définitivement'}), 200


# ==================== ROUTE POUR SOUMETTRE UN MESSAGE (PUBLIC) ====================

@app.route('/api/contact', methods=['POST'])
def submit_contact():
    """Soumettre un message de contact (route publique)"""
    data = request.get_json()
    
    required_fields = ['name', 'email', 'contact', 'domain', 'projectType', 'message']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Champ requis: {field}'}), 400
    
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Erreur de connexion à la base de données'}), 500
    
    cursor = conn.cursor()
    
    cursor.execute("""
        INSERT INTO client_messages 
        (name, email, contact, domain, project_type, budget, deadline, message)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """, (
        data['name'],
        data['email'],
        data['contact'],
        data['domain'],
        data['projectType'],
        data.get('budget', 'N/A'),
        data.get('deadline', 'N/A'),
        data['message']
    ))
    
    conn.commit()
    message_id = cursor.lastrowid
    
    # Mettre à jour les statistiques
    today = datetime.now().date()
    cursor.execute("""
        INSERT INTO statistics (date, total_messages, client_messages, new_messages)
        VALUES (%s, 1, 1, 1)
        ON DUPLICATE KEY UPDATE
        total_messages = total_messages + 1,
        client_messages = client_messages + 1,
        new_messages = new_messages + 1
    """, (today,))
    
    conn.commit()
    cursor.close()
    conn.close()
    
    return jsonify({
        'success': True,
        'message': 'Message envoyé avec succès',
        'id': message_id
    }), 201

# ==================== ROUTES STATISTIQUES ====================

@app.route('/api/admin/stats', methods=['GET'])
def get_stats():
    """Récupérer les statistiques du dashboard"""
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Erreur de connexion à la base de données'}), 500
    
    cursor = conn.cursor()
    
    # Messages clients
    cursor.execute("SELECT COUNT(*) as total FROM client_messages")
    total_client = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) as total FROM client_messages WHERE status = 'new'")
    new_client = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) as total FROM client_messages WHERE status = 'in_progress'")
    in_progress_client = cursor.fetchone()[0]
    
    # Messages généraux
    cursor.execute("SELECT COUNT(*) as total FROM general_messages")
    total_general = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) as total FROM general_messages WHERE status = 'new'")
    new_general = cursor.fetchone()[0]
    
    # Messages par domaine
    cursor.execute("""
        SELECT domain, COUNT(*) as count 
        FROM client_messages 
        GROUP BY domain
    """)
    by_domain = [{'domain': row[0], 'count': row[1]} for row in cursor.fetchall()]
    
    # Messages récents
    cursor.execute("""
        SELECT id, name, email, domain, project_type, created_at, status
        FROM client_messages 
        ORDER BY created_at DESC 
        LIMIT 10
    """)
    recent_messages = [dict_from_row(cursor, row) for row in cursor.fetchall()]
    
    cursor.close()
    conn.close()
    
    return jsonify({
        'client_messages': {
            'total': total_client,
            'new': new_client,
            'in_progress': in_progress_client
        },
        'general_messages': {
            'total': total_general,
            'new': new_general
        },
        'by_domain': by_domain,
        'recent_messages': recent_messages
    }), 200

# ==================== ROUTES PROJETS ====================

@app.route('/api/admin/projects', methods=['GET'])
def get_projects():
    """Récupérer tous les projets"""
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Erreur de connexion à la base de données'}), 500
    
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM projects ORDER BY order_index ASC, created_at DESC")
    rows = cursor.fetchall()
    
    projects = []
    for row in rows:
        projects.append(dict_from_row(cursor, row))
    
    cursor.close()
    conn.close()
    
    return jsonify(projects), 200

@app.route('/api/admin/projects', methods=['POST'])
def create_project():
    """Créer un nouveau projet"""
    data = request.get_json()
    
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Erreur de connexion à la base de données'}), 500
    
    cursor = conn.cursor()
    
    try:
        cursor.execute("""
            INSERT INTO projects (title, description, category, client_name, image_url, project_url, technologies, status, featured, order_index)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            data.get('title'),
            data.get('description'),
            data.get('category'),
            data.get('client_name'),
            data.get('image_url'),
            data.get('project_url'),
            data.get('technologies'),
            data.get('status', 'draft'),
            data.get('featured', False),
            data.get('order_index', 0)
        ))
        
        conn.commit()
        project_id = cursor.lastrowid
        
        cursor.close()
        conn.close()
        
        return jsonify({'id': project_id, 'message': 'Projet créé avec succès'}), 201
    except Exception as e:
        cursor.close()
        conn.close()
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/projects/<int:project_id>', methods=['GET'])
def get_project(project_id):
    """Récupérer un projet spécifique"""
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Erreur de connexion à la base de données'}), 500
    
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM projects WHERE id = %s", (project_id,))
    row = cursor.fetchone()
    
    cursor.close()
    conn.close()
    
    if not row:
        return jsonify({'error': 'Projet non trouvé'}), 404
    
    return jsonify(dict_from_row(cursor, row)), 200

@app.route('/api/admin/projects/<int:project_id>', methods=['PUT'])
def update_project(project_id):
    """Mettre à jour un projet"""
    data = request.get_json()
    
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Erreur de connexion à la base de données'}), 500
    
    cursor = conn.cursor()
    
    try:
        cursor.execute("""
            UPDATE projects 
            SET title = %s, description = %s, category = %s, client_name = %s, 
                image_url = %s, project_url = %s, technologies = %s, status = %s, 
                featured = %s, order_index = %s
            WHERE id = %s
        """, (
            data.get('title'),
            data.get('description'),
            data.get('category'),
            data.get('client_name'),
            data.get('image_url'),
            data.get('project_url'),
            data.get('technologies'),
            data.get('status'),
            data.get('featured'),
            data.get('order_index'),
            project_id
        ))
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({'message': 'Projet mis à jour avec succès'}), 200
    except Exception as e:
        cursor.close()
        conn.close()
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/projects/<int:project_id>', methods=['DELETE'])
def delete_project(project_id):
    """Supprimer un projet"""
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Erreur de connexion à la base de données'}), 500
    
    cursor = conn.cursor()
    
    try:
        cursor.execute("DELETE FROM projects WHERE id = %s", (project_id,))
        conn.commit()
        
        cursor.close()
        conn.close()
        
        return jsonify({'message': 'Projet supprimé avec succès'}), 200
    except Exception as e:
        cursor.close()
        conn.close()
        return jsonify({'error': str(e)}), 500

# ==================== ROUTES PORTFOLIO ====================

# Configuration pour les uploads
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), '..', 'public', 'images')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/admin/portfolio', methods=['GET'])
def get_portfolio():
    """Récupérer le portfolio visible aux clients (max 6 projets)"""
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Erreur de connexion à la base de données'}), 500
    
    cursor = conn.cursor()
    cursor.execute("""
        SELECT p.*, pr.title, pr.description, pr.category, pr.client_name, pr.technologies
        FROM portfolio p
        JOIN projects pr ON p.project_id = pr.id
        ORDER BY p.order_index ASC
        LIMIT 6
    """)
    rows = cursor.fetchall()
    
    portfolio = []
    for row in rows:
        portfolio.append(dict_from_row(cursor, row))
    
    cursor.close()
    conn.close()
    
    return jsonify(portfolio), 200

@app.route('/api/admin/portfolio/add', methods=['POST'])
def add_to_portfolio():
    """Ajouter un projet au portfolio visible"""
    data = request.form
    project_id = data.get('project_id')
    
    # Vérifier le nombre de projets dans le portfolio
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Erreur de connexion à la base de données'}), 500
    
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) as count FROM portfolio")
    result = cursor.fetchone()
    count = result[0] if result else 0
    
    if count >= 6:
        cursor.close()
        conn.close()
        return jsonify({'error': 'Maximum 6 projets dans le portfolio'}), 400
    
    # Gérer l'upload d'image
    image_filename = None
    if 'image' in request.files:
        file = request.files['image']
        if file and allowed_file(file.filename):
            # Créer le dossier s'il n'existe pas
            os.makedirs(UPLOAD_FOLDER, exist_ok=True)
            
            # Générer un nom de fichier unique
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S_')
            image_filename = timestamp + secure_filename(file.filename)
            filepath = os.path.join(UPLOAD_FOLDER, image_filename)
            
            # Sauvegarder le fichier
            file.save(filepath)
    
    try:
        cursor.execute("""
            INSERT INTO portfolio (project_id, image_filename, order_index)
            VALUES (%s, %s, %s)
        """, (project_id, image_filename, count))
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({'message': 'Projet ajouté au portfolio', 'image': image_filename}), 201
    except Exception as e:
        cursor.close()
        conn.close()
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/portfolio/<int:portfolio_id>', methods=['DELETE'])
def remove_from_portfolio(portfolio_id):
    """Retirer un projet du portfolio"""
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Erreur de connexion à la base de données'}), 500
    
    cursor = conn.cursor()
    
    try:
        # Récupérer le nom du fichier image
        cursor.execute("SELECT image_filename FROM portfolio WHERE id = %s", (portfolio_id,))
        row = cursor.fetchone()
        
        if row and row[0]:
            # Supprimer le fichier image
            filepath = os.path.join(UPLOAD_FOLDER, row[0])
            if os.path.exists(filepath):
                os.remove(filepath)
        
        # Supprimer de la base de données
        cursor.execute("DELETE FROM portfolio WHERE id = %s", (portfolio_id,))
        conn.commit()
        
        cursor.close()
        conn.close()
        
        return jsonify({'message': 'Projet retiré du portfolio'}), 200
    except Exception as e:
        cursor.close()
        conn.close()
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/portfolio/reorder', methods=['PUT'])
def reorder_portfolio():
    """Réorganiser l'ordre du portfolio"""
    data = request.get_json()
    
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Erreur de connexion à la base de données'}), 500
    
    cursor = conn.cursor()
    
    try:
        for item in data.get('items', []):
            cursor.execute("""
                UPDATE portfolio 
                SET order_index = %s
                WHERE id = %s
            """, (item['order_index'], item['id']))
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({'message': 'Portfolio réorganisé'}), 200
    except Exception as e:
        cursor.close()
        conn.close()
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port, use_reloader=False)
