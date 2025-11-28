from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import numpy as np
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
import random
import os
from twilio.rest import Client
from dotenv import load_dotenv

load_dotenv()

# Twilio Configuration
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER")
TWILIO_MESSAGING_SERVICE_SID = os.getenv("TWILIO_MESSAGING_SERVICE_SID")

# Emergency Contacts (In-memory storage for demo)
emergency_contacts = [
    {"id": 1, "name": "Sarah Jenkins", "role": "Head Nurse", "phone": "+919876543210"},
    {"id": 2, "name": "Dr. Rajesh Koothrappali", "role": "Doctor", "phone": "+919876543212"},
    {"id": 3, "name": "City General Ambulance", "role": "Ambulance", "phone": "+919876543211"}
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

@app.post("/predict")
def predict(request: PredictionRequest):
    # Robust Mock Logic for Demo Stability
    base_patients = 850
    
    # AQI Impact: +0.5 patient per AQI point over 100
    aqi_impact = max(0, (request.aqi - 100) * 0.5)
    
    # Temp Impact: +10 patients per degree over 35 (heatwave) or under 15 (cold)
    temp_impact = 0
    if request.temp > 35:
        temp_impact = (request.temp - 35) * 10
    elif request.temp < 15:
        temp_impact = (15 - request.temp) * 10
        
    # Festival Impact
    festival_impact = 150 if request.is_festival else 0
    
    # Random noise
    noise = random.randint(-20, 20)
    
    predicted_patients = int(base_patients + aqi_impact + temp_impact + festival_impact + noise)
    
    # Bed Occupancy (assuming 1200 beds capacity)
    predicted_beds = min(100, (predicted_patients / 1200) * 100)
    
    # Reasoning Logic
    reasons = []
    actions = []

    if predicted_patients > 880:
        reasons.append("Automated analysis indicates staffing is CRITICAL.")
        actions = [
            "Trigger emergency staff reallocation from nearby departments.",
            "Open overflow beds and notify charge nurse by SMS/alert.",
            "Delay non-urgent admissions and reroute ambulances if needed."
        ]
    else:
        if aqi_impact > 0:
            reasons.append(f"High AQI ({request.aqi}) contributing to respiratory strain (+{int(aqi_impact)} patients).")
        if temp_impact > 0:
            if request.temp > 35:
                reasons.append(f"Heatwave conditions ({request.temp}°C) increasing heatstroke risk (+{int(temp_impact)} patients).")
            else:
                reasons.append(f"Cold wave ({request.temp}°C) increasing viral susceptibility (+{int(temp_impact)} patients).")
        if festival_impact > 0:
            reasons.append("Festival season typically sees 20% increase in trauma/burn cases.")
        
        if not reasons:
            reasons.append("Normal environmental conditions. Standard patient load expected.")

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
            except Exception as e:
                errors.append(f"{contact['name']}: {str(e)}")
                print(f"Failed to send to {contact['name']} ({contact['phone']}): {e}")

        return {
            "status": "success" if sent_count > 0 else "partial_failure",
            "sent_count": sent_count,
            "errors": errors,
            "message": "Emergency protocols executed. SMS alerts sent."
        }
    except Exception as e:
        print(f"Twilio Error: {e}")
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
