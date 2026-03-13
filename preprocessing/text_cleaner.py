import re

def extract_features_v2(url):
    """
    Advanced URL feature extraction.
    """
    features = {}
    # Placeholder for more complex NLP/ML features
    return features

def normalize_text(text):
    """
    Standard text normalization for both URLs and emails.
    """
    text = text.lower().strip()
    text = re.sub(r'\s+', ' ', text)
    return text
