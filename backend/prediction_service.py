try:
    import joblib
    import numpy as np
    import pandas as pd
    DEPENDENCIES_AVAILABLE = True
except (ImportError, ModuleNotFoundError):
    DEPENDENCIES_AVAILABLE = False

import os
import sys

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
        if not self.url_model or not DEPENDENCIES_AVAILABLE:
            # Fallback/Mock logic if model is not trained or dependencies missing
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
        """
        Uses the native NLP engine for email classification.
        No scikit-learn dependency required.
        """
        from nlp_email_detector.model import ai_email_detector
        
        prediction, confidence = ai_email_detector.predict(email_text)
        return prediction, confidence

    def _heuristic_url_prediction(self, url):
        # Enhanced heuristic logic
        suspicious_keywords = ['login', 'secure', 'verify', 'bank', 'account', 'update', 'free', 'win', 'wp-content', 'action']
        score = 0
        url_lower = url.lower()
        
        if any(kw in url_lower for kw in suspicious_keywords):
            score += 0.3
        if url.count('.') > 3:
            score += 0.2
        if len(url) > 75:
            score += 0.1
        if '-' in url:
            score += 0.1
        if '@' in url:
            score += 0.3
        
        confidence = min(0.6 + score, 0.95)
        prediction = "phishing" if score >= 0.3 else "legitimate"
        return prediction, float(confidence)

    def _heuristic_email_prediction(self, email_text):
        suspicious_keywords = [
            'win', 'prize', 'urgent', 'verify', 'account', 'gift card', 
            'suspended', 'unusual activity', 'action required', 'billing'
        ]
        score = 0
        email_lower = email_text.lower()
        
        for kw in suspicious_keywords:
            if kw in email_lower:
                score += 0.2
        
        confidence = min(0.5 + score, 0.95)
        prediction = "phishing" if score >= 0.4 else "legitimate"
        return prediction, float(confidence)

prediction_service = PredictionService()
