"""
Secure Audit Logger.

Purpose:
Provides structured JSON logging for security events (logins, rate limits, resolutions).
Crucially masks PII (Personally Identifiable Information) like mobile numbers and 
IP addresses to comply with data privacy laws (CERT-In / DPDP Act).

Threats Mitigated:
- Information Disclosure (Logs leaking citizen PII)
- Insufficient Logging & Monitoring (OWASP #9)
"""

import logging
import json
import re
from datetime import datetime
from typing import Dict, Any

# Configure standard logger
logger = logging.getLogger("audit_logger")
logger.setLevel(logging.INFO)

# In production, this should write to an immutable log store (e.g., CloudWatch, ELK)
# Here we write to a local file for the hackathon prototype.
file_handler = logging.FileHandler("audit_security.log")
file_handler.setLevel(logging.INFO)
logger.addHandler(file_handler)

class AuditLogger:
    """
    Structured logger for security and audit events.
    """

    @staticmethod
    def _mask_mobile(mobile: str) -> str:
        """Masks a 10-digit mobile number: 9876543210 -> ******3210"""
        if not mobile or len(mobile) < 4:
            return mobile
        # Keep last 4 digits visible
        return "*" * (len(mobile) - 4) + mobile[-4:]

    @staticmethod
    def _mask_ip(ip: str) -> str:
        """Masks an IP address: 192.168.1.100 -> 192.168.*.*"""
        if not ip:
            return ip
        parts = ip.split('.')
        if len(parts) == 4:
            return f"{parts[0]}.{parts[1]}.*.*"
        return "***.***.***.***"

    @classmethod
    def log_event(
        cls, 
        event_type: str, 
        actor_id: str, 
        action: str, 
        status: str, 
        ip_address: str = None, 
        mobile_number: str = None, 
        details: Dict[str, Any] = None
    ):
        """
        Logs a structured JSON event.
        """
        log_entry = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "event_type": event_type,          # e.g., AUTH, GRIEVANCE, SECURITY
            "actor_id": actor_id,              # User ID, Citizen ID, or "System"
            "action": action,                  # e.g., LOGIN_ATTEMPT, PROMPT_INJECTION
            "status": status,                  # SUCCESS, FAILURE, BLOCKED
        }

        if ip_address:
            log_entry["ip_address_masked"] = cls._mask_ip(ip_address)
            
        if mobile_number:
            log_entry["mobile_masked"] = cls._mask_mobile(mobile_number)
            
        if details:
            log_entry["details"] = details

        # Log as a JSON string
        logger.info(json.dumps(log_entry))
