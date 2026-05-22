"""
Department routing and officer assignment agent.
"""

from utils.file_utils import read_json_file

DEPARTMENT_DATA_PATH = "data/mock_departments.json"


def assign_grievance(department_name: str) -> dict:
    """
    Assigns grievance to department officer.

    Args:
        department_name: Target department

    Returns:
        Assignment metadata
    """

    departments = read_json_file(DEPARTMENT_DATA_PATH)

    for department in departments:

        if department["name_en"] == department_name:

            open_tickets = department["open_tickets"]
            max_capacity = department["max_capacity"]

            overload_flag = open_tickets >= max_capacity

            return {
                "assigned_department": department_name,

                "assigned_officer": department["officer_name"],

                "department_hi": department["name_hi"],

                "overload_flag": overload_flag,

                "avg_resolution_hours":
                    department["avg_resolution_hours"]
            }

    return {
        "assigned_department": "Other",
        "assigned_officer": "Fallback Officer",
        "department_hi": "अन्य विभाग",
        "overload_flag": False,
        "avg_resolution_hours": 24
    }