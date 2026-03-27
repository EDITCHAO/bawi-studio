import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, API_URL } from '../config';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [clientMessages, setClientMessages] = useState([]);
  const [generalMessages, setGeneralMessages] = useState([]);
  const [trashMessages, setTrashMessages] = useState([]);
  const [projects, setProjects] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [generalMessageFilter, setGeneralMessageFilter] = useState('all'); // 'all', 'client', 'student'
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    category: '',
    client_name: '',
    image_url: '',
    project_url: '',
    technologies: '',
    status: 'draft',
    featured: false,
    order_index: 0
  });
  const [portfolio, setPortfolio] = useState([]);
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [portfolioImage, setPortfolioImage] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('admin_token');
  const admin = JSON.parse(localStorage.getItem('admin_user') || '{}');

  useEffect(() => {
    loadData();
  }, []);

  // Fermer le sidebar quand on change d'onglet sur mobile
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  // Fermer le sidebar quand on clique sur l'overlay
  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const loadData = async () => {
    try {
      // Charger les statistiques
      const statsRes = await fetch(API_ENDPOINTS.adminStats);
      const statsData = await statsRes.json();
      setStats(statsData);

      // Charger les messages clients
      const clientRes = await fetch(API_ENDPOINTS.clientMessages);
      const clientData = await clientRes.json();
      setClientMessages(clientData);

      // Charger les messages généraux
      const generalRes = await fetch(API_ENDPOINTS.generalMessages);
      const generalData = await generalRes.json();
      setGeneralMessages(generalData);

      // Charger la corbeille
      const trashRes = await fetch(API_ENDPOINTS.trash);
      const trashData = await trashRes.json();
      setTrashMessages(trashData);

      // Charger les projets
      const projectsRes = await fetch(API_ENDPOINTS.projects);
      const projectsData = await projectsRes.json();
      setProjects(projectsData);

      // Charger le portfolio
      const portfolioRes = await fetch(API_ENDPOINTS.portfolio);
      const portfolioData = await portfolioRes.json();
      setPortfolio(portfolioData);

      setLoading(false);
    } catch (error) {
      console.error('Erreur:', error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    navigate('/admin');
  };

  const handleDeleteMessage = async (messageId, type) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
      return;
    }

    try {
      const endpoint = type === 'client' 
        ? `${API_URL}/api/admin/client-messages/${messageId}`
        : `${API_URL}/api/admin/general-messages/${messageId}`;
      
      const response = await fetch(endpoint, {
        method: 'DELETE'
      });

      if (response.ok) {
        // Recharger les données
        loadData();
        alert('Message supprimé avec succès');
      } else {
        alert('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const handleStatusChange = async (messageId, newStatus, type) => {
    try {
      const endpoint = type === 'client'
        ? `${API_URL}/api/admin/client-messages/${messageId}`
        : `${API_URL}/api/admin/general-messages/${messageId}`;
      
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        // Recharger les données
        loadData();
      } else {
        alert('Erreur lors de la mise à jour du statut');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  const handleAcceptMessage = async (message) => {
    if (!window.confirm(`Accepter le message de ${message.name} ?\nIl sera déplacé vers "Messages Acceptés".`)) {
      return;
    }

    try {
      // Créer le message dans general_messages
      const response = await fetch(API_ENDPOINTS.acceptClientMessage, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          client_message_id: message.id,
          sender_name: message.name,
          sender_email: message.email,
          sender_contact: message.contact,
          subject: `Projet ${message.project_type} - ${message.domain}`,
          message: message.message,
          domain: message.domain // Passer le domaine pour catégoriser
        })
      });

      if (response.ok) {
        // Recharger les données
        loadData();
        alert('Message accepté et déplacé vers "Messages Acceptés"');
      } else {
        alert('Erreur lors de l\'acceptation du message');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'acceptation du message');
    }
  };

  const handleRestoreMessage = async (trashId) => {
    if (!window.confirm('Restaurer ce message ?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/admin/trash/${trashId}/restore`, {
        method: 'POST'
      });

      if (response.ok) {
        loadData();
        alert('Message restauré avec succès');
      } else {
        alert('Erreur lors de la restauration');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la restauration');
    }
  };

  const handleEmptyTrash = async () => {
    if (!window.confirm('Vider complètement la corbeille ?\nCette action est irréversible!')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/admin/trash/empty`, {
        method: 'DELETE'
      });

      if (response.ok) {
        const data = await response.json();
        loadData();
        alert(data.message);
      } else {
        alert('Erreur lors du vidage de la corbeille');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors du vidage de la corbeille');
    }
  };

  const handleDeletePermanently = async (trashId) => {
    if (!window.confirm('Supprimer définitivement ce message ?\nCette action est irréversible!')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/admin/trash/${trashId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        loadData();
        alert('Message supprimé définitivement');
      } else {
        alert('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const handleViewMessage = (message) => {
    setSelectedMessage(message);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedMessage(null);
  };

  const getFilteredMessages = (messages) => {
    let filtered = messages;
    
    // Filtre par statut
    if (filterStatus !== 'all') {
      filtered = filtered.filter(msg => msg.status === filterStatus);
    }
    
    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(msg => 
        msg.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.sender_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.sender_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.contact?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.sender_contact?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.message?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  const getFilteredGeneralMessages = (messages) => {
    let filtered = messages;
    
    // Filtre par catégorie (client/student)
    if (generalMessageFilter === 'client') {
      filtered = filtered.filter(msg => msg.category === 'client');
    } else if (generalMessageFilter === 'student') {
      filtered = filtered.filter(msg => msg.category === 'student');
    }
    
    // Filtre par statut
    if (filterStatus !== 'all') {
      filtered = filtered.filter(msg => msg.status === filterStatus);
    }
    
    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(msg => 
        msg.sender_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.sender_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.sender_contact?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.message?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    console.log('Filter:', generalMessageFilter, 'Total messages:', messages.length, 'Filtered:', filtered.length);
    return filtered;
  };

  const getFilteredTrashMessages = (messages) => {
    let filtered = messages;
    
    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(msg => 
        msg.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.contact?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.message?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  const getStatusCount = (messages, status) => {
    return messages.filter(msg => msg.status === status).length;
  };

  const getStatusBadge = (status) => {
    const badges = {
      new: { label: 'Nouveau', class: 'badge-new' },
      read: { label: 'Lu', class: 'badge-read' },
      in_progress: { label: 'En cours', class: 'badge-progress' },
      completed: { label: 'Terminé', class: 'badge-completed' },
      archived: { label: 'Archivé', class: 'badge-archived' }
    };
    const badge = badges[status] || badges.new;
    return <span className={`status-badge ${badge.class}`}>{badge.label}</span>;
  };

  const getDomainLabel = (domain) => {
    const labels = {
      company: '🏢 Entreprise',
      student: '🎓 Étudiant',
      individual: '👤 Particulier',
      ngo: '🤝 ONG'
    };
    return labels[domain] || domain;
  };

  const handleSaveProject = async () => {
    try {
      const method = selectedProject ? 'PUT' : 'POST';
      const url = selectedProject 
        ? `${API_ENDPOINTS.projects}/${selectedProject.id}`
        : API_ENDPOINTS.projects;

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(projectForm)
      });

      if (response.ok) {
        loadData();
        setShowProjectModal(false);
        setProjectForm({
          title: '',
          description: '',
          category: '',
          client_name: '',
          image_url: '',
          project_url: '',
          technologies: '',
          status: 'draft',
          featured: false,
          order_index: 0
        });
        setSelectedProject(null);
        alert(selectedProject ? 'Projet mis à jour!' : 'Projet créé!');
      } else {
        alert('Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la sauvegarde');
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce projet?')) {
      return;
    }

    try {
      const response = await fetch(`${API_ENDPOINTS.projects}/${projectId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        loadData();
        alert('Projet supprimé!');
      } else {
        alert('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const openProjectModal = (project = null) => {
    if (project) {
      setSelectedProject(project);
      setProjectForm(project);
    } else {
      setSelectedProject(null);
      setProjectForm({
        title: '',
        description: '',
        category: '',
        client_name: '',
        image_url: '',
        project_url: '',
        technologies: '',
        status: 'draft',
        featured: false,
        order_index: 0
      });
    }
    setShowProjectModal(true);
  };

  const closeProjectModal = () => {
    setShowProjectModal(false);
    setSelectedProject(null);
  };

  const handleAddToPortfolio = async () => {
    if (!selectedProject) {
      alert('Sélectionnez un projet');
      return;
    }

    if (portfolio.length >= 6) {
      alert('Maximum 6 projets dans le portfolio');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('project_id', selectedProject.id);
      if (portfolioImage) {
        formData.append('image', portfolioImage);
      }

      const response = await fetch(API_ENDPOINTS.portfolioAdd, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        loadData();
        setShowPortfolioModal(false);
        setSelectedProject(null);
        setPortfolioImage(null);
        alert('Projet ajouté au portfolio!');
      } else {
        alert('Erreur lors de l\'ajout');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'ajout');
    }
  };

  const handleRemoveFromPortfolio = async (portfolioId) => {
    if (!window.confirm('Retirer ce projet du portfolio?')) {
      return;
    }

    try {
      const response = await fetch(`${API_ENDPOINTS.portfolio}/${portfolioId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        loadData();
        alert('Projet retiré du portfolio!');
      } else {
        alert('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression');
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <i className="fa-solid fa-spinner fa-spin"></i>
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Bouton hamburger mobile */}
      <button 
        className="mobile-menu-btn" 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Menu"
      >
        <i className={`fa-solid ${sidebarOpen ? 'fa-times' : 'fa-bars'}`}></i>
      </button>

      {/* Overlay pour fermer le menu sur mobile */}
      <div 
        className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
        onClick={closeSidebar}
      ></div>

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <i className="fa-solid fa-shield-halved"></i>
          <h2>BAWI-STUDIO</h2>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={activeTab === 'overview' ? 'active' : ''}
            onClick={() => handleTabChange('overview')}
          >
            <i className="fa-solid fa-chart-line"></i>
            Vue d'ensemble
          </button>
          <button 
            className={activeTab === 'clients' ? 'active' : ''}
            onClick={() => handleTabChange('clients')}
          >
            <i className="fa-solid fa-briefcase"></i>
            Messages Clients
            {stats?.client_messages?.new > 0 && (
              <span className="badge-count">{stats.client_messages.new}</span>
            )}
          </button>
          <button 
            className={activeTab === 'students' ? 'active' : ''}
            onClick={() => handleTabChange('students')}
          >
            <i className="fa-solid fa-graduation-cap"></i>
            Messages Étudiants
            {clientMessages.filter(m => m.domain === 'student' && m.status === 'new').length > 0 && (
              <span className="badge-count">{clientMessages.filter(m => m.domain === 'student' && m.status === 'new').length}</span>
            )}
          </button>
          <button 
            className={activeTab === 'general' ? 'active' : ''}
            onClick={() => handleTabChange('general')}
          >
            <i className="fa-solid fa-check-circle"></i>
            Messages Acceptés
            {stats?.general_messages?.new > 0 && (
              <span className="badge-count">{stats.general_messages.new}</span>
            )}
          </button>
          <button 
            className={activeTab === 'trash' ? 'active' : ''}
            onClick={() => handleTabChange('trash')}
          >
            <i className="fa-solid fa-trash"></i>
            Corbeille
            {trashMessages.length > 0 && (
              <span className="badge-count">{trashMessages.length}</span>
            )}
          </button>
          <button 
            className={activeTab === 'projects' ? 'active' : ''}
            onClick={() => handleTabChange('projects')}
          >
            <i className="fa-solid fa-briefcase"></i>
            Projets
          </button>
          <button 
            className={activeTab === 'portfolio' ? 'active' : ''}
            onClick={() => handleTabChange('portfolio')}
          >
            <i className="fa-solid fa-images"></i>
            Portfolio
            {portfolio.length > 0 && (
              <span className="badge-count">{portfolio.length}/6</span>
            )}
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="admin-info">
            <i className="fa-solid fa-user-shield"></i>
            <span>{admin.username}</span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <i className="fa-solid fa-right-from-bracket"></i>
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <h1>
            {activeTab === 'overview' && 'Vue d\'ensemble'}
            {activeTab === 'clients' && 'Messages Clients (Entreprises, Particuliers, ONG)'}
            {activeTab === 'students' && 'Messages Étudiants'}
            {activeTab === 'general' && 'Messages Acceptés'}
            {activeTab === 'trash' && 'Corbeille'}
            {activeTab === 'projects' && 'Gestion des Projets'}
            {activeTab === 'portfolio' && 'Portfolio Visible aux Clients'}
          </h1>
          <div className="header-actions">
            {activeTab === 'portfolio' && (
              <button className="refresh-btn" onClick={() => setShowPortfolioModal(true)}>
                <i className="fa-solid fa-plus"></i>
                Ajouter au Portfolio
              </button>
            )}
            {activeTab === 'projects' && (
              <button className="refresh-btn" onClick={() => openProjectModal()}>
                <i className="fa-solid fa-plus"></i>
                Nouveau Projet
              </button>
            )}
            {activeTab === 'trash' && trashMessages.length > 0 && (
              <>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Rechercher dans la corbeille..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="empty-trash-btn" onClick={handleEmptyTrash}>
                  <i className="fa-solid fa-trash-can"></i>
                  Vider la corbeille
                </button>
              </>
            )}
            {activeTab !== 'overview' && activeTab !== 'trash' && activeTab !== 'projects' && (
              <>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Rechercher par nom ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                  className="filter-select"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">Tous les statuts</option>
                  <option value="new">Nouveau</option>
                  <option value="read">Lu</option>
                  <option value="in_progress">En cours</option>
                  <option value="completed">Terminé</option>
                  <option value="archived">Archivé</option>
                </select>
              </>
            )}
            <button className="refresh-btn" onClick={loadData}>
              <i className="fa-solid fa-rotate"></i>
              Actualiser
            </button>
          </div>
        </header>

        {/* Vue d'ensemble */}
        {activeTab === 'overview' && stats && (
          <div className="overview-content">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon" style={{ background: '#667eea' }}>
                  <i className="fa-solid fa-briefcase"></i>
                </div>
                <div className="stat-info">
                  <h3>{stats.client_messages.total}</h3>
                  <p>Messages Clients</p>
                  <span className="stat-detail">{stats.client_messages.new} nouveaux</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon" style={{ background: '#f59e0b' }}>
                  <i className="fa-solid fa-envelope"></i>
                </div>
                <div className="stat-info">
                  <h3>{stats.general_messages.total}</h3>
                  <p>Messages Généraux</p>
                  <span className="stat-detail">{stats.general_messages.new} nouveaux</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon" style={{ background: '#10b981' }}>
                  <i className="fa-solid fa-check-circle"></i>
                </div>
                <div className="stat-info">
                  <h3>{stats.client_messages.in_progress}</h3>
                  <p>En cours</p>
                  <span className="stat-detail">Projets actifs</span>
                </div>
              </div>
            </div>

            <div className="recent-messages">
              <h2>Messages récents</h2>
              <div className="messages-list">
                {stats.recent_messages.map(msg => (
                  <div key={msg.id} className="message-item">
                    <div className="message-header">
                      <strong>{msg.name}</strong>
                      {getStatusBadge(msg.status)}
                    </div>
                    <div className="message-meta">
                      {getDomainLabel(msg.domain)} • {msg.project_type}
                    </div>
                    <div className="message-date">
                      {new Date(msg.created_at).toLocaleString('fr-FR')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Messages Clients (sans étudiants) */}
        {activeTab === 'clients' && (
          <div className="messages-content">
            <div className="status-counters">
              <div className="counter-item">
                <span className="counter-label">Total:</span>
                <span className="counter-value">{clientMessages.filter(msg => msg.domain !== 'student').length}</span>
              </div>
              <div className="counter-item">
                <span className="counter-label">Nouveaux:</span>
                <span className="counter-value new">{getStatusCount(clientMessages.filter(msg => msg.domain !== 'student'), 'new')}</span>
              </div>
              <div className="counter-item">
                <span className="counter-label">En cours:</span>
                <span className="counter-value progress">{getStatusCount(clientMessages.filter(msg => msg.domain !== 'student'), 'in_progress')}</span>
              </div>
              <div className="counter-item">
                <span className="counter-label">Terminés:</span>
                <span className="counter-value completed">{getStatusCount(clientMessages.filter(msg => msg.domain !== 'student'), 'completed')}</span>
              </div>
            </div>
            <div className="messages-table">
              <table>
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Domaine</th>
                    <th>Projet</th>
                    <th>Budget</th>
                    <th>Statut</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredMessages(clientMessages.filter(msg => msg.domain !== 'student')).map(msg => (
                    <tr key={msg.id}>
                      <td><strong>{msg.name}</strong></td>
                      <td>{msg.email}</td>
                      <td>{getDomainLabel(msg.domain)}</td>
                      <td>{msg.project_type}</td>
                      <td>{msg.budget}</td>
                      <td>
                        <select 
                          className="status-select"
                          value={msg.status}
                          onChange={(e) => handleStatusChange(msg.id, e.target.value, 'client')}
                        >
                          <option value="new">Nouveau</option>
                          <option value="read">Lu</option>
                          <option value="in_progress">En cours</option>
                          <option value="completed">Terminé</option>
                          <option value="archived">Archivé</option>
                        </select>
                      </td>
                      <td>{new Date(msg.created_at).toLocaleDateString('fr-FR')}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="accept-btn"
                            onClick={() => handleAcceptMessage(msg)}
                            title="Accepter le projet"
                          >
                            <i className="fa-solid fa-check"></i>
                          </button>
                          <button 
                            className="view-btn"
                            onClick={() => handleViewMessage(msg)}
                            title="Voir détails"
                          >
                            <i className="fa-solid fa-eye"></i>
                          </button>
                          <button 
                            className="delete-btn"
                            onClick={() => handleDeleteMessage(msg.id, 'client')}
                            title="Supprimer"
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {getFilteredMessages(clientMessages.filter(msg => msg.domain !== 'student')).length === 0 && (
                <div className="no-data">Aucun message client trouvé</div>
              )}
            </div>
          </div>
        )}

        {/* Messages Étudiants */}
        {activeTab === 'students' && (
          <div className="messages-content">
            <div className="status-counters">
              <div className="counter-item">
                <span className="counter-label">Total:</span>
                <span className="counter-value">{clientMessages.filter(msg => msg.domain === 'student').length}</span>
              </div>
              <div className="counter-item">
                <span className="counter-label">Nouveaux:</span>
                <span className="counter-value new">{getStatusCount(clientMessages.filter(msg => msg.domain === 'student'), 'new')}</span>
              </div>
              <div className="counter-item">
                <span className="counter-label">En cours:</span>
                <span className="counter-value progress">{getStatusCount(clientMessages.filter(msg => msg.domain === 'student'), 'in_progress')}</span>
              </div>
              <div className="counter-item">
                <span className="counter-label">Terminés:</span>
                <span className="counter-value completed">{getStatusCount(clientMessages.filter(msg => msg.domain === 'student'), 'completed')}</span>
              </div>
            </div>
            <div className="messages-table">
              <table>
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Contact</th>
                    <th>Projet</th>
                    <th>Message</th>
                    <th>Statut</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredMessages(clientMessages.filter(msg => msg.domain === 'student')).map(msg => (
                    <tr key={msg.id}>
                      <td><strong>{msg.name}</strong></td>
                      <td>{msg.email}</td>
                      <td>{msg.contact}</td>
                      <td>{msg.project_type}</td>
                      <td style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {msg.message}
                      </td>
                      <td>
                        <select 
                          className="status-select"
                          value={msg.status}
                          onChange={(e) => handleStatusChange(msg.id, e.target.value, 'client')}
                        >
                          <option value="new">Nouveau</option>
                          <option value="read">Lu</option>
                          <option value="in_progress">En cours</option>
                          <option value="completed">Terminé</option>
                          <option value="archived">Archivé</option>
                        </select>
                      </td>
                      <td>{new Date(msg.created_at).toLocaleDateString('fr-FR')}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="accept-btn"
                            onClick={() => handleAcceptMessage(msg)}
                            title="Accepter le projet"
                          >
                            <i className="fa-solid fa-check"></i>
                          </button>
                          <button 
                            className="view-btn"
                            onClick={() => handleViewMessage(msg)}
                            title="Voir détails"
                          >
                            <i className="fa-solid fa-eye"></i>
                          </button>
                          <button 
                            className="delete-btn"
                            onClick={() => handleDeleteMessage(msg.id, 'client')}
                            title="Supprimer"
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {getFilteredMessages(clientMessages.filter(msg => msg.domain === 'student')).length === 0 && (
                <div className="no-data">Aucun message étudiant trouvé</div>
              )}
            </div>
          </div>
        )}

        {/* Messages Acceptés */}
        {activeTab === 'general' && (
          <div className="messages-content">
            <div className="filter-tabs">
              <button 
                className={generalMessageFilter === 'all' ? 'active' : ''}
                onClick={() => setGeneralMessageFilter('all')}
              >
                <i className="fa-solid fa-list"></i>
                Tous ({generalMessages.length})
              </button>
              <button 
                className={generalMessageFilter === 'client' ? 'active' : ''}
                onClick={() => setGeneralMessageFilter('client')}
              >
                <i className="fa-solid fa-briefcase"></i>
                Messages Clients ({generalMessages.filter(m => m.category === 'client').length})
              </button>
              <button 
                className={generalMessageFilter === 'student' ? 'active' : ''}
                onClick={() => setGeneralMessageFilter('student')}
              >
                <i className="fa-solid fa-graduation-cap"></i>
                Messages Étudiants ({generalMessages.filter(m => m.category === 'student').length})
              </button>
            </div>
            <div className="messages-table">
              <table>
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Contact</th>
                    <th>Sujet</th>
                    <th>Catégorie</th>
                    <th>Statut</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredGeneralMessages(generalMessages).map(msg => (
                    <tr key={msg.id}>
                      <td><strong>{msg.sender_name}</strong></td>
                      <td>{msg.sender_email}</td>
                      <td>
                        {msg.sender_contact ? (
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <a 
                              href={`tel:${msg.sender_contact}`}
                              style={{ color: '#667eea', textDecoration: 'none' }}
                              title="Appeler"
                            >
                              <i className="fa-solid fa-phone"></i>
                            </a>
                            <span>{msg.sender_contact}</span>
                            <a 
                              href={`https://wa.me/${msg.sender_contact.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: '#25D366', textDecoration: 'none' }}
                              title="WhatsApp"
                            >
                              <i className="fa-brands fa-whatsapp"></i>
                            </a>
                          </div>
                        ) : (
                          <span style={{ color: '#94a3b8' }}>N/A</span>
                        )}
                      </td>
                      <td>{msg.subject}</td>
                      <td>
                        <span className={`category-badge ${msg.category}`}>
                          {msg.category === 'student' ? '🎓 Étudiant' : '🏢 Client'}
                        </span>
                      </td>
                      <td>
                        <select 
                          className="status-select"
                          value={msg.status}
                          onChange={(e) => handleStatusChange(msg.id, e.target.value, 'general')}
                        >
                          <option value="new">Nouveau</option>
                          <option value="read">Lu</option>
                          <option value="replied">Répondu</option>
                          <option value="archived">Archivé</option>
                        </select>
                      </td>
                      <td>{new Date(msg.created_at).toLocaleDateString('fr-FR')}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="view-btn"
                            onClick={() => handleViewMessage(msg)}
                            title="Voir détails"
                          >
                            <i className="fa-solid fa-eye"></i>
                          </button>
                          <button 
                            className="delete-btn"
                            onClick={() => handleDeleteMessage(msg.id, 'general')}
                            title="Supprimer"
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {getFilteredGeneralMessages(generalMessages).length === 0 && (
                <div className="no-data">Aucun message accepté trouvé</div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Corbeille */}
      {activeTab === 'trash' && (
        <div className="messages-content trash-content">
          <div className="trash-info">
            <i className="fa-solid fa-info-circle"></i>
            <p>Les messages supprimés restent ici pendant 30 jours. Vous pouvez les restaurer ou les supprimer définitivement.</p>
          </div>

          {trashMessages.length === 0 ? (
            <div className="no-data">
              <i className="fa-solid fa-trash"></i>
              <p>La corbeille est vide</p>
            </div>
          ) : (
            <>
              {/* Bouton Vider la corbeille */}
              <div style={{ marginBottom: '1.5rem', textAlign: 'right' }}>
                <button className="empty-trash-btn" onClick={handleEmptyTrash}>
                  <i className="fa-solid fa-trash-can"></i>
                  Vider la corbeille
                </button>
              </div>

              {/* Liste des messages supprimés */}
              <div className="trash-messages-list">
                {getFilteredTrashMessages(trashMessages).map(msg => (
                  <div key={msg.id} className="trash-message-item">
                    <div className="trash-message-info">
                      <div className="trash-message-header">
                        <span className={`type-badge ${msg.original_type}`}>
                          {msg.original_type === 'client' ? 'Client' : 'Accepté'}
                        </span>
                        <strong>{msg.name}</strong>
                        <span className="trash-message-email">{msg.email}</span>
                      </div>
                      <div className="trash-message-details">
                        <span className="trash-message-subject">
                          {msg.original_type === 'client' 
                            ? `${msg.project_type} - ${msg.domain}`
                            : msg.subject
                          }
                        </span>
                        <span className="trash-message-date">
                          Supprimé le {new Date(msg.deleted_at).toLocaleString('fr-FR')}
                        </span>
                      </div>
                    </div>
                    <div className="trash-message-actions">
                      <button 
                        className="restore-btn"
                        onClick={() => handleRestoreMessage(msg.id)}
                        title="Restaurer le message"
                      >
                        <i className="fa-solid fa-rotate-left"></i>
                        Restaurer
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDeletePermanently(msg.id)}
                        title="Supprimer définitivement"
                      >
                        <i className="fa-solid fa-trash"></i>
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Portfolio */}
      {activeTab === 'portfolio' && (
        <div className="messages-content">
          <div className="portfolio-info">
            <i className="fa-solid fa-info-circle"></i>
            <p>Sélectionnez jusqu'à 6 projets à afficher dans votre portfolio visible aux clients</p>
          </div>

          {portfolio.length === 0 ? (
            <div className="no-data">
              <i className="fa-solid fa-images"></i>
              <p>Aucun projet dans le portfolio. Ajoutez-en un!</p>
            </div>
          ) : (
            <div className="portfolio-grid">
              {portfolio.map((item, index) => (
                <div key={item.id} className="portfolio-item">
                  {item.image_filename && (
                    <div className="portfolio-image">
                      <img src={`/images/${item.image_filename}`} alt={item.title} />
                    </div>
                  )}
                  <div className="portfolio-item-content">
                    <h3>{item.title}</h3>
                    {item.client_name && <p className="portfolio-client">👤 {item.client_name}</p>}
                    {item.category && <p className="portfolio-category">🏷️ {item.category}</p>}
                    <p className="portfolio-position">Position: {index + 1}/6</p>
                  </div>
                  <button 
                    className="delete-btn"
                    onClick={() => handleRemoveFromPortfolio(item.id)}
                    title="Retirer du portfolio"
                  >
                    <i className="fa-solid fa-trash"></i>
                    Retirer
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Projets */}
      {activeTab === 'projects' && (
        <div className="messages-content">
          <div className="projects-grid">
            {projects.map(project => (
              <div key={project.id} className="project-card">
                {project.image_url && (
                  <div className="project-image">
                    <img src={project.image_url} alt={project.title} />
                  </div>
                )}
                <div className="project-content">
                  <div className="project-header">
                    <h3>{project.title}</h3>
                    <span className={`status-badge badge-${project.status}`}>
                      {project.status === 'draft' ? 'Brouillon' : project.status === 'published' ? 'Publié' : 'Archivé'}
                    </span>
                  </div>
                  {project.client_name && (
                    <p className="project-client">👤 {project.client_name}</p>
                  )}
                  {project.category && (
                    <p className="project-category">🏷️ {project.category}</p>
                  )}
                  {project.description && (
                    <p className="project-description">{project.description.substring(0, 100)}...</p>
                  )}
                  {project.technologies && (
                    <p className="project-tech">💻 {project.technologies}</p>
                  )}
                  <div className="project-actions">
                    <button 
                      className="edit-btn"
                      onClick={() => openProjectModal(project)}
                      title="Modifier"
                    >
                      <i className="fa-solid fa-edit"></i>
                      Modifier
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteProject(project.id)}
                      title="Supprimer"
                    >
                      <i className="fa-solid fa-trash"></i>
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {projects.length === 0 && (
            <div className="no-data">
              <i className="fa-solid fa-briefcase"></i>
              <p>Aucun projet. Créez-en un!</p>
            </div>
          )}
        </div>
      )}

      {/* Modal Portfolio */}
      {showPortfolioModal && (
        <div className="modal-overlay" onClick={() => setShowPortfolioModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Ajouter au Portfolio</h2>
              <button className="modal-close" onClick={() => setShowPortfolioModal(false)}>
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Sélectionner un Projet *</label>
                <select
                  value={selectedProject?.id || ''}
                  onChange={(e) => {
                    const project = projects.find(p => p.id === parseInt(e.target.value));
                    setSelectedProject(project);
                  }}
                >
                  <option value="">-- Choisir un projet --</option>
                  {projects.filter(p => p.status === 'published').map(project => (
                    <option key={project.id} value={project.id}>
                      {project.title} ({project.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Image du Projet *</label>
                <div className="file-input-wrapper">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPortfolioImage(e.target.files[0])}
                    className="file-input"
                  />
                  <span className="file-label">
                    {portfolioImage ? portfolioImage.name : 'Cliquez pour sélectionner une image'}
                  </span>
                </div>
                <small>Formats acceptés: PNG, JPG, JPEG, GIF, WebP (Max 5MB)</small>
              </div>

              {portfolioImage && (
                <div className="image-preview">
                  <img src={URL.createObjectURL(portfolioImage)} alt="Aperçu" />
                </div>
              )}

              <div className="portfolio-count">
                <strong>Projets dans le portfolio: {portfolio.length}/6</strong>
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-btn secondary" onClick={() => setShowPortfolioModal(false)}>
                Annuler
              </button>
              <button 
                className="modal-btn primary" 
                onClick={handleAddToPortfolio}
                disabled={!selectedProject || !portfolioImage || portfolio.length >= 6}
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Projet */}
      {showProjectModal && (
        <div className="modal-overlay" onClick={closeProjectModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedProject ? 'Modifier le Projet' : 'Nouveau Projet'}</h2>
              <button className="modal-close" onClick={closeProjectModal}>
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Titre du Projet *</label>
                <input
                  type="text"
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({...projectForm, title: e.target.value})}
                  placeholder="Ex: Site Vitrine"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                  placeholder="Description du projet..."
                  rows="4"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Catégorie</label>
                  <input
                    type="text"
                    value={projectForm.category}
                    onChange={(e) => setProjectForm({...projectForm, category: e.target.value})}
                    placeholder="Ex: Site Vitrine"
                  />
                </div>
                <div className="form-group">
                  <label>Nom du Client</label>
                  <input
                    type="text"
                    value={projectForm.client_name}
                    onChange={(e) => setProjectForm({...projectForm, client_name: e.target.value})}
                    placeholder="Ex: Entreprise XYZ"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>URL de l'Image</label>
                  <input
                    type="text"
                    value={projectForm.image_url}
                    onChange={(e) => setProjectForm({...projectForm, image_url: e.target.value})}
                    placeholder="https://..."
                  />
                </div>
                <div className="form-group">
                  <label>URL du Projet</label>
                  <input
                    type="text"
                    value={projectForm.project_url}
                    onChange={(e) => setProjectForm({...projectForm, project_url: e.target.value})}
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Technologies</label>
                <input
                  type="text"
                  value={projectForm.technologies}
                  onChange={(e) => setProjectForm({...projectForm, technologies: e.target.value})}
                  placeholder="Ex: React, Node.js, MongoDB"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Statut</label>
                  <select
                    value={projectForm.status}
                    onChange={(e) => setProjectForm({...projectForm, status: e.target.value})}
                  >
                    <option value="draft">Brouillon</option>
                    <option value="published">Publié</option>
                    <option value="archived">Archivé</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Ordre d'Affichage</label>
                  <input
                    type="number"
                    value={projectForm.order_index}
                    onChange={(e) => setProjectForm({...projectForm, order_index: parseInt(e.target.value)})}
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="form-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={projectForm.featured}
                    onChange={(e) => setProjectForm({...projectForm, featured: e.target.checked})}
                  />
                  Mettre en avant (Projet vedette)
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-btn secondary" onClick={closeProjectModal}>
                Annuler
              </button>
              <button className="modal-btn primary" onClick={handleSaveProject}>
                {selectedProject ? 'Mettre à jour' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Message */}
      {showModal && selectedMessage && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Détails du message</h2>
              <button className="modal-close" onClick={closeModal}>
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <strong>Nom:</strong>
                <span>{selectedMessage.name || selectedMessage.sender_name}</span>
              </div>
              <div className="detail-row">
                <strong>Email:</strong>
                <span>{selectedMessage.email || selectedMessage.sender_email}</span>
              </div>
              <div className="detail-row">
                <strong>Contact:</strong>
                <span>{selectedMessage.contact || selectedMessage.sender_contact || 'N/A'}</span>
              </div>
              {selectedMessage.domain && (
                <div className="detail-row">
                  <strong>Domaine:</strong>
                  <span>{getDomainLabel(selectedMessage.domain)}</span>
                </div>
              )}
              {selectedMessage.project_type && (
                <div className="detail-row">
                  <strong>Type de projet:</strong>
                  <span>{selectedMessage.project_type}</span>
                </div>
              )}
              {selectedMessage.budget && (
                <div className="detail-row">
                  <strong>Budget:</strong>
                  <span>{selectedMessage.budget}</span>
                </div>
              )}
              {selectedMessage.deadline && (
                <div className="detail-row">
                  <strong>Délai:</strong>
                  <span>{selectedMessage.deadline}</span>
                </div>
              )}
              {selectedMessage.subject && (
                <div className="detail-row">
                  <strong>Sujet:</strong>
                  <span>{selectedMessage.subject}</span>
                </div>
              )}
              {selectedMessage.category && (
                <div className="detail-row">
                  <strong>Catégorie:</strong>
                  <span>{selectedMessage.category}</span>
                </div>
              )}
              <div className="detail-row">
                <strong>Statut:</strong>
                <span>{getStatusBadge(selectedMessage.status)}</span>
              </div>
              <div className="detail-row">
                <strong>Date:</strong>
                <span>{new Date(selectedMessage.created_at).toLocaleString('fr-FR')}</span>
              </div>
              <div className="detail-row full-width">
                <strong>Message:</strong>
                <p className="message-text">{selectedMessage.message}</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-btn secondary" onClick={closeModal}>
                Fermer
              </button>
              <button 
                className="modal-btn primary"
                onClick={() => {
                  handleStatusChange(selectedMessage.id, 'read', selectedMessage.domain ? 'client' : 'general');
                  closeModal();
                }}
              >
                Marquer comme lu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
