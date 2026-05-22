"""
Department schema models.
"""

from pydantic import BaseModel


class Department(BaseModel):

    id: int

    name_en: str

    name_hi: str

    officer_name: str

    open_tickets: int

    max_capacity: int

    avg_resolution_hours: int