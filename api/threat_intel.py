import re
from urllib.parse import urlparse
from threat_intelligence.whitelist_checker import whitelist_checker # Added for balanced scoring
from threat_intelligence.blacklist_checker import blacklist_checker
from threat_intelligence.whois_checker import get_domain_age

class ThreatIntelligence:
    def __init__(self):
        # Common phishing patterns and suspicious TLDs
        self.suspicious_tlds = {'.xyz', '.top', '.pw', '.stream', '.men', '.bid', '.loan', '.click', '.date'}
        self.malicious_patterns = [
            r'paypal.*confirm',
            r'appleid.*verify',
            r'microsoft.*security',
            r'bank.*login',
            r'secure.*account.*update',
            r'login.*verification',
            r'unusual.*activity.*account'
        ]

    def check_url(self, url):
        """
        Check URL against known malicious patterns, blacklist, and domain age.
        """
        url_lower = url.lower()
        reasons = []
        threat_level = 0.0

        # Parse domain
        parsed = urlparse(url if "://" in url else f"http://{url}")
        domain = parsed.netloc or parsed.path.split('/')[0]
        
        # 1. Whitelist Check (Instant Safe)
        # Assuming we might have a whitelist checker soon, or we can just mock it
        # try:
        #     if whitelist_checker.is_whitelisted(domain):
        #         return {"is_threat": False, "threat_level": 0.0, "reasons": ["Verified Trusted Domain"]}
        # except: pass

        # 1. Blacklist Check (Instant High Threat)
        if blacklist_checker.is_blacklisted(domain):
            reasons.append("Domain is in the global malicious blacklist")
            threat_level += 0.9

        # 2. TLD Check
        if any(domain.endswith(tld) for tld in self.suspicious_tlds):
            reasons.append(f"Suspicious Top-Level Domain (TLD) detected: {domain.split('.')[-1]}")
            threat_level += 0.3

        # 3. Domain Age Check (Simulated WHOIS)
        age_days = get_domain_age(domain)
        if age_days < 30:
            reasons.append(f"Domain is very young ({age_days} days) - high risk")
            threat_level += 0.4
        elif age_days < 90:
            reasons.append(f"Domain is relatively new ({age_days} days)")
            threat_level += 0.1

        # 4. Pattern matching
        for pattern in self.malicious_patterns:
            if re.search(pattern, url_lower):
                reasons.append(f"Matches phishing pattern: {pattern}")
                threat_level += 0.5

        # 5. Domain Character Check (Lookalikes)
        lookalikes = [('0', 'o'), ('1', 'l'), ('3', 'e'), ('4', 'a')]
        if any(c in domain for c, _ in lookalikes):
            # Simple heuristic: if it looks like a popular domain but has numbers
            for brand in ['google', 'paypal', 'apple', 'amazon']:
                if brand in domain.replace('0','o').replace('1','l').replace('3','e').replace('4','a'):
                    if brand not in domain: # It's a lookalike
                        reasons.append(f"Potential {brand} lookalike domain detected")
                        threat_level += 0.4

        return {
            "is_threat": threat_level >= 0.5,
            "threat_level": min(threat_level, 1.0),
            "reasons": list(set(reasons)) # Unique reasons
        }

threat_intel = ThreatIntelligence()
