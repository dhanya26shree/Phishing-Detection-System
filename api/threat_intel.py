import re
from urllib.parse import urlparse

class ThreatIntelligence:
    def __init__(self):
        # Common phishing patterns and suspicious TLDs
        self.suspicious_tlds = ['.xyz', '.top', '.pw', '.stream', '.men', '.bid', '.loan', '.click', '.date']
        self.malicious_patterns = [
            r'paypal.*confirm',
            r'appleid.*verify',
            r'microsoft.*security',
            r'bank.*login',
            r'secure.*account.*update'
        ]

    def check_url(self, url):
        """
        Check URL against known malicious patterns and suspicious characteristics.
        """
        url_lower = url.lower()
        reasons = []
        threat_level = 0

        # Check TLD
        parsed = urlparse(url)
        domain = parsed.netloc
        if any(url_lower.endswith(tld) for tld in self.suspicious_tlds):
            reasons.append("Suspicious Top-Level Domain (TLD)")
            threat_level += 0.4

        # Check malicious patterns
        for pattern in self.malicious_patterns:
            if re.search(pattern, url_lower):
                reasons.append(f"Matches phishing pattern: {pattern}")
                threat_level += 0.6

        # Check for lookalike domains (e.g., g00gle instead of google)
        # (Simplified implementation)
        lookalikes = [('0', 'o'), ('1', 'l'), ('3', 'e'), ('4', 'a'), ('5', 's')]
        for char, sub in lookalikes:
            if char in domain:
                # This is a very broad check, but useful for heuristics
                threat_level += 0.1

        return {
            "is_threat": threat_level >= 0.5,
            "threat_level": min(threat_level, 1.0),
            "reasons": reasons
        }

threat_intel = ThreatIntelligence()
