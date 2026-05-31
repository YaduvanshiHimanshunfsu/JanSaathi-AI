import os
import json
import logging
from typing import Dict, Any, List
from openai import OpenAI

logger = logging.getLogger(__name__)

class ClassificationAgent:
    """
    Agent 2: Classification & Priority Agent
    Classifies complaints into departments, detects emotional urgency, 
    calculates priority, and predicts SLA. 
    Supports bilingual English & Hindi keyword matching for highly accurate categorization.
    """
    def __init__(self):
        # Support Google Gemini API key or standard OpenAI key
        self.gemini_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
        self.openai_key = os.getenv("OPENAI_API_KEY")
        
        if self.gemini_key:
            self.client = OpenAI(
                api_key=self.gemini_key,
                base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
            )
            self.model_name = "gemini-1.5-flash"
        elif self.openai_key:
            self.client = OpenAI(api_key=self.openai_key)
            self.model_name = "gpt-4o-mini"
        else:
            self.client = None
            self.model_name = None

        self.valid_departments = [
            "pothole_road",
            "water_supply",
            "electricity",
            "sanitation_waste",
            "encroachment",
            "health_hospital",
            "property_tax",
            "public_safety"
        ]

    def _extract_matched_keywords(self, text: str) -> List[str]:
        """
        Scans complaint text for registered English and Hindi keywords across all departments
        and returns a sorted list of unique found keyword tokens.
        """
        text_lower = text.lower()
        matched = []
        
        # Comprehensive bilingual keyword dictionary representing all departments
        keyword_dict = {
            "pothole_road": [
                "गड्ढा", "गड्ढे", "सड़क", "मार्ग", "गड्ढों", "टूटी सड़क", "खड्डे", "pothole", "potholes", 
                "road", "roads", "street", "damage", "broken", "accident", "fracture", "bike", "scooty", "fall", "injury"
            ],
            "water_supply": [
                "पानी", "जल", "नल", "सप्लाई", "गंदा पानी", "पाइप", "लीक", "पंप", "मोटर", "जल कल", "water", 
                "supply", "pipe", "pipeline", "leak", "leakage", "dirty", "odor", "smell", "drainage", "motor", "pump", "jal kal", "tap"
            ],
            "electricity": [
                "बिजली", "विद्युत", "विद्युत्", "विर्णित", "लेसा", "लेस", "खंभा", "तार", "चिंगारी", "शॉर्ट सर्किट", "बिल", "स्ट्रीट लाइट", "अंधेरा",
                "electricity", "power", "light", "lesa", "transformer", "spark", "sparking", "current", "wire", "pole", "blackout", "bill", "fluctuation"
            ],
            "sanitation_waste": [
                "कूड़ा", "कचरा", "सफाई", "झाड़ू", "सफाईवाला", "नाली", "नाला", "बदबू", "सड़ांध", "कचरे का ढेर",
                "garbage", "waste", "trash", "sanitation", "clean", "sweeper", "dustbin", "drain", "sewer", "clogged", "stench", "smell"
            ],
            "encroachment": [
                "अतिक्रमण", "कब्जा", "अवैध", "फुटपाथ", "दुकानदार", "दुकान", "ठेला", "जाम", "रास्ता रोका",
                "encroachment", "illegal", "fencing", "fence", "shop", "vendor", "path", "pavement", "footpath", "jam", "parking", "blocked"
            ],
            "health_hospital": [
                "डेंगू", "मच्छर", "मलेरिया", "अस्पताल", "बीमारी", "मरीज", "छिड़काव", "फॉग्गिंग", "डॉक्टर", "स्वास्थ्य",
                "dengue", "mosquito", "malaria", "fever", "hospital", "doctor", "medicine", "spraying", "fogging", "health", "disease", "sick"
            ],
            "property_tax": [
                "टैक्स", "कर", "गृह कर", "हाउस टैक्स", "रसीद", "नाम गलत", "बिल सुधार", "नामांतरण",
                "tax", "property tax", "house tax", "receipt", "assessment", "name correction", "mistake", "error", "registry"
            ],
            "public_safety": [
                "पुलिस", "सुरक्षा", "नशा", "छेड़खानी", "लड़ाई", "असामाजिक तत्व", "चोरी", "खतरा", "डर",
                "police", "safety", "crime", "threat", "harassment", "girls", "women", "gunda", "theft", "patrol", "security"
            ]
        }
        
        for dept, words in keyword_dict.items():
            for w in words:
                if w in text_lower:
                    if w not in matched:
                        matched.append(w)
                        
        return sorted(matched, key=len, reverse=True) # Sort by length to highlight longer matches first

    def _get_fallback_analysis(self, text: str, specified_dept: str = None) -> Dict[str, Any]:
        """
        Bilingual English & Hindi Keyword and Lexical Heuristics Analyzer.
        Categorizes complaints in both Hindi and English/Hinglish styles.
        """
        text_lower = text.lower()
        
        # If user explicitly selected one of our 8 valid departments, respect that choice!
        if specified_dept and specified_dept in self.valid_departments:
            best_dept = specified_dept
        else:
            # Otherwise, run bilingual keyword categorization
            scores = {dept: 0 for dept in self.valid_departments}
            
            # 1. Pothole / Road Repair Keywords (Hindi & English/Hinglish)
            pothole_words = [
                "गड्ढा", "गड्ढे", "सड़क", "मार्ग", "गड्ढों", "टूटी सड़क", "खड्डे", # Hindi
                "pothole", "potholes", "road", "roads", "street", "damage", "broken", "accident", "fracture", "bike", "scooty", "fall", "injury" # English/Hinglish
            ]
            for w in pothole_words:
                if w in text_lower: scores["pothole_road"] += 2
                
            # 2. Water Supply Keywords (Hindi & English/Hinglish)
            water_words = [
                "पानी", "जल", "नल", "सप्लाई", "गंदा पानी", "पाइप", "लीक", "पंप", "मोटर", "जल कल", # Hindi
                "water", "supply", "pipe", "pipeline", "leak", "leakage", "dirty", "odor", "smell", "drainage", "motor", "pump", "jal kal", "tap" # English/Hinglish
            ]
            for w in water_words:
                if w in text_lower: scores["water_supply"] += 2
                
            # 3. Electricity / LESA Keywords (Hindi & English/Hinglish)
            elec_words = [
                "बिजली", "विद्युत", "ट्रांसफार्मर", "खंभा", "तार", "चिंगारी", "शॉर्ट सर्किट", "बिल", "लेसा", "अंधेरा", "स्ट्रीट लाइट", # Hindi
                "electricity", "power", "light", "lesa", "transformer", "spark", "sparking", "current", "wire", "pole", "blackout", "bill", "fluctuation" # English/Hinglish
            ]
            for w in elec_words:
                if w in text_lower: scores["electricity"] += 2
                
            # 4. Sanitation / Waste Keywords (Hindi & English/Hinglish)
            san_words = [
                "कूड़ा", "कचरा", "सफाई", "झाड़ू", "सफाईवाला", "नाली", "नाला", "बदबू", "सड़ांध", "कचरे का ढेर", # Hindi
                "garbage", "waste", "trash", "sanitation", "clean", "sweeper", "dustbin", "drain", "sewer", "clogged", "stench", "smell" # English/Hinglish
            ]
            for w in san_words:
                if w in text_lower: scores["sanitation_waste"] += 2
                
            # 5. Encroachment Keywords (Hindi & English/Hinglish)
            enc_words = [
                "अतिक्रमण", "कब्जा", "अवैध", "फुटपाथ", "दुकानदार", "दुकान", "ठेला", "जाम", "रास्ता रोका", # Hindi
                "encroachment", "illegal", "fencing", "fence", "shop", "vendor", "path", "pavement", "footpath", "jam", "parking", "blocked" # English/Hinglish
            ]
            for w in enc_words:
                if w in text_lower: scores["encroachment"] += 2
                
            # 6. Health & Hospital Keywords (Hindi & English/Hinglish)
            health_words = [
                "डेंगू", "मच्छर", "मलेरिया", "अस्पताल", "बीमारी", "मरीज", "छिड़काव", "फॉग्गिंग", "डॉक्टर", "स्वास्थ्य", # Hindi
                "dengue", "mosquito", "malaria", "fever", "hospital", "doctor", "medicine", "spraying", "fogging", "health", "disease", "sick" # English/Hinglish
            ]
            for w in health_words:
                if w in text_lower: scores["health_hospital"] += 2
                
            # 7. Property Tax Keywords (Hindi & English/Hinglish)
            tax_words = [
                "टैक्स", "कर", "गृह कर", "हाउस टैक्स", "रसीद", "नाम गलत", "बिल सुधार", "नामांतरण", # Hindi
                "tax", "property tax", "house tax", "receipt", "assessment", "name correction", "mistake", "error", "registry" # English/Hinglish
            ]
            for w in tax_words:
                if w in text_lower: scores["property_tax"] += 2
                
            # 8. Public Safety / Police Keywords (Hindi & English/Hinglish)
            public_words = [
                "पुलिस", "सुरक्षा", "नशा", "छेड़खानी", "लड़ाई", "असामाजिक तत्व", "चोरी", "खतरा", "डर", # Hindi
                "police", "safety", "crime", "threat", "harassment", "girls", "women", "gunda", "theft", "patrol", "security" # English/Hinglish
            ]
            for w in public_words:
                if w in text_lower: scores["public_safety"] += 2

            best_dept = max(scores, key=scores.get)
            if scores[best_dept] == 0:
                best_dept = "sanitation_waste" # default

        # Urgency & Priority Detection
        urgency = "concerned"
        priority = 3
        
        # High impact urgency words (Hindi & English)
        critical_words = ["sparking", "spark", "fire", "accident", "threat", "immediate", "urgent", "खतरा", "हादसा", "चोट", "आग", "चिंगारी", "करंट"]
        distressed_words = ["badbu", "stench", "ganda", "sick", "disease", "dengue", "dengu", "डेंगू", "मच्छर", "सड़ांध", "बीमारी", "days", "weeks", "परेशान", "हाहाकार"]
        calm_words = ["bill", "tax", "name", "correction", "गलत", "सुधार", "rashi", "receipt"]
        
        if any(w in text_lower for w in critical_words):
            urgency = "critical"
            priority = 5
        elif any(w in text_lower for w in distressed_words):
            urgency = "distressed"
            priority = 4
        elif any(w in text_lower for w in calm_words):
            urgency = "calm"
            priority = 2
            
        # Target default SLA maps
        sla_hours_map = {
            "electricity": 12,
            "public_safety": 8,
            "water_supply": 24,
            "sanitation_waste": 24,
            "health_hospital": 36,
            "pothole_road": 48,
            "encroachment": 72,
            "property_tax": 96
        }
        sla_hours = sla_hours_map.get(best_dept, 24)
        
        if priority == 5:
            sla_hours = max(2, int(sla_hours * 0.3))
        elif priority == 4:
            sla_hours = max(6, int(sla_hours * 0.6))
            
        return {
            "category": best_dept,
            "department": best_dept,
            "priority": priority,
            "urgency_label": urgency,
            "predicted_sla_hours": sla_hours,
            "reasoning": f"Bilingual parsing identified '{best_dept}' with urgency '{urgency}'."
        }

    def run(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        text = input_data["normalized_text"]
        specified_dept = input_data.get("selected_department")
        
        # Always run bilingual keyword extraction first so we have the matched tags
        input_data["matched_keywords"] = self._extract_matched_keywords(text)
        
        # If user explicitly chose a valid department, we can bypass AI sorting or feed it as reference
        # We run the local matching fallback if no key is provided
        if not self.client:
            logger.info("No active AI API key found, executing local bilingual keyword parser.")
            analysis = self._get_fallback_analysis(text, specified_dept)
            return {**input_data, **analysis}

        # Otherwise, run context-rich LLM classifier (Gemini or OpenAI)
        system_prompt = f"""
You are the central "Classification & Priority Agent" for Lucknow Nagar Nigam's AI Jansunwai portal ("SunwAI").
You analyze complaints containing combinations of English, Hindi, and Hinglish.

If the citizen has specified a particular department, prioritize classifying it into that department if it fits context. Otherwise, analyze the description and classify it into one of these exact categories:
- "pothole_road" (Pothole/Road repair)
- "water_supply" (Jal Kal Department)
- "electricity" (LESA Electricity issues, transformers, sparks, streetlights)
- "sanitation_waste" (Garbage pileup, blocked drains, sweepers)
- "encroachment" (Illegal roadside shops, blocked pavements)
- "health_hospital" (Mosquito control, dengue outbreaks, clinic complaints)
- "property_tax" (Property/House tax complaints, errors)
- "public_safety" (Safety threats, local harassment, police coordinate issues)

Analyze the emotional urgency of the complaint:
- "calm": Simple administrative errors, name changes, or general non-pressing inquiries.
- "concerned": Standard issues causing public annoyance (garbage, dead streetlights).
- "distressed": Severe issues affecting quality of life (no water for days, foul smell, sick people nearby).
- "critical": Active dangers, immediate safety hazards, sparking electrical assets, crime/safety threats.

Assign a Priority score (integer from 1 to 5):
- 1 or 2: Low priority (calm, administrative issues)
- 3: Medium priority (standard complaints)
- 4: High priority (distressed complaints)
- 5: Critical priority (active dangers)

SLA Estimation:
- Estimate the predicted hours to resolve the ticket.
- Standard default hours are: electricity=12, public_safety=8, water_supply=24, sanitation_waste=24, health_hospital=36, pothole_road=48, encroachment=72, property_tax=96.
- Reduce SLA significantly (by 40-70%) for critical priority 4 and 5 complaints.

You MUST respond with a JSON object in this exact schema:
{{
  "category": "department_name_here",
  "department": "department_name_here",
  "priority": 3,
  "urgency_label": "urgency_here",
  "predicted_sla_hours": 24,
  "reasoning": "A concise engineering sentence explaining why this department, urgency, and priority were chosen."
}}
"""
        user_prompt = f"""
Complaint Description: {text}
Citizen Selected Department Field: {specified_dept}
"""
        try:
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
            
            # Validation: Ensure category is correct
            if result.get("category") not in self.valid_departments:
                fallback = self._get_fallback_analysis(text, specified_dept)
                result["category"] = fallback["category"]
                result["department"] = fallback["category"]
                
            return {**input_data, **result}
            
        except Exception as e:
            logger.error(f"Error calling AI API (model: {self.model_name}): {e}. Executing fallback.")
            analysis = self._get_fallback_analysis(text, specified_dept)
            return {**input_data, **analysis}
