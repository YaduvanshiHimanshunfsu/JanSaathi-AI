"""
Citizen communication generation agent.
"""

from services.llm_service import generate_llm_response


def generate_citizen_message(
    grievance_id: str,
    department_hi: str,
    sla_hours: int,
    urgency_label: str
) -> str:
    """
    Generates warm Hindi acknowledgement.

    Args:
        grievance_id: Unique grievance ID
        department_hi: Hindi department name
        sla_hours: Predicted SLA
        urgency_label: Detected urgency

    Returns:
        Hindi acknowledgement message
    """

    system_prompt = """
You are a helpful UP government grievance officer.

Generate:
- natural Hindi
- warm tone
- professional tone
- short citizen acknowledgement

IMPORTANT:
- Do NOT sound robotic
- Do NOT translate literally from English
- Use citizen-friendly Hindi
"""

    user_prompt = f"""
Generate Hindi acknowledgement message.

Details:
- Grievance ID: {grievance_id}
- Department: {department_hi}
- SLA Hours: {sla_hours}
- Urgency: {urgency_label}
"""

    response = generate_llm_response(
        system_prompt=system_prompt,
        user_prompt=user_prompt,
        temperature=0.5
    )

    return response