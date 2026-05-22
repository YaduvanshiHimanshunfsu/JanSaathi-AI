"""
Analytics API routes.
"""

from fastapi import APIRouter

from services.analytics_service import (
    generate_dashboard_summary
)

router = APIRouter(
    prefix="/api/analytics",
    tags=["Analytics"]
)


@router.get("/summary")
async def analytics_summary():
    """
    Returns dashboard analytics.
    """

    summary = generate_dashboard_summary()

    return {
        "success": True,
        "data": summary
    }