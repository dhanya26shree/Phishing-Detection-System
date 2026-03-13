import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
import string

def clean_email_text(text):
    tokens = word_tokenize(text.lower())
    stop_words = set(stopwords.words('english'))
    punctuations = set(string.punctuation)
    return [t for t in tokens if t not in stop_words and t not in punctuations]
