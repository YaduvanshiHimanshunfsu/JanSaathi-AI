"""
Keyword-based deterministic routing agent.
"""

from utils.file_utils import read_json_file

KEYWORD_MAP_PATH = "data/keyword_map.json"


def keyword_route(description: str) -> dict:
    """
    Matches complaint keywords against departments.

    Args:
        description: Complaint description

    Returns:
        Suggested department and confidence
    """

    keyword_map = read_json_file(KEYWORD_MAP_PATH)

    text = description.lower()

    for department, keywords in keyword_map.items():

        for keyword in keywords:

            if keyword.lower() in text:

                return {
                    "department": department,
                    "confidence": 0.75,
                    "matched_keyword": keyword
                }

    return {
        "department": "Other",
        "confidence": 0.30,
        "matched_keyword": None
    }