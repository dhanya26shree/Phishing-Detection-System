class BlacklistChecker:
    def __init__(self):
        # In a real system, this would load from a database or API
        self.blacklist = [
            "malicious-site.com",
            "phish-login.net",
            "secure-bank-update.org"
        ]

    def is_blacklisted(self, domain):
        return domain in self.blacklist

blacklist_checker = BlacklistChecker()
