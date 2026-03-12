import pandas as pd
import random

# legitimate URLs
legit_urls = [
    "https://www.google.com", "https://www.facebook.com", "https://www.amazon.com",
    "https://www.apple.com", "https://www.microsoft.com", "https://www.github.com",
    "https://www.wikipedia.org", "https://www.linkedin.com", "https://www.netflix.com",
    "https://www.youtube.com", "https://www.twitter.com", "https://www.instagram.com",
    "https://www.reddit.com", "https://www.medium.com", "https://www.quora.com",
    "https://www.stackoverflow.com", "https://www.bbc.com", "https://www.cnn.com",
    "https://www.nytimes.com", "https://www.forbes.com", "https://www.bloomberg.com",
    "https://www.reuters.com", "https://www.theguardian.com", "https://www.wsj.com",
    "https://www.washingtonpost.com", "https://www.sciencedirect.com", "https://www.nature.com",
    "https://www.ieee.org", "https://www.acm.org", "https://www.python.org",
    "https://www.java.com", "https://www.w3schools.com", "https://www.geeksforgeeks.org",
    "https://www.coursera.org", "https://www.edx.org", "https://www.udemy.com"
]

# Phishing URLs
phishing_urls = [
    "http://secure-login-bank-verify.com/account/update",
    "http://verify-identity-login-paypal.net",
    "http://192.168.1.1/login.php",
    "http://bit.ly/3xY8zR_fake_login",
    "http://apple-support-icloud.net/login.php",
    "http://microsoft-outlook-login.com",
    "http://google-drive-shared-file.xyz/view",
    "http://secure-banking-portal.org",
    "http://urgent-verification-needed.ga",
    "http://account-suspended-action-required.tk",
    "http://login-confirm-access.ml",
    "http://update-now-security-alert.cf",
    "http://confirm-payment-received.gq",
    "http://claim-your-prize-now.biz",
    "http://free-gift-card-win.info",
    "http://discount-shopping-deals.cc",
    "http://online-loan-approval.tv",
    "http://verify-bank-details.ws",
    "http://secure-login-portal.site",
    "http://identity-safe-verify.online"
]

# Legitimate Emails
legit_emails = [
    "Hi John, hope you're doing well. Let's catch up soon.",
    "The project meeting is scheduled for tomorrow at 10 AM in the conference room.",
    "Attached is the report for the last quarter. Please let me know if you have any questions.",
    "Your order #12345 has been shipped and will arrive in 3-5 business days.",
    "Notification: You have a new message on LinkedIn.",
    "Invitation: Monthly Team Meeting @ Wed Mar 15, 2026 2pm - 3pm",
    "Your flight to San Francisco has been confirmed. View details in the app.",
    "Welcome to our newsletter! Here are the latest updates from our team.",
    "Happy Birthday! Enjoy 10% off your next purchase with this code.",
    "Please find the meeting notes from today's discussion attached."
]

# Phishing Emails
phishing_emails = [
    "Congratulations! You've won a $1000 gift card. Click here to claim your prize.",
    "URGENT: Your account has been suspended. Please login to verify your identity immediately.",
    "Alert: Suspicious activity detected on your account. Change your password now at this link.",
    "Important: Your tax refund is ready. Click here to process the payment.",
    "Action Required: Verify your email address to avoid account closure.",
    "Secure login alert: Someone tried to access your account from a new device.",
    "Your package could not be delivered. Click here to reschedule and pay the fee.",
    "Warning: Your cloud storage is full. Upgrade now to avoid losing your files.",
    "Final Notice: You have an unpaid invoice. Pay immediately to avoid late fees.",
    "Dear Customer, your bank account has been locked. Click here to unlock it."
]

def generate_data():
    # URL Data
    url_data = []
    for url in legit_urls:
        url_data.append({'url': url, 'label': 0})
    for url in phishing_urls:
        url_data.append({'url': url, 'label': 1})
    
    # Duplicate data to have a decent size
    url_data = url_data * 5
    random.shuffle(url_data)
    pd.DataFrame(url_data).to_csv('dataset/urls.csv', index=False)
    
    # Email Data
    email_data = []
    for email in legit_emails:
        email_data.append({'email_text': email, 'label': 0})
    for email in phishing_emails:
        email_data.append({'email_text': email, 'label': 1})
    
    # Duplicate data
    email_data = email_data * 5
    random.shuffle(email_data)
    pd.DataFrame(email_data).to_csv('dataset/emails.csv', index=False)
    
    print("Synthetic datasets generated in dataset/ directory.")

if __name__ == "__main__":
    generate_data()
