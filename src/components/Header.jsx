import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './Header.css';

const Header = () => {
  const { language, t, toggleLanguage } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <nav className="nav">
          <div className="logo">BAWI-STUDIO</div>
          
          <ul className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
            <li><a href="#services" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.services')}</a></li>
            <li><a href="#portfolio" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.portfolio')}</a></li>
            <li><a href="#about" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.about')}</a></li>
            <li><a href="#contact" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.contact')}</a></li>
          </ul>

          <div className="nav-actions">
            <button className="lang-toggle" onClick={toggleLanguage}>
              {language === 'fr' ? 'EN' : 'FR'}
            </button>
            <a href="#contact" className="btn-primary">{t('nav.quote')}</a>
            <button 
              className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
