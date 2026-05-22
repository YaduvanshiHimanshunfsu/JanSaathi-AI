"""
Standard API response models.
"""

from pydantic import BaseModel
from typing import Any


class APIResponse(BaseModel):
    """
    Generic API response format.
    """

    success: bool

    message: str

    data: Any = None