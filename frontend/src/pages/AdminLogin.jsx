import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config';
import './AdminLogin.css';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.adminLogin, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (response.ok) {
        // Sauvegarder le token
        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('admin_user', JSON.stringify(data.admin));
        
        // Rediriger vers le dashboard
        navigate('/admin/dashboard');
      } else {
        setError(data.error || 'Identifiants invalides');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-header">
          <i className="fa-solid fa-shield-halved"></i>
          <h1>BAWI-STUDIO</h1>
          <p>Administration</p>
        </div>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              <i className="fa-solid fa-user"></i>
              Nom d'utilisateur
            </label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>
              <i className="fa-solid fa-lock"></i>
              Mot de passe
            </label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              placeholder="••••••"
              required
            />
          </div>

          {error && (
            <div className="error-message">
              <i className="fa-solid fa-triangle-exclamation"></i>
              {error}
            </div>
          )}

          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i>
                Connexion...
              </>
            ) : (
              <>
                <i className="fa-solid fa-right-to-bracket"></i>
                Se connecter
              </>
            )}
          </button>
        </form>

        <div className="admin-login-footer">
          <a href="/">
            <i className="fa-solid fa-arrow-left"></i>
            Retour au site
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
