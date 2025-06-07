import React from 'react';

const RegisterView = ({
  username,
  setUsername,
  email,
  setEmail,
  password,
  setPassword,
  role,
  setRole,
  error,
  loading,
  onSubmit,
}) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Créer un compte
        </h2>

        {error && (
          <div className="mb-4 text-red-600 bg-red-100 px-3 py-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block mb-1 font-medium">
              Nom d'utilisateur
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-1 font-medium">
              Adresse email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 font-medium">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div>
            <label htmlFor="role" className="block mb-1 font-medium">
              Rôle
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="">Sélectionner un rôle</option>
              <option value="STUDENT">Étudiant</option>
              <option value="RESPONSABLE">Responsable</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition duration-150 disabled:opacity-50"
          >
            {loading ? 'Inscription en cours...' : 'S\'inscrire'}
          </button>

          <div className="text-center text-sm text-gray-600">
            Déjà un compte?{' '}
            <a href="/login" className="text-blue-600 hover:underline">
              Se connecter
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterView;