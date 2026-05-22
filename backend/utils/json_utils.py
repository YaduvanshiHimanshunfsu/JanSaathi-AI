"""
Safe JSON parsing utilities.
"""

import json
from typing import Dict, Any


def safe_json_loads(raw_text: str) -> Dict[str, Any]:
    """
    Safely parses JSON text.

    Args:
        raw_text: Raw JSON string

    Returns:
        Parsed dictionary
    """

    try:
        return json.loads(raw_text)

    except json.JSONDecodeError:
        return {
            "success": False,
            "error": "Invalid JSON response"
        }