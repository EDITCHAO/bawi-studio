import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import './Footer.css';

const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">BAWI-STUDIO</div>
            <p>Solutions digitales depuis Lomé, Togo</p>
            <p>Au service de l'Afrique de l'Ouest</p>
          </div>

          <div className="footer-section">
            <h4>{t('footer.links')}</h4>
            <ul>
              <li><a href="#services">{t('nav.services')}</a></li>
              <li><a href="#portfolio">{t('nav.portfolio')}</a></li>
              <li><a href="#about">{t('nav.about')}</a></li>
              <li><a href="#contact">{t('nav.contact')}</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact</h4>
            <p><i className="fa-solid fa-envelope"></i> editchaosam@gmail.com</p>
            <p><i className="fa-solid fa-phone"></i> +228 99 25 38 43</p>
            <p><i className="fa-brands fa-whatsapp"></i> +228 99 25 38 43</p>
            <p><i className="fa-solid fa-location-dot"></i> Lomé, Togo</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} BAWI-STUDIO. {t('footer.rights')}.</p>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <a href="#">{t('footer.legal')}</a>
            <a 
              href="/admin" 
              style={{ 
                opacity: 0.3, 
                fontSize: '0.85rem',
                transition: 'opacity 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.opacity = '1'}
              onMouseLeave={(e) => e.target.style.opacity = '0.3'}
            >
              <i className="fa-solid fa-shield-halved"></i> Admin
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
