import os
import json
import secrets
from datetime import datetime, timezone, timedelta
from typing import Dict, Any

class IncidentClusterAgent:
    """
    Agent 6: Incident Cluster Agent
    Groups similar complaints into master incident reports.
    """
    def __init__(self):
        self.data_file = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "sample_complaints.json")
        if not os.path.exists(self.data_file):
            self.data_file = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "mock_grievances.json")

    def _jaccard_similarity(self, set1: set, set2: set) -> float:
        intersection = len(set1.intersection(set2))
        union = len(set1.union(set2))
        return intersection / union if union > 0 else 0.0

    def run(self, final_res: Dict[str, Any]) -> Dict[str, Any]:
        try:
            if not os.path.exists(self.data_file):
                return {**final_res, "is_clustered": False, "incident_id": None}
                
            new_cat = final_res.get("category")
            new_pin = str(final_res.get("pincode", ""))
            new_text = final_res.get("normalized_text", "")
            if not new_cat or len(new_pin) < 4 or not new_text:
                return {**final_res, "is_clustered": False, "incident_id": None}
                
            new_pin_prefix = new_pin[:4]
            new_words = set(new_text.split())
            
            with open(self.data_file, "r", encoding="utf-8") as f:
                data = json.load(f)
                
            recent = data[-100:] if len(data) >= 100 else data
            
            # For prototype: we just check timestamp if available, else assume recent
            # If we had robust timestamps, we'd filter by last 72 hours
            
            linked_count = 1 # Self
            
            for g in recent:
                g_cat = g.get("category", "")
                g_pin = str(g.get("pincode", ""))
                
                if g_cat == new_cat and g_pin.startswith(new_pin_prefix):
                    g_text = g.get("description", "") + " " + g.get("problem_title", "")
                    g_words = set(g_text.lower().split())
                    
                    if self._jaccard_similarity(new_words, g_words) > 0.40:
                        linked_count += 1
                        
            if linked_count >= 3:
                year = datetime.now().year
                inc_id = f"INC-{year}-{secrets.token_hex(3).upper()}"
                
                if linked_count >= 16:
                    severity = "zone_level"
                elif linked_count >= 6:
                    severity = "ward_level"
                else:
                    severity = "local"
                    
                return {
                    **final_res,
                    "is_clustered": True,
                    "incident_id": inc_id,
                    "incident_linked_count": linked_count,
                    "incident_severity": severity
                }
                
            return {
                **final_res,
                "is_clustered": False,
                "incident_id": None,
                "incident_linked_count": 0,
                "incident_severity": None
            }
            
        except Exception as e:
            print(f"IncidentCluster error: {e}")
            return {
                **final_res,
                "is_clustered": False,
                "incident_id": None,
                "incident_linked_count": 0,
                "incident_severity": None
            }
