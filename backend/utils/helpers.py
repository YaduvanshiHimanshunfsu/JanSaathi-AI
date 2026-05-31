import json
import os
import random
from datetime import datetime

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")

def get_file_path(filename):
    return os.path.join(DATA_DIR, filename)

def load_json(filename):
    path = get_file_path(filename)
    if not os.path.exists(path):
        return []
    with open(path, "r", encoding="utf-8") as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return []

def save_json(filename, data):
    path = get_file_path(filename)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def load_departments():
    return load_json("mock_departments.json")

def save_departments(departments):
    save_json("mock_departments.json", departments)

def load_grievances():
    return load_json("mock_grievances.json")

def save_grievances(grievances):
    save_json("mock_grievances.json", grievances)

def load_sample_complaints():
    return load_json("sample_complaints.json")

def generate_ticket_id():
    year = datetime.now().year
    rand_num = random.randint(1000, 9999)
    return f"GRV-{year}-{rand_num}"
