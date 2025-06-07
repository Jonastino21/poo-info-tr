// src/components/repartitions-azir/RepartitionsList-azir.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import { fr } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useEvents } from '../../contexts/EventsContext';

const locales = { fr: fr };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const messages = {
  allDay: 'Toute la journée',
  date: 'Date',
  time: 'Heure',
  event: 'Événement',
  showMore: (total) => `+ ${total} supplémentaires`,
  previous: 'Précédent',
  next: 'Suivant',
  today: "Aujourd'hui",
  month: 'Mois',
  week: 'Semaine',
  day: 'Jour',
  agenda: 'Agenda',
};

function CustomToolbar({ label, onNavigate, onView, view }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex space-x-2">
        <button
          className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600"
          onClick={() => onNavigate('TODAY')}
        >
          Aujourd'hui
        </button>
        <button
          className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600"
          onClick={() => onNavigate('PREV')}
        >
          Précédent
        </button>
        <button
          className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600"
          onClick={() => onNavigate('NEXT')}
        >
          Suivant
        </button>
      </div>
      <span className="font-semibold text-gray-800">{label}</span>
      <div className="flex space-x-2">
        <button
          className={`px-3 py-1 rounded ${
            view === 'week'
              ? 'bg-indigo-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => onView('week')}
        >
          Semaine
        </button>
        <button
          className={`px-3 py-1 rounded ${
            view === 'day'
              ? 'bg-indigo-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => onView('day')}
        >
          Jour
        </button>
        <button
          className={`px-3 py-1 rounded ${
            view === 'agenda'
              ? 'bg-indigo-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => onView('agenda')}
        >
          Agenda
        </button>
      </div>
    </div>
  );
}

export default function RepartitionsListAzir() {
  const { events, ressources, deleteEvent } = useEvents();
  const [filtreRessourceId, setFiltreRessourceId] = useState('Tous');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState('week');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const eventsAffiches =
    filtreRessourceId === 'Tous'
      ? events
      : events.filter(
          (evt) => String(evt.ressourceId) === String(filtreRessourceId)
        );

  const handleDelete = (id) => {
    if (!window.confirm('Supprimer ce créneau ?')) return;
    deleteEvent(id);
    setIsModalOpen(false);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      {/* Filtre par ressource */}
      <div className="flex items-center mb-4 space-x-2">
        <label htmlFor="filtreRessource" className="text-sm font-medium text-gray-700">
          Filtrer par ressource :
        </label>
        <select
          id="filtreRessource"
          value={filtreRessourceId}
          onChange={(e) => setFiltreRessourceId(e.target.value)}
          className="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="Tous">Toutes les ressources</option>
          {ressources.map((r) => (
            <option key={r.id} value={r.id}>
              {r.libelle}
            </option>
          ))}
        </select>
      </div>

      {/* Calendrier */}
      <Calendar
        localizer={localizer}
        events={eventsAffiches}
        startAccessor="start"
        endAccessor="end"
        culture="fr"
        date={currentDate}
        view={currentView}
        onNavigate={setCurrentDate}
        onView={setCurrentView}
        onSelectEvent={handleEventClick}
        toolbar={true}
        components={{
          toolbar: CustomToolbar,
          event: ({ event }) => (
            <div className="px-1 py-0.5">
              <div className="font-medium">{event.title}</div>
              <div className="text-xs text-white-500">
                {event.ressourceLabel} – {event.groupe || event.responsable}
              </div>
            </div>
          ),
        }}
        views={['week', 'day', 'agenda']}
        defaultView="week"
        messages={messages}
        style={{ height: 600 }}
      />

      {/* Modal d'affichage de l'événement */}
      {isModalOpen && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">{selectedEvent.title}</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Description</p>
                <p>{selectedEvent.description || 'Aucune description'}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Ressource</p>
                <p>{selectedEvent.ressourceLabel}</p>
              </div>
              
              {selectedEvent.groupe && (
                <div>
                  <p className="text-sm text-gray-500">Groupe</p>
                  <p>{selectedEvent.groupe}</p>
                </div>
              )}
              
              {selectedEvent.responsable && (
                <div>
                  <p className="text-sm text-gray-500">Responsable</p>
                  <p>{selectedEvent.responsable}</p>
                </div>
              )}
              
              <div>
                <p className="text-sm text-gray-500">Début</p>
                <p>{formatDate(selectedEvent.start)}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Fin</p>
                <p>{formatDate(selectedEvent.end)}</p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Link
                to={`/dashboard/repartitions/${selectedEvent.id}/modifier`}
                className="flex items-center px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
              >
                <PencilIcon className="h-4 w-4 mr-2" />
                Modifier
              </Link>
              <button
                onClick={() => handleDelete(selectedEvent.id)}
                className="flex items-center px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}