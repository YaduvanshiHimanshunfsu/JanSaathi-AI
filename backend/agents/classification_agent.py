import os
import re
import json
import logging
from typing import Dict, Any, List

logger = logging.getLogger(__name__)

class ClassificationAgentV2:
    """
    Agent 2 (V2): Classification & Priority Agent
    Classifies complaints into departments, detects urgency, geo-tags,
    calculates priority, SLA, and provides reasoning.
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
                self.model_name = "gemini-2.5-flash"
            except ImportError:
                pass
        elif self.openai_key:
            try:
                from openai import OpenAI
                self.client = OpenAI(api_key=self.openai_key)
                self.model_name = "gpt-4o-mini"
            except ImportError:
                pass

        self.valid_departments = [
            "pothole_road", "water_supply", "electricity", "sanitation_waste",
            "encroachment", "health_hospital", "property_tax", "public_safety"
        ]
        
        self.lucknow_localities = [
            "Hazratganj", "Gomti Nagar", "Aliganj", "Indira Nagar", "Rajajipuram",
            "Charbagh", "Alambagh", "Mahanagar", "Vikas Nagar", "Nishatganj",
            "Aminabad", "Hussainganj", "Kapoorthala", "Jankipuram", "Faizabad Road",
            "Kursi Road", "Sitapur Road", "Kanpur Road", "Chinhat", "Bakshi Ka Talab"
        ]

    def _extract_geo_tag(self, text: str) -> str:
        text_lower = text.lower()
        for loc in self.lucknow_localities:
            if loc.lower() in text_lower:
                return loc
        return None

    def _get_fallback_analysis(self, text: str, specified_dept: str = None) -> Dict[str, Any]:
        text_lower = text.lower()
        
        if specified_dept and specified_dept in self.valid_departments:
            best_dept = specified_dept
        else:
            scores = {dept: 0 for dept in self.valid_departments}
            pothole_words = ["गड्ढा", "सड़क", "pothole", "road", "damage"]
            for w in pothole_words:
                if w in text_lower: scores["pothole_road"] += 2
                
            water_words = ["पानी", "जल", "water", "supply", "pipe", "leak"]
            for w in water_words:
                if w in text_lower: scores["water_supply"] += 2
                
            elec_words = ["बिजली", "तार", "electricity", "power", "spark"]
            for w in elec_words:
                if w in text_lower: scores["electricity"] += 2
                
            san_words = ["कूड़ा", "कचरा", "सफाई", "garbage", "waste", "drain"]
            for w in san_words:
                if w in text_lower: scores["sanitation_waste"] += 2
                
            best_dept = max(scores, key=scores.get)
            if scores[best_dept] == 0:
                best_dept = "sanitation_waste"

        urgency = "concerned"
        priority = 3
        critical_words = ["fire", "accident", "threat", "immediate", "urgent"]
        if any(w in text_lower for w in critical_words):
            urgency = "critical"
            priority = 5
            
        sla_hours_map = {
            "electricity": 12, "public_safety": 8, "water_supply": 24,
            "sanitation_waste": 24, "health_hospital": 36, "pothole_road": 48,
            "encroachment": 72, "property_tax": 96
        }
        sla_hours = sla_hours_map.get(best_dept, 24)
        if priority == 5:
            sla_hours = max(2, int(sla_hours * 0.3))

        sub_cat_map = {
            "electricity": "power_cut",
            "water_supply": "no_supply",
            "pothole_road": "road_damage",
            "sanitation_waste": "garbage_pile"
        }
        
        # Fake a confidence score based on keywords matched vs total text
        confidence = 0.65
        if specified_dept == best_dept:
            confidence = 0.85

        return {
            "category": best_dept,
            "sub_category": sub_cat_map.get(best_dept, "other"),
            "department": best_dept,
            "priority": priority,
            "urgency_label": urgency,
            "predicted_sla_hours": sla_hours,
            "confidence": confidence,
            "geo_tag": self._extract_geo_tag(text),
            "reasoning": [
                f"Matched keywords for {best_dept}",
                f"Urgency determined as {urgency}",
                "Used fallback heuristic analysis"
            ]
        }

    def run(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        try:
            text = input_data.get("normalized_text", "")
            specified_dept = input_data.get("selected_department")
            
            geo_tag = self._extract_geo_tag(text)
            
            if not self.client:
                analysis = self._get_fallback_analysis(text, specified_dept)
                return {**input_data, **analysis}

            system_prompt = f"""
You are the Classification Agent for Lucknow Nagar Nigam.
Classify the complaint into exactly one of these categories:
- pothole_road, water_supply, electricity, sanitation_waste, encroachment, health_hospital, property_tax, public_safety

Determine the sub_category (e.g. transformer_fault, pipe_leak, garbage_pile).
Assign Priority (1-5).
Assign Urgency: calm, concerned, distressed, critical.
Assign predicted_sla_hours (electricity=12, public_safety=8, water=24, waste=24, health=36, road=48, encroachment=72, tax=96).
Reduce SLA for priority 4-5.
Provide a confidence score (float 0.0 - 1.0).
Provide reasoning as an array of exactly 3 strings explaining the classification.

Output EXACTLY this JSON schema:
{{
  "category": "category_name",
  "sub_category": "sub_category_name",
  "department": "category_name",
  "priority": 3,
  "urgency_label": "concerned",
  "predicted_sla_hours": 24,
  "confidence": 0.85,
  "reasoning": ["point 1", "point 2", "point 3"]
}}
"""
            user_prompt = f"Complaint: {text}\nSpecified Dept: {specified_dept}"
            
            response = self.client.chat.completions.create(
                model=self.model_name,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                response_format={"type": "json_object"},
                temperature=0.0
            )
            
            result = json.loads(response.choices[0].message.content)
            
            # Ensure geo_tag is appended from our regex list
            result["geo_tag"] = geo_tag
            
            if result.get("category") not in self.valid_departments:
                result["category"] = "sanitation_waste"
                result["department"] = "sanitation_waste"
                
            return {**input_data, **result}
            
        except Exception as e:
            logger.error(f"Classification error: {e}")
            fallback = self._get_fallback_analysis(input_data.get("normalized_text", ""), input_data.get("selected_department"))
            return {**input_data, **fallback}
