# JanSaathi AI — Multi-Agent Architecture

## Overview

JanSaathi AI is designed as a modular multi-agent grievance resolution system inspired by real government workflow pipelines.

Instead of a single chatbot, the system breaks grievance handling into multiple specialised agents that independently process, enrich, classify, route, and monitor complaints.

This architecture improves:
- modularity,
- explainability,
- reliability,
- scalability,
- and fault tolerance.

---

# System Goals

The architecture is designed to solve:

- slow grievance routing,
- lack of transparency,
- language accessibility barriers,
- overloaded departments,
- delayed prioritisation,
- poor citizen communication.

---

# High-Level Agent Pipeline

```text
Citizen Complaint
        │
        ▼
┌─────────────────────────────┐
│ Intake & Normalisation Agent│
└────────────┬────────────────┘
             │
             ▼
┌─────────────────────────────┐
│ Keyword Routing Agent       │
│ (Fast deterministic layer)  │
└────────────┬────────────────┘
             │
             ▼
┌─────────────────────────────┐
│ AI Classification Agent     │
│ + Emotion Detection         │
└────────────┬────────────────┘
             │
             ▼
┌─────────────────────────────┐
│ Routing & Assignment Agent  │
└────────────┬────────────────┘
             │
             ▼
┌─────────────────────────────┐
│ Communication Agent         │
│ Hindi/English Responses     │
└────────────┬────────────────┘
             │
             ▼
┌─────────────────────────────┐
│ Follow-up & Escalation Agent│
└─────────────────────────────┘
```

---

# Agent Descriptions

---

## 1. Intake & Normalisation Agent

### Purpose
Receives raw complaint submissions and converts them into standard structured data.

### Responsibilities
- validate form fields,
- clean text,
- detect language,
- generate grievance ID,
- attach timestamps.

### Input

```json
{
  "citizen_name": "Ramesh Yadav",
  "description": "3 din se paani nahi aa raha"
}
```

### Output

```json
{
  "grievance_id": "JSA-1024",
  "language": "Hindi",
  "normalized_text": "3 din se paani nahi aa raha"
}
```

---

## 2. Keyword Routing Agent

### Purpose
Performs fast deterministic classification using predefined civic keywords.

### Why Important
Acts as:
- fallback layer,
- reliability layer,
- cost optimisation layer.

### Example

| Keyword | Department |
|---|---|
| paani | Water Supply |
| kachra | Sanitation |
| pothole | Road Repair |

### Output

```json
{
  "suggested_department": "Water Supply",
  "confidence": 0.72
}
```

---

## 3. AI Classification & Priority Agent

### Purpose
Uses LLM intelligence for:
- department classification,
- urgency analysis,
- emotional tone detection,
- SLA prediction.

### Emotion Labels
- Calm
- Concerned
- Distressed
- Critical

### Output

```json
{
  "department": "Water Supply",
  "priority": 5,
  "urgency_label": "Critical",
  "predicted_sla_hours": 6
}
```

---

## 4. Routing & Assignment Agent

### Purpose
Routes complaints to:
- correct department,
- least-loaded officer,
- balanced department queues.

### Responsibilities
- officer assignment,
- overload detection,
- workload balancing.

### Overload Trigger

```text
open_tickets > max_capacity
```

### Output

```json
{
  "assigned_officer": "Amit Verma",
  "department": "Water Supply",
  "overload_flag": false
}
```

---

## 5. Communication Agent

### Purpose
Generates citizen-facing acknowledgements and internal officer summaries.

### Citizen Message
- Hindi-native,
- warm tone,
- non-robotic communication.

### Officer Message
- concise English briefing,
- operational context.

### Example

```text
आपकी शिकायत सफलतापूर्वक दर्ज कर ली गई है।
जल आपूर्ति विभाग को शिकायत भेज दी गई है।
```

---

## 6. Follow-up & Escalation Agent

### Purpose
Simulates asynchronous government follow-up workflows.

### Responsibilities
- monitor grievance status,
- trigger reminders,
- escalate overdue cases,
- update citizens.

### Demo Behaviour
After a configurable delay:
- check status,
- update workflow,
- escalate unresolved cases.

---

# Hybrid Classification Strategy

JanSaathi AI intentionally uses a hybrid routing approach:

## Layer 1 — Keyword Detection
Fast deterministic filtering.

## Layer 2 — LLM Refinement
Context-aware classification and emotional analysis.

This approach improves:
- reliability,
- explainability,
- cost efficiency,
- debugging simplicity.

---

# Frontend Architecture

## Citizen Portal
Handles:
- complaint submission,
- multilingual input,
- agent animation flow,
- acknowledgement display.

---

## Officer Dashboard
Displays:
- active grievances,
- priorities,
- SLA countdowns,
- overload alerts.

---

## Department Directory
Provides:
- department links,
- helplines,
- contact information.

---

# Backend Stack

| Layer | Technology |
|---|---|
| API | FastAPI |
| AI | OpenAI GPT-4o-mini |
| Storage | JSON Mock Database |
| Frontend | React + Vite |
| Styling | Tailwind CSS |

---

# Design Principles

## Explainable AI
Every routing decision should be inspectable.

---

## Human-in-the-Loop
Critical grievances can be escalated to manual officers.

---

## Vernacular Accessibility
Hindi and Hinglish are treated as first-class citizen inputs.

---

## Modular Agents
Each agent performs one specialised task independently.

---

# Future Scalability

Future improvements may include:
- district-wide deployment,
- real SMS integration,
- real Jansunwai API integration,
- officer authentication,
- vector search,
- analytics pipelines,
- audit logs,
- role-based access control.