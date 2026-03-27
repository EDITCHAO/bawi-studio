import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import './WhyUs.css';

const WhyUs = () => {
  const { language } = useLanguage();

  const content = {
    fr: {
      title: 'Pourquoi BAWI-STUDIO ?',
      cards: [
        {
          icon: 'fa-solid fa-desktop',
          title: 'Développement Web',
          desc: 'Sites vitrines, E-commerce, applications sur mesure'
        },
        {
          icon: 'fa-solid fa-mobile-screen',
          title: 'Applications Mobiles',
          desc: 'iOS et Android pour une expérience nomade'
        },
        {
          icon: 'fa-solid fa-pen-nib',
          title: 'Design UI/UX',
          desc: 'Interfaces modernes, intuitives et centrées sur l\'utilisateur'
        }
      ]
    },
    en: {
      title: 'Why BAWI-STUDIO?',
      cards: [
        {
          icon: 'fa-solid fa-desktop',
          title: 'Web Development',
          desc: 'Showcase sites, E-commerce, custom applications'
        },
        {
          icon: 'fa-solid fa-mobile-screen',
          title: 'Mobile Applications',
          desc: 'iOS and Android for a mobile experience'
        },
        {
          icon: 'fa-solid fa-pen-nib',
          title: 'UI/UX Design',
          desc: 'Modern, intuitive and user-centered interfaces'
        }
      ]
    }
  };

  const t = content[language];

  return (
    <section className="why-us">
      <div className="container">
        <h2 className="section-title">{t.title}</h2>
        
        <div className="why-cards-grid">
          {t.cards.map((card, index) => (
            <div key={index} className="why-card">
              <div className="why-card-icon-wrapper">
                <i className={card.icon}></i>
              </div>
              <h3 className="why-card-title">{card.title}</h3>
              <p className="why-card-desc">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
