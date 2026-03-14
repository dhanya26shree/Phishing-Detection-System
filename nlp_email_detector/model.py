import re

class NLPEmailDetector:
    def __init__(self):
        # Weights for different suspicious indicators
        self.suspicious_keywords = {
            'urgent': 0.2,
            'verify': 0.3,
            'account': 0.1,
            'suspended': 0.4,
            'security': 0.1,
            'login': 0.2,
            'password': 0.2,
            'prize': 0.5,
            'gift card': 0.5,
            'billing': 0.2,
            'update': 0.1,
            'unusual activity': 0.3,
            'win': 0.4,
            'free': 0.2,
            'congratulations': 0.3,
            'immediate action': 0.4
        }
        
        self.urgency_patterns = [
            r'action.*required',
            r'account.*disabled',
            r'unauthorized.*access',
            r'final.*notice',
            r'within.*24.*hours'
        ]

    def predict(self, text):
        """
        Pure Python implementation of an email classifier.
        Uses lexical analysis and urgency detection.
        """
        if not text:
            return "legitimate", 0.0
            
        text_lower = text.lower()
        score = 0.0
        reasons = []

        # 1. Keyword Weighted Scoring
        for kw, weight in self.suspicious_keywords.items():
            if kw in text_lower:
                score += weight
                reasons.append(f"Contains keyword: {kw}")

        # 2. Urgency Pattern Matching
        for pattern in self.urgency_patterns:
            if re.search(pattern, text_lower):
                score += 0.4
                reasons.append(f"Urgency pattern detected: {pattern}")

        # 3. Check for typical phishing formatting (excessive punctuation/caps)
        if text.count('!') > 3:
            score += 0.1
            reasons.append("Excessive use of exclamation marks")
            
        if sum(1 for c in text if c.isupper()) / (len(text) + 1) > 0.3:
            score += 0.2
            reasons.append("High percentage of capital letters")

        # Normalize score to 0-1 range
        confidence = min(score, 1.0)
        
        # Decision
        prediction = "phishing" if score >= 0.5 else "legitimate"
        
        # If it's a very short email with a suspicious word, boost it
        if len(text.split()) < 20 and score > 0.3:
            confidence = min(confidence + 0.1, 1.0)
            prediction = "phishing"

        return prediction, float(confidence)

# Singleton instance
ai_email_detector = NLPEmailDetector()
