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
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [expandedMessageId, setExpandedMessageId] = useState(null);
  const [selectedCahier, setSelectedCahier] = useState(null);
  const [showCahierModal, setShowCahierModal] = useState(false);
  const [showTrash, setShowTrash] = useState(false);

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

  const handleRestore = async (messageId) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.clientMessages}/${messageId}/restore`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la restauration');
      }

      fetchMessages();
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePermanentDelete = async (messageId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer définitivement ce message ? Cette action est irréversible.')) {
      try {
        const response = await fetch(`${API_ENDPOINTS.clientMessages}/${messageId}/permanent`, {
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

  const openMessageModal = (message) => {
    setSelectedMessage(message);
    setShowMessageModal(true);
  };

  const closeMessageModal = () => {
    setShowMessageModal(false);
    setSelectedMessage(null);
  };

  const truncateMessage = (message, maxLength = 150) => {
    if (message.length > maxLength) {
      return message.substring(0, maxLength) + '...';
    }
    return message;
  };

  const openCahierModal = (cahierUrl, clientName) => {
    setSelectedCahier({ url: cahierUrl, name: clientName });
    setShowCahierModal(true);
  };

  const closeCahierModal = () => {
    setShowCahierModal(false);
    setSelectedCahier(null);
  };

  // Filtrer les messages par catégorie
  const getFilteredMessages = () => {
    // Exclure les messages supprimés
    const activeMessages = messages.filter(msg => !msg.deleted_at);
    
    if (activeTab === 'all') return activeMessages;
    return activeMessages.filter(msg => msg.domain === activeTab);
  };

  // Récupérer les messages supprimés
  const getTrashMessages = () => {
    return messages.filter(msg => msg.deleted_at);
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
      individual: '👤 Particuliers',
      other: '🔧 Autre'
    };
    return labels[domain] || domain;
  };

  const getCategoryColor = (domain) => {
    const colors = {
      student: '#667eea',
      company: '#f59e0b',
      ngo: '#10b981',
      individual: '#8b5cf6',
      other: '#ec4899'
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
        <div className="header-actions">
          <button onClick={() => navigate('/')} className="back-to-client-btn">
            <i className="fa-solid fa-arrow-left"></i> Retour au site
          </button>
          <button onClick={handleLogout} className="logout-btn">
            <i className="fa-solid fa-sign-out-alt"></i> Déconnexion
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Navigation des sections */}
      <div className="admin-nav">
        <button
          className={`nav-btn ${activeSection === 'messages' ? 'active' : ''}`}
          onClick={() => {
            setActiveSection('messages');
            setShowTrash(false);
          }}
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

      {/* Bouton Corbeille - Visible seulement dans la section Messages */}
      {activeSection === 'messages' && (
        <div className="trash-button-container">
          <button 
            onClick={() => setShowTrash(!showTrash)}
            className={`trash-btn ${showTrash ? 'active' : ''}`}
          >
            <i className="fa-solid fa-trash"></i> 
            <span className="trash-label">{showTrash ? 'Retour aux messages' : 'Corbeille'}</span>
            {!showTrash && <span className="trash-count">{getTrashMessages().length}</span>}
          </button>
        </div>
      )}

      {/* Section Messages */}
      {activeSection === 'messages' && !showTrash && (
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
            <button
              className={`tab ${activeTab === 'other' ? 'active' : ''}`}
              onClick={() => setActiveTab('other')}
              style={{ borderBottomColor: activeTab === 'other' ? getCategoryColor('other') : 'transparent' }}
            >
              <span className="tab-label">🔧 Autre</span>
              <span className="tab-count">{getCategoryCount('other')}</span>
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
                  </div>

                  <div className="message-date-row">
                    <div className="message-date">
                      <i className="fa-solid fa-calendar-days"></i>
                      {new Date(msg.created_at).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                      <span className="date-separator">•</span>
                      <i className="fa-solid fa-clock"></i>
                      {new Date(msg.created_at).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
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
                      {msg.cahier_de_charge_url && (
                        <button 
                          onClick={() => openCahierModal(msg.cahier_de_charge_url, msg.name)}
                          className="meta-item cahier-link"
                        >
                          <i className="fa-solid fa-file-pdf"></i> Cahier de charge
                        </button>
                      )}
                    </div>
                  )}

                  <div className="message-body">
                    {expandedMessageId === msg.id ? (
                      <>
                        {msg.message}
                        <button
                          onClick={() => setExpandedMessageId(null)}
                          className="collapse-message-btn"
                        >
                          <i className="fa-solid fa-compress"></i> Réduire
                        </button>
                      </>
                    ) : (
                      <>
                        {truncateMessage(msg.message)}
                        {msg.message.length > 150 && (
                          <button
                            onClick={() => setExpandedMessageId(msg.id)}
                            className="expand-message-btn"
                          >
                            <i className="fa-solid fa-expand"></i> Voir le message complet
                          </button>
                        )}
                      </>
                    )}
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

      {/* Section Corbeille */}
      {activeSection === 'messages' && showTrash && (
        <>
          <div className="trash-header">
            <h2><i className="fa-solid fa-trash"></i> Corbeille</h2>
            <p className="trash-subtitle">Messages supprimés ({getTrashMessages().length})</p>
          </div>

          <div className="messages-container">
            {getTrashMessages().length === 0 ? (
              <div className="no-messages">
                <i className="fa-solid fa-inbox"></i>
                <p>La corbeille est vide</p>
              </div>
            ) : (
              getTrashMessages().map((msg) => (
                <div key={msg.id} className={`message-card ${msg.read ? 'read' : 'unread'} trash-card`}>
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
                  </div>

                  <div className="message-date-row">
                    <div className="message-date">
                      <i className="fa-solid fa-trash-clock"></i>
                      Supprimé le {new Date(msg.deleted_at).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>

                  <div className="message-body">
                    {truncateMessage(msg.message)}
                  </div>

                  <div className="message-actions">
                    <button
                      onClick={() => handleRestore(msg.id)}
                      className="action-btn restore"
                    >
                      <i className="fa-solid fa-undo"></i> Restaurer
                    </button>
                    <button
                      onClick={() => handlePermanentDelete(msg.id)}
                      className="action-btn permanent-delete"
                    >
                      <i className="fa-solid fa-times"></i> Supprimer définitivement
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

      {/* Modal pour afficher le cahier de charge */}
      {showCahierModal && selectedCahier && (
        <div className="cahier-modal-overlay" onClick={closeCahierModal}>
          <div className="cahier-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cahier-modal-header">
              <h2>
                <i className="fa-solid fa-file-pdf"></i> Cahier de charge
              </h2>
              <p className="cahier-client-name">De: {selectedCahier.name}</p>
              <button onClick={closeCahierModal} className="cahier-modal-close-btn">
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            <div className="cahier-modal-content">
              <iframe
                src={selectedCahier.url}
                title="Cahier de charge"
                className="cahier-iframe"
              ></iframe>
            </div>
            <div className="cahier-modal-actions">
              <a 
                href={selectedCahier.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="cahier-download-btn"
              >
                <i className="fa-solid fa-download"></i> Télécharger
              </a>
              <button onClick={closeCahierModal} className="cahier-close-btn">
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
