import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config';
import PortfolioManager from './PortfolioManager';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState(localStorage.getItem('admin_token'));
  const [showLoginForm, setShowLoginForm] = useState(!token);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [activeSection, setActiveSection] = useState('messages');

  useEffect(() => {
    if (token) {
      fetchMessages();
      
      // Auto-refresh toutes les 15 minutes (900000 ms)
      const refreshInterval = setInterval(() => {
        console.log('🔄 Auto-refresh du dashboard...');
        fetchMessages();
      }, 900000);
      
      return () => clearInterval(refreshInterval);
    }
  }, [token]);

  const fetchMessages = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(API_ENDPOINTS.clientMessages, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des messages');
      }

      const data = await response.json();
      setMessages(data);
    } catch (err) {
      setError(err.message);
      if (err.message.includes('Token')) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const response = await fetch(API_ENDPOINTS.adminLogin, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erreur de connexion');
      }

      localStorage.setItem('admin_token', result.token);
      setToken(result.token);
      setShowLoginForm(false);
      setPassword('');
    } catch (err) {
      setLoginError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
    setShowLoginForm(true);
    setMessages([]);
  };

  const handleMarkAsRead = async (messageId) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.clientMessages}/${messageId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ read: true })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour');
      }

      fetchMessages();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (messageId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
      try {
        const response = await fetch(`${API_ENDPOINTS.clientMessages}/${messageId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la suppression');
        }

        fetchMessages();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Filtrer les messages par catégorie
  const getFilteredMessages = () => {
    if (activeTab === 'all') return messages;
    return messages.filter(msg => msg.domain === activeTab);
  };

  const filteredMessages = getFilteredMessages();

  // Compter les messages par catégorie
  const getCategoryCount = (category) => {
    if (category === 'all') return messages.length;
    return messages.filter(msg => msg.domain === category).length;
  };

  const getCategoryLabel = (domain) => {
    const labels = {
      student: '🎓 Étudiants',
      company: '🏢 Entreprises',
      ngo: '🤝 ONG',
      individual: '👤 Particuliers'
    };
    return labels[domain] || domain;
  };

  const getCategoryColor = (domain) => {
    const colors = {
      student: '#667eea',
      company: '#f59e0b',
      ngo: '#10b981',
      individual: '#8b5cf6'
    };
    return colors[domain] || '#64748b';
  };

  if (showLoginForm) {
    return (
      <div className="admin-login">
        <div className="login-container">
          <h1>Admin Login</h1>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Mot de passe admin"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {loginError && <div className="error-message">{loginError}</div>}
            <button type="submit">Se connecter</button>
          </form>
          <button onClick={() => navigate('/')} className="back-btn">
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="header-content">
          <h1>📊 Tableau de bord Admin</h1>
          <p className="header-subtitle">Gestion des messages et réalisations</p>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          <i className="fa-solid fa-sign-out-alt"></i> Déconnexion
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Navigation des sections */}
      <div className="admin-nav">
        <button
          className={`nav-btn ${activeSection === 'messages' ? 'active' : ''}`}
          onClick={() => setActiveSection('messages')}
        >
          <i className="fa-solid fa-envelope"></i> Messages
        </button>
        <button
          className={`nav-btn ${activeSection === 'portfolio' ? 'active' : ''}`}
          onClick={() => setActiveSection('portfolio')}
        >
          <i className="fa-solid fa-images"></i> Réalisations
        </button>
      </div>

      {/* Section Messages */}
      {activeSection === 'messages' && (
        <>
          <div className="dashboard-controls">
            <button onClick={fetchMessages} disabled={loading} className="refresh-btn">
              <i className="fa-solid fa-sync"></i> {loading ? 'Chargement...' : 'Actualiser'}
            </button>
            <div className="message-stats">
              <div className="stat-item">
                <span className="stat-label">Total</span>
                <span className="stat-value">{messages.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Non lus</span>
                <span className="stat-value unread">{messages.filter(m => !m.read).length}</span>
              </div>
            </div>
          </div>

          {/* Onglets de catégories */}
          <div className="category-tabs">
            <button
              className={`tab ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              <span className="tab-label">📋 Tous</span>
              <span className="tab-count">{getCategoryCount('all')}</span>
            </button>
            <button
              className={`tab ${activeTab === 'student' ? 'active' : ''}`}
              onClick={() => setActiveTab('student')}
              style={{ borderBottomColor: activeTab === 'student' ? getCategoryColor('student') : 'transparent' }}
            >
              <span className="tab-label">🎓 Étudiants</span>
              <span className="tab-count">{getCategoryCount('student')}</span>
            </button>
            <button
              className={`tab ${activeTab === 'company' ? 'active' : ''}`}
              onClick={() => setActiveTab('company')}
              style={{ borderBottomColor: activeTab === 'company' ? getCategoryColor('company') : 'transparent' }}
            >
              <span className="tab-label">🏢 Entreprises</span>
              <span className="tab-count">{getCategoryCount('company')}</span>
            </button>
            <button
              className={`tab ${activeTab === 'ngo' ? 'active' : ''}`}
              onClick={() => setActiveTab('ngo')}
              style={{ borderBottomColor: activeTab === 'ngo' ? getCategoryColor('ngo') : 'transparent' }}
            >
              <span className="tab-label">🤝 ONG</span>
              <span className="tab-count">{getCategoryCount('ngo')}</span>
            </button>
            <button
              className={`tab ${activeTab === 'individual' ? 'active' : ''}`}
              onClick={() => setActiveTab('individual')}
              style={{ borderBottomColor: activeTab === 'individual' ? getCategoryColor('individual') : 'transparent' }}
            >
              <span className="tab-label">👤 Particuliers</span>
              <span className="tab-count">{getCategoryCount('individual')}</span>
            </button>
          </div>

          <div className="messages-container">
            {filteredMessages.length === 0 ? (
              <div className="no-messages">
                <i className="fa-solid fa-inbox"></i>
                <p>Aucun message dans cette catégorie</p>
              </div>
            ) : (
              filteredMessages.map((msg) => (
                <div key={msg.id} className={`message-card ${msg.read ? 'read' : 'unread'}`}>
                  <div className="message-badge" style={{ backgroundColor: getCategoryColor(msg.domain) }}>
                    {getCategoryLabel(msg.domain)}
                  </div>

                  <div className="message-header">
                    <div className="message-info">
                      <h3>{msg.name}</h3>
                      <p className="message-email">
                        <i className="fa-solid fa-envelope"></i> {msg.email}
                      </p>
                      {msg.phone && (
                        <p className="message-phone">
                          <i className="fa-solid fa-phone"></i> {msg.phone}
                        </p>
                      )}
                    </div>
                    {msg.domain !== 'student' && (
                      <div className="message-date">
                        {new Date(msg.created_at).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    )}
                  </div>

                  {msg.project_type && (
                    <div className="message-meta">
                      <span className="meta-item">
                        <i className="fa-solid fa-briefcase"></i> {msg.project_type}
                      </span>
                      {msg.budget && (
                        <span className="meta-item">
                          <i className="fa-solid fa-money-bill"></i> {msg.budget}
                        </span>
                      )}
                      {msg.deadline && (
                        <span className="meta-item">
                          <i className="fa-solid fa-calendar"></i> {msg.deadline}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="message-body">
                    {msg.message}
                  </div>

                  <div className="message-actions">
                    {!msg.read && (
                      <button
                        onClick={() => handleMarkAsRead(msg.id)}
                        className="action-btn mark-read"
                      >
                        <i className="fa-solid fa-check"></i> Marquer comme lu
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(msg.id)}
                      className="action-btn delete"
                    >
                      <i className="fa-solid fa-trash"></i> Supprimer
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* Section Portfolio */}
      {activeSection === 'portfolio' && (
        <PortfolioManager token={token} />
      )}
    </div>
  );
};

export default AdminDashboard;
