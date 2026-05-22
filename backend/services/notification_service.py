"""
Simulated citizen notification service.
"""

from utils.logger import app_logger


def send_sms_notification(
    mobile_number: str,
    message: str
):
    """
    Simulates SMS delivery.

    Args:
        mobile_number: Citizen mobile number
        message: Notification message
    """

    app_logger.info(
        f"SMS sent to {mobile_number}"
    )

    print("\n")
    print("=" * 50)
    print("SIMULATED SMS DELIVERY")
    print("=" * 50)
    print(f"To: {mobile_number}")
    print(f"Message:\n{message}")
    print("=" * 50)
    print("\n")