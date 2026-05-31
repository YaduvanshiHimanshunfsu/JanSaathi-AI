# सुनवाई SunwAI 🇮🇳
### Autonomous Multi-Agent Grievance Resolution System for UP Jansunwai
**Developed by Himanshu Yadav | GDG Lucknow APL Hackathon**

[![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green.svg?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Vanilla JS](https://img.shields.io/badge/Vanilla_JS-Frontend-f7df1e.svg?style=for-the-badge&logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Gemini](https://img.shields.io/badge/Google-Gemini_2.5_Flash-orange.svg?style=for-the-badge&logo=googlegemini)](https://ai.google.dev/)
[![Security](https://img.shields.io/badge/Security-OTP_%7C_JWT_%7C_Prompt_Guard-blue.svg?style=for-the-badge)](#)

> **सुनवाई SunwAI** is a premium, resilient, autonomous multi-agent grievance orchestration and resolution ecosystem specifically optimized for Uttar Pradesh's metropolitan municipalities. Built to solve delayed routing, officer fatigue, and language accessibility, SunwAI auto-classifies vernacular complaints (English, Hindi, Hinglish), routes them to the least-loaded officer with predictive SLAs, and autonomously follows up while keeping citizens updated through real-time native SMS messages.

---

## 📅 May 31, 2026 - Major Security & Agentic V2 Overhaul

Today, the entire system architecture was rewritten and heavily upgraded for production-grade security, LLM stability, and advanced agentic analysis. 

### 🌟 What's New?
1. **Gemini 2.5 Flash Upgrade**: Entire backend pipeline migrated from the deprecated `gemini-1.5-flash` model directly to `gemini-2.5-flash`, significantly boosting reasoning speed, Hinglish parsing accuracy, and eliminating silent API 404 drops.
2. **Citizen Credibility Index (Section 8)**: Implemented a robust 0-100 credibility scoring algorithm. The AI analyzes if OTP is verified, word count density, geospatial tagging, distress scoring, and duplication flags to assign a priority status (Low, Medium, High, Verified) to prevent malicious or manufactured urgency attacks.
3. **OTP & JWT Secure Tunneling (Section 4 & 5)**: 
   - Introduced simulated mobile OTP generation and verification barriers on the frontend before allowing grievance submissions.
   - Replaced flat JSON authentication with JWT tokenized sessions.
   - All API keys safely stripped from the frontend and secured purely in `main_secure.py`.
4. **Prompt Injection & Spam Defense**: Introduced `PromptSecurityAgent` as "Agent 0" to block adversarial LLM injections, and upgraded `IntakeAgentV2` with aggressive duplication detection (MD5 hashing) and heuristic spam blockers.
5. **Dynamic Incident Clustering**: The new `IncidentClusterAgent` identifies localized micro-outbreaks (e.g., three people reporting a water leak on the same street) and links them to a single parent ticket.
6. **Frontend Address Geocoding**: Enhanced the public form to capture and inject exact string addresses invisibly into the AI's contextual context layer.

---

## 🏗️ The V2 Multi-Agent Orchestration Pipeline
```text
      Citizen Grievance Submission (English / Hindi / Hinglish) + OTP Verification
                                   │
                                   ▼
                      ┌───────────────────────────┐
                      │ 0. Prompt Security Agent  │ Blocks malicious injections & threats
                      └────────────┬──────────────┘
                                   │
                                   ▼
                      ┌───────────────────────────┐
                      │ 1. Intake Agent V2        │ Cleans Hindi dialects, strips spam & dupes
                      └────────────┬──────────────┘
                                   │
                                   ▼
                      ┌───────────────────────────┐
                      │ 2. Classification Agent V2│ LLM extracts categories, tags geo-loc
                      └────────────┬──────────────┘
                                   │
                                   ▼
                      ┌───────────────────────────┐
                      │ 3. Sentiment Agent        │ Evaluates distress levels & tone
                      └────────────┬──────────────┘
                                   │
                                   ▼
                      ┌───────────────────────────┐
                      │ 4. Routing Agent          │ Assigns least-loaded in-charge officer
                      └────────────┬──────────────┘
                                   │
                                   ▼
                      ┌───────────────────────────┐
                      │ 5. Incident Cluster Agent │ Groups similar nearby complaints together
                      └────────────┬──────────────┘
                                   │
                                   ▼
                      ┌───────────────────────────┐
                      │ 6. Communication Agent    │ Compiles warm native Hindi SMS alerts
                      └───────────────────────────┘
```

---

## 🚀 How to Run locally

### 🔌 Step 1: Open VS Code Terminal
Ensure your current directory is the root directory of the project: `E:\GDG LUCKNOW\Jansathi-AI`.

### 🐍 Step 2: Spin up the Secure FastAPI Backend
Open a **terminal** and execute:
```powershell
cd backend
# Make sure to activate your virtual environment if not active:
# ..\venv\Scripts\Activate.ps1

# Install requirements (including newly added PyJWT)
pip install -r requirements_v2.txt

# Boot the new secure server
python -m uvicorn main_secure:app --reload --port 8000
```
*The backend server will successfully start listening on `http://localhost:8000`.*

### 🎨 Step 3: Spin up the Frontend UI
Open a **second terminal tab** and execute:
```powershell
cd frontend
python -m http.server 5500
```
*The Web App will run instantly on `http://localhost:5500/`.*

---

## 🔐 Officer Portal Credentials

To access the administrative **Officer Control Dashboard**, a secure glassmorphic gate has been implemented:
* **Government Portal Page**: Click **Officer Panel** in the navigation bar.
* **Credentials Check**: 
  * **Test Login**: Under the new JWT system, the hardcoded admin is `admin` / `admin123`.

---

## 👥 Team & Hackathon Attributions
* **Team Name**: ATHU
* **Developer**: Solo; Himanshu Yadav
* **Hackathon**: GDG Lucknow APL Hackathon 🚀
* **Corpus Repository**: [JanSaathi-AI](https://github.com/YaduvanshiHimanshunfsu/JanSaathi-AI)