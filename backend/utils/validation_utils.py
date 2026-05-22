"""
Validation helper functions.
"""

import re


def validate_mobile_number(number: str) -> bool:
    """
    Validates Indian mobile number.

    Args:
        number: Mobile number string

    Returns:
        Boolean validation result
    """

    pattern = r"^[6-9]\d{9}$"

    return bool(re.match(pattern, number))


def validate_pincode(pincode: str) -> bool:
    """
    Validates Indian pincode.

    Args:
        pincode: Pincode string

    Returns:
        Boolean validation result
    """

    pattern = r"^\d{6}$"

    return bool(re.match(pattern, pincode))