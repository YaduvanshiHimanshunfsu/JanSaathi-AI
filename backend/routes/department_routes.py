"""
Government department routes.
"""

from fastapi import APIRouter

from utils.file_utils import read_json_file

DEPARTMENT_DB_PATH = (
    "data/government_departments.json"
)

router = APIRouter(
    prefix="/api/departments",
    tags=["Departments"]
)


@router.get("")
async def get_departments():
    """
    Returns government departments.
    """

    departments = read_json_file(
        DEPARTMENT_DB_PATH
    )

    return {
        "success": True,
        "count": len(departments),
        "data": departments
    }