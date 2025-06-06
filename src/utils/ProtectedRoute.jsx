// src/utils/ProtectedRoute.jsx
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const ProtectedRoute = () => {
  const { token } = useContext(AuthContext);

  // Si pas de token → redirection vers /login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Sinon, on affiche la route demandée
  return <Outlet />;
};

export default ProtectedRoute;
