# JanSaathi AI — Prompt Engineering Notes

# Objective

The AI Classification Agent must:
- classify grievances,
- detect urgency,
- understand Hindi/Hinglish,
- avoid hallucinated departments,
- return strict JSON output.

---

# Key Design Goals

## Deterministic Output
Responses must always be parseable JSON.

---

## Controlled Department Vocabulary
The model is restricted to predefined departments only.

---

## Emotion-Aware Classification
The model analyses:
- urgency,
- emotional tone,
- civic severity.

---

# Supported Languages

- Hindi
- English
- Hinglish

Example:
```text
bijli 2 din se nahi aa rahi
```

---

# Prompt Strategy

The prompt uses:

## 1. System Prompt
Defines:
- role,
- constraints,
- output schema.

---

## 2. Few-Shot Examples
Provides examples for:
- Hindi complaints,
- mixed-language complaints,
- urgency handling.

---

## 3. JSON Enforcement
The model is explicitly instructed:
- never return markdown,
- never explain,
- only output valid JSON.

---

# Example System Prompt

```text
You are a government grievance classification AI.

You must:
- classify complaints,
- detect urgency,
- return only valid JSON,
- never hallucinate departments.

Allowed departments:
- Water Supply
- Electricity
- Sanitation
- Road Repair
- Public Safety
```

---

# Emotion Detection Logic

The AI analyses:
- distress language,
- urgency indicators,
- public safety risks,
- healthcare dependency references.

---

# Example Critical Complaint

```text
मेरी माँ dialysis patient हैं और 3 दिन से पानी नहीं आ रहा
```

Expected:
```json
{
  "priority": 5,
  "urgency_label": "Critical"
}
```

---

# Fallback Strategy

If:
- OpenAI fails,
- JSON parsing fails,
- timeout occurs,

the system falls back to:
- keyword routing,
- default priority assignment.

---

# Why Hybrid AI Was Chosen

Pure LLM routing can:
- hallucinate,
- become expensive,
- fail unpredictably.

Hybrid routing improves:
- reliability,
- transparency,
- explainability.

---

# Production Improvements

Future improvements may include:
- fine-tuned civic classification models,
- multilingual embeddings,
- confidence scoring,
- district-specific routing intelligence.