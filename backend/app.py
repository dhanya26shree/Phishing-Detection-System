from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Optional
import datetime
import json
import sys
import os
from dotenv import load_dotenv

load_dotenv()

# Add the project root to sys.path for imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from api.scanner import scanner
from blockchain.ledger import ledger
from backend.database import db_manager

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Phishing Detection API")

# Configure CORS for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class URLRequest(BaseModel):
    url: str

class EmailRequest(BaseModel):
    email_text: str

class PredictionResponse(BaseModel):
    prediction: str
    confidence: float
    timestamp: str
    signals: List[str] = []

# Logging helper
LOG_FILE = "logs/phishing_logs.txt"

def log_prediction(data_type, input_data, prediction, confidence, signals=[]):
    # 1. MongoDB Logging (Primary)
    try:
        db_manager.log_scan(data_type, input_data, prediction, confidence, signals)
    except Exception as e:
        print(f"MongoDB Logging Error: {e}")

    # 2. File Logging (Fallback/Audit)
    if not os.path.exists('logs'):
        os.makedirs('logs')
    
    log_entry = {
        "timestamp": datetime.datetime.now().isoformat(),
        "type": data_type,
        "input": input_data,
        "prediction": prediction,
        "confidence": confidence,
        "signals": signals
    }
    
    with open(LOG_FILE, "a") as f:
        f.write(json.dumps(log_entry) + "\n")

@app.get("/")
async def read_root():
    return FileResponse('frontend/dist/index.html')

@app.get("/dashboard")
async def read_dashboard():
    # React Router handles dashboard in a SPA, but for now we serve index
    return FileResponse('frontend/dist/index.html')

@app.post("/predict-url", response_model=PredictionResponse)
async def predict_url(request: URLRequest):
    try:
        prediction, confidence, signals = scanner.scan_url(request.url)
        timestamp = datetime.datetime.now().isoformat()
        
        # Log all attempts for stats
        log_prediction("url", request.url, prediction, confidence, signals)
            
        return PredictionResponse(
            prediction=prediction,
            confidence=confidence,
            timestamp=timestamp,
            signals=signals
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict-email", response_model=PredictionResponse)
async def predict_email(request: EmailRequest):
    try:
        # scan_email currently returns (pred, conf) - updating to match pattern
        result = scanner.scan_email(request.email_text)
        if isinstance(result, tuple) and len(result) == 3:
            prediction, confidence, signals = result
        else:
            prediction, confidence = result
            signals = ["Standard Lexical Analysis Applied"]
            
        timestamp = datetime.datetime.now().isoformat()
        
        # Log all attempts for stats
        log_prediction("email", request.email_text, prediction, confidence, signals)
            
        return PredictionResponse(
            prediction=prediction,
            confidence=confidence,
            timestamp=timestamp,
            signals=signals
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/stats")
async def get_stats():
    # Attempt to get stats from MongoDB primarily
    try:
        stats = db_manager.get_stats()
        return stats
    except Exception as e:
        print(f"MongoDB Stats Error: {e}")
        # Fallback to file logs if MongoDB is down
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
app.mount("/", StaticFiles(directory="frontend/dist"), name="frontend")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
