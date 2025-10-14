import requests
import json

BASE_URL = "http://127.0.0.1:8000"

print("=" * 60)
print("BOTNET DETECTION API - AUTHENTICATION TEST")
print("=" * 60)

# Step 1: Register a new user
print("\n1️⃣  Testing Registration...")
print("-" * 60)

register_data = {
    "email": "testuser@example.com",
    "username": "testuser",
    "password": "testpass123"
}

try:
    response = requests.post(f"{BASE_URL}/auth/register", json=register_data)
    
    if response.status_code == 201:
        print("✅ Registration Successful!")
        print(json.dumps(response.json(), indent=2))
    elif response.status_code == 400:
        print("⚠️  User already exists (this is fine, continuing...)")
        print(json.dumps(response.json(), indent=2))
    else:
        print(f"❌ Registration Failed: {response.status_code}")
        print(response.text)
except Exception as e:
    print(f"❌ Error: {e}")

# Step 2: Login
print("\n2️⃣  Testing Login...")
print("-" * 60)

login_data = {
    "username": "testuser@example.com",  # OAuth2 uses 'username' field
    "password": "testpass123"
}

try:
    response = requests.post(f"{BASE_URL}/auth/login", data=login_data)
    
    if response.status_code == 200:
        print("✅ Login Successful!")
        token_data = response.json()
        print(f"Token Type: {token_data['token_type']}")
        print(f"Access Token (first 50 chars): {token_data['access_token'][:50]}...")
        
        access_token = token_data['access_token']
    else:
        print(f"❌ Login Failed: {response.status_code}")
        print(response.text)
        exit()
except Exception as e:
    print(f"❌ Error: {e}")
    exit()

# Step 3: Test protected endpoint - Get current user
print("\n3️⃣  Testing Protected Endpoint - GET /auth/me...")
print("-" * 60)

headers = {
    "Authorization": f"Bearer {access_token}"
}

# After you set headers = {"Authorization": f"Bearer {access_token}"}

print("\n6️⃣  Testing Samples Info...")
r = requests.get(f"{BASE_URL}/samples/info", headers=headers)
print("Status:", r.status_code)
print(r.json())

print("\n7️⃣  Testing Random Samples...")
r = requests.get(f"{BASE_URL}/samples/random?n=5&balanced=true", headers=headers)
print("Status:", r.status_code)
print("Count:", r.json().get("count"))


try:
    response = requests.get(f"{BASE_URL}/auth/me", headers=headers)
    
    if response.status_code == 200:
        print("✅ Protected Endpoint Access Successful!")
        print(json.dumps(response.json(), indent=2))
    else:
        print(f"❌ Failed: {response.status_code}")
        print(response.text)
except Exception as e:
    print(f"❌ Error: {e}")

# Step 4: Test another protected endpoint
print("\n4️⃣  Testing Protected Endpoint - GET /auth/test-protected...")
print("-" * 60)

try:
    response = requests.get(f"{BASE_URL}/auth/test-protected", headers=headers)
    
    if response.status_code == 200:
        print("✅ Test Protected Endpoint Successful!")
        print(json.dumps(response.json(), indent=2))
    else:
        print(f"❌ Failed: {response.status_code}")
        print(response.text)
except Exception as e:
    print(f"❌ Error: {e}")

# Step 5: Test without token (should fail)
print("\n5️⃣  Testing Without Token (Should Fail)...")
print("-" * 60)

try:
    response = requests.get(f"{BASE_URL}/auth/me")  # No headers
    
    if response.status_code == 401:
        print("✅ Correctly Rejected - Unauthorized!")
        print(json.dumps(response.json(), indent=2))
    else:
        print(f"⚠️  Unexpected Response: {response.status_code}")
        print(response.text)
except Exception as e:
    print(f"❌ Error: {e}")

print("\n" + "=" * 60)
print("✅ ALL AUTHENTICATION TESTS COMPLETED!")
print("=" * 60)
