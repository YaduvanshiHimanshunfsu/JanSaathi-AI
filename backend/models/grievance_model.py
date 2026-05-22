"""
Pydantic models for grievance payloads.
"""

from pydantic import BaseModel, Field
from typing import Optional


class GrievanceRequest(BaseModel):
    """
    Incoming citizen grievance payload.
    """

    citizen_name: str = Field(..., min_length=2)
    mobile_number: str
    district: str
    pincode: str

    selected_department: Optional[str] = "Other"

    problem_title: str
    description: str

    language: str


class GrievanceResponse(BaseModel):
    """
    Final grievance response payload.
    """

    grievance_id: str

    department: str

    assigned_officer: str

    priority: int

    urgency_label: str

    predicted_sla_hours: int

    citizen_message: str

    status: str