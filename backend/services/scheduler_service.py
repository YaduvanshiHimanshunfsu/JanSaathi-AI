"""
Background follow-up scheduling service.
"""

from apscheduler.schedulers.background import (
    BackgroundScheduler
)

from agents.followup_agent import (
    simulate_followup
)

from utils.logger import app_logger

scheduler = BackgroundScheduler()


def schedule_followup(
    grievance_id: str,
    delay_seconds: int = 30
):
    """
    Schedules grievance follow-up.

    Args:
        grievance_id: Unique grievance ID
        delay_seconds: Delay before follow-up
    """

    scheduler.add_job(
        simulate_followup,
        "interval",
        seconds=delay_seconds,
        args=[grievance_id],
        id=grievance_id,
        replace_existing=True
    )

    app_logger.info(
        f"Follow-up scheduled for "
        f"{grievance_id}"
    )


def start_scheduler():
    """
    Starts APScheduler background service.
    """

    if not scheduler.running:

        scheduler.start()

        app_logger.info(
            "Background scheduler started"
        )