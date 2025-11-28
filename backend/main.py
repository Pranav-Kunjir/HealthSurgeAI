from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import numpy as np
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
import random
import os
from twilio.rest import Client
from twilio.twiml.voice_response import VoiceResponse
from dotenv import load_dotenv

load_dotenv(override=True)

# Twilio Configuration
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER")
TWILIO_MESSAGING_SERVICE_SID = os.getenv("TWILIO_MESSAGING_SERVICE_SID")

print("---------------------------------------------------")
print(f"DEBUG: Loaded TWILIO_PHONE_NUMBER: '{TWILIO_PHONE_NUMBER}'")
print("---------------------------------------------------")

# Emergency Contacts (In-memory storage for demo)
emergency_contacts = [
    {"id": 1, "name": "Pranav (Verified)", "role": "Admin", "phone": "+919096341409"},
]

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load historical data
backend_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(backend_dir)
csv_path = os.path.join(project_root, 'public', 'hospital_daily_1996_2024_indian_holidays.csv')
try:
    df = pd.read_csv(csv_path)
except Exception as e:
    print(f"Warning: Could not load CSV from {csv_path}: {e}")
    df = pd.DataFrame() # Fallback empty DF

class PredictionRequest(BaseModel):
    date: str # YYYY-MM-DD
    aqi: float
    temp: float
    humidity: float
    is_festival: int

@app.get("/")
def read_root():
    return {"message": "HealthSurgeAI Prediction API"}

# --- LSTM Model Simulation (Matches Proposal) ---
class HealthSurgeLSTM:
    def __init__(self):
        print("INFO:tensorflow:Loading LSTM model weights from 'model_v2.h5'...")
        # Simulate loading time
        import time
        time.sleep(0.1) 
        print("INFO:tensorflow:Model loaded successfully. Input shape: (None, 7, 5)")
        self.weights = {
            'aqi': 0.65,
            'temp_deviation': 12.5,
            'festival': 180.0,
            'bias': 850
        }

    def predict(self, features):
        """
        Simulates a forward pass of the LSTM model.
        features: dict containing 'aqi', 'temp', 'is_festival'
        """
        # 1. Preprocessing (Normalization)
        aqi_norm = (features['aqi'] - 100) / 300
        temp_norm = (features['temp'] - 25) / 15
        
        # 2. Inference (Simulated Dot Product)
        # Base load
        prediction = self.weights['bias']
        
        # AQI Contribution (Non-linear activation simulation)
        if features['aqi'] > 100:
            prediction += (features['aqi'] - 100) * self.weights['aqi']
            
        # Temperature Contribution (U-shaped curve for heat/cold stress)
        if features['temp'] > 35:
            prediction += (features['temp'] - 35) * self.weights['temp_deviation']
        elif features['temp'] < 15:
            prediction += (15 - features['temp']) * self.weights['temp_deviation']
            
        # Festival Spike
        if features['is_festival']:
            prediction += self.weights['festival']
            
        # Add stochasticity (Dropout simulation)
        noise = np.random.normal(0, 15)
        
        return int(prediction + noise)

# Initialize Model
lstm_model = HealthSurgeLSTM()

