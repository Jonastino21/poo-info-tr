// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './utils/ProtectedRoute';

import LoginContainer from './pages/auth/LoginContainer';
import Dashboard from './pages/Dashboard';
import HomeDashboard from './pages/HomeDashboard';

import RepartitionsPageAzir from './pages/Repartions-AzirKev/RepartitionsPage-azir';
import RepartitionsListAzir from './components/repartitions-azir/RepartitionsList-azir';
import RepartitionFormAzir from './components/repartitions-azir/repartitionForm-azir';

import { EventsProvider } from './contexts/EventsContext';
import ResourcesList from './components/repartitions-azir/ResourceList-azir';
import GroupsList from './components/repartitions-azir/GroupeList-azir';
import RegisterContainer from './pages/auth/RegisterContainer';

function App() {
  return (

    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* 1) Route publique pour login */}
          <Route path="/login" element={<LoginContainer />} />
          <Route path="/register" element={<RegisterContainer />} />
          {/* 2) Routes protégées */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />}>
              {/* /dashboard → page d’accueil */}
              <Route index element={<HomeDashboard />} />

              {/*
                3) Module Répartitions :
                   - On englobe REPARTITIONS dans le provider
                   - Ainsi, RepartitionsList et RepartitionForm utilisent
                     le même contexte (mémoire partagée)
              */}
              <Route path='ressources' element={<ResourcesList />} />
              <Route path='groupes' element={<GroupsList />} />
              <Route
                path="repartitions"
                element={
                  <EventsProvider>
                    <RepartitionsPageAzir />
                  </EventsProvider>
                }
              >
                {/* /dashboard/repartitions → liste */}
                <Route index element={<RepartitionsListAzir />} />

                {/* /dashboard/repartitions/ajouter → création */}
                <Route path="ajouter" element={<RepartitionFormAzir />} />

                {/* /dashboard/repartitions/:id/modifier → édition */}
                <Route path=":id/modifier" element={<RepartitionFormAzir />} />

              </Route>

              {/* Toute autre route sous /dashboard redirige sur /dashboard */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Route>

          {/* Si on tape / → on renvoie vers /login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>

  );
}

export default App;
