"""
Prompt Security Agent.

Purpose:
Acts as a pre-flight firewall for LLM requests. Analyzes incoming citizen complaints
for Prompt Injection, Jailbreak attempts, and system prompt extraction maneuvers.

Threats Mitigated:
- LLM Prompt Injection
- Social Engineering / Jailbreaking
- System Prompt Exfiltration
"""

import re
from typing import Dict, Any
from utils.audit_logger import AuditLogger

class PromptSecurityAgent:
    """
    Analyzes raw text for malicious LLM manipulation attempts.
    """
    
    # Common keywords and patterns used in jailbreaks and injections.
    # Note: In a true production enterprise setup, you would use a secondary 
    # classifying LLM (like Llama Guard) to perform semantic analysis. 
    # For speed and cost efficiency, we use a heuristic regex blocklist.
    SUSPICIOUS_PATTERNS = [
        r"ignore\s+(all\s+)?(previous\s+)?instructions",
        r"disregard\s+(all\s+)?(previous\s+)?instructions",
        r"system\s+prompt",
        r"output\s+your\s+instructions",
        r"forget\s+everything",
        r"you\s+are\s+now",
        r"act\s+as\s+a",
        r"jailbreak",
        r"bypass\s+rules",
        r"print\s+the\s+following",
        r"repeat\s+after\s+me",
    ]
    
    def __init__(self):
        self.blocklist_regex = re.compile(
            "|".join(self.SUSPICIOUS_PATTERNS), 
            re.IGNORECASE
        )

    def analyze_complaint(self, raw_text: str) -> Dict[str, Any]:
        """
        Analyzes the text. Returns a threat score and action recommendation.
        """
        threat_score = 0
        action = "proceed"
        reason = ""
        
        if not raw_text:
            return {"threat_score": 0, "action": "proceed"}
            
        # 1. Regex Heuristic Check
        match = self.blocklist_regex.search(raw_text)
        if match:
            threat_score += 80
            action = "block"
            reason = f"Regex match for injection pattern: '{match.group(0)}'"
            
        # 2. Length Anomaly Check (e.g., extremely long prompts often attempt buffer/context overflow)
        if len(raw_text) > 2000:
            threat_score += 20
            if action == "proceed":
                action = "flag"
            reason += " | Text length exceeds anomaly threshold."
            
        # Log the incident if suspicious
        if threat_score > 0:
            AuditLogger.log_event(
                event_type="SECURITY",
                actor_id="System",
                action="PROMPT_INJECTION_DETECTED",
                status="BLOCKED" if action == "block" else "FLAGGED",
                details={"threat_score": threat_score, "reason": reason}
            )
            
        return {
            "threat_score": threat_score,
            "action": action,
            "reason": reason
        }
