// src/components/repartitions-azir/RepartitionForm-azir.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';

// On récupère les hooks du contexte pour lire/mettre à jour le state global
import { useEvents } from '../../contexts/EventsContext';

export default function RepartitionFormAzir() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  // On récupère du contexte : 
  // - events pour préremplir en mode édition 
  // - ressources pour la liste déroulante 
  // - addEvent / updateEvent pour sauvegarder
  const { events, ressources, addEvent, updateEvent } = useEvents();

  // react-hook-form pour gérer le formulaire
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const [loadError, setLoadError] = useState(null);

  // Si on est en édition, on préremplit le formulaire à partir de l’événement dans context
  useEffect(() => {
    if (!isEdit) return;

    const evt = events.find((e) => String(e.id) === String(id));
    if (!evt) {
      setLoadError('Créneau introuvable.');
      return;
    }
    reset({
      titre: evt.title,
      description: evt.description || '',
      groupe: evt.groupe || '',
      ressourceId: evt.ressourceId,
      dateDebut: evt.start.toISOString().slice(0, 16), // “YYYY-MM-DDThh:mm”
      dateFin: evt.end.toISOString().slice(0, 16),
    });
  }, [id, isEdit, events, reset]);

  const onSubmit = async (formValues) => {
    // Construction de l’objet à passer au contexte
    const payload = {
      title: formValues.titre,
      description: formValues.description,
      groupe: formValues.groupe,
      ressourceId: Number(formValues.ressourceId),
      ressourceLabel:
        ressources.find((r) => String(r.id) === String(formValues.ressourceId))?.libelle ||
        '',
      start: new Date(formValues.dateDebut),
      end: new Date(formValues.dateFin),
    };

    try {
      if (isEdit) {
        updateEvent(Number(id), payload);
      } else {
        addEvent(payload);
      }
      navigate('/dashboard/repartitions');
    } catch (error) {
      console.error('Erreur lors de la soumission :', error);
      alert('Une erreur est survenue.');
    }
  };

  if (loadError) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded">
        {loadError}
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">
        {isEdit ? 'Modifier un créneau' : 'Créer un nouveau créneau'}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Titre */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Titre du créneau <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('titre', { required: 'Ce champ est obligatoire.' })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.titre && (
            <p className="text-red-500 text-sm mt-1">{errors.titre.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            {...register('description')}
            rows={3}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Groupe */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Groupe / Responsable <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Nom du groupe ou du responsable"
            {...register('groupe', { required: 'Renseignez le groupe.' })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.groupe && (
            <p className="text-red-500 text-sm mt-1">{errors.groupe.message}</p>
          )}
        </div>

        {/* Ressource */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Ressource <span className="text-red-500">*</span>
          </label>
          <select
            {...register('ressourceId', { required: 'Sélectionnez une ressource.' })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">-- Choisir la ressource --</option>
            {ressources
              .filter((r) => r.id !== 'Tous') // on n’affiche pas “Toutes les ressources” dans le formulaire
              .map((r) => (
                <option key={r.id} value={r.id}>
                  {r.libelle} ({r.type || '—'})
                </option>
              ))}
          </select>
          {errors.ressourceId && (
            <p className="text-red-500 text-sm mt-1">{errors.ressourceId.message}</p>
          )}
        </div>

        {/* Date et heure de début */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Début <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            {...register('dateDebut', {
              required: 'La date et l’heure de début sont requises.',
            })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.dateDebut && (
            <p className="text-red-500 text-sm mt-1">{errors.dateDebut.message}</p>
          )}
        </div>

        {/* Date et heure de fin */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fin <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            {...register('dateFin', {
              required: 'La date et l’heure de fin sont requises.',
            })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.dateFin && (
            <p className="text-red-500 text-sm mt-1">{errors.dateFin.message}</p>
          )}
        </div>

        {/* Boutons */}
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => navigate('/dashboard/repartitions')}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
          >
            {isEdit ? 'Mettre à jour' : 'Créer'}
          </button>
        </div>
      </form>
    </div>
  );
}
