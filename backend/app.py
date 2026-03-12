from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import datetime
import json
import os

from backend.prediction_service import prediction_service

app = FastAPI(title="Phishing Detection API")

class URLRequest(BaseModel):
    url: str

class EmailRequest(BaseModel):
    email_text: str

class PredictionResponse(BaseModel):
    prediction: str
    confidence: float
    timestamp: str

# Logging helper
LOG_FILE = "logs/phishing_logs.txt"

def log_prediction(data_type, input_data, prediction, confidence):
    if not os.path.exists('logs'):
        os.makedirs('logs')
    
    log_entry = {
        "timestamp": datetime.datetime.now().isoformat(),
        "type": data_type,
        "input": input_data,
        "prediction": prediction,
        "confidence": confidence
    }
    
    with open(LOG_FILE, "a") as f:
        f.write(json.dumps(log_entry) + "\n")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Phishing Detection API", "status": "online"}

@app.post("/predict-url", response_model=PredictionResponse)
async def predict_url(request: URLRequest):
    try:
        prediction, confidence = prediction_service.predict_url(request.url)
        timestamp = datetime.datetime.now().isoformat()
        
        # Log phishing attempts
        if prediction == "phishing":
            log_prediction("url", request.url, prediction, confidence)
            
        return PredictionResponse(
            prediction=prediction,
            confidence=confidence,
            timestamp=timestamp
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict-email", response_model=PredictionResponse)
async def predict_email(request: EmailRequest):
    try:
        prediction, confidence = prediction_service.predict_email(request.email_text)
        timestamp = datetime.datetime.now().isoformat()
        
        # Log phishing attempts
        if prediction == "phishing":
            log_prediction("email", request.email_text, prediction, confidence)
            
        return PredictionResponse(
            prediction=prediction,
            confidence=confidence,
            timestamp=timestamp
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/stats")
async def get_stats():
    # Simple stats from logs
    if not os.path.exists(LOG_FILE):
        return {"total_scanned": 0, "phishing_detected": 0, "recent_alerts": []}
    
    logs = []
    with open(LOG_FILE, "r") as f:
        for line in f:
            logs.append(json.loads(line))
    
    return {
        "total_scanned": len(logs), # Note: this only counts phishing since we only log phishing for now
        "phishing_detected": len([l for l in logs if l['prediction'] == 'phishing']),
        "recent_alerts": logs[-5:]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
