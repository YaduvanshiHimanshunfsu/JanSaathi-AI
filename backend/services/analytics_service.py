"""
Analytics computation service.
"""

from utils.file_utils import read_json_file

GRIEVANCE_DB_PATH = "data/mock_grievances.json"


def generate_dashboard_summary():
    """
    Computes dashboard KPI metrics.
    """

    grievances = read_json_file(
        GRIEVANCE_DB_PATH
    )

    total = len(grievances)

    resolved = len([
        grievance for grievance in grievances
        if grievance["status"] == "Resolved"
    ])

    high_priority = len([
        grievance for grievance in grievances
        if grievance["priority"] >= 4
    ])

    return {
        "total_grievances": total,

        "resolved_grievances": resolved,

        "high_priority_cases": high_priority,

        "pending_cases": total - resolved
    }