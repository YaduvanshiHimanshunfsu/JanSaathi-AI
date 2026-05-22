# JanSaathi AI — API Flow Documentation

# Base URL

```text
http://localhost:8000
```

---

# API Overview

The backend exposes REST APIs for:
- complaint submission,
- dashboard retrieval,
- analytics,
- department lookup,
- grievance updates.

---

# 1. Submit Grievance

## Endpoint

```http
POST /api/grievances/submit
```

---

## Request Body

```json
{
  "citizen_name": "Ramesh Yadav",
  "mobile_number": "9876543210",
  "district": "Lucknow",
  "pincode": "226001",
  "selected_department": "Other",
  "problem_title": "Water issue",
  "description": "3 din se paani nahi aa raha",
  "language": "Hindi"
}
```

---

## Processing Flow

```text
1. Intake Agent
2. Keyword Routing Agent
3. AI Classification Agent
4. Routing Agent
5. Communication Agent
6. Save Grievance
```

---

## Response

```json
{
  "grievance_id": "JSA-1024",
  "department": "Water Supply",
  "priority": 5,
  "urgency_label": "Critical",
  "assigned_officer": "Amit Verma",
  "predicted_sla_hours": 6,
  "citizen_message": "आपकी शिकायत दर्ज कर ली गई है।"
}
```

---

# 2. Get All Grievances

## Endpoint

```http
GET /api/dashboard/grievances
```

---

## Response

```json
[
  {
    "grievance_id": "JSA-1024",
    "department": "Water Supply",
    "priority": 5,
    "status": "Assigned"
  }
]
```

---

# 3. Mark Grievance Resolved

## Endpoint

```http
PATCH /api/dashboard/resolve/{grievance_id}
```

---

## Response

```json
{
  "message": "Grievance marked as resolved"
}
```

---

# 4. Department Directory

## Endpoint

```http
GET /api/departments
```

---

## Response

```json
[
  {
    "name": "Water Supply",
    "website": "https://jalnigam.up.gov.in",
    "helpline": "1916"
  }
]
```

---

# 5. Analytics API

## Endpoint

```http
GET /api/analytics/summary
```

---

## Response

```json
{
  "total_grievances": 120,
  "resolved_today": 42,
  "overloaded_departments": 2
}
```

---

# Error Response Format

```json
{
  "success": false,
  "error": "Invalid grievance payload"
}
```

---

# Status Definitions

| Status | Meaning |
|---|---|
| New | Complaint received |
| Assigned | Officer assigned |
| In Progress | Work ongoing |
| Escalated | SLA breached |
| Resolved | Complaint completed |

---

# Priority Levels

| Priority | Meaning |
|---|---|
| 1 | Low |
| 2 | Moderate |
| 3 | Important |
| 4 | High |
| 5 | Critical |

---

# Security Notes

Current hackathon prototype:
- uses mock data,
- simplified validation,
- no authentication.

Production deployment would require:
- RBAC,
- audit logs,
- encryption,
- API rate limiting.