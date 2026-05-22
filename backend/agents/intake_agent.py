"""
Intake and normalisation agent.
"""

from models.grievance_model import GrievanceRequest
from utils.id_generator import generate_grievance_id
from utils.language_utils import detect_language
from utils.time_utils import current_timestamp


def process_intake(grievance: GrievanceRequest) -> dict:
    """
    Processes incoming citizen grievance.

    Args:
        grievance: Incoming grievance payload

    Returns:
        Normalised grievance dictionary
    """

    detected_language = detect_language(
        grievance.description
    )

    normalized_payload = {
        "grievance_id": generate_grievance_id(),

        "citizen_name": grievance.citizen_name.strip(),

        "mobile_number": grievance.mobile_number,

        "district": grievance.district,

        "pincode": grievance.pincode,

        "selected_department": grievance.selected_department,

        "problem_title": grievance.problem_title.strip(),

        "description": grievance.description.strip(),

        "language": detected_language,

        "created_at": current_timestamp()
    }

    return normalized_payload