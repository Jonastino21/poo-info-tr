import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import LoginView from './LoginView';
import { toast } from 'react-toastify';

const LoginContainer = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login({ email, password });
      
      toast.success('Connexion réussie !', {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Redirection en fonction du rôle
      const user = JSON.parse(localStorage.getItem('AUTH_USER'));
      if (user?.role === 'RESPONSABLE') {
        navigate('/dashboard/responsable');
      } else {
        navigate('/dashboard/student');
      }
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <LoginView
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      error={error}
      loading={loading}
      onSubmit={handleSubmit}
    />
  );
};

export default LoginContainer;