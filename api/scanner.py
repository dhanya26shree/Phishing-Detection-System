from api.threat_intel import threat_intel
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
        Comprehensive URL scan combining threat intelligence and ML/Heuristic models.
        """
        intel_result = threat_intel.check_url(url)
        
        # Use prediction service for deeper analysis
        pred_label, confidence = self.prediction_service.predict_url(url)

        # Final decision logic
        if intel_result["is_threat"]:
            final_prediction = "phishing"
            final_confidence = max(confidence, intel_result["threat_level"])
        else:
            final_prediction = pred_label
            final_confidence = confidence

        return final_prediction, final_confidence

    def scan_email(self, email_text):
        """
        Email scan logic.
        """
        return self.prediction_service.predict_email(email_text)

scanner = PhishingScanner()

