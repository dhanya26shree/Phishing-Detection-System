# Real-Time AI/ML-Based Phishing Detection & Prevention System

A production-grade cybersecurity intelligence system designed to detect and block phishing attacks in real-time using advanced Machine Learning and Natural Language Processing.

## 🚀 Key Features

- **URL Analysis**: Lexical and structural analysis of URLs to identify malicious patterns.
- **Email Phishing Detection**: NLP-powered classification of suspicious email content.
- **Real-Time API**: FastAPI-driven backend for instant threat assessments.
- **Monitoring Dashboard**: Modern glassmorphism UI for threat visualization and metrics.
- **Logging System**: Persistent logging of phishing attempts for forensic analysis.
- **Browser Extension**: Real-time URL scanning as you browse the web.
- **Docker Ready**: Fully containerized for seamless deployment.

## 🛠️ Tech Stack

- **Backend**: Python, FastAPI, Scikit-learn, joblib
- **Frontend**: HTML5, Vanilla CSS (Glassmorphism), JavaScript, Chart.js
- **ML/NLP**: Random Forest, TF-IDF, NLTK
- **DevOps**: Docker

## 📂 Project Structure

```text
phishing-detection-system/
├── backend/            # FastAPI Application & Prediction Logic
├── frontend/           # Dashboard & Scanner UI
├── dataset/            # Training Data & Generation Scripts
├── models/             # Trained ML Models (Pickle)
├── feature_engineering/ # URL & Email Feature Extraction
├── browser_extension/  # Chrome-compatible Extension
├── deployment/         # Dockerfile & Config
└── logs/               # Saved Phishing Alerts
```

## 🚦 Getting Started

### 1. Installation
```bash
pip install -r requirements.txt
```

### 2. Generate Data & Train Models
```bash
python dataset/generate_mock_data.py
python models/train_model.py
```

### 3. Start the API
```bash
python -m uvicorn backend.app:app --reload
```

### 4. Open the Dashboard
Navigate to `frontend/index.html` in your browser.

## 🐳 Docker Deployment
```bash
docker build -t phishing-shield .
docker run -p 8000:8000 phishing-shield
```

## 🧠 Machine Learning Approach
The system uses a **Random Forest Classifier** trained on high-signal features:
- **URL Features**: Length, subdomain count, IP presence, suspicious keywords, and TLD analysis.
- **Email Features**: TF-IDF vectorization of preprocessed text, focusing on urgent calls to action and suspicious patterns.

## 🛡️ Future Enhancements
- Integration with VirusTotal and Google Safe Browsing APIs.
- Advanced BERT-based transformers for deeper email context analysis.
- Real-time WHOIS and SSL certificate validation.

---
*Created by your engineer, for Cybersecurity Portfolio*
