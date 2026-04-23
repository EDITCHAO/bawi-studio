import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import './Services.css';

const Services = () => {
  const { t } = useLanguage();

  const services = [
    { key: 'web', icon: 'fa-solid fa-globe' },
    { key: 'mobile', icon: 'fa-solid fa-mobile-screen-button' },
    { key: 'software', icon: 'fa-solid fa-laptop-code' },
    { key: 'maintenance', icon: 'fa-solid fa-screwdriver-wrench' },
    { key: 'academic', icon: 'fa-solid fa-graduation-cap' }
  ];

  return (
    <section id="services" className="services">
      <div className="container">
        <h2 className="section-title">{t('services.title')}</h2>
        <div className="services-grid">
          {services.map(service => (
            <div key={service.key} className="service-card">
              <div className="service-icon">
                <i className={service.icon}></i>
              </div>
              <h3>{t(`services.${service.key}.title`)}</h3>
              <p>{t(`services.${service.key}.desc`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
