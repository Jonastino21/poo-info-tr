// src/pages/RepartitionsPage.jsx
import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function RepartitionsPage() {
  return (
    <div className="flex flex-col h-full">
      {/* Header du module */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Planning & Répartitions
        </h1>
        <Link
          to="ajouter"
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Nouveau créneau
        </Link>
      </div>

      {/* Contenu variable (liste ou formulaire) */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
