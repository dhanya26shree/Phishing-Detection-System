class BlacklistChecker:
    def __init__(self):
        # Sample set of known phishing domains for SIH demonstration
        self.blacklist = {
            "malicious-site.com",
            "phish-login.net",
            "secure-bank-update.org",
            "paypal-verify-account.top",
            "apple-support-security.xyz",
            "microsoft-login-update.bid",
            "netf-lix-login.stream",
            "amazon-prime-gift.click"
        }

    def is_blacklisted(self, domain):
        return domain in self.blacklist

blacklist_checker = BlacklistChecker()
