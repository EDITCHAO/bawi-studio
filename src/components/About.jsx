import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import './About.css';

const About = () => {
  const { t } = useLanguage();

  return (
    <section id="about" className="about">
      <div className="container">
        <h2 className="section-title">{t('about.title')}</h2>
        
        <div className="about-content">
          <div className="about-block">
            <h3>{t('about.mission')}</h3>
            <p>{t('about.missionText')}</p>
          </div>
          
          <div className="about-block">
            <h3>{t('about.vision')}</h3>
            <p>{t('about.visionText')}</p>
          </div>
        </div>

        <div className="values">
          <h3>{t('about.values')}</h3>
          <div className="values-grid">
            <div className="value-item">
              <span className="value-icon">
                <i className="fa-solid fa-lightbulb"></i>
              </span>
              <span>{t('about.innovation')}</span>
            </div>
            <div className="value-item">
              <span className="value-icon">
                <i className="fa-solid fa-star"></i>
              </span>
              <span>{t('about.excellence')}</span>
            </div>
            <div className="value-item">
              <span className="value-icon">
                <i className="fa-solid fa-handshake"></i>
              </span>
              <span>{t('about.integrity')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
