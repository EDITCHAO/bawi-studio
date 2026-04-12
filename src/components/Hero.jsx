import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import './Hero.css';

const Hero = () => {
  const { language } = useLanguage();

  const content = {
    fr: {
      title: 'Nous développons les solutions digitales de demain',
      subtitle: 'Expertise en développement web, mobile et logiciel depuis Lomé, Togo - Au service de toute l\'Afrique de l\'Ouest',
      cta: 'Contactez-nous',
      cards: [
        {
          icon: 'fa-solid fa-desktop',
          title: 'Développement Web',
          desc: 'Sites vitrines, E-commerce, applications sur mesure'
        },
        {
          icon: 'fa-solid fa-mobile-screen',
          title: 'Développement Mobile',
          desc: 'Applications iOS, Android, Multiplateforme'
        },
        {
          icon: 'fa-solid fa-pen-nib',
          title: 'Design UI/UX',
          desc: 'Interfaces modernes, intuitives et conviviales et sécurisées'
        }
      ]
    },
    en: {
      title: 'We Build Tomorrow\'s Digital Solutions',
      subtitle: 'Expertise in web, mobile and software development from Lomé, Togo - Serving all of West Africa',
      cta: 'Contact Us',
      cards: [
        {
          icon: 'fa-solid fa-desktop',
          title: 'Web Development',
          desc: 'Showcase sites, E-commerce, custom applications'
        },
        {
          icon: 'fa-solid fa-mobile-screen',
          title: 'Mobile Development',
          desc: 'iOS, Android, Cross-platform applications'
        },
        {
          icon: 'fa-solid fa-pen-nib',
          title: 'UI/UX Design',
          desc: 'Modern, intuitive, user-friendly and secure interfaces'
        }
      ]
    }
  };

  const currentContent = content[language] || content['fr'];

  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <h1 className="hero-title">{currentContent.title}</h1>
          <p className="hero-subtitle">{currentContent.subtitle}</p>
          <a href="#contact" className="hero-cta">{currentContent.cta}</a>
        </div>
        <div className="hero-visual">
          {currentContent.cards.map((card, index) => (
            <div key={index} className={`floating-card card-${index + 1}`}>
              <div className="card-icon-bg">
                <i className={card.icon}></i>
              </div>
              <h3 className="card-title">{card.title}</h3>
              <p className="card-desc">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
