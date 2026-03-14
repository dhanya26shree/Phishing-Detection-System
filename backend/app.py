from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Optional
import datetime
import json
import os

from api.scanner import scanner
from blockchain.ledger import ledger

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
async def read_root():
    return FileResponse('frontend/index.html')

@app.get("/dashboard")
async def read_dashboard():
    return FileResponse('frontend/dashboard.html')

@app.post("/predict-url", response_model=PredictionResponse)
async def predict_url(request: URLRequest):
    try:
        prediction, confidence = scanner.scan_url(request.url)
        timestamp = datetime.datetime.now().isoformat()
        
        # Log all attempts for stats
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
        prediction, confidence = scanner.scan_email(request.email_text)
        timestamp = datetime.datetime.now().isoformat()
        
        # Log all attempts for stats
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
        "total_scanned": len(logs),
        "phishing_detected": len([l for l in logs if l['prediction'] == 'phishing']),
        "recent_alerts": [l for l in logs if l['prediction'] == 'phishing'][-5:]
    }

@app.get("/blockchain")
async def get_blockchain():
    # Return the simulated blockchain ledger
    return {
        "chain": [
            {
                "index": b.index,
                "timestamp": b.timestamp,
                "data": b.data,
                "previous_hash": b.previous_hash,
                "hash": b.hash
            } for b in ledger.chain
        ]
    }

# Mount the static files (js, css, etc.)
# We mount this at root but at the very end. 
# Explicitly serving HTML above is better.
app.mount("/", StaticFiles(directory="frontend"), name="frontend")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
