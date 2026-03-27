"""
Script pour ajouter des données de test dans la base de données
"""
import sqlite3
from datetime import datetime, timedelta
import random

DB_FILE = 'bawi_studio.db'

def add_test_data():
    """Ajouter des données de test"""
    connection = sqlite3.connect(DB_FILE)
    cursor = connection.cursor()
    
    print("🚀 Ajout de données de test...")
    
    # Messages clients de test
    client_messages = [
        {
            'name': 'Jean Kouassi',
            'email': 'jean.kouassi@example.com',
            'contact': '+228 90 12 34 56',
            'domain': 'company',
            'project_type': 'web',
            'budget': '3000-5000€',
            'deadline': '3-6 mois',
            'message': 'Bonjour, je souhaite créer un site e-commerce pour vendre des produits artisanaux africains. J\'ai besoin d\'un système de paiement mobile money intégré.',
            'status': 'new'
        },
        {
            'name': 'Marie Adjo',
            'email': 'marie.adjo@univ.tg',
            'contact': '+228 91 23 45 67',
            'domain': 'student',
            'project_type': 'web',
            'budget': 'N/A',
            'deadline': 'N/A',
            'message': 'Je suis étudiante en informatique et j\'ai besoin d\'aide pour mon projet de fin d\'études. Il s\'agit d\'une plateforme de gestion de bibliothèque universitaire.',
            'status': 'read'
        },
        {
            'name': 'Kofi Mensah',
            'email': 'kofi.mensah@gmail.com',
            'contact': '+228 92 34 56 78',
            'domain': 'individual',
            'project_type': 'mobile',
            'budget': '1000-3000€',
            'deadline': '1-3 mois',
            'message': 'Je veux développer une application mobile pour mon restaurant. Les clients pourront commander en ligne et suivre la livraison en temps réel.',
            'status': 'in_progress'
        },
        {
            'name': 'ONG Espoir Afrique',
            'email': 'contact@espoirafrique.org',
            'contact': '+228 93 45 67 89',
            'domain': 'ngo',
            'project_type': 'web',
            'budget': '5000-10000€',
            'deadline': '6+ mois',
            'message': 'Notre ONG a besoin d\'une plateforme web pour gérer nos projets humanitaires et recevoir des dons en ligne. Nous voulons aussi un espace membre pour nos bénévoles.',
            'status': 'new'
        },
        {
            'name': 'Ama Tetteh',
            'email': 'ama.tetteh@business.com',
            'contact': '+228 94 56 78 90',
            'domain': 'company',
            'project_type': 'design',
            'budget': '1000-3000€',
            'deadline': '1-3 mois',
            'message': 'Je cherche un designer UI/UX pour refaire l\'identité visuelle de mon entreprise de cosmétiques. J\'ai besoin d\'un logo moderne et d\'une charte graphique complète.',
            'status': 'completed'
        },
        {
            'name': 'Kwame Asante',
            'email': 'kwame@startup.tg',
            'contact': '+228 95 67 89 01',
            'domain': 'company',
            'project_type': 'mobile',
            'budget': '10000+€',
            'deadline': '6+ mois',
            'message': 'Startup fintech cherche développeur pour créer une application de transfert d\'argent mobile. Besoin d\'une solution sécurisée avec authentification biométrique.',
            'status': 'in_progress'
        },
        {
            'name': 'Fatou Diallo',
            'email': 'fatou.diallo@edu.tg',
            'contact': '+228 96 78 90 12',
            'domain': 'student',
            'project_type': 'mobile',
            'budget': 'N/A',
            'deadline': 'N/A',
            'message': 'Projet de licence: application mobile pour apprendre les langues locales africaines. J\'ai besoin d\'aide pour la partie technique.',
            'status': 'new'
        },
        {
            'name': 'Yao Koffi',
            'email': 'yao.koffi@perso.com',
            'contact': '+228 97 89 01 23',
            'domain': 'individual',
            'project_type': 'web',
            'budget': '500-1000€',
            'deadline': '1-3 mois',
            'message': 'Je suis photographe et je veux un site portfolio pour présenter mon travail. Design minimaliste et élégant souhaité.',
            'status': 'read'
        },
        {
            'name': 'Entreprise AgriTech',
            'email': 'info@agritech.tg',
            'contact': '+228 98 90 12 34',
            'domain': 'company',
            'project_type': 'web',
            'budget': '5000-10000€',
            'deadline': '3-6 mois',
            'message': 'Plateforme web pour connecter les agriculteurs aux acheteurs. Besoin de fonctionnalités de géolocalisation, chat en temps réel et système de notation.',
            'status': 'new'
        },
        {
            'name': 'Abena Osei',
            'email': 'abena@fashion.com',
            'contact': '+228 99 01 23 45',
            'domain': 'individual',
            'project_type': 'web',
            'budget': '3000-5000€',
            'deadline': '3-6 mois',
            'message': 'Créatrice de mode cherche à créer une boutique en ligne pour vendre mes créations. J\'ai besoin d\'un site avec galerie photo professionnelle.',
            'status': 'in_progress'
        }
    ]
    
    # Insérer les messages clients
    for i, msg in enumerate(client_messages):
        # Varier les dates de création (derniers 15 jours)
        days_ago = random.randint(0, 15)
        created_at = (datetime.now() - timedelta(days=days_ago)).strftime('%Y-%m-%d %H:%M:%S')
        
        cursor.execute("""
            INSERT INTO client_messages 
            (name, email, contact, domain, project_type, budget, deadline, message, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            msg['name'], msg['email'], msg['contact'], msg['domain'],
            msg['project_type'], msg['budget'], msg['deadline'],
            msg['message'], msg['status'], created_at
        ))
        print(f"✅ Message client {i+1}/10 ajouté: {msg['name']}")
    
    # Messages généraux de test
    general_messages = [
        {
            'sender_name': 'Paul Mensah',
            'sender_email': 'paul@example.com',
            'sender_contact': '+228 90 11 22 33',
            'subject': 'Question sur vos tarifs',
            'message': 'Bonjour, pouvez-vous m\'envoyer une grille tarifaire détaillée pour vos différents services ?',
            'category': 'question',
            'status': 'new'
        },
        {
            'sender_name': 'Sophie Kone',
            'sender_email': 'sophie@mail.com',
            'sender_contact': '+228 91 22 33 44',
            'subject': 'Excellent travail !',
            'message': 'Je voulais vous remercier pour le site web que vous avez créé pour mon entreprise. Mes clients adorent le design !',
            'category': 'feedback',
            'status': 'read'
        },
        {
            'sender_name': 'David Akoto',
            'sender_email': 'david@company.tg',
            'sender_contact': '+228 92 33 44 55',
            'subject': 'Délai de livraison',
            'message': 'Le projet devait être livré la semaine dernière. Pouvez-vous me donner une mise à jour sur l\'avancement ?',
            'category': 'complaint',
            'status': 'replied'
        },
        {
            'sender_name': 'Grace Owusu',
            'sender_email': 'grace@startup.com',
            'sender_contact': '+228 93 44 55 66',
            'subject': 'Partenariat possible',
            'message': 'Notre startup cherche un partenaire technique pour développer notre MVP. Seriez-vous intéressés par une collaboration ?',
            'category': 'other',
            'status': 'new'
        },
        {
            'sender_name': 'Emmanuel Bah',
            'sender_email': 'emmanuel@perso.com',
            'sender_contact': '+228 94 55 66 77',
            'subject': 'Formation développement web',
            'message': 'Proposez-vous des formations en développement web ? Je suis intéressé par React et Node.js.',
            'category': 'question',
            'status': 'read'
        }
    ]
    
    # Insérer les messages généraux
    for i, msg in enumerate(general_messages):
        days_ago = random.randint(0, 10)
        created_at = (datetime.now() - timedelta(days=days_ago)).strftime('%Y-%m-%d %H:%M:%S')
        
        cursor.execute("""
            INSERT INTO general_messages 
            (sender_name, sender_email, sender_contact, subject, message, category, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            msg['sender_name'], msg['sender_email'], msg['sender_contact'],
            msg['subject'], msg['message'], msg['category'], msg['status'], created_at
        ))
        print(f"✅ Message général {i+1}/5 ajouté: {msg['sender_name']}")
    
    # Mettre à jour les statistiques
    today = datetime.now().date()
    cursor.execute("""
        INSERT OR REPLACE INTO statistics (date, total_messages, client_messages, general_messages, new_messages)
        VALUES (?, 15, 10, 5, 5)
    """, (today,))
    
    connection.commit()
    cursor.close()
    connection.close()
    
    print("\n🎉 Données de test ajoutées avec succès!")
    print(f"📊 Total: 10 messages clients + 5 messages généraux")
    print(f"📅 Dates variées sur les 15 derniers jours")
    print(f"\n🔗 Accédez au dashboard: http://localhost:5173/admin")
    print(f"🔑 Identifiants: euloge / 20-86")

if __name__ == "__main__":
    add_test_data()
