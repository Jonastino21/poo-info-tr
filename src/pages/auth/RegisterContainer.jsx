import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import RegisterView from './RegisterView';
import { toast } from 'react-toastify';

const RegisterContainer = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await register({ username, email, password, role });
      
      toast.success('Inscription réussie ! Vous pouvez maintenant vous connecter', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      navigate('/login');
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <RegisterView
      username={username}
      setUsername={setUsername}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      role={role}
      setRole={setRole}
      error={error}
      loading={loading}
      onSubmit={handleSubmit}
    />
  );
};

export default RegisterContainer;