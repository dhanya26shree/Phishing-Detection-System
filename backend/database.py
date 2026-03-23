from pymongo import MongoClient
import datetime
import os

class PhishShieldDB:
    def __init__(self, uri=os.getenv("MONGODB_URI", "mongodb://localhost:27017/")):
        self.client = MongoClient(uri)
        self.db = self.client["PhishShieldDB"]
        self.scans = self.db["scans"]

    def log_scan(self, data_type, input_data, prediction, confidence, signals=[]):
        scan_entry = {
            "timestamp": datetime.datetime.now().isoformat(),
            "type": data_type,
            "input": input_data,
            "prediction": prediction,
            "confidence": confidence,
            "signals": signals
        }
        return self.scans.insert_one(scan_entry)

    def get_stats(self):
        total_scanned = self.scans.count_documents({})
        phishing_detected = self.scans.count_documents({"prediction": "phishing"})
        
        # Get 5 most recent phishing alerts
        recent_alerts_cursor = self.scans.find(
            {"prediction": "phishing"}
        ).sort("timestamp", -1).limit(5)
        
        recent_alerts = []
        for alert in recent_alerts_cursor:
            # Convert ObjectId to string for JSON serialization
            alert["_id"] = str(alert["_id"])
            recent_alerts.append(alert)
            
        return {
            "total_scanned": total_scanned,
            "phishing_detected": phishing_detected,
            "recent_alerts": recent_alerts
        }

db_manager = PhishShieldDB()
