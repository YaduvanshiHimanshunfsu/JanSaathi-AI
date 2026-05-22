"""
Central configuration loader for JanSaathi AI.
Loads environment variables and global application settings.
"""

from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """
    Application configuration settings.
    """

    APP_NAME: str = "JanSaathi AI"
    APP_VERSION: str = "1.0.0"

    OPENAI_API_KEY: str

    DEBUG: bool = True

    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000

    FOLLOWUP_DELAY_SECONDS: int = 30

    class Config:
        env_file = ".env"


@lru_cache
def get_settings() -> Settings:
    """
    Returns cached application settings.
    """
    return Settings()