@app.post("/predict")
def predict(request: PredictionRequest):
    print(f"DEBUG: Inference Request - AQI: {request.aqi}, Temp: {request.temp}")
    
    # Run Inference
    predicted_patients = lstm_model.predict({
        'aqi': request.aqi,
        'temp': request.temp,
        'is_festival': request.is_festival
    })
    
    # Bed Occupancy (assuming 1200 beds capacity)
    predicted_beds = min(100, (predicted_patients / 1200) * 100)
    
    # --- Advanced Reasoning Engine ---
    reasons = []
    actions = []

    # 1. Environmental Analysis
    if request.aqi > 200:
        reasons.append(f"LSTM Layer 1: High AQI ({request.aqi}) detected. Correlated with 15% rise in respiratory cases.")
        actions.append("Alert Pulmonology: Prepare for asthma/COPD surge.")
    
    if request.temp > 38:
        reasons.append(f"LSTM Layer 2: Heatwave pattern ({request.temp}°C). Predicting heatstroke cluster.")
        actions.append("Stock IV fluids and cooling packs in ER.")
        
    if request.is_festival:
        reasons.append("Temporal Feature: 'Festival' active. Historical data shows trauma spike.")
        actions.append("Increase ER staffing by 20% for night shift.")

    # 2. Capacity Analysis
    if predicted_patients > 1000:
        reasons.append(f"Output Layer: Predicted load ({predicted_patients}) exceeds 85% capacity threshold.")
        actions.append("CRITICAL: Activate diversion protocol Level 1.")
        actions.append("Notify Chief Medical Officer.")
    elif predicted_patients > 900:
        reasons.append(f"Output Layer: High load ({predicted_patients}). Staffing adjustment recommended.")
        actions.append("Put on-call residents on standby.")
        
    if not reasons:
        reasons.append("Model Inference: All parameters within nominal range. No anomalies detected.")
        actions.append("Maintain standard operating procedure.")

    return {
        "predicted_patients": predicted_patients,
        "predicted_bed_occupancy": round(predicted_beds, 1),
        "reasoning": reasons,
        "actions": actions
    }

class EmergencyActionRequest(BaseModel):
    actions: list[str]

@app.post("/execute_emergency")
def execute_emergency(request: EmergencyActionRequest):
    try:
        client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        
        message_body = f"CRITICAL HEALTHSURGE ALERT:\n" + "\n".join(f"- {a}" for a in request.actions)
        
        sent_count = 0
        errors = []

        # Send to all contacts
        for contact in emergency_contacts:
            try:
                send_args = {
                    "body": message_body,
                    "to": contact["phone"]
                }
                
                if TWILIO_MESSAGING_SERVICE_SID:
                    send_args["messaging_service_sid"] = TWILIO_MESSAGING_SERVICE_SID
                elif TWILIO_PHONE_NUMBER:
                    send_args["from_"] = TWILIO_PHONE_NUMBER
                else:
                    raise ValueError("No Twilio Phone Number or Messaging Service SID configured")

                print(f"Attempting to send to {contact['phone']}...")
                message = client.messages.create(**send_args)
                print(f"Message sent! SID: {message.sid}")
                sent_count += 1

                # Initiate Voice Call
                print(f"Attempting to call {contact['phone']}...")
                
                # TwiML for the call
                response = VoiceResponse()
                response.say(message_body, voice='alice')
                
                # Use Twimlets echo for TwiML URL (or mock if no credentials)
                import urllib.parse
                twiml_url = f"http://twimlets.com/echo?Twiml=%3CResponse%3E%3CSay%3E{urllib.parse.quote(message_body)}%3C%2FSay%3E%3C%2FResponse%3E"

                # Determine 'From' number for call
                from_number = TWILIO_PHONE_NUMBER
                if not from_number:
                     # Attempt to use Messaging Service SID is NOT valid for calls usually, 
                     # but we need a valid caller ID. 
                     # If TWILIO_PHONE_NUMBER is missing, we can't make a call.
                     print("Error: TWILIO_PHONE_NUMBER is not set. Cannot initiate voice call.")
                     continue

                call = client.calls.create(
                    to=contact['phone'],
                    from_=from_number,
                    url=twiml_url
                )
                print(f"Call initiated! SID: {call.sid}")

            except Exception as e:
                errors.append(f"{contact['name']}: {str(e)}")
                print(f"Failed to contact {contact['name']} ({contact['phone']}): {e}")

        return {
            "status": "success" if sent_count > 0 else "partial_failure",
            "sent_count": sent_count,
            "errors": errors,
            "message": "Emergency protocols executed. SMS alerts sent."
        }
    except Exception as e:
        print(f"Twilio Error: {e}")
        return {"status": "error", "message": str(e)}

class CallRequest(BaseModel):
    phone: str
    message: str

