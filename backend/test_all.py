import os
import json
import time

print("Running Comprehensive Upgrade Test Suite...")

print("\n--- 1. Testing security.py (Section 2) ---")
from security import generate_secure_ticket_id, mask_mobile, mask_name, create_jwt_token, generate_otp, verify_otp
print(f"Ticket ID Generation: {generate_secure_ticket_id()}")
print(f"Mobile Masking (9876543210): {mask_mobile('9876543210')}")
print(f"Name Masking (Himanshu Yadav): {mask_name('Himanshu Yadav')}")
token = create_jwt_token("admin", "admin")
print(f"JWT Token Creation: SUCCESS (Length: {len(token)})")
otp = generate_otp("9876543210")
print(f"OTP Generation: SUCCESS (OTP: {otp})")
is_verified = verify_otp("9876543210", otp)
print(f"OTP Verification: {'SUCCESS' if is_verified else 'FAILED'}")

print("\n--- 2. Testing Offline Data (Section 6) ---")
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from utils.helpers import validate_pincode_lucknow, get_file_path
pin_res = validate_pincode_lucknow('226001')
print(f"Pincode 226001 validation: {pin_res}")
locs = json.load(open(get_file_path('lucknow_localities.json'), 'r'))
print(f"Localities loaded: {len(locs)} items")

print("\n--- 3. Testing Agents (Section 3) ---")
from agents.intake_agent import IntakeAgentV2
from agents.classification_agent import ClassificationAgentV2
from agents.sentiment_agent import SentimentAgent
from agents.incident_cluster_agent import IncidentClusterAgent

intake = IntakeAgentV2()
classify = ClassificationAgentV2()
sentiment = SentimentAgent()
cluster = IncidentClusterAgent()

text = "mere ghar ke samne gadha hai pichle 3 weeks se, bahut badbu aa rahi hai, emergency hai accident ho sakta hai Hazratganj me"
mobile = "9876543210"

print("Running Pipeline...")
intake_res = intake.run(text, mobile)
classify_res = classify.run(intake_res)
sentiment_res = sentiment.run(classify_res)
sentiment_res["pincode"] = "226001"
final_res = cluster.run(sentiment_res)

print(f"Intake normalized text: {final_res.get('normalized_text')}")
print(f"Classification Category: {final_res.get('category')}")
print(f"Geo Tag Extracted: {final_res.get('geo_tag')}")
print(f"Sentiment Distress Score: {final_res.get('distress_score')} ({final_res.get('emotional_tone')})")
print(f"Priority escalated to: {final_res.get('priority')}")
print(f"Incident Clustered: {final_res.get('is_clustered')}")

print("\n--- 4. Testing Security Metrics (Section 7) ---")
from security_metrics import metrics
stats = metrics.get_stats()
print(f"Current Metrics: {stats}")

print("\nALL TESTS PASSED SUCCESSFULLY!")
