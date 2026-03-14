import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def test_endpoint(name, method, path, payload=None):
    url = f"{BASE_URL}{path}"
    print(f"Testing {name} ({method} {path})...")
    try:
        if method == "GET":
            r = requests.get(url)
        else:
            r = requests.post(url, json=payload)
        
        print(f"  Status: {r.status_code}")
        if r.status_code == 200:
            try:
                print(f"  Response: {json.dumps(r.json(), indent=2)}")
            except:
                print(f"  Response: {r.text[:100]}...")
        else:
            print(f"  Error: {r.text[:100]}")
    except Exception as e:
        print(f"  Failed: {e}")
    print("-" * 30)

test_endpoint("Root", "GET", "/")
test_endpoint("Stats", "GET", "/stats")
test_endpoint("Predict URL", "POST", "/predict-url", {"url": "http://paypal-security-update.xyz/login"})
test_endpoint("Predict Email", "POST", "/predict-email", {"email_text": "Win a prize!"})
test_endpoint("Blockchain Ledger", "GET", "/blockchain")
