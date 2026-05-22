"""
AI-powered classification and urgency analysis agent.
"""

from constants import ALLOWED_DEPARTMENTS
from services.llm_service import generate_llm_response
from utils.json_utils import safe_json_loads
from utils.logger import app_logger


def classify_grievance(
    complaint_text: str,
    keyword_department: str
) -> dict:
    """
    Uses LLM to classify grievance and detect urgency.

    Args:
        complaint_text: Citizen complaint text
        keyword_department: Department suggested by keyword agent

    Returns:
        Structured classification result
    """

    allowed_departments = ", ".join(ALLOWED_DEPARTMENTS)

    system_prompt = f"""
You are an AI grievance classification system for UP Jansunwai.

Your task:
1. Classify grievance department
2. Detect urgency/emotional distress
3. Predict realistic SLA hours

IMPORTANT RULES:
- Only use departments from this list:
{allowed_departments}

- Return ONLY valid JSON
- Never explain anything
- Never return markdown
- Never hallucinate departments

Urgency labels allowed:
- Calm
- Concerned
- Distressed
- Critical

Priority rules:
1 = Low
5 = Critical

JSON FORMAT:
{{
    "department": "...",
    "priority": 1,
    "urgency_label": "...",
    "predicted_sla_hours": 24,
    "reasoning": "..."
}}
"""

    user_prompt = f"""
Complaint:
{complaint_text}

Keyword suggested department:
{keyword_department}
"""

    llm_response = generate_llm_response(
        system_prompt=system_prompt,
        user_prompt=user_prompt
    )

    parsed_response = safe_json_loads(llm_response)

    # -------------------------------
    # Fallback Protection
    # -------------------------------

    if not parsed_response.get("department"):

        app_logger.warning(
            "Fallback classification activated"
        )

        return {
            "department": keyword_department,
            "priority": 3,
            "urgency_label": "Concerned",
            "predicted_sla_hours": 24,
            "reasoning": "Fallback classification"
        }

    # -------------------------------
    # Department Validation
    # -------------------------------

    if parsed_response["department"] not in ALLOWED_DEPARTMENTS:

        parsed_response["department"] = keyword_department

    return parsed_response