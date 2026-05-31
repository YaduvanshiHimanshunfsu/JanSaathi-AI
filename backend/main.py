import os
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import our agents and helpers
from backend.utils.helpers import (
    load_departments,
    load_grievances,
    save_grievances,
    generate_ticket_id,
    load_sample_complaints
)
from backend.agents.intake_agent import IntakeAgent
from backend.agents.classification_agent import ClassificationAgent
from backend.agents.routing_agent import RoutingAgent
from backend.agents.communication_agent import CommunicationAgent
from backend.agents.followup_agent import FollowupAgent

app = FastAPI(
    title="SunwAI - Autonomous Grievance Intelligence System",
    description="APL Qualifier - Jansunwai Resolution Agent for Lucknow Nagar Nigam"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Instantiate Agents
intake_agent = IntakeAgent()
classify_agent = ClassificationAgent()
routing_agent = RoutingAgent()
comm_agent = CommunicationAgent()
followup_agent = FollowupAgent()

# Expanded Request Schema to hold full citizen coordinates
class GrievanceRequest(BaseModel):
    citizen_name: str
    citizen_mobile: str
    district: str
    pincode: str
    selected_department: str
    other_department: str = ""
    raw_text: str
    complaint_language: str = "auto"

@app.post("/api/grievance/submit")
def submit_grievance(req: GrievanceRequest):
    """
    Enhanced Multi-Agent Execution Pipeline.
    Supports structured citizen intake data and hybrid category classification.
    """
    if not req.raw_text.strip():
        raise HTTPException(status_code=400, detail="Complaint description cannot be empty.")
        
    try:
        # Step 1: Generate ticket ID
        ticket_id = generate_ticket_id()
        
        # Step 2: Run Intake Agent (normalizes descriptions and checks dialect)
        intake_res = intake_agent.run(req.raw_text)
        
        # Override detected language if citizen explicitly requested a specific setting
        if req.complaint_language != "auto":
            intake_res["language_detected"] = req.complaint_language
        
        # Add basic citizen fields into payload
        intake_res["citizen_name"] = req.citizen_name
        intake_res["citizen_mobile"] = req.citizen_mobile
        intake_res["district"] = req.district
        intake_res["pincode"] = req.pincode
        intake_res["selected_department"] = req.selected_department
        intake_res["other_department"] = req.other_department
        intake_res["complaint_language"] = req.complaint_language
        
        # Step 3: Run Classification & Priority Agent
        # Uses hybrid sorting: if user selected a specific department, it validates/pins it.
        # If user chose "other", the AI agent classifies the category automatically!
        classify_res = classify_agent.run(intake_res)
        
        # Step 4: Run Routing Agent
        routing_res = routing_agent.run(classify_res)
        
        # Step 5: Run Communication Agent
        final_res = comm_agent.run(routing_res, ticket_id)
        
        # Add tracking metadata
        final_res["id"] = ticket_id
        final_res["status"] = "assigned"
        final_res["escalated"] = False
        final_res["history"] = [
            {
                "status": "submitted",
                "timestamp": final_res["timestamp"],
                "note": f"Grievance filed by {req.citizen_name} (PIN: {req.pincode}) in district {req.district}."
            },
            {
                "status": "assigned",
                "timestamp": final_res["timestamp"],
                "note": f"Auto-routed to {final_res['department_name_hi']}. Officer {final_res['assigned_officer']} assigned."
            }
        ]
        
        # Save to database
        grievances = load_grievances()
        grievances.insert(0, final_res)
        save_grievances(grievances)
        
        return final_res
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent pipeline failed: {str(e)}")

@app.get("/api/grievances")
def get_grievances():
    return load_grievances()

@app.post("/api/grievance/{ticket_id}/resolve")
def resolve_grievance(ticket_id: str):
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

# Serve Frontend statically
frontend_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend")
if os.path.exists(frontend_path):
    app.mount("/", StaticFiles(directory=frontend_path, html=True), name="frontend")
else:
    print(f"WARNING: Frontend path '{frontend_path}' not found.")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
