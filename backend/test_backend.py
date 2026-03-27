"""
Test simple du backend
"""
import requests
import time

print("=" * 60)
print("🔍 TEST DU BACKEND")
print("=" * 60)
print()

# Attendre un peu
print("⏳ Attente de 2 secondes...")
time.sleep(2)

# Test 1: Backend accessible?
print("\n📋 Test 1: Backend accessible sur http://localhost:5000")
try:
    response = requests.get("http://localhost:5000/api/admin/stats", timeout=5)
    print(f"✅ Réponse reçue! Status: {response.status_code}")
    if response.status_code == 401:
        print("   (Erreur 401 = normal, l'authentification est requise)")
except requests.exceptions.ConnectionError:
    print("❌ Erreur: Connexion refusée")
    print("   Le backend n'est pas démarré ou ne répond pas")
except requests.exceptions.Timeout:
    print("❌ Erreur: Timeout")
    print("   Le backend met trop de temps à répondre")
except Exception as e:
    print(f"❌ Erreur: {e}")

# Test 2: Port 5000 utilisé?
print("\n📋 Test 2: Vérification du port 5000")
import socket
sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
result = sock.connect_ex(('localhost', 5000))
if result == 0:
    print("✅ Le port 5000 est utilisé")
else:
    print("❌ Le port 5000 n'est pas utilisé")
sock.close()

print("\n" + "=" * 60)
