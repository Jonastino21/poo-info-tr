import React, { useState, useEffect } from 'react';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { api } from '../../../config';

const ResourcesList = () => {
  const [resources, setResources] = useState([]);
  const [filter, setFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentResource, setCurrentResource] = useState(null);
  const [formData, setFormData] = useState({ libelle: '' });

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await api.get('/api/resources');
      setResources(response.data);
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentResource) {
        await api.put(`/api/resources/${currentResource.id}`, formData);
      } else {
        await api.post('/api/resources', formData);
      }
      fetchResources();
      setIsModalOpen(false);
      setFormData({ libelle: '' });
    } catch (error) {
      console.error('Error saving resource:', error);
    }
  };

  const handleEdit = (resource) => {
    setCurrentResource(resource);
    setFormData({ libelle: resource.libelle });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette ressource ?')) {
      try {
        await api.delete(`/api/resources/${id}`);
        fetchResources();
      } catch (error) {
        console.error('Error deleting resource:', error);
      }
    }
  };

  const filteredResources = resources.filter(resource =>
    resource.libelle.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Ressources</h1>
        <button
          onClick={() => {
            setCurrentResource(null);
            setFormData({ libelle: '' });
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredResources.map((resource) => (
              <tr key={resource.id}>
                <td className="px-6 py-4 whitespace-nowrap">{resource.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{resource.libelle}</td>
                <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                  <button
                    onClick={() => handleEdit(resource)}
                    className="text-yellow-500 hover:text-yellow-700"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(resource.id)}
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
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {currentResource ? 'Modifier la ressource' : 'Ajouter une ressource'}
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
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="libelle">
                  Nom de la ressource
                </label>
                <input
                  type="text"
                  id="libelle"
                  name="libelle"
                  value={formData.libelle}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
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
                  {currentResource ? 'Mettre à jour' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourcesList;