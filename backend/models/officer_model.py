"""
Officer metadata schema.
"""

from pydantic import BaseModel


class Officer(BaseModel):

    officer_id: int

    name: str

    department: str

    active_cases: int

    district: str