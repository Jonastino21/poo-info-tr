import React, { useState, useEffect } from 'react';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { api } from '../../../config';

const GroupsList = () => {
  const [groups, setGroups] = useState([]);
  const [students, setStudents] = useState([]);
  const [filter, setFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    membres: [] // Format: [{ id, username }]
  });

  useEffect(() => {
    fetchGroups();
    fetchStudents();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await api.get('/api/groupes');
      setGroups(response.data);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await api.get('/api/auth/all');
      setStudents(response.data.filter(user => user.role === 'STUDENT'));
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStudentToggle = (student) => {
    setFormData(prev => {
      const isAlreadyMember = prev.membres.some(m => m.id === student.id);
      
      return {
        ...prev,
        membres: isAlreadyMember
          ? prev.membres.filter(m => m.id !== student.id)
          : [...prev.membres, { id: student.id, username: student.username }]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentGroup) {
        await api.put(`/api/groupes/${currentGroup.id}`, {
          nom: formData.nom,
          studentIds: formData.membres.map(m => m.id) // Envoyer seulement les IDs pour la MAJ
        });
      } else {
        await api.post('/api/groupes', {
          nom: formData.nom,
          studentIds: formData.membres.map(m => m.id) // Envoyer seulement les IDs pour la création
        });
      }
      fetchGroups();
      setIsModalOpen(false);
      setFormData({ nom: '', membres: [] });
    } catch (error) {
      console.error('Error saving group:', error);
    }
  };

  const handleEdit = (group) => {
    setCurrentGroup(group);
    setFormData({
      nom: group.nom,
      membres: group.membres || [] // Pré-remplir avec les membres existants
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce groupe ?')) {
      try {
        await api.delete(`/api/groupes/${id}`);
        fetchGroups();
      } catch (error) {
        console.error('Error deleting group:', error);
      }
    }
  };

  const filteredGroups = groups.filter(group =>
    group.nom.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Groupes</h1>
        <button
          onClick={() => {
            setCurrentGroup(null);
            setFormData({ nom: '', membres: [] });
            setIsModalOpen(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Ajouter
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Filtrer par nom..."
          className="border p-2 rounded w-full md:w-1/3"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Membres</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredGroups.map((group) => (
              <tr key={group.id}>
                <td className="px-6 py-4 whitespace-nowrap">{group.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{group.nom}</td>
                <td className="px-6 py-4">
                  {group.membres?.map(m => m.username).join(', ') || 'Aucun membre'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                  <button
                    onClick={() => handleEdit(group)}
                    className="text-yellow-500 hover:text-yellow-700"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(group.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {currentGroup ? 'Modifier le groupe' : 'Ajouter un groupe'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nom">
                  Nom du groupe
                </label>
                <input
                  type="text"
                  id="nom"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Étudiants
                </label>
                <div className="space-y-2 max-h-60 overflow-y-auto border p-2 rounded">
                  {students.map(student => {
                    const isMember = formData.membres.some(m => m.id === student.id);
                    return (
                      <div key={student.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`student-${student.id}`}
                          checked={isMember}
                          onChange={() => handleStudentToggle(student)}
                          className="mr-2"
                        />
                        <label htmlFor={`student-${student.id}`}>
                          {student.username} (ID: {student.id})
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  {currentGroup ? 'Mettre à jour' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupsList;