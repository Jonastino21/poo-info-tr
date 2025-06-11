// src/contexts/EventsContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../../config';

const EventsContext = createContext();

export function useEvents() {
  return useContext(EventsContext);
}

export function EventsProvider({ children }) {
  const [events, setEvents] = useState([]);
  const [ressources, setRessources] = useState([]);
  const [groupes, setGroupes] = useState([]);
  const [responsables, setResponsables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fonction pour convertir et enrichir les événements
  const processEvents = (eventsData) => {
    return eventsData.map(event => ({
      ...event,
      start: new Date(event.start),
      end: new Date(event.end),
      ressourceLabel: event.ressourceLabel || 'Inconnue',
      groupe: event.groupe || null,
      responsable: event.responsable || null
    }));
  };

  // Chargement des données initiales
  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      const [ressourcesRes, groupesRes, responsablesRes, creneauxRes] = await Promise.all([
        api.get('/api/resources'),
        api.get('/api/groupes'),
        api.get('/api/auth/all'),
        api.get('/api/creneaux'),
      ]);

      setRessources(ressourcesRes.data);
      setGroupes(groupesRes.data);
      setResponsables(responsablesRes.data.filter(u => u.role === 'RESPONSABLE'));
      setEvents(processEvents(creneauxRes.data));
      
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      console.error('Erreur lors du chargement des données:', err);
    }
  };

  // Rafraîchissement forcé
  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    fetchAllData();
  }, [refreshTrigger]);

  // Opérations CRUD
  const addEvent = async (newEvent) => {
    try {
      const response = await api.post('/api/creneaux', newEvent);
      refreshData(); // Rafraîchir après ajout
      return response.data;
    } catch (err) {
      console.error('Erreur lors de l\'ajout:', err);
      throw err;
    }
  };

  const updateEvent = async (id, updatedEvent) => {
    try {
      const response = await api.put(`/api/creneaux/${id}`, updatedEvent);
      refreshData(); // Rafraîchir après mise à jour
      return response.data;
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      throw err;
    }
  };

  const deleteEvent = async (id) => {
    try {
      await api.delete(`/api/creneaux/${id}`);
      refreshData(); // Rafraîchir après suppression
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      throw err;
    }
  };

  const value = {
    events,
    ressources,
    groupes,
    responsables,
    loading,
    error,
    addEvent,
    updateEvent,
    deleteEvent,
    refreshData
  };

  return (
    <EventsContext.Provider value={value}>
      {children}
    </EventsContext.Provider>
  );
}