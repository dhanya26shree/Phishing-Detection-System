import joblib
import os
import sys
import numpy as np
import pandas as pd

# Add the project root to sys.path for imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from feature_engineering.url_features import extract_url_features
from feature_engineering.email_features import preprocess_email

class PredictionService:
    def __init__(self):
        self.url_model = None
        self.email_model = None
        self.email_vectorizer = None
        self.load_models()

    def load_models(self):
        try:
            if os.path.exists('models/phishing_url_model.pkl'):
                self.url_model = joblib.load('models/phishing_url_model.pkl')
                print("URL model loaded.")
            
            if os.path.exists('models/phishing_email_model.pkl'):
                self.email_model = joblib.load('models/phishing_email_model.pkl')
                print("Email model loaded.")
            
            if os.path.exists('models/email_vectorizer.pkl'):
                self.email_vectorizer = joblib.load('models/email_vectorizer.pkl')
                print("Email vectorizer loaded.")
        except Exception as e:
            print(f"Error loading models: {e}")

    def predict_url(self, url):
        if not self.url_model:
            # Fallback/Mock logic if model is not trained
            return self._heuristic_url_prediction(url)
        
        features = extract_url_features(url)
        features_df = pd.DataFrame([features])
        
        # Ensure feature order matches training
        # If we used a specific order in training, we should enforce it here
        # For RF, column names usually suffice if it was trained on a DF
        
        prediction = self.url_model.predict(X=features_df)[0]
        confidence = np.max(self.url_model.predict_proba(features_df))
        
        return "phishing" if prediction == 1 else "legitimate", float(confidence)

    def predict_email(self, email_text):
        if not self.email_model or not self.email_vectorizer:
            return self._heuristic_email_prediction(email_text)
        
        processed_text = preprocess_email(email_text)
        features = self.email_vectorizer.transform([processed_text])
        
        prediction = self.email_model.predict(features)[0]
        confidence = np.max(self.email_model.predict_proba(features))
        
        return "phishing" if prediction == 1 else "legitimate", float(confidence)

    def _heuristic_url_prediction(self, url):
        # Very simple heuristic as fallback
        suspicious_keywords = ['login', 'secure', 'verify', 'bank', 'account']
        score = 0
        if any(kw in url.lower() for kw in suspicious_keywords):
            score += 0.4
        if url.count('.') > 3:
            score += 0.3
        if len(url) > 100:
            score += 0.2
        
        confidence = min(0.5 + score, 0.9)
        prediction = "phishing" if score > 0.4 else "legitimate"
        return prediction, float(confidence)

    def _heuristic_email_prediction(self, email_text):
        suspicious_keywords = ['win', 'prize', 'urgent', 'verify', 'account', 'gift card']
        score = 0
        if any(kw in email_text.lower() for kw in suspicious_keywords):
            score += 0.5
        
        confidence = min(0.5 + score, 0.9)
        prediction = "phishing" if score > 0.4 else "legitimate"
        return prediction, float(confidence)

prediction_service = PredictionService()
