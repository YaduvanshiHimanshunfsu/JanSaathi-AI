"""
LLM service wrapper for OpenAI interactions.
Supports automatic fallbacks for Google Gemini OpenAI-compatible API keys.
"""

from openai import OpenAI
from config import get_settings
from utils.logger import app_logger

settings = get_settings()

# Check if the provided key is a Google Gemini key (starts with AIzaSy)
is_gemini = settings.OPENAI_API_KEY.startswith("AIzaSy")

if is_gemini:
    app_logger.info("Gemini API Key detected. Using OpenAI Compatibility Layer.")
    client = OpenAI(
        api_key=settings.OPENAI_API_KEY,
        base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
    )
    DEFAULT_MODEL = "gemini-1.5-flash"
else:
    client = OpenAI(api_key=settings.OPENAI_API_KEY)
    DEFAULT_MODEL = "gpt-4o-mini"


def generate_llm_response(
    system_prompt: str,
    user_prompt: str,
    temperature: float = 0.2
) -> str:
    """
    Generates response from OpenAI or Gemini compatible model.

    Args:
        system_prompt: System-level instructions
        user_prompt: User input prompt
        temperature: Creativity level

    Returns:
        LLM response text
    """

    try:
        response = client.chat.completions.create(
            model=DEFAULT_MODEL,
            temperature=temperature,
            messages=[
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": user_prompt
                }
            ]
        )

        content = response.choices[0].message.content

        app_logger.info("LLM response generated successfully")

        return content

    except Exception as error:
        app_logger.error(f"LLM API Error: {error}")

        return ""