"""
Utility for generating unique grievance IDs.
"""

import uuid


def generate_grievance_id() -> str:
    """
    Generates unique grievance ID.

    Example:
        JSA-4F82A1
    """

    short_uuid = str(uuid.uuid4()).split("-")[0].upper()

    return f"JSA-{short_uuid}"