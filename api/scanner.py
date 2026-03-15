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
        signals = []
        # Step 1: Blockchain Domain Verification
        is_verified, blockchain_data = check_domain_authenticity(url)
        if is_verified:
            signals.append("Domain verified safe via Immutable Blockchain Ledger")
            return "legitimate", 0.99, signals

        # Step 2: Native AI Path
        ai_pred, ai_confidence, ai_signals = ai_classifier.predict(url)
        signals.extend(ai_signals)
        
        # Step 3: Threat Intelligence Path
        intel_result = threat_intel.check_url(url)
        if intel_result["is_threat"]:
            signals.append(f"Threat Intel Alert: Matches known malicious pattern ({intel_result.get('threat_type', 'Phishing')})")

        # Final Decision Synthesis
        final_prediction = ai_pred
        final_confidence = ai_confidence

        if intel_result["is_threat"]:
            final_prediction = "phishing"
            final_confidence = max(ai_confidence, intel_result["threat_level"])
        
        # Add intelligence layer signals
        if intel_result["threat_level"] > 0.7:
             signals.append("High-risk heuristics detected by intelligence layer")

        return final_prediction, final_confidence, signals

    def scan_email(self, email_text):
        """
        Email scan logic.
        """
        return self.prediction_service.predict_email(email_text)

scanner = PhishingScanner()


