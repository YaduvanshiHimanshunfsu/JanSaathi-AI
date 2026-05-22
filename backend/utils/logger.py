"""
Central logging configuration for JanSaathi AI.
"""

from loguru import logger
import sys
from pathlib import Path

# Create logs directory if not exists
Path("logs").mkdir(exist_ok=True)

# Remove default logger
logger.remove()

# Console logger
logger.add(
    sys.stdout,
    level="INFO",
    format="{time} | {level} | {message}"
)

# File logger
logger.add(
    "logs/app.log",
    rotation="5 MB",
    retention="10 days",
    level="INFO"
)

# Error logger
logger.add(
    "logs/error.log",
    rotation="5 MB",
    retention="10 days",
    level="ERROR"
)

app_logger = logger