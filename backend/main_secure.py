import os
import sys
# Ensure the parent directory is in the path to allow 'backend.' imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import uvicorn
from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from dotenv import load_dotenv
from typing import Optional

# Load environment variables
load_dotenv()

# --- Security Imports ---
from backend.security_metrics import metrics
from backend.security import (
    RateLimitMiddleware,
    SecurityHeadersMiddleware,
    get_cors_origins,
    generate_secure_ticket_id,
    sanitize_text,
    sanitize_mobile,
    sanitize_name,
    sanitize_pincode,
    validate_district,
    log_action,
    login_guard,
    generate_otp,
    verify_otp,
    create_jwt_token,
    get_officer_from_request,
    OFFICER_DB
)

# --- Agent Imports ---
from backend.agents.prompt_security_agent import PromptSecurityAgent
from backend.agents.intake_agent import IntakeAgentV2
from backend.agents.classification_agent import ClassificationAgentV2
from backend.agents.sentiment_agent import SentimentAgent
from backend.agents.incident_cluster_agent import IncidentClusterAgent

# Functions from old agents
from backend.agents.routing_agent import assign_grievance
from backend.agents.communication_agent import generate_citizen_message
# Mocking followup_agent for resolution endpoint
class MockFollowupAgent:
    def resolve_grievance(self, ticket_id):
        return {"id": ticket_id, "status": "resolved"}
    def run_tick(self):
        return []

# --- Helper Imports ---
from backend.utils.helpers import (
    load_departments,
    load_grievances,
    save_grievances,
    load_sample_complaints,
    validate_pincode_lucknow
)

app = FastAPI(
    title="SunwAI - Secure Government Grievance API",
    description="V2 Pipeline with Defense-in-Depth, Multi-Agent NLP, and Incident Clustering"
)

