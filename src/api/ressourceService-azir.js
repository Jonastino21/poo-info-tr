// src/api/ressourceService-azir.js
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export async function fetchAllRessources() {
  const response = await axios.get(`${API_BASE}/ressources`);
  return response.data; 
  // on attend un tableau de ressources { id, libelle, type, capacité, etc. }
}
