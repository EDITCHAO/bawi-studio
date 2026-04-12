import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config';
import './PortfolioManager.css';

const PortfolioManager = ({ token }) => {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    category: 'web',
    technologies: '',
    link: '',
    order_index: 0
  });

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(API_ENDPOINTS.adminPortfolios, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération');
      }

      const data = await response.json();
      setPortfolios(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'order_index' ? (parseInt(value) || 0) : value
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        setError('Veuillez sélectionner une image valide');
        return;
      }

      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('L\'image ne doit pas dépasser 5MB');
        return;
      }

      // Créer un aperçu
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Uploader l'image sur Supabase Storage via le backend
      setUploading(true);
      try {
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);

        const response = await fetch(`${API_ENDPOINTS.adminPortfolios}/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formDataUpload
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erreur lors de l\'upload');
        }

        const data = await response.json();
        console.log('✅ Image uploadée:', data.imageUrl);
        setFormData(prev => ({
          ...prev,
          image_url: data.imageUrl
        }));
        setError('');
      } catch (err) {
        console.error('❌ Erreur upload:', err);
        setError(`Erreur upload: ${err.message}`);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    console.log('📝 Soumission du formulaire:', formData);

    if (!formData.title || !formData.description) {
      setError('Titre et description sont requis');
      return;
    }

    if (!editingId && !formData.image_url) {
      setError('Une image est requise pour une nouvelle réalisation');
      return;
    }

    try {
      const url = editingId 
        ? `${API_ENDPOINTS.adminPortfolios}/${editingId}`
        : API_ENDPOINTS.adminPortfolios;

      const method = editingId ? 'PUT' : 'POST';

      console.log(`🚀 Envoi ${method} vers:`, url);
      console.log('📦 Données:', formData);

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      console.log('📨 Réponse status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Erreur serveur:', errorData);
        throw new Error(errorData.error || 'Erreur lors de la sauvegarde');
      }

      const result = await response.json();
      console.log('✅ Succès:', result);

      await fetchPortfolios();
      setShowForm(false);
      setEditingId(null);
      setImagePreview('');
      setFormData({
        title: '',
        description: '',
        image_url: '',
        category: 'web',
        technologies: '',
        link: '',
        order_index: 0
      });
    } catch (err) {
      console.error('❌ Erreur complète:', err);
      setError(err.message);
    }
  };

  const handleEdit = (portfolio) => {
    setFormData({
      title: portfolio.title,
      description: portfolio.description,
      image_url: portfolio.image_url || '',
      category: portfolio.category || 'web',
      technologies: portfolio.technologies || '',
      link: portfolio.link || '',
      order_index: portfolio.order_index || 0
    });
    setImagePreview(portfolio.image_url || '');
    setEditingId(portfolio.id);
    setShowForm(true);
    setError('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce portfolio ?')) {
      return;
    }

    try {
      const response = await fetch(`${API_ENDPOINTS.adminPortfolios}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      await fetchPortfolios();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setImagePreview('');
    setFormData({
      title: '',
      description: '',
      image_url: '',
      category: 'web',
      technologies: '',
      link: '',
      order_index: 0
    });
    setError('');
  };

  return (
    <div className="portfolio-manager">
      <div className="portfolio-header">
        <h2>
          <i className="fa-solid fa-images"></i> Gestion des Réalisations
        </h2>
        <button 
          onClick={() => {
            setShowForm(!showForm);
            if (showForm) {
              handleCancel();
            }
          }}
          className="btn-add-portfolio"
        >
          <i className="fa-solid fa-plus"></i> {showForm ? 'Fermer' : 'Ajouter une réalisation'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="portfolio-form-container">
          <form onSubmit={handleSubmit} className="portfolio-form">
            <h3>{editingId ? 'Modifier' : 'Ajouter'} une réalisation</h3>

            <div className="form-group">
              <label>Titre *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Titre du projet"
                required
              />
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Description détaillée du projet"
                rows="4"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Image du projet *</label>
                <div className="image-upload-container">
                  <input
                    type="file"
                    id="image-input"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="image-input"
                  />
                  <label htmlFor="image-input" className="image-upload-label">
                    <i className="fa-solid fa-cloud-arrow-up"></i>
                    <span>{uploading ? 'Upload en cours...' : 'Cliquez pour sélectionner une image'}</span>
                  </label>
                </div>
                {imagePreview && (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Aperçu" />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Catégorie</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="web">Web</option>
                  <option value="mobile">Mobile</option>
                  <option value="design">Design</option>
                  <option value="other">Autre</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Technologies</label>
                <input
                  type="text"
                  name="technologies"
                  value={formData.technologies}
                  onChange={handleInputChange}
                  placeholder="React, Node.js, MongoDB"
                />
              </div>

              <div className="form-group">
                <label>Lien du projet <span className="optional">(optionnel)</span></label>
                <input
                  type="url"
                  name="link"
                  value={formData.link}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Ordre d'affichage</label>
              <input
                type="number"
                name="order_index"
                value={formData.order_index}
                onChange={handleInputChange}
                min="0"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-save">
                <i className="fa-solid fa-save"></i> Enregistrer
              </button>
              <button type="button" onClick={handleCancel} className="btn-cancel">
                <i className="fa-solid fa-times"></i> Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="portfolios-list">
        {loading ? (
          <p className="loading">Chargement...</p>
        ) : portfolios.length === 0 ? (
          <p className="no-portfolios">Aucune réalisation pour le moment</p>
        ) : (
          <div className="portfolios-grid">
            {portfolios.map(portfolio => (
              <div key={portfolio.id} className="portfolio-card">
                {portfolio.image_url && (
                  <div className="portfolio-image">
                    <img src={portfolio.image_url} alt={portfolio.title} />
                  </div>
                )}

                <div className="portfolio-content">
                  <div className="portfolio-header-card">
                    <h4>{portfolio.title}</h4>
                    <span className="portfolio-category">{portfolio.category}</span>
                  </div>

                  <p className="portfolio-description">{portfolio.description}</p>

                  {portfolio.technologies && (
                    <div className="portfolio-tech">
                      <strong>Tech:</strong> {portfolio.technologies}
                    </div>
                  )}

                  {portfolio.link && portfolio.link.trim() !== '' && (
                    <div className="portfolio-link">
                      <a href={portfolio.link} target="_blank" rel="noopener noreferrer">
                        <i className="fa-solid fa-external-link"></i> Voir le projet
                      </a>
                    </div>
                  )}

                  <div className="portfolio-order">
                    <small>Ordre: {portfolio.order_index}</small>
                  </div>
                </div>

                <div className="portfolio-actions">
                  <button
                    onClick={() => handleEdit(portfolio)}
                    className="btn-edit"
                    title="Modifier"
                  >
                    <i className="fa-solid fa-edit"></i>
                  </button>
                  <button
                    onClick={() => handleDelete(portfolio.id)}
                    className="btn-delete"
                    title="Supprimer"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioManager;
