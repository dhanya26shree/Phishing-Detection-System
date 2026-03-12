import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import os
import sys

# Add the project root to sys.path for imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from feature_engineering.url_features import extract_url_features
from feature_engineering.email_features import EmailFeatureExtractor

def train_url_model():
    print("Training URL detection model...")
    df = pd.read_csv('dataset/urls.csv')
    
    # Extract features for each URL
    feature_list = []
    for url in df['url']:
        feature_list.append(extract_url_features(url))
    
    X = pd.DataFrame(feature_list)
    y = df['label']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    y_pred = model.predict(X_test)
    print(f"URL Model Accuracy: {accuracy_score(y_test, y_pred):.4f}")
    print(classification_report(y_test, y_pred))
    
    joblib.dump(model, 'models/phishing_url_model.pkl')
    print("URL model saved to models/phishing_url_model.pkl")

def train_email_model():
    print("\nTraining Email detection model...")
    df = pd.read_csv('dataset/emails.csv')
    
    X_text = df['email_text'].tolist()
    y = df['label']
    
    X_train_text, X_test_text, y_train, y_test = train_test_split(X_text, y, test_size=0.2, random_state=42)
    
    extractor = EmailFeatureExtractor(max_features=1000)
    extractor.fit(X_train_text)
    
    X_train = extractor.transform(X_train_text)
    X_test = extractor.transform(X_test_text)
    
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    y_pred = model.predict(X_test)
    print(f"Email Model Accuracy: {accuracy_score(y_test, y_pred):.4f}")
    print(classification_report(y_test, y_pred))
    
    joblib.dump(model, 'models/phishing_email_model.pkl')
    joblib.dump(extractor, 'models/email_vectorizer.pkl')
    print("Email model and vectorizer saved to models/")

if __name__ == "__main__":
    if not os.path.exists('models'):
        os.makedirs('models')
    
    train_url_model()
    train_email_model()