# --- Apply Middlewares ---
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(RateLimitMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=get_cors_origins(),
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# --- Instantiate Agents ---
prompt_security_agent = PromptSecurityAgent()
intake_agent = IntakeAgentV2()
classify_agent = ClassificationAgentV2()
sentiment_agent = SentimentAgent()
incident_cluster_agent = IncidentClusterAgent()
followup_agent = MockFollowupAgent()

# --- Pydantic Schemas ---
class GrievanceRequest(BaseModel):
    citizen_name: str
    citizen_mobile: str
    district: str
    pincode: str
    selected_department: str
    other_department: str = ""
    raw_text: str
    complaint_language: str = "auto"
    otp_verified: bool = False

class LoginRequest(BaseModel):
    username: str
    password: str

class OTPGenerateRequest(BaseModel):
    mobile: str

class OTPVerifyRequest(BaseModel):
    mobile: str
    otp: str

# --- 1. OTP AUTHENTICATION ROUTES ---
@app.post("/api/otp/generate")
def api_generate_otp(req: OTPGenerateRequest):
    mobile = sanitize_mobile(req.mobile)
    otp = generate_otp(mobile)
    # In production, send via SMS gateway. Here we print for testing:
    print(f"[MOCK SMS] Your SunwAI OTP is: {otp}")
    return {"status": "success", "message": "OTP sent"}

@app.post("/api/otp/verify")
def api_verify_otp(req: OTPVerifyRequest):
    mobile = sanitize_mobile(req.mobile)
    is_valid = verify_otp(mobile, req.otp)
    if not is_valid:
        raise HTTPException(status_code=401, detail="Invalid or expired OTP")
    token = create_jwt_token(mobile, "citizen")
    return {"status": "success", "token": token}

# --- 2. OFFICER LOGIN ROUTES ---
@app.post("/api/auth/login")
def api_login(req: LoginRequest, request: Request):
    ip = request.client.host if request.client else "unknown"
    login_guard.check_lockout(ip)
    
    user = OFFICER_DB.get(req.username)
    if not user:
        rem_attempts = login_guard.check_and_record_failure(ip)
        raise HTTPException(status_code=401, detail=f"Invalid credentials. {rem_attempts} attempts left.")
        
    import hashlib
    input_hash = hashlib.sha256(req.password.encode()).hexdigest()
    if input_hash != user["hash"]:
        rem_attempts = login_guard.check_and_record_failure(ip)
        raise HTTPException(status_code=401, detail=f"Invalid credentials. {rem_attempts} attempts left.")
        
    login_guard.reset_failures(ip)
    token = create_jwt_token(req.username, user["role"])
    return {"status": "success", "token": token, "role": user["role"]}

# --- 3. GRIEVANCE SUBMISSION PIPELINE ---
@app.post("/api/grievance/submit")
def submit_grievance(req: GrievanceRequest, request: Request):
    """
    Secure V2 Multi-Agent Pipeline.
    """
    # 1. Sanitization & Validation
    sanitized_text = sanitize_text(req.raw_text)
    mobile = sanitize_mobile(req.citizen_mobile)
    name = sanitize_name(req.citizen_name)
    pincode = sanitize_pincode(req.pincode)
    district = validate_district(req.district)
    
    if not sanitized_text:
        raise HTTPException(status_code=400, detail="Complaint description cannot be empty.")
        
    # Check Lucknow pincode mapping
    if district == "Lucknow":
        pin_val = validate_pincode_lucknow(pincode)
        if not pin_val["valid"]:
            # Could block, but we allow with warning for mockup
            pass

    # 2. Agent 0: Prompt Security
    sec_res = prompt_security_agent.run(sanitized_text)
    if sec_res.get("is_malicious"):
        log_action("PROMPT_INJECTION_BLOCKED", request, {"mobile": mobile, "name": name, "ip": request.client.host})
        raise HTTPException(status_code=400, detail="Malicious input detected. Request blocked for security.")
        
    try:
        metrics.increment("total_grievances_processed")
        ticket_id = generate_secure_ticket_id()
        
        # 3. Agent 1: Intake & Normalization
        intake_res = intake_agent.run(sanitized_text, mobile)
        if intake_res.get("spam_blocked"):
            log_action("SPAM_BLOCKED", request, {"mobile": mobile})
            metrics.increment("total_grievances_blocked")
            raise HTTPException(status_code=400, detail="Spam detected. Request blocked.")
            
        intake_res["citizen_name"] = name
        intake_res["citizen_mobile"] = mobile
        intake_res["district"] = district
        intake_res["pincode"] = pincode
        intake_res["selected_department"] = req.selected_department
        intake_res["other_department"] = req.other_department
        intake_res["complaint_language"] = req.complaint_language
        
        # 4. Agent 2: Classification
        classify_res = classify_agent.run(intake_res)
        
        # 5. Agent 2.5: Sentiment Analysis
        sentiment_res = sentiment_agent.run(classify_res)
        
        # 6. Agent 3: Routing
        routing_assignment = assign_grievance(sentiment_res.get("category", "Other"))
        routing_res = {**sentiment_res, **routing_assignment}
        
        # 7. Agent 6: Incident Cluster
        cluster_res = incident_cluster_agent.run(routing_res)
        
        # 8. Agent 4: Communication
        import datetime
        timestamp = datetime.datetime.now().isoformat()
        comm_msg = generate_citizen_message(
            ticket_id, 
            cluster_res.get("department_hi", cluster_res.get("department", "Other")), 
            cluster_res.get("predicted_sla_hours", 24),
            cluster_res.get("urgency_label", "concerned")
        )
        
        # Section 8: Citizen Credibility Index Calculation
        credibility_index = 50 # Base
        
        if req.otp_verified:
            credibility_index += 20
        if cluster_res.get("word_count", 0) >= 15:
            credibility_index += 15
        if cluster_res.get("geo_tag"):
            credibility_index += 10
        if cluster_res.get("confidence", 0.0) >= 0.85:
            credibility_index += 10
        if not cluster_res.get("intake_flags", []):
            credibility_index += 5
            
        if "DUPLICATE_SUSPECTED" in cluster_res.get("intake_flags", []):
            credibility_index -= 15
        if cluster_res.get("distress_score", 0) >= 9:
            credibility_index -= 10
        if cluster_res.get("word_count", 10) < 8:
            credibility_index -= 5
            
        credibility_index = max(0, min(100, credibility_index))
        
        if credibility_index <= 30:
            credibility_level = "low"
        elif credibility_index <= 60:
            credibility_level = "medium"
        elif credibility_index <= 80:
            credibility_level = "high"
        else:
            credibility_level = "verified"
            
        final_res = {
            **cluster_res, 
            "timestamp": timestamp, 
            "citizen_message": comm_msg,
            "credibility_index": credibility_index,
            "credibility_level": credibility_level
        }
        
        # Add metadata
        final_res["id"] = ticket_id
        final_res["status"] = "assigned"
        final_res["escalated"] = False
        final_res["history"] = [
            {
                "status": "submitted",
                "timestamp": final_res["timestamp"],
                "note": f"Grievance filed by {name} (PIN: {pincode}) in district {district}."
            },
            {
                "status": "assigned",
                "timestamp": final_res["timestamp"],
                "note": f"Auto-routed to {final_res.get('department_name_hi', final_res.get('department'))}. Officer {final_res.get('assigned_officer')} assigned."
            }
        ]
        
        # Audit Log (Masked)
        log_action("GRIEVANCE_SUBMITTED", request, {"ticket_id": ticket_id, "category": final_res.get("category"), "mobile": mobile})
        
        # Save to database
        grievances = load_grievances()
        grievances.insert(0, final_res)
        save_grievances(grievances)
        
        return final_res
        
    except HTTPException:
        raise
    except Exception as e:
        log_action("PIPELINE_ERROR", request, {"error": str(e)})
        raise HTTPException(status_code=500, detail=f"Agent pipeline failed: {str(e)}")

# --- 4. SECURE READ ROUTES ---
@app.get("/api/grievances")
def get_grievances():
    # In production, require JWT. Left open for frontend mockup compatibility.
    return load_grievances()

@app.post("/api/grievance/{ticket_id}/resolve")
def resolve_grievance(ticket_id: str, officer: dict = Depends(get_officer_from_request)):
    # IDOR protection: require officer or admin
    if officer["role"] not in ["officer", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorized to resolve tickets")
        
    result = followup_agent.resolve_grievance(ticket_id)
    if not result:
        raise HTTPException(status_code=404, detail="Grievance ticket not found.")
    return {"status": "success", "grievance": result}

@app.get("/api/departments")
def get_departments():
    return load_departments()

@app.get("/api/sample-complaints")
def get_samples():
    return load_sample_complaints()

@app.post("/api/simulate-followup")
def simulate_followup():
    updated_list = followup_agent.run_tick()
    return {"status": "success", "total_tickets": len(updated_list)}

@app.get("/api/admin/security-metrics")
def get_security_metrics(officer: dict = Depends(get_officer_from_request)):
    if officer["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return metrics.get_stats()

# --- Serve Frontend ---
frontend_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend")
if os.path.exists(frontend_path):
    app.mount("/", StaticFiles(directory=frontend_path, html=True), name="frontend")
else:
    print(f"WARNING: Frontend path '{frontend_path}' not found.")

if __name__ == "__main__":
    uvicorn.run("main_secure:app", host="0.0.0.0", port=8000, reload=True)
