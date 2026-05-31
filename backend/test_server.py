import sys
import json
import os

# Add backend to path so imports work correctly
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from main_secure import app

client = TestClient(app)

print("Starting main_secure.py FastApi TestClient Verification...\n")

# 1. Test OTP Generation
print("--- 1. Testing OTP Generation Endpoint ---")
response = client.post("/api/otp/generate", json={"mobile": "9876543210"})
print(f"Status: {response.status_code}")
print(f"Response: {response.json()}\n")

# 2. Test Grievance Submission
print("--- 2. Testing Grievance Submission Pipeline ---")
payload = {
    "citizen_name": "Himanshu Yadav",
    "citizen_mobile": "9876543210",
    "district": "Lucknow",
    "pincode": "226010",
    "selected_department": "Other",
    "raw_text": "bhaiya yaha gomti nagar me sadak kharab hai, gaddha ho gaya hai pichle 2 din se, emergency accident ho sakta hai",
    "complaint_language": "auto"
}
response = client.post("/api/grievance/submit", json=payload)
print(f"Status: {response.status_code}")
res_json = response.json()
print("Ticket ID:", res_json.get("id"))
print("Priority Assigned:", res_json.get("priority"))
print("Urgency Label:", res_json.get("urgency_label"))
print("Geo Tag Extracted:", res_json.get("geo_tag"))
print("Department Assigned:", res_json.get("department"))
print("Citizen Message:", json.dumps(res_json.get("citizen_message"), indent=2))
print("History Logging:", json.dumps(res_json.get("history"), indent=2))

print("\nAll endpoints reached successfully!")
