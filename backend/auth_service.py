import smtplib
import random
import os
import time
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

# In-memory store for demo (Email -> {otp, expires})
OTP_STORE = {}
OTP_EXPIRY_SECONDS = 300 # 5 minutes

SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "") # App Password

def generate_otp():
    return str(random.randint(100000, 999999))

def send_otp_email(target_email: str, otp: str):
    """
    Sends the OTP via SMTP. Fallbacks to terminal logging if credentials are missing.
    """
    subject = "PhishShield AI - Your Authentication Code"
    body = f"""
    Your PhishShield AI authentication code is: {otp}
    
    This code will expire in 5 minutes.
    If you did not request this, please secure your account.
    """
    
    # Store in-memory
    OTP_STORE[target_email] = {
        "otp": otp,
        "expires": time.time() + OTP_EXPIRY_SECONDS
    }

    if not SMTP_USER or not SMTP_PASSWORD:
        print(f"\n[AUTH_SYSTEM] NO SMTP CREDENTIALS FOUND.")
        print(f"[AUTH_SYSTEM] >>> OTP FOR {target_email} IS: {otp} <<<\n")
        return True, "Code sent (Simulated - Check Server Logs)"

    try:
        msg = MIMEMultipart()
        msg['From'] = SMTP_USER
        msg['To'] = target_email
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'plain'))

        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.send_message(msg)
        server.quit()
        return True, "Code sent to your email"
    except Exception as e:
        print(f"[AUTH_ERROR] Failed to send email: {e}")
        return False, f"Failed to dispatch: {str(e)}"

def verify_otp(email: str, otp: str):
    if email not in OTP_STORE:
        return False, "No code requested for this email"
    
    record = OTP_STORE[email]
    if time.time() > record["expires"]:
        del OTP_STORE[email]
        return False, "Code expired"
    
    if record["otp"] == otp:
        del OTP_STORE[email]
        return True, "Verification successful"
    
    return False, "Invalid authentication code"
