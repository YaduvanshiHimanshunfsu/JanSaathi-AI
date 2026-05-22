"""
Main grievance orchestration pipeline.
"""

from agents.intake_agent import process_intake
from agents.keyword_router_agent import keyword_route
from agents.classify_agent import classify_grievance
from agents.routing_agent import assign_grievance
from agents.communication_agent import (
    generate_citizen_message
)

from constants import STATUS_ASSIGNED

from models.grievance_model import (
    GrievanceRequest
)

from utils.file_utils import (
    read_json_file,
    write_json_file
)

from utils.logger import app_logger

GRIEVANCE_DB_PATH = "data/mock_grievances.json"


def process_grievance_pipeline(
    grievance_request: GrievanceRequest
) -> dict:
    """
    Complete multi-agent grievance pipeline.

    Args:
        grievance_request: Incoming grievance

    Returns:
        Final grievance response
    """

    app_logger.info(
        "Starting grievance orchestration pipeline"
    )

    # ---------------------------------
    # 1. Intake Agent
    # ---------------------------------

    intake_result = process_intake(
        grievance_request
    )

    # ---------------------------------
    # 2. Keyword Routing Agent
    # ---------------------------------

    keyword_result = keyword_route(
        intake_result["description"]
    )

    # ---------------------------------
    # 3. AI Classification Agent
    # ---------------------------------

    classification_result = classify_grievance(
        complaint_text=intake_result["description"],
        keyword_department=keyword_result["department"]
    )

    # ---------------------------------
    # 4. Routing Agent
    # ---------------------------------

    routing_result = assign_grievance(
        classification_result["department"]
    )

    # ---------------------------------
    # 5. Communication Agent
    # ---------------------------------

    citizen_message = generate_citizen_message(
        grievance_id=intake_result["grievance_id"],

        department_hi=routing_result["department_hi"],

        sla_hours=classification_result[
            "predicted_sla_hours"
        ],

        urgency_label=classification_result[
            "urgency_label"
        ]
    )

    # ---------------------------------
    # Final Response Object
    # ---------------------------------

    final_response = {

        "grievance_id":
            intake_result["grievance_id"],

        "citizen_name":
            intake_result["citizen_name"],

        "department":
            classification_result["department"],

        "department_hi":
            routing_result["department_hi"],

        "assigned_officer":
            routing_result["assigned_officer"],

        "priority":
            classification_result["priority"],

        "urgency_label":
            classification_result["urgency_label"],

        "predicted_sla_hours":
            classification_result[
                "predicted_sla_hours"
            ],

        "overload_flag":
            routing_result["overload_flag"],

        "citizen_message":
            citizen_message,

        "status":
            STATUS_ASSIGNED
    }

    # ---------------------------------
    # Save grievance to mock DB
    # ---------------------------------

    grievances = read_json_file(
        GRIEVANCE_DB_PATH
    )

    grievances.append(final_response)

    write_json_file(
        GRIEVANCE_DB_PATH,
        grievances
    )

    app_logger.info(
        f"Grievance processed successfully: "
        f"{final_response['grievance_id']}"
    )

    return final_response