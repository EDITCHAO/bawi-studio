import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { API_ENDPOINTS } from '../config';
import ImageModal from './ImageModal';
import './Portfolio.css';

const Portfolio = () => {
  const { language } = useLanguage();
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const content = {
    fr: {
      title: 'Nos Réalisations',
      subtitle: 'Découvrez quelques projets que nous avons réalisés avec passion'
    },
    en: {
      title: 'Our Work',
      subtitle: 'Discover some projects we have completed with passion'
    }
  };

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.portfolios);
      if (response.ok) {
        const data = await response.json();
        console.log('📊 Portfolios chargés:', data);
        setPortfolios(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des portfolios:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    
    // Si c'est une URL complète (http/https), la retourner telle quelle
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    // Si c'est un chemin relatif, le retourner tel quel (Vite le gérera)
    return imageUrl;
  };

  const openImageModal = (imageUrl, title) => {
    setSelectedImage({ url: imageUrl, title });
    setIsModalOpen(true);
  };

  const closeImageModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  const t = content[language];
  const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b', '#ef4444'];

  return (
    <section id="portfolio" className="portfolio">
      <div className="container">
        <h2 className="section-title">{t.title}</h2>
        <p className="portfolio-subtitle">{t.subtitle}</p>
        <div className="portfolio-grid">
          {loading ? (
            <p style={{ textAlign: 'center', gridColumn: '1 / -1' }}>Chargement...</p>
          ) : portfolios.length === 0 ? (
            <p style={{ textAlign: 'center', gridColumn: '1 / -1' }}>Aucune réalisation pour le moment</p>
          ) : (
            portfolios.map((project, index) => {
              const imageUrl = getImageUrl(project.image_url);
              console.log('🖼️ Image pour', project.title, ':', imageUrl);
              
              return (
                <div key={project.id} className="portfolio-card">
                  <div 
                    className="portfolio-image" 
                    style={imageUrl 
                      ? { backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                      : { background: `linear-gradient(135deg, ${colors[index % colors.length]} 0%, ${colors[index % colors.length]}dd 100%)` }
                    }
                    onClick={() => imageUrl && openImageModal(imageUrl, project.title)}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && imageUrl) {
                        openImageModal(imageUrl, project.title);
                      }
                    }}
                  >
                    <div className="portfolio-overlay">
                      <span className="portfolio-category">{project.category}</span>
                      {imageUrl && <div className="portfolio-zoom-icon"><i className="fa-solid fa-magnifying-glass-plus"></i></div>}
                    </div>
                  </div>
                  <div className="portfolio-content">
                    <h3 className="portfolio-title">{project.title}</h3>
                    <p className="portfolio-desc">{project.description}</p>
                    {project.technologies && (
                      <div className="portfolio-tech">
                        {project.technologies.split(',').map((tech, i) => (
                          <span key={i} className="tech-badge">{tech.trim()}</span>
                        ))}
                      </div>
                    )}
                    {project.link && project.link.trim() !== '' && (
                      <div style={{ marginTop: '10px' }}>
                        <a 
                          href={project.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 'bold' }}
                        >
                          Voir le projet →
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <ImageModal 
        isOpen={isModalOpen}
        imageUrl={selectedImage?.url}
        title={selectedImage?.title}
        onClose={closeImageModal}
      />
    </section>
  );
};

export default Portfolio;
