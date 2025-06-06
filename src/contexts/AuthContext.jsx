import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('AUTH_TOKEN');
    const savedUser = localStorage.getItem('AUTH_USER');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(savedUser);
    }
  }, []);

  const login = async ({ email, password }) => {
    // fake login
    const VALID_EMAIL = 'admin@isstm.mg';
    const VALID_PASSWORD = 'admin123';

    return new Promise((resolve, reject) => {
      // Simuler un délai réseau (optionnel)
      setTimeout(() => {
        if (email === VALID_EMAIL && password === VALID_PASSWORD) {
          // En cas de succès : on crée un token factice
          const fakeToken = 'fake-jwt-token';

          setToken(fakeToken);
          setUser(email);
          localStorage.setItem('AUTH_TOKEN', fakeToken);
          localStorage.setItem('AUTH_USER', email);

          resolve({
            token: fakeToken,
            user: { email }
          });
        } else {
          reject(new Error('Email ou mot de passe invalide'));
        }
      }, 500);
    });
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('AUTH_TOKEN');
    localStorage.removeItem('AUTH_USER');
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
