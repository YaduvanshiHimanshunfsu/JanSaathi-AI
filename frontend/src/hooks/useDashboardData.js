import { useEffect, useState } from "react";
import api from "../services/api";

// High-fidelity preloaded mock dataset for robust offline mode
const DEFAULT_OFFLINE_GRIEVANCES = [
  {
    "grievance_id": "JSA-1001",
    "citizen_name": "Ramesh Yadav",
    "department": "Water Supply",
    "department_hi": "जल आपूर्ति विभाग",
    "assigned_officer": "Amit Verma",
    "priority": 5,
    "urgency_label": "Critical",
    "predicted_sla_hours": 6,
    "overload_flag": false,
    "citizen_message": "आपकी शिकायत सफलतापूर्वक दर्ज कर ली गई है।",
    "status": "Assigned"
  },
  {
    "grievance_id": "JSA-1002",
    "citizen_name": "Priya Singh",
    "department": "Sanitation",
    "department_hi": "स्वच्छता विभाग",
    "assigned_officer": "Pooja Mishra",
    "priority": 4,
    "urgency_label": "Distressed",
    "predicted_sla_hours": 12,
    "overload_flag": true,
    "citizen_message": "आपकी शिकायत संबंधित विभाग को भेज दी गई है।",
    "status": "In Progress"
  },
  {
    "grievance_id": "JSA-1003",
    "citizen_name": "Ankit Sharma",
    "department": "Road Repair",
    "department_hi": "सड़क मरम्मत विभाग",
    "assigned_officer": "Neeraj Tiwari",
    "priority": 3,
    "urgency_label": "Concerned",
    "predicted_sla_hours": 24,
    "overload_flag": false,
    "citizen_message": "सड़क मरम्मत विभाग को शिकायत भेज दी गई है।",
    "status": "Resolved"
  },
  {
    "grievance_id": "JSA-1004",
    "citizen_name": "Sana Khan",
    "department": "Electricity",
    "department_hi": "विद्युत विभाग",
    "assigned_officer": "Rakesh Singh",
    "priority": 5,
    "urgency_label": "Critical",
    "predicted_sla_hours": 4,
    "overload_flag": true,
    "citizen_message": "बिजली विभाग को शिकायत भेज दी गई है।",
    "status": "Escalated"
  },
  {
    "grievance_id": "JSA-1005",
    "citizen_name": "Rahul Mishra",
    "department": "Public Safety",
    "department_hi": "जन सुरक्षा विभाग",
    "assigned_officer": "Inspector Rajeev Sharma",
    "priority": 4,
    "urgency_label": "Distressed",
    "predicted_sla_hours": 3,
    "overload_flag": false,
    "citizen_message": "जन सुरक्षा विभाग को शिकायत भेज दी गई है।",
    "status": "Assigned"
  },
  {
    "grievance_id": "LKO-2001",
    "citizen_name": "Himanshu Yadav",
    "department": "Sanitation",
    "department_hi": "स्वच्छता विभाग",
    "assigned_officer": "Dr. K.P. Tripathi",
    "priority": 5,
    "urgency_label": "Critical",
    "predicted_sla_hours": 8,
    "overload_flag": false,
    "citizen_message": "स्वच्छता विभाग में शिकायत दर्ज की गई है।",
    "status": "In Progress"
  }
];

export default function useDashboardData() {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOffline, setIsOffline] = useState(
    localStorage.getItem("offline_mode") === "true"
  );

  async function fetchDashboard() {
    try {
      setLoading(true);
      setError(null);

      // If user explicitly locked the UI to offline sandbox mode
      if (isOffline) {
        loadOfflineData();
        return;
      }

      const response = await api.get("/dashboard/grievances");
      setGrievances(response.data.data);
      localStorage.setItem("offline_mode", "false");
      setIsOffline(false);
    } catch (err) {
      console.error("Dashboard connection error, checking fallback:", err);
      // If server fails and we don't have offline state set, trigger the error banner
      // so the user can interactively select to launch offline sandbox
      setError("Failed to load dashboard live data. The backend server might be offline.");
    } finally {
      setLoading(false);
    }
  }

  function loadOfflineData() {
    setError(null);
    setIsOffline(true);
    localStorage.setItem("offline_mode", "true");
    
    const localSaved = localStorage.getItem("local_grievances");
    if (localSaved) {
      setGrievances(JSON.parse(localSaved));
    } else {
      localStorage.setItem("local_grievances", JSON.stringify(DEFAULT_OFFLINE_GRIEVANCES));
      setGrievances(DEFAULT_OFFLINE_GRIEVANCES);
    }
    setLoading(false);
  }

  function resolveGrievanceOffline(id) {
    const updated = grievances.map(g => {
      if (g.grievance_id === id) {
        return { ...g, status: "Resolved" };
      }
      return g;
    });
    setGrievances(updated);
    localStorage.setItem("local_grievances", JSON.stringify(updated));
  }

  function resetLiveMode() {
    localStorage.setItem("offline_mode", "false");
    setIsOffline(false);
    fetchDashboard();
  }

  useEffect(() => {
    fetchDashboard();
  }, [isOffline]);

  return {
    grievances,
    loading,
    error,
    isOffline,
    refresh: fetchDashboard,
    loadOfflineData,
    resolveGrievanceOffline,
    resetLiveMode
  };
}