import os
import json
import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

class SentimentAgent:
    """
    Agent 2.5: Sentiment & Distress Analysis
    Analyzes emotional state of the citizen to adjust priorities.
    """
    def __init__(self):
        self.gemini_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
        self.openai_key = os.getenv("OPENAI_API_KEY")
        
        self.client = None
        self.model_name = None
        if self.gemini_key:
            try:
                from openai import OpenAI
                self.client = OpenAI(
                    api_key=self.gemini_key,
                    base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
                )
                self.model_name = "gemini-1.5-flash"
            except ImportError:
                pass
        elif self.openai_key:
            try:
                from openai import OpenAI
                self.client = OpenAI(api_key=self.openai_key)
                self.model_name = "gpt-4o-mini"
            except ImportError:
                pass

    def _get_fallback_analysis(self, text: str) -> Dict[str, Any]:
        text_lower = text.lower()
        
        critical_words = ["emergency", "dying", "bleeding", "fire", "accident", "आग", "मर", "हादसा"]
        distress_words = ["days", "weeks", "children", "sick", "hospital", "दिनों", "बीमार", "अस्पताल"]
        
        if any(w in text_lower for w in critical_words):
            score = 9
            tone = "panicked"
            emotions = ["fear", "urgency", "desperation"]
            escalate = True
        elif any(w in text_lower for w in distress_words):
            score = 7
            tone = "distressed"
            emotions = ["frustration", "urgency", "sadness"]
            escalate = False
        else:
            score = 2
            tone = "calm"
            emotions = ["hope", "anxiety"]
            escalate = False
            
        return {
            "distress_score": score,
            "emotional_tone": tone,
            "detected_emotions": emotions,
            "escalation_recommended": escalate,
            "sentiment_note": "Fallback heuristic analysis applied."
        }

    def run(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        try:
            text = input_data.get("normalized_text", "")
            
            if not self.client:
                analysis = self._get_fallback_analysis(text)
            else:
                system_prompt = """
Analyze the emotional state of the citizen writing this complaint.
Return ONLY this JSON:
{
  "distress_score": 7,
  "emotional_tone": "frustrated",
  "detected_emotions": ["frustration", "urgency", "fear"],
  "escalation_recommended": false,
  "sentiment_note": "Citizen has been waiting 3 days, tone is increasingly urgent"
}

distress_score: integer 1-10 (1-3 calm, 4-6 concerned, 7-8 distressed, 9-10 critical)
emotional_tone: single word (calm|concerned|frustrated|distressed|panicked|angry)
detected_emotions: list from (frustration, urgency, fear, anger, desperation, sadness, anxiety, exhaustion, hope, gratitude)
escalation_recommended: true if distress_score >= 8
"""
                response = self.client.chat.completions.create(
                    model=self.model_name,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": text}
                    ],
                    response_format={"type": "json_object"},
                    temperature=0.0
                )
                analysis = json.loads(response.choices[0].message.content)

            # Apply integration rules
            score = analysis.get("distress_score", 1)
            escalate = analysis.get("escalation_recommended", False)
            current_priority = input_data.get("priority", 3)
            
            if score >= 9:
                input_data["priority"] = 5
            elif score >= 8 and current_priority < 4:
                input_data["priority"] += 1
                
            if escalate:
                input_data["overload_flag"] = True
                
            return {**input_data, **analysis}
            
        except Exception as e:
            logger.error(f"Sentiment error: {e}")
            fallback = self._get_fallback_analysis(input_data.get("normalized_text", ""))
            return {**input_data, **fallback}
