"""
Language helper utilities.
"""

from langdetect import detect


def detect_language(text: str) -> str:
    """
    Detects language of complaint text.

    Args:
        text: Complaint description

    Returns:
        Language label
    """

    try:
        lang = detect(text)

        if lang == "hi":
            return "Hindi"

        elif lang == "en":
            return "English"

        return "Hinglish"

    except Exception:
        return "Unknown"