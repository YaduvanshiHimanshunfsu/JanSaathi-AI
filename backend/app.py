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
# Security & Middleware Configuration
# -------------------------------

# 1. Hardened CORS (Replace wildcard with specific origins)
# Only allow our React frontend
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# 2. Add Security Headers Middleware
from middleware.security import SecurityHeadersMiddleware, setup_rate_limiting
app.add_middleware(SecurityHeadersMiddleware)

# 3. Setup Rate Limiting
setup_rate_limiting(app)

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