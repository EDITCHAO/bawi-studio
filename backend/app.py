from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import bcrypt
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
from database import get_db_connection, init_database

load_dotenv()

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

CORS(app)
jwt = JWTManager(app)

# Initialiser la base de données au démarrage
init_database()

def dict_from_row(row):
    """Convertir une ligne SQLite en dictionnaire"""
    return dict(row) if row else None

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
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM admins WHERE username = ? AND is_active = 1", (username,))
    row = cursor.fetchone()
    
    if not row:
        cursor.close()
        conn.close()
        return jsonify({'error': 'Identifiants invalides'}), 401
    
    admin = dict_from_row(row)
    
    # Vérifier le mot de passe
    if not bcrypt.checkpw(password.encode('utf-8'), admin['password_hash'].encode('utf-8')):
        cursor.close()
        conn.close()
        return jsonify({'error': 'Identifiants invalides'}), 401
    
    # Mettre à jour last_login
    cursor.execute("UPDATE admins SET last_login = CURRENT_TIMESTAMP WHERE id = ?", (admin['id'],))
    conn.commit()
    
    # Log de connexion
    cursor.execute(
        "INSERT INTO admin_logs (admin_id, action, ip_address) VALUES (?, ?, ?)",
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
    cursor = conn.cursor()
    
    query = "SELECT * FROM client_messages WHERE 1=1"
    params = []
    
    if status:
        query += " AND status = ?"
        params.append(status)
    
    if domain:
        query += " AND domain = ?"
        params.append(domain)
    
    query += " ORDER BY created_at DESC"
    
    cursor.execute(query, params)
    messages = [dict_from_row(row) for row in cursor.fetchall()]
    
    cursor.close()
    conn.close()
    
    return jsonify(messages), 200

@app.route('/api/admin/client-messages/<int:message_id>', methods=['GET'])
def get_client_message(message_id):
    """Récupérer un message client spécifique"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM client_messages WHERE id = ?", (message_id,))
    row = cursor.fetchone()
    
    if not row:
        cursor.close()
        conn.close()
        return jsonify({'error': 'Message non trouvé'}), 404
    
    message = dict_from_row(row)
    
    # Marquer comme lu si nouveau
    if message['status'] == 'new':
        cursor.execute("UPDATE client_messages SET status = 'read' WHERE id = ?", (message_id,))
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
    cursor = conn.cursor()
    
    updates = []
    params = []
    
    if 'status' in data:
        updates.append("status = ?")
        params.append(data['status'])
    
    if 'priority' in data:
        updates.append("priority = ?")
        params.append(data['priority'])
    
    if 'notes' in data:
        updates.append("notes = ?")
        params.append(data['notes'])
    
    if not updates:
        cursor.close()
        conn.close()
        return jsonify({'error': 'Aucune donnée à mettre à jour'}), 400
    
    params.append(message_id)
    query = f"UPDATE client_messages SET {', '.join(updates)} WHERE id = ?"
    
    cursor.execute(query, params)
    conn.commit()
    
    # Log de l'action
    cursor.execute(
        "INSERT INTO admin_logs (admin_id, action, details) VALUES (?, ?, ?)",
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
    cursor = conn.cursor()
    
    # Récupérer le message avant de le supprimer
    cursor.execute("SELECT * FROM client_messages WHERE id = ?", (message_id,))
    row = cursor.fetchone()
    
    if not row:
        cursor.close()
        conn.close()
        return jsonify({'error': 'Message non trouvé'}), 404
    
    message = dict_from_row(row)
    
    # Déplacer vers la corbeille
    cursor.execute("""
        INSERT INTO deleted_messages 
        (original_id, original_type, name, email, contact, domain, project_type, 
         budget, deadline, message, status, original_created_at, deleted_by)
        VALUES (?, 'client', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        message['id'], message['name'], message['email'], message['contact'],
        message['domain'], message['project_type'], message['budget'],
        message['deadline'], message['message'], message['status'],
        message['created_at'], admin_id
    ))
    
    # Supprimer de la table originale
    cursor.execute("DELETE FROM client_messages WHERE id = ?", (message_id,))
    conn.commit()
    
    # Log de l'action
    cursor.execute(
        "INSERT INTO admin_logs (admin_id, action, details) VALUES (?, ?, ?)",
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
    cursor = conn.cursor()
    
    query = "SELECT * FROM general_messages WHERE 1=1"
    params = []
    
    if status:
        query += " AND status = ?"
        params.append(status)
    
    if category:
        query += " AND category = ?"
        params.append(category)
    
    query += " ORDER BY created_at DESC"
    
    cursor.execute(query, params)
    messages = [dict_from_row(row) for row in cursor.fetchall()]
    
    cursor.close()
    conn.close()
    
    return jsonify(messages), 200

@app.route('/api/admin/general-messages/<int:message_id>', methods=['PUT'])
def update_general_message(message_id):
    """Mettre à jour un message général"""
    data = request.get_json()
    admin_id = 1  # ID de l'admin par défaut
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    updates = []
    params = []
    
    if 'status' in data:
        updates.append("status = ?")
        params.append(data['status'])
    
    if not updates:
        cursor.close()
        conn.close()
        return jsonify({'error': 'Aucune donnée à mettre à jour'}), 400
    
    params.append(message_id)
    query = f"UPDATE general_messages SET {', '.join(updates)} WHERE id = ?"
    
    cursor.execute(query, params)
    conn.commit()
    
    # Log de l'action
    cursor.execute(
        "INSERT INTO admin_logs (admin_id, action, details) VALUES (?, ?, ?)",
        (admin_id, 'update_general_message', f'Message ID: {message_id}')
    )
    conn.commit()
    
    cursor.close()
    conn.close()
    
    return jsonify({'message': 'Message mis à jour'}), 200

@app.route('/api/admin/general-messages/<int:message_id>', methods=['DELETE'])
def delete_general_message(message_id):
    """Déplacer un message général vers la corbeille"""
    admin_id = 1  # ID de l'admin par défaut

    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Récupérer le message avant de le supprimer
    cursor.execute("SELECT * FROM general_messages WHERE id = ?", (message_id,))
    row = cursor.fetchone()
    
    if not row:
        cursor.close()
        conn.close()
        return jsonify({'error': 'Message non trouvé'}), 404
    
    message = dict_from_row(row)
    
    # Déplacer vers la corbeille
    cursor.execute("""
        INSERT INTO deleted_messages 
        (original_id, original_type, name, email, contact, subject, category,
         message, status, original_created_at, deleted_by)
        VALUES (?, 'general', ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        message['id'], message['sender_name'], message['sender_email'],
        message.get('sender_contact', ''), message['subject'], message['category'],
        message['message'], message['status'], message['created_at'], admin_id
    ))
    
    # Supprimer de la table originale
    cursor.execute("DELETE FROM general_messages WHERE id = ?", (message_id,))
    conn.commit()

    # Log de l'action
    cursor.execute(
        "INSERT INTO admin_logs (admin_id, action, details) VALUES (?, ?, ?)",
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
    cursor = conn.cursor()
    
    # Créer le message dans general_messages
    cursor.execute("""
        INSERT INTO general_messages 
        (sender_name, sender_email, sender_contact, subject, message, category, status)
        VALUES (?, ?, ?, ?, ?, ?, 'new')
    """, (
        data['sender_name'],
        data['sender_email'],
        data.get('sender_contact', ''),
        data['subject'],
        data['message'],
        data.get('category', 'other')
    ))
    
    general_message_id = cursor.lastrowid
    
    # Supprimer le message client original
    cursor.execute("DELETE FROM client_messages WHERE id = ?", (data['client_message_id'],))
    
    conn.commit()
    
    # Log de l'action
    cursor.execute(
        "INSERT INTO admin_logs (admin_id, action, details) VALUES (?, ?, ?)",
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
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM deleted_messages ORDER BY deleted_at DESC")
    messages = [dict_from_row(row) for row in cursor.fetchall()]
    
    cursor.close()
    conn.close()
    
    return jsonify(messages), 200

@app.route('/api/admin/trash/<int:trash_id>/restore', methods=['POST'])
def restore_message(trash_id):
    """Restaurer un message de la corbeille"""
    admin_id = 1
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Récupérer le message de la corbeille
    cursor.execute("SELECT * FROM deleted_messages WHERE id = ?", (trash_id,))
    row = cursor.fetchone()
    
    if not row:
        cursor.close()
        conn.close()
        return jsonify({'error': 'Message non trouvé dans la corbeille'}), 404
    
    message = dict_from_row(row)
    
    # Restaurer selon le type
    if message['original_type'] == 'client':
        cursor.execute("""
            INSERT INTO client_messages 
            (name, email, contact, domain, project_type, budget, deadline, message, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            message['name'], message['email'], message['contact'], message['domain'],
            message['project_type'], message['budget'], message['deadline'],
            message['message'], message['status'], message['original_created_at']
        ))
    else:  # general
        cursor.execute("""
            INSERT INTO general_messages 
            (sender_name, sender_email, sender_contact, subject, category, message, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            message['name'], message['email'], message['contact'], message['subject'],
            message['category'], message['message'], message['status'], message['original_created_at']
        ))
    
    # Supprimer de la corbeille
    cursor.execute("DELETE FROM deleted_messages WHERE id = ?", (trash_id,))
    conn.commit()
    
    # Log
    cursor.execute(
        "INSERT INTO admin_logs (admin_id, action, details) VALUES (?, ?, ?)",
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
    cursor = conn.cursor()
    
    # Compter les messages avant suppression
    cursor.execute("SELECT COUNT(*) FROM deleted_messages")
    count = cursor.fetchone()[0]
    
    # Supprimer tous les messages
    cursor.execute("DELETE FROM deleted_messages")
    conn.commit()
    
    # Log
    cursor.execute(
        "INSERT INTO admin_logs (admin_id, action, details) VALUES (?, ?, ?)",
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
    cursor = conn.cursor()
    
    cursor.execute("DELETE FROM deleted_messages WHERE id = ?", (trash_id,))
    conn.commit()
    
    # Log
    cursor.execute(
        "INSERT INTO admin_logs (admin_id, action, details) VALUES (?, ?, ?)",
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
    cursor = conn.cursor()
    
    cursor.execute("""
        INSERT INTO client_messages 
        (name, email, contact, domain, project_type, budget, deadline, message)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
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
        VALUES (?, 1, 1, 1)
        ON CONFLICT(date) DO UPDATE SET
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
    recent_messages = [dict_from_row(row) for row in cursor.fetchall()]
    
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

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
