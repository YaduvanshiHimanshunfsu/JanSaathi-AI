"""
Citizen grievance submission routes.
"""

from fastapi import APIRouter, Request, HTTPException, BackgroundTasks
from middleware.security import limiter
from agents.prompt_security_agent import PromptSecurityAgent

from models.grievance_model import (
    GrievanceRequest
)

from services.grievance_service import (
    process_grievance_pipeline
)

from services.scheduler_service import (
    schedule_followup
)

router = APIRouter(
    prefix="/api/grievances",
    tags=["Grievances"]
)

security_agent = PromptSecurityAgent()

@router.post("/submit")
@limiter.limit("10/minute")
async def submit_grievance(
    request: Request,
    grievance: GrievanceRequest,
    background_tasks: BackgroundTasks
):
    """
    Submits citizen grievance.
    Protected by Rate Limits and AI Prompt Security.
    """

    # 1. Pre-flight Security Check (Prompt Injection & Jailbreak Defense)
    full_text = f"{grievance.problem_title} {grievance.description}"
    security_assessment = security_agent.analyze_complaint(full_text)
    
    if security_assessment["action"] == "block":
        raise HTTPException(
            status_code=400, 
            detail="Malicious input detected. Request blocked for security."
        )

    # 2. Process Core Pipeline
    result = process_grievance_pipeline(
        grievance
    )

    # 3. Background follow-up
    background_tasks.add_task(
        schedule_followup,
        result["grievance_id"]
    )

    return {
        "success": True,
        "data": result
    }