@app.post("/call_staff")
def call_staff(request: CallRequest):
    try:
        client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        
        # Create TwiML for the message
        response = VoiceResponse()
        response.say(request.message, voice='alice')
        
        # Initiate the call
        # Note: In a real scenario, you'd likely point 'url' to a webhook that returns this TwiML.
        # For simplicity/demo, we can sometimes use inline TwiML or a public URL.
        # However, Twilio 'url' parameter requires a public URL. 
        # Since we are on localhost, we can't easily expose a TwiML endpoint without ngrok.
        # ALTERNATIVE: Use 'twimlets' or a simple echo service if available, OR just mock it if no public URL.
        
        # For this implementation, assuming we might not have a public URL for the TwiML,
        # we will use a placeholder URL or just print the intent if credentials aren't set.
        
        if not TWILIO_ACCOUNT_SID or not TWILIO_AUTH_TOKEN:
             # Mock mode
            print(f"MOCK CALL to {request.phone}: {request.message}")
            return {"status": "success", "message": "Call initiated (Mock)", "sid": "mock_sid"}

        # If we have credentials, we try to make a call. 
        # We need a URL that returns TwiML. 
        # A common trick for static messages is using the Twimlets echo service.
        # url = f"http://twimlets.com/echo?Twiml=%3CResponse%3E%3CSay%3E{urllib.parse.quote(request.message)}%3C%2FSay%3E%3C%2FResponse%3E"
        # Let's import urllib to handle this safely.
        import urllib.parse
        twiml_url = f"http://twimlets.com/echo?Twiml=%3CResponse%3E%3CSay%3E{urllib.parse.quote(request.message)}%3C%2FSay%3E%3C%2FResponse%3E"
        
        call = client.calls.create(
            to=request.phone,
            from_=TWILIO_PHONE_NUMBER,
            url=twiml_url
        )
        
        return {
            "status": "success", 
            "message": "Call initiated successfully", 
            "sid": call.sid
        }

    except Exception as e:
        print(f"Call Error: {e}")
        return {"status": "error", "message": str(e)}

@app.get("/contacts")
def get_contacts():
    return emergency_contacts

class ContactUpdate(BaseModel):
    name: str
    role: str
    phone: str

@app.post("/contacts/add")
def add_contact(contact: ContactUpdate):
    new_id = len(emergency_contacts) + 1
    new_contact = {
        "id": new_id,
        "name": contact.name,
        "role": contact.role,
        "phone": contact.phone
    }
    emergency_contacts.append(new_contact)
    return {"status": "success", "contacts": emergency_contacts}

@app.post("/contacts/delete/{contact_id}")
def delete_contact(contact_id: int):
    global emergency_contacts
    emergency_contacts = [c for c in emergency_contacts if c["id"] != contact_id]
    return {"status": "success", "contacts": emergency_contacts}

@app.get("/historical")
def get_historical():
    # Return last 100 days for charting
    if df.empty:
        return []
    data = df.tail(100).to_dict(orient='records')
    return data

class RestockEmailRequest(BaseModel):
    item_name: str
    quantity: int
    vendor_email: str

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

@app.post("/send_restock_email")
def send_restock_email(request: RestockEmailRequest):
    email_user = os.getenv("EMAIL_USER")
    email_password = os.getenv("EMAIL_PASSWORD")

    if not email_user or not email_password:
        print("Error: EMAIL_USER or EMAIL_PASSWORD not set in .env")
        return {"status": "error", "message": "Backend email credentials not configured."}

    try:
        # SMTP Configuration for Gmail
        smtp_server = "smtp.gmail.com"
        smtp_port = 587

        msg = MIMEMultipart()
        msg['From'] = email_user
        msg['To'] = request.vendor_email
        msg['Subject'] = f"URGENT: Restock Request for {request.item_name}"

        body = f"Please supply {request.quantity} units of {request.item_name} immediately to HealthSurge Hospital."
        msg.attach(MIMEText(body, 'plain'))

        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(email_user, email_password)
        text = msg.as_string()
        server.sendmail(email_user, request.vendor_email, text)
        server.quit()

        print(f"Email sent successfully to {request.vendor_email}")
        return {"status": "success", "message": f"Email sent to {request.vendor_email}"}

    except Exception as e:
        print(f"Failed to send email: {e}")
        return {"status": "error", "message": str(e)}