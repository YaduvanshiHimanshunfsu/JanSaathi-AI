"""
Global constants used across JanSaathi AI.
"""

# -------------------------------
# Complaint Statuses
# -------------------------------

STATUS_NEW = "New"
STATUS_ASSIGNED = "Assigned"
STATUS_IN_PROGRESS = "In Progress"
STATUS_ESCALATED = "Escalated"
STATUS_RESOLVED = "Resolved"

# -------------------------------
# Priority Levels
# -------------------------------

PRIORITY_LOW = 1
PRIORITY_MODERATE = 2
PRIORITY_IMPORTANT = 3
PRIORITY_HIGH = 4
PRIORITY_CRITICAL = 5

# -------------------------------
# Supported Languages
# -------------------------------

SUPPORTED_LANGUAGES = [
    "Hindi",
    "English",
    "Hinglish"
]

# -------------------------------
# Allowed Departments
# -------------------------------

ALLOWED_DEPARTMENTS = [
    "Water Supply",
    "Electricity",
    "Road Repair",
    "Sanitation",
    "Encroachment",
    "Health Services",
    "Property Tax",
    "Public Safety"
]

# -------------------------------
# Emotion Labels
# -------------------------------

EMOTION_LABELS = [
    "Calm",
    "Concerned",
    "Distressed",
    "Critical"
]