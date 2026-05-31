import re
import os
import json
import hashlib
from typing import Dict, Any

try:
    from security_metrics import metrics
except ImportError:
    import sys
    sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    from security_metrics import metrics

class IntakeAgentV2:
    """
    Agent 1 (V2): Spam detection, Duplicate Check, and Hinglish Normalization.
    """
    def __init__(self):
        self.hinglish_map = {
            "paani": "pani", "kooda": "kuda", "kachraa": "kachra", "gaddha": "gadha",
            "sadak": "sadak", "bijli": "bijli", "naalaa": "nala", "aaraha": "aa raha",
            "naali": "nali", "safai": "safai", "paesa": "paisa"
        }
        self.data_file = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "sample_complaints.json")
        # We will check sample_complaints.json or mock_grievances.json
        if not os.path.exists(self.data_file):
            self.data_file = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "mock_grievances.json")

    def _normalize_hinglish(self, text: str) -> str:
        words = text.split()
        normalized = [self.hinglish_map.get(w.lower(), w) for w in words]
        return " ".join(normalized)

    def _is_spam(self, text: str) -> bool:
        words = text.split()
        if len(words) < 4:
            return True
            
        if text.isupper() and len(text) > 20:
            return True
            
        if re.search(r'(.)\1{6,}', text):
            return True
            
        test_words = {"test", "testing", "hello", "hi", "abc", "xyz", "asdf"}
        if all(w.lower() in test_words for w in words):
            return True
            
        return False

    def _generate_hash(self, text: str) -> str:
        normalized = re.sub(r'[^a-z0-9]', '', text.lower())
        return hashlib.md5(normalized.encode()).hexdigest()

    def _is_duplicate(self, mobile: str, text_hash: str) -> bool:
        if not os.path.exists(self.data_file):
            return False
        try:
            with open(self.data_file, "r", encoding="utf-8") as f:
                data = json.load(f)
                
            recent_grievances = data[-50:] if len(data) >= 50 else data
            
            for g in recent_grievances:
                # check both possible fields
                if g.get("citizen_mobile") == mobile or g.get("mobile_number") == mobile:
                    old_text = g.get("description", "") + g.get("problem_title", "")
                    if not old_text:
                        old_text = g.get("raw_text", "")
                    old_hash = self._generate_hash(old_text)
                    if old_hash == text_hash:
                        return True
            return False
        except Exception as e:
            print(f"Duplicate check failed: {e}")
            return False

    def run(self, raw_text: str, mobile: str) -> Dict[str, Any]:
        try:
            intake_flags = []
            
            # Spam Check
            if self._is_spam(raw_text):
                metrics.increment("spam_blocked")
                return {
                    "spam_blocked": True,
                    "intake_flags": ["SPAM_DETECTED"],
                    "word_count": len(raw_text.split()),
                    "normalized_text": raw_text
                }
                
            # Normalization
            normalized_text = self._normalize_hinglish(raw_text)
            
            # Duplicate Check
            text_hash = self._generate_hash(normalized_text)
            if self._is_duplicate(mobile, text_hash):
                metrics.increment("duplicates_detected")
                intake_flags.append("DUPLICATE_SUSPECTED")
                
            return {
                "spam_blocked": False,
                "intake_flags": intake_flags,
                "word_count": len(normalized_text.split()),
                "normalized_text": normalized_text
            }
        except Exception as e:
            print(f"IntakeAgentV2 error: {e}")
            return {
                "spam_blocked": False,
                "intake_flags": [],
                "word_count": len(raw_text.split()),
                "normalized_text": raw_text
            }