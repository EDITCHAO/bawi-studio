import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import './WhatsAppButton.css';

const WhatsAppButton = () => {
  const { language } = useLanguage();

  const text = {
    fr: 'Discutez avec nous',
    en: 'Chat with us'
  };

  const handleClick = () => {
    const phoneNumber = '22899253843'; // Votre numéro WhatsApp
    const message = language === 'fr' 
      ? 'Bonjour BAWI-STUDIO, je souhaite discuter d\'un projet...'
      : 'Hello BAWI-STUDIO, I would like to discuss a project...';
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="whatsapp-float">
      <button className="whatsapp-button" onClick={handleClick} aria-label="WhatsApp">
        <i className="fa-brands fa-whatsapp"></i>
      </button>
      <div className="whatsapp-tooltip">{text[language]}</div>
    </div>
  );
};

export default WhatsAppButton;
