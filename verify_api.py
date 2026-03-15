import requests
import json

def test_url(url):
    print(f"\nTesting URL: {url}")
    try:
        response = requests.post(
            "http://localhost:8000/predict-url",
            json={"url": url},
            timeout=5
        )
        if response.status_code == 200:
            data = response.json()
            print(f"Prediction: {data['prediction']}")
            print(f"Confidence: {data['confidence']:.2f}")
            print(f"Signals: {data['signals']}")
        else:
            print(f"Error: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Connection failed: {e}")

if __name__ == "__main__":
    # Test cases
    test_url("google.com")
    test_url("http://secure-login-bank.com/update")
    test_url("http://paypal-verify-account.click/login")
