import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import './Portfolio.css';

const Portfolio = () => {
  const { language } = useLanguage();

  const content = {
    fr: {
      title: 'Nos Réalisations',
      subtitle: 'Découvrez quelques projets que nous avons réalisés avec passion',
      projects: [
        {
          title: 'E-Shop Afrique',
          category: 'E-commerce',
          desc: 'Plateforme e-commerce complète avec paiement mobile et gestion des stocks',
          tech: ['React', 'Node.js', 'MongoDB'],
          color: '#6366f1',
          image: '/images/E-commerce.jpeg'
        },
        {
          title: 'MediCare App',
          category: 'Application Mobile',
          desc: 'Application de prise de rendez-vous médicaux avec géolocalisation',
          tech: ['React Native', 'Firebase'],
          color: '#8b5cf6',
          image: '/images/Application%20Mobile.jpeg'
        },
        {
          title: 'EduLearn Platform',
          category: 'Plateforme Web',
          desc: 'Plateforme d\'apprentissage en ligne avec cours vidéo et quiz interactifs',
          tech: ['Vue.js', 'Laravel', 'MySQL'],
          color: '#ec4899',
          image: '/images/Plateforme%20Web.jpeg'
        },
        {
          title: 'AgriTech Dashboard',
          category: 'Dashboard',
          desc: 'Tableau de bord pour la gestion agricole avec analyse de données',
          tech: ['React', 'Python', 'PostgreSQL'],
          color: '#14b8a6',
          image: '/images/Dashboard.jpeg'
        },
        {
          title: 'BankPro Mobile',
          category: 'Fintech',
          desc: 'Application bancaire mobile avec transferts et paiements sécurisés',
          tech: ['Flutter', 'Node.js'],
          color: '#f59e0b',
          image: '/images/Fintech.jpeg'
        },
        {
          title: 'RestoPro',
          category: 'Site Vitrine',
          desc: 'Site vitrine moderne pour chaîne de restaurants avec réservation en ligne',
          tech: ['Next.js', 'Tailwind'],
          color: '#ef4444',
          image: '/images/Site%20Vitrine.jpeg'
        }
      ]
    },
    en: {
      title: 'Our Work',
      subtitle: 'Discover some projects we have completed with passion',
      projects: [
        {
          title: 'E-Shop Africa',
          category: 'E-commerce',
          desc: 'Complete e-commerce platform with mobile payment and inventory management',
          tech: ['React', 'Node.js', 'MongoDB'],
          color: '#6366f1',
          image: '/images/E-commerce.jpeg'
        },
        {
          title: 'MediCare App',
          category: 'Mobile App',
          desc: 'Medical appointment booking app with geolocation',
          tech: ['React Native', 'Firebase'],
          color: '#8b5cf6',
          image: '/images/Application%20Mobile.jpeg'
        },
        {
          title: 'EduLearn Platform',
          category: 'Web Platform',
          desc: 'Online learning platform with video courses and interactive quizzes',
          tech: ['Vue.js', 'Laravel', 'MySQL'],
          color: '#ec4899',
          image: '/images/Plateforme%20Web.jpeg'
        },
        {
          title: 'AgriTech Dashboard',
          category: 'Dashboard',
          desc: 'Agricultural management dashboard with data analysis',
          tech: ['React', 'Python', 'PostgreSQL'],
          color: '#14b8a6',
          image: '/images/Dashboard.jpeg'
        },
        {
          title: 'BankPro Mobile',
          category: 'Fintech',
          desc: 'Mobile banking app with secure transfers and payments',
          tech: ['Flutter', 'Node.js'],
          color: '#f59e0b',
          image: '/images/Fintech.jpeg'
        },
        {
          title: 'RestoPro',
          category: 'Showcase Site',
          desc: 'Modern showcase site for restaurant chain with online booking',
          tech: ['Next.js', 'Tailwind'],
          color: '#ef4444',
          image: '/images/Site%20Vitrine.jpeg'
        }
      ]
    }
  };

  const t = content[language];

  return (
    <section id="portfolio" className="portfolio">
      <div className="container">
        <h2 className="section-title">{t.title}</h2>
        <p className="portfolio-subtitle">{t.subtitle}</p>
        <div className="portfolio-grid">
          {t.projects.map((project, index) => (
            <div key={index} className="portfolio-card">
              <div 
                className="portfolio-image" 
                style={project.image 
                  ? { backgroundImage: `url(${project.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                  : { background: `linear-gradient(135deg, ${project.color} 0%, ${project.color}dd 100%)` }
                }
              >
                <div className="portfolio-overlay">
                  <span className="portfolio-category">{project.category}</span>
                </div>
              </div>
              <div className="portfolio-content">
                <h3 className="portfolio-title">{project.title}</h3>
                <p className="portfolio-desc">{project.desc}</p>
                <div className="portfolio-tech">
                  {project.tech.map((tech, i) => (
                    <span key={i} className="tech-badge">{tech}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
