import requests
import json

BASE_URL = "http://127.0.0.1:8000"

print("=" * 70)
print("BOTNET DETECTION SYSTEM - ML MODEL TEST")
print("=" * 70)

# Login
print("\n🔐 Logging in...")
login_response = requests.post(
    f"{BASE_URL}/auth/login",
    data={"username": "testuser@example.com", "password": "testpass123"}
)
token = login_response.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}
print("✅ Logged in successfully")

# Check model status
print("\n📊 Checking model status...")
model_status = requests.get(f"{BASE_URL}/detect/models", headers=headers).json()
print(json.dumps(model_status, indent=2))

# Get feature names
print("\n📋 Getting required features...")
features_response = requests.get(f"{BASE_URL}/detect/features").json()
print(f"✅ {features_response['count']} features required")

# Test batch detection with all 3 models
for model_type in ["lstm", "gcn", "ensemble"]:
    print(f"\n{'=' * 70}")
    print(f"Testing {model_type.upper()} Model")
    print(f"{'=' * 70}")
    
    response = requests.post(
        f"{BASE_URL}/detect/batch",
        headers=headers,
        json={"n": 10, "balanced": True, "model_type": model_type}
    )
    
    if response.status_code == 200:
        result = response.json()
        print(f"\n✅ {model_type.upper()} Batch Detection Complete!")
        print(f"\nSummary:")
        print(json.dumps(result["summary"], indent=2))
        
        # Show first 3 predictions
        print(f"\nFirst 3 Predictions:")
        for i, pred in enumerate(result["predictions"][:3], 1):
            print(f"\n  Sample {i}:")
            print(f"    Predicted: {pred['prediction_label']}")
            print(f"    Actual: {'Botnet' if pred['actual_label'] == 1 else 'Normal' if pred['actual_label'] == 0 else 'Unknown'}")
            print(f"    Probability: {pred['probability']:.4f}")
            print(f"    Confidence: {pred['confidence']:.4f}")
            print(f"    Correct: {pred['correct']}")
    else:
        print(f"❌ Error: {response.status_code}")
        print(response.text)

print("\n" + "=" * 70)
print("✅ ALL DETECTION TESTS COMPLETED!")
print("=" * 70)
