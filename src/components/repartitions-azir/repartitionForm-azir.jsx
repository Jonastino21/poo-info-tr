// src/components/repartitions-azir/RepartitionForm-azir.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Select from 'react-select';
import { api } from '../../../config';
import { useEvents } from '../../contexts/EventsContext';

export default function RepartitionFormAzir() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  // États pour les données chargées
  const [ressources, setRessources] = useState([]);
  const [groupes, setGroupes] = useState([]);
  const [responsables, setResponsables] = useState([]);
  const [creneau, setCreneau] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {addEvent,updateEvent} = useEvents();

  // react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  // Watch les valeurs pour gérer l'exclusivité groupe/responsable
  const groupeId = watch('groupId');
  const responsableId = watch('responsableId');

  // Chargement initial des données
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        
        // Chargement en parallèle des données statiques
        const [ressourcesRes, groupesRes, responsablesRes] = await Promise.all([
          api.get('/api/resources'),
          api.get('/api/groupes'),
          api.get('/api/auth/all')
        ]);

        setRessources(ressourcesRes.data);
        setGroupes(groupesRes.data);
        setResponsables(responsablesRes.data.filter(u => u.role === 'RESPONSABLE'));

        // Si mode édition, charger aussi le créneau
        if (isEdit) {
          const creneauRes = await api.get(`/api/creneaux/${id}`);
          setCreneau(creneauRes.data);
        }

        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement des données');
        setLoading(false);
        console.error(err);
      }
    };

    fetchInitialData();
  }, [id, isEdit]);

  // Pré-remplissage du formulaire quand les données sont chargées
  useEffect(() => {
    if (!isEdit || !creneau || loading) return;

    // Préparer les valeurs pour les selects
    const ressourceValue = ressources.find(r => r.id === creneau.ressourceId);
    const groupeValue = groupes.find(g => g.id === creneau.groupId);
    const responsableValue = responsables.find(r => r.id === creneau.responsableId);

    reset({
      title: creneau.title,
      description: creneau.description || '',
      groupId: creneau.groupId || null,
      responsableId: creneau.responsableId || null,
      ressourceId: creneau.ressourceId,
      start: creneau.start ? new Date(creneau.start).toISOString().slice(0, 16) : '',
      end: creneau.end ? new Date(creneau.end).toISOString().slice(0, 16) : '',
    });

    // Mettre à jour les valeurs des selects
    if (ressourceValue) {
      setValue('ressourceId', ressourceValue.id);
    }
    if (groupeValue) {
      setValue('groupId', groupeValue.id);
    }
    if (responsableValue) {
      setValue('responsableId', responsableValue.id);
    }
  }, [creneau, isEdit, loading, reset, ressources, groupes, responsables, setValue]);

  const onSubmit = async (formValues) => {
    // Validation : doit avoir soit un groupe soit un responsable
    if (!formValues.groupId && !formValues.responsableId) {
      alert('Vous devez sélectionner soit un groupe soit un responsable');
      return;
    }
    try {
    // Préparation des données
    const payload = {
      title: formValues.title,
      description: formValues.description,
      ressourceId: Number(formValues.ressourceId),
      groupId: formValues.groupId ? Number(formValues.groupId) : null,
      responsableId: formValues.responsableId ? Number(formValues.responsableId) : null,
      start: new Date(formValues.start),
      end: new Date(formValues.end),
    };

    console.log(payload);

    if (isEdit) {
      await updateEvent(id, payload);
    } else {
      await addEvent(payload);
    }
    
    // Navigation après succès
    navigate('/dashboard/repartitions');
  } catch (error) {
    console.error('Erreur:', error);
    alert('Erreur: ' + (error.response?.data?.message || error.message));
  }
  };

  // Préparer les options pour les selects
  const ressourcesOptions = ressources.map(r => ({
    value: r.id,
    label: r.libelle,
  }));

  const groupesOptions = groupes.map(g => ({
    value: g.id,
    label: g.nom,
  }));

  const responsablesOptions = responsables.map(r => ({
    value: r.id,
    label: r.username,
  }));

  if (loading) {
    return <div className="text-center py-8">Chargement en cours...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded">
        {error}
        <button 
          onClick={() => window.location.reload()} 
          className="ml-4 px-3 py-1 bg-red-600 text-white rounded"
        >
          Réessayer
        </button>
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
            {...register('title', { required: 'Ce champ est obligatoire.' })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
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

        {/* Ressource */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Ressource <span className="text-red-500">*</span>
          </label>
          <Select
            options={ressourcesOptions}
            onChange={(selectedOption) => {
              setValue('ressourceId', selectedOption.value);
            }}
            defaultValue={isEdit && creneau?.ressourceId ? 
              { value: creneau.ressourceId, label: ressources.find(r => r.id === creneau.ressourceId)?.libelle } 
              : null}
            placeholder="Rechercher une ressource..."
            isSearchable
            required
          />
          <input
            type="hidden"
            {...register('ressourceId', { required: 'Sélectionnez une ressource.' })}
          />
          {errors.ressourceId && (
            <p className="text-red-500 text-sm mt-1">{errors.ressourceId.message}</p>
          )}
        </div>

        {/* Groupe */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Groupe (optionnel si responsable sélectionné)
          </label>
          <Select
            options={groupesOptions}
            onChange={(selectedOption) => {
              setValue('groupId', selectedOption.value);
              setValue('responsableId', null); // Désélectionner le responsable
            }}
            defaultValue={isEdit && creneau?.groupId ? 
              { value: creneau.groupId, label: groupes.find(g => g.id === creneau.groupId)?.nom } 
              : null}
            placeholder="Sélectionner un groupe..."
            isSearchable
            isDisabled={!!responsableId}
          />
          <input type="hidden" {...register('groupId')} />
        </div>

        {/* Responsable */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Responsable (optionnel si groupe sélectionné)
          </label>
          <Select
            options={responsablesOptions}
            onChange={(selectedOption) => {
              setValue('responsableId', selectedOption.value);
              setValue('groupId', null); // Désélectionner le groupe
            }}
            defaultValue={isEdit && creneau?.responsableId ? 
              { value: creneau.responsableId, label: responsables.find(r => r.id === creneau.responsableId)?.username } 
              : null}
            placeholder="Sélectionner un responsable..."
            isSearchable
            isDisabled={!!groupeId}
          />
          <input type="hidden" {...register('responsableId')} />
        </div>

        {/* Date et heure de début */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Début <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            {...register('start', {
              required: 'La date et l\'heure de début sont requises.',
            })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.start && (
            <p className="text-red-500 text-sm mt-1">{errors.start.message}</p>
          )}
        </div>

        {/* Date et heure de fin */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fin <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            {...register('end', {
              required: 'La date et l\'heure de fin sont requises.',
            })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.end && (
            <p className="text-red-500 text-sm mt-1">{errors.end.message}</p>
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