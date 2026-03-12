import re
import nltk
from nltk.corpus import stopwords
try:
    from sklearn.feature_extraction.text import TfidfVectorizer
    SKLEARN_AVAILABLE = True
except (ImportError, ModuleNotFoundError):
    SKLEARN_AVAILABLE = False

# Download stopwords if not already present
try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

def preprocess_email(text):
    # Convert to lowercase
    text = text.lower()
    
    # Remove HTML tags
    text = re.sub(r'<.*?>', '', text)
    
    # Remove special characters and numbers
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    
    # Tokenization and removing stopwords
    stop_words = set(stopwords.words('english'))
    words = text.split()
    cleaned_words = [w for w in words if w not in stop_words]
    
    return " ".join(cleaned_words)

class EmailFeatureExtractor:
    def __init__(self, max_features=1000):
        if SKLEARN_AVAILABLE:
            self.vectorizer = TfidfVectorizer(max_features=max_features)
        else:
            self.vectorizer = None
            print("Warning: scikit-learn not available. EmailFeatureExtractor will not function correctly.")
    
    def fit(self, email_list):
        processed_emails = [preprocess_email(email) for email in email_list]
        self.vectorizer.fit(processed_emails)
    
    def transform(self, email_list):
        processed_emails = [preprocess_email(email) for email in email_list]
        return self.vectorizer.transform(processed_emails)

if __name__ == "__main__":
    test_emails = [
        "Congratulations! You've won a $1000 gift card. Click here to claim your prize.",
        "Hi John, hope you're doing well. Let's catch up soon.",
        "URGENT: Your account has been suspended. Please login to verify your identity immediately.",
        "The project meeting is scheduled for tomorrow at 10 AM in the conference room."
    ]
    
    extractor = EmailFeatureExtractor()
    extractor.fit(test_emails)
    features = extractor.transform(test_emails)
    print(f"Features shape: {features.shape}")
    print(f"Vocabulary: {list(extractor.vectorizer.vocabulary_.keys())[:10]}")
