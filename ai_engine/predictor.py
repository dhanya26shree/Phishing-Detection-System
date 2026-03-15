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
        Returns (probability, signals).
        """
        score = 0
        signals = []
        url_lower = url.lower()
        
        # Keyword Analysis
        keyword_hits = []
        total_keyword_weight = 0
        for kw, weight in self.weights["keywords"].items():
            if kw in url_lower:
                keyword_hits.append(kw)
                total_keyword_weight += weight
        
        if keyword_hits:
            impact = (total_keyword_weight / len(keyword_hits)) * 0.4
            score += impact
            signals.append(f"Suspicious keywords detected: {', '.join(keyword_hits)}")

        # Structural Analysis
        from urllib.parse import urlparse
        parsed = urlparse(url if '://' in url else f'http://{url}')
        domain = (parsed.netloc or parsed.path.split('/')[0]).lower()
        
        # Brand Spoofing Check (Aggressive)
        brands = ["paypal", "google", "microsoft", "bank", "apple", "amazon"]
        for brand in brands:
            if brand in domain and brand != domain.split('.')[-2]:
                score += 0.3
                signals.append(f"Potential brand spoofing detected: '{brand}'")

        suspicious_tlds = {'.xyz', '.top', '.pw', '.click', '.loan', '.bid', '.stream', '.update'}
        if any(domain.endswith(tld) for tld in suspicious_tlds):
            weight = self.weights["url_features"].get("suspicious_tld", 0.8)
            score += weight * 0.4
            signals.append(f"High-risk TLD used: {domain.split('.')[-1]}")
        
        if domain.count('.') > 2:
            weight = self.weights["url_features"].get("multiple_subdomains", 0.5)
            score += weight * 0.1
            signals.append("Excessive subdomain depth")
            
        if '@' in url_lower:
            weight = self.weights["url_features"].get("has_at_symbol", 0.7)
            score += weight * 0.2
            signals.append("Contains '@' symbol (phishing signature)")

        if '-' in domain:
            score += 0.15
            signals.append("Hyphenated domain (uncommon for brands)")

        if len(url) > 75:
            score += 0.2
            signals.append("Abnormally long URL string")

        # Sigmoid-like normalization
        probability = 1 / (1 + math.exp(-10 * (score - 0.4)))
        return probability, signals

    def predict(self, url):
        prob, signals = self.predict_url_score(url)
        prediction = "phishing" if prob >= self.weights["threshold"] else "legitimate"
        # Tiered risk override
        if 0.4 <= prob < 0.7 and prediction == "legitimate":
            prediction = "suspicious"
        
        return prediction, prob, signals

ai_classifier = NativeAIClassifier()
