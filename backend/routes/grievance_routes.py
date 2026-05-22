"""
Citizen grievance submission routes.
"""

from fastapi import APIRouter
from fastapi import BackgroundTasks

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


@router.post("/submit")
async def submit_grievance(
    grievance: GrievanceRequest,
    background_tasks: BackgroundTasks
):
    """
    Submits citizen grievance.
    """

    result = process_grievance_pipeline(
        grievance
    )

    # Background follow-up
    background_tasks.add_task(
        schedule_followup,
        result["grievance_id"]
    )

    return {
        "success": True,
        "data": result
    }