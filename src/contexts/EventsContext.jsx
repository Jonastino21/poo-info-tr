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

  // Fonction pour convertir les dates du format API en objets Date
  const parseEventDates = (event) => ({
    ...event,
    start: new Date(event.start),
    end: new Date(event.end)
  });

  // Chargement des données initiales depuis l'API
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        
        const [ressourcesRes, groupesRes, responsablesRes, creneauRes] = await Promise.all([
          api.get('/api/resources'),
          api.get('/api/groupes'),
          api.get('/api/auth/all'),
          api.get('/api/creneaux'),
        ]);

        setRessources(ressourcesRes.data);
        setGroupes(groupesRes.data);
        // Conversion des dates pour les événements
        setEvents(creneauRes.data.map(parseEventDates));
        setResponsables(responsablesRes.data.filter(u => u.role === 'RESPONSABLE'));
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error('Erreur lors du chargement des données:', err);
      }
    };

    fetchInitialData();
  }, []);

  // Ajouter un créneau
  const addEvent = async (newEvent) => {
    try {
      const response = await api.post('/api/creneaux', newEvent);
      const eventWithDates = parseEventDates(response.data);
      setEvents(prev => [...prev, eventWithDates]);
      return eventWithDates;
    } catch (err) {
      console.error('Erreur lors de l\'ajout du créneau:', err);
      throw err;
    }
  };

  // Mettre à jour un créneau
  const updateEvent = async (id, updatedEvent) => {
    try {
      const response = await api.put(`/api/creneaux/${id}`, updatedEvent);
      const eventWithDates = parseEventDates(response.data);
      setEvents(prev => prev.map(evt => evt.id === id ? eventWithDates : evt));
      return eventWithDates;
    } catch (err) {
      console.error('Erreur lors de la mise à jour du créneau:', err);
      throw err;
    }
  };

  // Supprimer un créneau
  const deleteEvent = async (id) => {
    try {
      await api.delete(`/api/creneaux/${id}`);
      setEvents(prev => prev.filter(evt => evt.id !== id));
    } catch (err) {
      console.error('Erreur lors de la suppression du créneau:', err);
      throw err;
    }
  };

  // Charger tous les créneaux
  const loadEvents = async () => {
    try {
      const response = await api.get('/api/creneaux');
      setEvents(response.data.map(parseEventDates));
    } catch (err) {
      console.error('Erreur lors du chargement des créneaux:', err);
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
    loadEvents,
  };

  return (
    <EventsContext.Provider value={value}>
      {children}
    </EventsContext.Provider>
  );
}