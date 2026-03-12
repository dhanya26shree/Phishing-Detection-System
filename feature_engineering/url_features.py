import re
from urllib.parse import urlparse
import tldextract

def extract_url_features(url):
    features = {}
    
    # Basic URL parts
    parsed_url = urlparse(url)
    domain = parsed_url.netloc
    path = parsed_url.path
    
    # 1. URL Length
    features['url_length'] = len(url)
    
    # 2. Number of dots
    features['num_dots'] = url.count('.')
    
    # 3. Number of hyphens
    features['num_hyphens'] = url.count('-')
    
    # 4. Number of subdomains
    ext = tldextract.extract(url)
    features['num_subdomains'] = len(ext.subdomain.split('.')) if ext.subdomain else 0
    
    # 5. Presence of IP address
    ip_pattern = r'\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b'
    features['has_ip'] = 1 if re.search(ip_pattern, url) else 0
    
    # 6. Suspicious keywords
    suspicious_keywords = ['login', 'secure', 'verify', 'bank', 'account', 'update', 'paypal', 'signin']
    features['suspicious_keywords_count'] = sum(1 for word in suspicious_keywords if word in url.lower())
    
    # 7. Use of URL shorteners
    shorteners = ['bit.ly', 'goo.gl', 'shorte.st', 'go2l.ink', 'x.co', 'ow.ly', 't.co', 'tinyurl.com', 'tr.im', 'is.gd', 'cli.gs']
    features['is_shortened'] = 1 if any(s in domain for s in shorteners) else 0
    
    # 8. Presence of '@' symbol (often used to mask actual domain)
    features['has_at_symbol'] = 1 if '@' in url else 0
    
    # 9. Number of special characters
    special_chars = ['?', '=', '&', '%', '!', '$']
    features['num_special_chars'] = sum(url.count(c) for c in special_chars)
    
    # 10. Digit count (phishing URLs often have more digits)
    features['digit_count'] = sum(c.isdigit() for c in url)
    
    return features

if __name__ == "__main__":
    test_urls = [
        "https://www.google.com",
        "http://secure-login-verify-bank.com/account/update",
        "http://192.168.1.1/login.php",
        "https://bit.ly/3xY8zR"
    ]
    
    for url in test_urls:
        print(f"URL: {url}")
        print(f"Features: {extract_url_features(url)}\n")
