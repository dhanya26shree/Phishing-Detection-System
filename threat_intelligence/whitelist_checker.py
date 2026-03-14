class WhitelistChecker:
    def __init__(self):
        # Trusted domains that should never be flagged
        self.whitelist = {
            "google.com",
            "microsoft.com",
            "apple.com",
            "amazon.com",
            "paypal.com",
            "github.com",
            "linkedin.com",
            "gmail.com",
            "outlook.com"
        }

    def is_whitelisted(self, domain):
        # Check for exact match or subdomain of a whitelisted domain
        for trusted in self.whitelist:
            if domain == trusted or domain.endswith(f".{trusted}"):
                return True
        return False

whitelist_checker = WhitelistChecker()
