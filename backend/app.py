"""
Main FastAPI application entry point.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import get_settings
from routes.grievance_routes import router as grievance_router
from routes.dashboard_routes import router as dashboard_router
from routes.analytics_routes import router as analytics_router
from routes.department_routes import router as department_router

settings = get_settings()

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION
)

# -------------------------------
# CORS Configuration
# -------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# -------------------------------
# Include Routes
# -------------------------------

app.include_router(grievance_router)
app.include_router(dashboard_router)
app.include_router(analytics_router)
app.include_router(department_router)


@app.get("/")
async def root():
    """
    Root health endpoint.
    """

    return {
        "success": True,
        "message": "JanSaathi AI Backend Running"
    }