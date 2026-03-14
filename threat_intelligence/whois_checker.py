import datetime
import random

def get_domain_age(domain):
    """
    Simulated WHOIS domain age check.
    Phishing domains are often very young (created within the last 30 days).
    """
    # Deterministic simulation for demo purposes
    # If it's a suspicious TLD or has common phishing words, simulate a young age
    suspicious_indicators = ['.xyz', '.top', '.pw', 'login', 'verify', 'account']
    if any(ind in domain.lower() for ind in suspicious_indicators):
        return random.randint(1, 15) # 1-15 days old (High Risk)
    
    return random.randint(365, 2000) # >1 year old (Low Risk)
