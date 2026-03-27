"""
Script pour tester l'API du dashboard
"""
import requests
import json

BASE_URL = "http://localhost:5000"

def test_login():
    """Tester la connexion admin"""
    print("🔐 Test de connexion...")
    
    response = requests.post(
        f"{BASE_URL}/api/admin/login",
        json={
            "username": "euloge",
            "password": "20-86"
        }
    )
    
    if response.status_code == 200:
        data = response.json()
        print("✅ Connexion réussie!")
        print(f"   Token: {data['token'][:50]}...")
        print(f"   Admin: {data['admin']['username']}")
        return data['token']
    else:
        print(f"❌ Erreur de connexion: {response.status_code}")
        print(f"   {response.text}")
        return None

def test_stats(token):
    """Tester les statistiques"""
    print("\n📊 Test des statistiques...")
    
    response = requests.get(
        f"{BASE_URL}/api/admin/stats",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    if response.status_code == 200:
        data = response.json()
        print("✅ Statistiques récupérées!")
        print(f"   Messages clients: {data['client_messages']['total']}")
        print(f"   - Nouveaux: {data['client_messages']['new']}")
        print(f"   - En cours: {data['client_messages']['in_progress']}")
        print(f"   Messages généraux: {data['general_messages']['total']}")
        print(f"   - Nouveaux: {data['general_messages']['new']}")
        return True
    else:
        print(f"❌ Erreur: {response.status_code}")
        print(f"   {response.text}")
        return False

def test_client_messages(token):
    """Tester la récupération des messages clients"""
    print("\n💼 Test des messages clients...")
    
    response = requests.get(
        f"{BASE_URL}/api/admin/client-messages",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ {len(data)} messages clients récupérés!")
        if len(data) > 0:
            print(f"   Premier message: {data[0]['name']} - {data[0]['domain']}")
        return True
    else:
        print(f"❌ Erreur: {response.status_code}")
        print(f"   {response.text}")
        return False

def test_general_messages(token):
    """Tester la récupération des messages généraux"""
    print("\n📧 Test des messages généraux...")
    
    response = requests.get(
        f"{BASE_URL}/api/admin/general-messages",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ {len(data)} messages généraux récupérés!")
        if len(data) > 0:
            print(f"   Premier message: {data[0]['sender_name']} - {data[0]['subject']}")
        return True
    else:
        print(f"❌ Erreur: {response.status_code}")
        print(f"   {response.text}")
        return False

def main():
    """Exécuter tous les tests"""
    print("=" * 60)
    print("🧪 TEST DE L'API BAWI-STUDIO")
    print("=" * 60)
    print()
    
    # Test de connexion
    token = test_login()
    if not token:
        print("\n❌ Impossible de continuer sans token")
        return
    
    # Test des statistiques
    test_stats(token)
    
    # Test des messages clients
    test_client_messages(token)
    
    # Test des messages généraux
    test_general_messages(token)
    
    print()
    print("=" * 60)
    print("✅ TOUS LES TESTS TERMINÉS")
    print("=" * 60)
    print()
    print("🌐 Le dashboard devrait fonctionner sur:")
    print("   http://localhost:5173/admin")
    print()
    print("🔑 Identifiants:")
    print("   Username: euloge")
    print("   Password: 20-86")

if __name__ == "__main__":
    try:
        main()
    except requests.exceptions.ConnectionError:
        print("\n❌ ERREUR: Impossible de se connecter au backend!")
        print("   Assure-toi que le backend tourne sur http://localhost:5000")
        print("   Commande: cd backend && python app.py")
    except Exception as e:
        print(f"\n❌ ERREUR: {e}")
