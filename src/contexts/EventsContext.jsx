// src/contexts/EventsContext.jsx
import React, { createContext, useContext, useState } from 'react';
import { mockEvents, mockRessources } from '../components/repartitions-azir/fakerepartitionsList-azir';

// 1) On crée le contexte
const EventsContext = createContext();

// 2) Hook pour consommer le contexte
export function useEvents() {
  return useContext(EventsContext);
}

// 3) Provider qui englobe l’appli (ou le Dashboard)
export function EventsProvider({ children }) {
  // On part de nos mocks comme valeur initiale
  const [events, setEvents] = useState(mockEvents);
  const [ressources] = useState(mockRessources);

  // Ajouter un créneau : on génère un nouvel id (incremental) et on push
  const addEvent = (newEvent) => {
    // Pour simuler un id unique, on prend max actuel + 1
    const nextId =
      events.length > 0 ? Math.max(...events.map((evt) => evt.id)) + 1 : 1;
    setEvents((prev) => [
      ...prev,
      {
        id: nextId,
        ...newEvent,
      },
    ]);
  };

  // Mettre à jour un créneau existant (on rembourse l’ancienne entrée)
  const updateEvent = (id, updatedEvent) => {
    setEvents((prev) =>
      prev.map((evt) => (evt.id === id ? { id, ...updatedEvent } : evt))
    );
  };

  // Supprimer un créneau
  const deleteEvent = (id) => {
    setEvents((prev) => prev.filter((evt) => evt.id !== id));
  };

  // On expose les valeurs et fonctions dans le contexte
  const value = {
    events,
    ressources,
    addEvent,
    updateEvent,
    deleteEvent,
  };

  return (
    <EventsContext.Provider value={value}>
      {children}
    </EventsContext.Provider>
  );
}
