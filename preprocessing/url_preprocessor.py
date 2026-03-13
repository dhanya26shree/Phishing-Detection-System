import re

def clean_url(url):
    """
    Remove unnecessary parts of the URL for better feature extraction.
    """
    url = url.strip().lower()
    # Remove protocol
    url = re.sub(r'^https?://', '', url)
    # Remove www
    url = re.sub(r'^www\.', '', url)
    return url

def tokenize_url(url):
    """
    Split URL into tokens (words).
    """
    return re.split(r'[./-]', url)
