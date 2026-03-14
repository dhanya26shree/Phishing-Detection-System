import json
import os
import math

class NativeAIClassifier:
    def __init__(self):
        self.weights_path = "ai_engine/model_weights.json"
        self.weights = self.load_weights()

    def load_weights(self):
        if os.path.exists(self.weights_path):
            with open(self.weights_path, 'r') as f:
                return json.load(f)
        return {"url_features": {}, "keywords": {}, "threshold": 0.5}

    def predict_url_score(self, url):
        """
        Calculates a probability score using weighted feature mapping.
        """
        score = 0
        url_lower = url.lower()
        
        # Keyword Analysis
        keyword_hits = 0
        total_keyword_weight = 0
        for kw, weight in self.weights["keywords"].items():
            if kw in url_lower:
                keyword_hits += 1
                total_keyword_weight += weight
        
        if keyword_hits > 0:
            score += (total_keyword_weight / keyword_hits) * 0.4

        # Structural Analysis
        if any(url_lower.endswith(tld) for tld in ['.xyz', '.top', '.pw', '.click', '.loan']):
            score += self.weights["url_features"].get("suspicious_tld", 0.8) * 0.3
        
        if url.count('.') > 3:
            score += self.weights["url_features"].get("multiple_subdomains", 0.5) * 0.1
            
        if '@' in url:
            score += self.weights["url_features"].get("has_at_symbol", 0.7) * 0.2

        # Sigmoid-like normalization
        probability = 1 / (1 + math.exp(-10 * (score - 0.5)))
        return probability

    def predict(self, url):
        prob = self.predict_url_score(url)
        prediction = "phishing" if prob >= self.weights["threshold"] else "legitimate"
        return prediction, prob

ai_classifier = NativeAIClassifier()
