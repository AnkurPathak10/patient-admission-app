import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Options ────────────────────────────────────────────────────────────
export const getOptions = () => api.get("/options");

// ── Patients CRUD ──────────────────────────────────────────────────────
export const getPatients = (params) => api.get("/patients", { params });

export const getPatient = (id) => api.get(`/patients/${id}`);

export const createPatient = (data) => api.post("/patients", data);

export const updatePatient = (id, data) => api.put(`/patients/${id}`, data);

export const deletePatient = (id) => api.delete(`/patients/${id}`);

export const dischargePatient = (id) =>
  api.patch(`/patients/${id}/discharge`);

export default api;

