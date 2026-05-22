# सुनवाई SunwAI 🇮🇳
### Autonomous Multi-Agent Grievance Resolution System for UP Jansunwai
**Developed by Himanshu Yadav | GDG Lucknow APL Hackathon**

[![React](https://img.shields.io/badge/React-Frontend-61dafb.svg?style=for-the-badge&logo=react)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green.svg?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Styling-38bdf8.svg?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Gemini](https://img.shields.io/badge/Google-Gemini_API-orange.svg?style=for-the-badge&logo=googlegemini)](https://ai.google.dev/)

> **सुनवाई SunwAI** is a premium, resilient, autonomous multi-agent grievance orchestration and resolution ecosystem specifically optimized for Uttar Pradesh's metropolitan municipalities. Built to solve delayed routing, officer fatigue, and language accessibility, SunwAI auto-classifies vernacular complaints (English, Hindi, Hinglish), routes them to the least-loaded officer with predictive SLAs, and autonomously follows up while keeping citizens updated through real-time native SMS messages.

---

## 👥 Team & Hackathon Attributions
* **Team Name**: ATHU
* **Developer**: Solo; Himanshu Yadav
* **Hackathon**: GDG Lucknow APL Hackathon 🚀
* **Corpus Repository**: [JanSaathi-AI](https://github.com/YaduvanshiHimanshunfsu/JanSaathi-AI)

---

## 🎯 The Problem & Our Solution (PS-07)
* **Problem**: The Uttar Pradesh Jansunwai portal registers millions of public complaints. However, processing is slow due to dry manual triage, high language barriers (many complaints are in Hindi/Hinglish), poor prioritization of emergencies, and a complete lack of operational transparency.
* **Solution**: **सुनवाई SunwAI** resolves this by replacing dry interfaces with a high-fidelity, autonomous multi-agent administrative workspace. It offers:
  1. **Multilingual Vernacular Intake**: Accepting text in pure Hindi, pure English, or mixed conversational Hinglish (e.g. *"sewers block hai aur smell aa rahi"*).
  2. **Real-time Pipeline Simulators**: Demonstrating the exact visual workflow of the agents directly on the landing page.
  3. **Silent Self-Healing Core**: The frontend is equipped with intelligent mock fallbacks. If the FastAPI uvicorn server is unreachable, the Analytics, Directory, and Dashboard views automatically calculations metrics via `localStorage` with **zero visible crash banners**.
  4. **Caseload Load Balancing**: Dynamically assigns cases based on officer active quotas to prevent overload thresholds.

---

## 🏗️ Multi-Agent Orchestration Pipeline
```text
      Citizen Grievance Submission (English / Hindi / Hinglish)
                                  │
                                  ▼
                     ┌───────────────────────────┐
                     │ 1. Intake Agent           │ Normalizes fields & detects language
                     └────────────┬──────────────┘
                                  │
                                  ▼
                     ┌───────────────────────────┐
                     │ 2. Keyword Router Agent   │ Resolves fast local match categories
                     └────────────┬──────────────┘
                                  │
                                  ▼
                     ┌───────────────────────────┐
                     │ 3. AI Classify Agent      │ LLM refines urgency & prioritizes (1-5)
                     └────────────┬──────────────┘
                                  │
                                  ▼
                     ┌───────────────────────────┐
                     │ 4. Routing Agent          │ Assigns least-loaded in-charge officer
                     └────────────┬──────────────┘
                                  │
                                  ▼
                     ┌───────────────────────────┐
                     │ 5. Communication Agent    │ Compiles warm native Hindi SMS alerts
                     └────────────┬──────────────┘
                                  │
                                  ▼
                     ┌───────────────────────────┐
                     │ 6. Follow-up/Escalate Agent│ background simulation timers for SLAs
                     └───────────────────────────┘
```

---

## 🚀 How to Run in the VS Code Terminal

Follow these step-by-step commands inside your VS Code terminals to boot up both the frontend and backend servers.

### 🔌 Step 1: Open VS Code Terminal
Ensure your current directory is the root directory of the project: `C:\Users\mrhim\Downloads\Jansathi-AI`.

### 🐍 Step 2: Spin up the FastAPI Backend

Open a **new terminal tab** in VS Code and execute:
```powershell
# 1. Navigate to the backend directory
cd backend

# 2. Initialize the Python Virtual Environment
python -m venv venv

# 3. Activate the environment
venv\Scripts\activate

# 4. Install required packages
pip install -r requirements.txt

# 5. Run the FastAPI development server
uvicorn app:app --reload
```
*The backend server will successfully start listening on `http://localhost:8000`.*

---

### 🎨 Step 3: Spin up the Vite React Frontend

Open a **second terminal tab** (click the `+` button in VS Code terminal panel) and execute:
```powershell
# 1. Navigate to the frontend directory
cd frontend

# 2. Install Node.js package dependencies
npm install

# 3. Boot up the Vite web application
npm run dev
```
*The Vite compilation will take ~400ms and run on `http://localhost:5173/`.*

---

## 🔐 Officer Portal Credentials

To access the administrative **Officer Control Dashboard**, a secure glassmorphic gate has been implemented:
* **Government Portal Page**: `/dashboard` (click **Officer Dashboard** in the navigation bar).
* **Credentials Check**: 
  * **Test Login**: Enter any email and password to instantly pass testing!
  * **Default Credentials**: `admin@sunwai.gov.in` and password `admin123`.

---

## 🌟 Key Upgraded Highlights

1. **Stunning UP Cabinet Grid Showcase**:
   - Gorgeous cards detailing CM Yogi Adityanath, the Deputy CMs, and Chief Secretary Shri Manoj Kumar Singh, IAS, in dynamically synchronizing bilingual text.
2. **Interactive Clickable Officer Caseloads**:
   - Clicking an officer's name in the table opens an overlay detailing their government email, official helpline, active workload limits (e.g. 14/50 cases), average response SLA, and official directives.
3. **15 Pre-populated Lucknow citizen Complaints**:
   - The Lucknow Demo features exactly 15 detailed cases (extending across Jankipuram, Charbagh, Aliganj, Gomti Nagar, Aminabad, Hazratganj, Chowk, Indiranagar, Vrindavan Yojna, Alambagh, Nishatganj, Mahanagar, Vikas Nagar) showing multi-agent routing step-by-step.
4. **Resilient Self-Healing Analytics**:
   - Zero visible crash frames. Instantly calculates KPIs like total received complaints, pending active cases, and workload gauges directly from frontend caches if FastAPI is offline.