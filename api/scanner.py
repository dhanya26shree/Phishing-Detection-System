from api.threat_intel import threat_intel
from blockchain.validator import check_domain_authenticity
from ai_engine.predictor import ai_classifier
import os
import sys

# Add the project root to sys.path for imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Lazy import to avoid circular dependency
def get_prediction_service():
    from backend.prediction_service import prediction_service
    return prediction_service

class PhishingScanner:
    def __init__(self):
        self._prediction_service = None

    @property
    def prediction_service(self):
        if self._prediction_service is None:
            self._prediction_service = get_prediction_service()
        return self._prediction_service

    def scan_url(self, url):
        """
        SIH Tiered Verification Pipeline:
        1. Blockchain Consensus Check (Reputation)
        2. Native AI Prediction (Pattern Probability)
        3. Threat Intel Heuristics (Know Malicious)
        """
        # Step 1: Blockchain Domain Verification
        is_verified, blockchain_data = check_domain_authenticity(url)
        if is_verified:
            # If blockchain says verified safe, we give it high weight
            return "legitimate", 0.99 

        # Step 2: Native AI Path
        ai_pred, ai_confidence = ai_classifier.predict(url)
        
        # Step 3: Threat Intelligence Path
        intel_result = threat_intel.check_url(url)

        # Final Decision Synthesis
        if intel_result["is_threat"] or ai_pred == "phishing":
            final_prediction = "phishing"
            final_confidence = max(ai_confidence, intel_result["threat_level"])
        else:
            final_prediction = "legitimate"
            final_confidence = ai_confidence

        return final_prediction, final_confidence

    def scan_email(self, email_text):
        """
        Email scan logic.
        """
        return self.prediction_service.predict_email(email_text)

scanner = PhishingScanner()


