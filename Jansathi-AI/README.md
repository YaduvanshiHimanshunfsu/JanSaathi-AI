# JanSaathi AI 🇮🇳
### Autonomous AI-Powered Grievance Resolution System for Jansunwai

![Python](https://img.shields.io/badge/Python-3.11-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green)
![React](https://img.shields.io/badge/React-Frontend-61dafb)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-orange)
![Status](https://img.shields.io/badge/Status-Prototype-success)

> JanSaathi AI is an autonomous multi-agent grievance resolution platform designed for the Jansunwai ecosystem.  
> It intelligently classifies complaints, detects urgency and emotional distress, routes cases to departments, generates vernacular citizen responses, and simulates autonomous follow-up workflows.

---

# Problem Statement

UP's Jansunwai portal receives millions of public grievances related to roads, sanitation, water supply, electricity, safety, healthcare, and civic infrastructure.  
However, grievance resolution is often slow, opaque, and difficult to track for citizens.

Citizens frequently face:
- delayed routing to correct departments,
- lack of updates,
- language barriers,
- overloaded departments,
- and poor prioritisation of urgent cases.

JanSaathi AI aims to solve this using an autonomous AI-driven workflow system with multilingual citizen support and intelligent grievance orchestration.

---

# Core Idea

Instead of building a simple chatbot, JanSaathi AI acts as a **multi-agent governance coordination system**.

The platform:
- understands Hindi, English, and Hinglish complaints,
- detects urgency and emotional distress,
- routes grievances intelligently,
- balances department workload,
- generates citizen-facing Hindi acknowledgements,
- and autonomously follows up on unresolved cases.

---

# Key Features

## 🧠 Emotion-Aware Prioritisation
Detects emotional distress and urgency from complaint tone:
- Calm
- Concerned
- Distressed
- Critical

Urgent citizen issues receive higher priority automatically.

---

## 🌐 Hindi + English + Hinglish Support
Citizens can submit complaints naturally in:
- Hindi
- English
- Hinglish

Example:
```text
3 din se hamare area me paani nahi aa raha
```

---

## ⚡ Hybrid Smart Classification
Uses:
1. Keyword-based deterministic routing
2. LLM-based intelligent refinement

This improves:
- reliability,
- speed,
- and fault tolerance.

---

## 🏛️ Intelligent Department Routing
Automatically routes complaints to:
- correct department,
- least-loaded officer,
- and flags overloaded departments.

---

## 📩 Vernacular Citizen Communication
Generates warm, native Hindi acknowledgement messages instead of robotic translations.

---

## 🔄 Autonomous Follow-up Agent
Simulates asynchronous government follow-up workflows:
- checks unresolved grievances,
- updates status,
- escalates overdue cases.

---

## 📚 UP Government Department Directory
Provides department:
- contacts,
- websites,
- helplines,
- escalation references.

---

# Multi-Agent Architecture

```text
Citizen Complaint
        │
        ▼
┌────────────────────────┐
│ Intake & Normalisation │
└──────────┬─────────────┘
           │
           ▼
┌────────────────────────┐
│ Keyword Routing Agent  │
└──────────┬─────────────┘
           │
           ▼
┌────────────────────────┐
│ AI Classification      │
│ + Urgency Detection    │
└──────────┬─────────────┘
           │
           ▼
┌────────────────────────┐
│ Routing & Assignment   │
└──────────┬─────────────┘
           │
           ▼
┌────────────────────────┐
│ Hindi Communication    │
└──────────┬─────────────┘
           │
           ▼
┌────────────────────────┐
│ Follow-up Agent        │
│ + Escalation Logic     │
└────────────────────────┘
```

---

# Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React + Vite | Fast UI development |
| Styling | Tailwind CSS | Clean responsive design |
| Backend | FastAPI | High-performance Python APIs |
| AI Engine | OpenAI GPT-4o-mini | Classification + Hindi generation |
| State Management | React Hooks | Lightweight frontend state |
| Storage | JSON Mock Database | Rapid hackathon prototyping |
| Background Tasks | FastAPI BackgroundTasks | Autonomous follow-up simulation |
| Deployment | Vercel + Render | Free deployment |
| Icons | Lucide React | Modern UI icons |

---

# Frontend Modules

## Citizen Portal
- Complaint submission form
- Hindi/English support
- Agent execution animation
- AI-generated acknowledgement

---

## Officer Dashboard
- Live grievance table
- Priority indicators
- SLA countdown
- Department overload alerts
- Resolve grievance action

---

## Department Directory
- UP department contacts
- Website links
- Helpline information

---

# Example Workflow

## Citizen Complaint
```text
3 din se hamare area me paani nahi aa raha aur ghar me elderly patient hai
```

## AI Output
```json
{
  "department": "Water Supply",
  "priority": 5,
  "urgency_label": "Critical",
  "predicted_sla_hours": 6
}
```

## Citizen Acknowledgement
```text
आपकी शिकायत सफलतापूर्वक दर्ज कर ली गई है।
जल आपूर्ति विभाग को शिकायत भेज दी गई है।
अनुमानित समाधान समय: 6 घंटे।
```

---

# Project Structure

```text
backend/
frontend/
docs/
demo/
scripts/
```

Detailed modular architecture:
- Multi-agent backend
- Officer dashboard
- AI classification engine
- Hindi communication engine
- Autonomous follow-up simulation

---

# Setup Instructions

## 1. Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/jansathi-ai.git
cd jansathi-ai
```

---

## 2. Backend Setup

```bash
cd backend

python -m venv venv

# Windows
venv\Scripts\activate

# Linux/macOS
source venv/bin/activate

pip install -r requirements.txt
```

---

## 3. Configure Environment Variables

Create `.env`

```env
OPENAI_API_KEY=your_openai_key
```

---

## 4. Run Backend

```bash
uvicorn app:app --reload
```

Backend runs on:
```text
http://localhost:8000
```

---

## 5. Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on:
```text
http://localhost:5173
```

---

# Demo

## Demo Video
```text
[ Demo Link Here ]
```

---

# AI Tools Used

As permitted by APL rules, the following AI tools were used during development:

- ChatGPT
- OpenAI GPT-4o-mini API
- GitHub Copilot (optional)
- Cursor IDE (optional)

AI tools were used for:
- architecture planning,
- prompt engineering,
- code generation assistance,
- debugging assistance,
- UI ideation.

The project logic, architecture, orchestration, and implementation decisions were independently designed and integrated.

---

# Known Limitations

- Uses mock department datasets
- SLA prediction is heuristic-based, not trained on historical government data
- Authentication and citizen verification are simplified
- Follow-up workflow is simulated for demo purposes
- Does not yet integrate with real Jansunwai APIs

---

# Production Roadmap

Future production-grade improvements:

## 🔐 PII Protection
Secure handling of citizen data with encryption and masking.

---

## 📜 Audit Trails
Immutable grievance history and officer action logs.

---

## 📈 Multi-District Scalability
Support for multiple districts and state-wide deployment.

---

## 💰 API Cost Controls
Caching, rate limiting, and fallback routing to reduce LLM costs.

---

## 👨‍💼 Human-in-the-Loop Governance
Fallback to manual officer review when AI confidence is low.

---

# Team

## Team Name
JanSaathi AI

## Members
- Himanshu Yadav — Full Stack + AI + System Design

GitHub:
```text
https://github.com/YaduvanshiHimanshunfsu
```

---

# Why This Matters

JanSaathi AI is designed not just as an AI demo, but as a citizen-centric governance assistance platform focused on:
- accessibility,
- transparency,
- prioritisation,
- and operational efficiency.

The goal is to make grievance resolution:
- faster,
- more transparent,
- and more humane.

---

# Built at APL Qualifiers — GDG Lucknow 🚀