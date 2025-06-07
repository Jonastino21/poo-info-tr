import React, { createContext, useState, useEffect } from 'react';
import { api } from '../../config';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      const savedUser = localStorage.getItem('AUTH_USER');

      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          
          // Optionnel: Valider la session avec le backend
          // await api.get('/api/auth/validate');
          
          setUser(userData);
        } catch (error) {
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async ({ email, password }) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      
      // Stocker les infos utilisateur
      localStorage.setItem('AUTH_USER', JSON.stringify(response.data));
      
      // Mettre à jour le state
      setUser(response.data);
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Échec de la connexion');
    }
  };

  const register = async ({ username, email, password, role }) => {
    try {
      const response = await api.post('/api/auth/register', { 
        username, 
        email, 
        password, 
        role 
      });
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Échec de l'inscription");
    }
  };

  const logout = () => {
    localStorage.removeItem('AUTH_USER');
    setUser(null);
    navigate('/login');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isResponsable: user?.role === 'RESPONSABLE',
    isStudent: user?.role === 'STUDENT'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};