"""
Officer dashboard routes.
"""

from fastapi import APIRouter

from utils.file_utils import read_json_file
from utils.file_utils import write_json_file

GRIEVANCE_DB_PATH = "data/mock_grievances.json"

router = APIRouter(
    prefix="/api/dashboard",
    tags=["Dashboard"]
)


@router.get("/grievances")
async def get_all_grievances():
    """
    Returns all grievances.
    """

    grievances = read_json_file(
        GRIEVANCE_DB_PATH
    )

    return {
        "success": True,
        "count": len(grievances),
        "data": grievances
    }


@router.patch("/resolve/{grievance_id}")
async def resolve_grievance(
    grievance_id: str
):
    """
    Marks grievance resolved.
    """

    grievances = read_json_file(
        GRIEVANCE_DB_PATH
    )

    for grievance in grievances:

        if grievance["grievance_id"] == grievance_id:

            grievance["status"] = "Resolved"

    write_json_file(
        GRIEVANCE_DB_PATH,
        grievances
    )

    return {
        "success": True,
        "message":
            f"{grievance_id} marked resolved"
    }