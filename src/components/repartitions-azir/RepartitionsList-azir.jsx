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
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

import { useEvents } from '../../contexts/EventsContext';

const locales = { fr: fr };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

/**
 * messages : traductions des libellés internes de react-big-calendar
 */
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

/**
 * CustomToolbar : barre d’outils en français
 */
function CustomToolbar({ label, onNavigate, onView, view }) {
  return (
    <div className="flex items-center justify-between mb-4">
      {/* Bloc navigation : Aujourd'hui, Précédent, Suivant */}
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

      {/* Étiquette de la période (ex. “juin 02 – 08”) */}
      <span className="font-semibold text-gray-800">{label}</span>

      {/* Bloc vues : Semaine, Jour, Agenda */}
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
  // 1️⃣ Récupération du contexte (événements + ressources + fonctions)
  const { events, ressources, deleteEvent } = useEvents();

  // 2️⃣ Filtre par ressource
  const [filtreRessourceId, setFiltreRessourceId] = useState('Tous');

  // 3️⃣ États pour gérer la date et la vue contrôlées du calendrier
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState('week');

  // 4️⃣ Filtrage des événements selon la ressource sélectionnée
  const eventsAffiches =
    filtreRessourceId === 'Tous'
      ? events
      : events.filter(
          (evt) => String(evt.ressourceId) === String(filtreRessourceId)
        );

  // 5️⃣ Fonction de suppression simulée
  const handleDelete = (id) => {
    if (!window.confirm('Supprimer ce créneau ?')) return;
    deleteEvent(id);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      {/* ─── Barre de filtres par ressource ─────────────────────────────── */}
      <div className="flex items-center mb-4 space-x-2">
        <label
          htmlFor="filtreRessource"
          className="text-sm font-medium text-gray-700"
        >
          Filtrer par ressource :
        </label>
        <select
          id="filtreRessource"
          value={filtreRessourceId}
          onChange={(e) => setFiltreRessourceId(e.target.value)}
          className="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        >
          {ressources.map((r) => (
            <option key={r.id} value={r.id}>
              {r.libelle}
            </option>
          ))}
        </select>
      </div>

      {/* ─── Calendrier React Big Calendar ──────────────────────────────── */}
      <Calendar
        localizer={localizer}
        events={eventsAffiches}
        startAccessor="start"
        endAccessor="end"
        culture="fr"

        /* Date et vue sous contrôle du parent */
        date={currentDate}
        view={currentView}
        onNavigate={(date) => setCurrentDate(date)}
        onView={(view) => setCurrentView(view)}

        /* Activation de la toolbar personnalisée */
        toolbar={true}
        components={{
          toolbar: CustomToolbar,
          event: ({ event }) => (
            <div className="flex items-center justify-between px-1 py-0.5">
              <div>
                <span className="font-medium">{event.title}</span>
                <div className="text-xs text-gray-500">
                  {event.ressourceLabel} – {event.groupe}
                </div>
              </div>
              <div className="flex space-x-1">
                <Link
                  to={`/dashboard/repartitions/${event.id}/modifier`}
                  className="text-yellow-500 hover:text-yellow-700"
                >
                  <PencilIcon className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          ),
        }}

        /* Vues disponibles en français */
        views={['week', 'day', 'agenda']}
        defaultView="week"

        /* Traduction des libellés internes */
        messages={messages}

        /* Style de hauteur (pour occuper l’espace dans notre carte) */
        style={{ height: 600 }}
      />
    </div>
  );
}
