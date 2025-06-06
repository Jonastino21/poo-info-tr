// src/api/creneauService-azir.js
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export async function fetchAllCreneaux() {
  const response = await axios.get(`${API_BASE}/creneaux`);
  return response.data; // on attend un tableau de créneaux { id, titre, description, groupe, ressource: { id, libelle, type }, dateDebut, dateFin }
}

export async function fetchCreneauById(id) {
  const response = await axios.get(`${API_BASE}/creneaux/${id}`);
  return response.data;
}

export async function createCreneau(payload) {
  const response = await axios.post(`${API_BASE}/creneaux`, payload);
  return response.data;
}

export async function updateCreneau(id, payload) {
  const response = await axios.put(`${API_BASE}/creneaux/${id}`, payload);
  return response.data;
}

export async function deleteCreneau(id) {
  await axios.delete(`${API_BASE}/creneaux/${id}`);
}
