"""
Time utility helpers for SLA calculations.
"""

from datetime import datetime, timedelta


def current_timestamp() -> str:
    """
    Returns current timestamp.
    """

    return datetime.utcnow().isoformat()


def calculate_sla_deadline(hours: int) -> str:
    """
    Calculates SLA deadline timestamp.

    Args:
        hours: SLA hours

    Returns:
        Deadline timestamp
    """

    deadline = datetime.utcnow() + timedelta(hours=hours)

    return deadline.isoformat()