import api from "./api";

export async function submitGrievance(payload) {

  const response = await api.post(
    "/grievances/submit",
    payload
  );

  return response.data;
}

export async function fetchGrievances() {

  const response = await api.get(
    "/dashboard/grievances"
  );

  return response.data;
}

export async function fetchDepartments() {

  const response = await api.get(
    "/departments"
  );

  return response.data;
}

export async function fetchAnalytics() {

  const response = await api.get(
    "/analytics/summary"
  );

  return response.data;
}