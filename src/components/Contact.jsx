import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { API_ENDPOINTS } from '../config';
import { getCountryCodeOptions } from '../data/countryCodes';
import './Contact.css';

const Contact = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    countryCode: '+228', // Togo par défaut
    contact: '',
    domain: '',
    customDomain: '',
    projectType: '',
    budget: '',
    deadline: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isStudent = formData.domain === 'student';
  const isOtherDomain = formData.domain === 'other';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setStatus({ type: '', message: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      if (!formData.name || !formData.email || !formData.message) {
        throw new Error('Veuillez remplir tous les champs requis');
      }

      if (formData.message.length < 10) {
        throw new Error('Le message doit contenir au moins 10 caractères');
      }

      // Créer un FormData pour envoyer les données
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('email', formData.email);
      submitData.append('contact', `${formData.countryCode}${formData.contact}`);
      submitData.append('domain', formData.domain === 'other' ? formData.customDomain : formData.domain);
      submitData.append('projectType', formData.projectType);
      submitData.append('budget', formData.budget);
      submitData.append('deadline', formData.deadline);
      submitData.append('message', formData.message);

      console.log('📤 Envoi du formulaire vers:', API_ENDPOINTS.contact);

      const response = await fetch(API_ENDPOINTS.contact, {
        method: 'POST',
        body: submitData
      });

      console.log('📥 Réponse reçue:', response.status, response.statusText);

      let result;
      try {
        const responseText = await response.text();
        console.log('📄 Texte de réponse:', responseText);
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('❌ Erreur parsing JSON:', parseError);
        throw new Error('Erreur serveur: réponse invalide');
      }

      if (response.ok && result.success) {
        setStatus({ type: 'success', message: t('contact.success') });
        setFormData({ 
          name: '', 
          email: '', 
          countryCode: '+228',
          contact: '', 
          domain: '', 
          customDomain: '',
          projectType: '', 
          budget: '', 
          deadline: '', 
          message: '' 
        });
      } else {
        const errorMessage = result.error || result.message || 'Erreur d\'envoi';
        console.error('❌ Erreur du serveur:', errorMessage);
        throw new Error(errorMessage);
      }

    } catch (error) {
      console.error('❌ Erreur complète:', error);
      setStatus({ type: 'error', message: error.message || t('contact.error') });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="contact">
      <div className="container">
        <h2 className="section-title">{t('contact.title')}</h2>
        <p className="contact-subtitle">{t('contact.subtitle')}</p>

        <div className="contact-wrapper">
          <form className="contact-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder={t('contact.name') + ' *'}
              value={formData.name}
              onChange={handleChange}
              required
              minLength="2"
            />
            <input
              type="email"
              name="email"
              placeholder={t('contact.email') + ' *'}
              value={formData.email}
              onChange={handleChange}
              required
            />
            
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <select
                name="countryCode"
                value={formData.countryCode}
                onChange={handleChange}
                style={{ 
                  padding: '1rem', 
                  border: '2px solid #e2e8f0', 
                  borderRadius: '8px', 
                  fontSize: '1rem', 
                  fontFamily: 'inherit',
                  minWidth: '150px',
                  flex: '0 0 auto'
                }}
              >
                {getCountryCodeOptions().map((option, index) => (
                  <option key={index} value={option.code}>
                    {option.flag} {option.code} - {option.country}
                  </option>
                ))}
              </select>
              
              <input
                type="tel"
                name="contact"
                placeholder={t('contact.contactNumber') + ' *'}
                value={formData.contact}
                onChange={handleChange}
                required
                minLength="8"
                title="Entrez un numéro de téléphone valide (minimum 8 chiffres)"
                style={{ flex: '1' }}
              />
            </div>
            
            <select
              name="domain"
              value={formData.domain}
              onChange={handleChange}
              required
              style={{ padding: '1rem', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem', fontFamily: 'inherit' }}
            >
              <option value="">{t('contact.domain')} *</option>
              <option value="company">{t('contact.domainCompany')}</option>
              <option value="student">{t('contact.domainStudent')}</option>
              <option value="individual">{t('contact.domainIndividual')}</option>
              <option value="ngo">{t('contact.domainNGO')}</option>
              <option value="other">Autre</option>
            </select>

            {isOtherDomain && (
              <input
                type="text"
                name="customDomain"
                placeholder="Précisez votre domaine d'activité *"
                value={formData.customDomain}
                onChange={handleChange}
                required
                style={{ padding: '1rem', border: '2px solid #667eea', borderRadius: '8px', fontSize: '1rem', fontFamily: 'inherit', background: '#f0f4ff' }}
              />
            )}

            <select
              name="projectType"
              value={formData.projectType}
              onChange={handleChange}
              required
              style={{ padding: '1rem', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem', fontFamily: 'inherit' }}
            >
              <option value="">{t('contact.projectType')} *</option>
              <option value="web">{t('contact.projectWeb')}</option>
              <option value="mobile">{t('contact.projectMobile')}</option>
              <option value="design">{t('contact.projectDesign')}</option>
              <option value="other">{t('contact.projectOther')}</option>
            </select>

            <select
              name="budget"
              value={formData.budget}
              onChange={(e) => setFormData({...formData, budget: e.target.value})}
              required={!isStudent}
              disabled={isStudent}
              style={{ 
                padding: '1rem', 
                border: '2px solid #e2e8f0', 
                borderRadius: '8px', 
                fontSize: '1rem', 
                fontFamily: 'inherit',
                opacity: isStudent ? 0.5 : 1,
                cursor: isStudent ? 'not-allowed' : 'pointer',
                background: isStudent ? '#f5f5f5' : 'var(--white)'
              }}
            >
              <option value="">{isStudent ? t('contact.budgetNA') : t('contact.budget')}</option>
              {!isStudent && (
                <>
                  <option value="small">{t('contact.budgetSmall')}</option>
                  <option value="medium">{t('contact.budgetMedium')}</option>
                  <option value="large">{t('contact.budgetLarge')}</option>
                  <option value="discuss">{t('contact.budgetDiscuss')}</option>
                </>
              )}
            </select>

            <select
              name="deadline"
              value={formData.deadline}
              onChange={(e) => setFormData({...formData, deadline: e.target.value})}
              required={!isStudent}
              disabled={isStudent}
              style={{ 
                padding: '1rem', 
                border: '2px solid #e2e8f0', 
                borderRadius: '8px', 
                fontSize: '1rem', 
                fontFamily: 'inherit',
                opacity: isStudent ? 0.5 : 1,
                cursor: isStudent ? 'not-allowed' : 'pointer',
                background: isStudent ? '#f5f5f5' : 'var(--white)'
              }}
            >
              <option value="">{isStudent ? t('contact.deadlineNA') : t('contact.deadline')}</option>
              {!isStudent && (
                <>
                  <option value="urgent">{t('contact.deadlineUrgent')}</option>
                  <option value="normal">{t('contact.deadlineNormal')}</option>
                  <option value="flexible">{t('contact.deadlineFlexible')}</option>
                </>
              )}
            </select>

            <textarea
              name="message"
              placeholder={t('contact.message') + ' *'}
              value={formData.message}
              onChange={handleChange}
              rows="5"
              required
              minLength="10"
            />
            
            {status.message && (
              <div className={`status-message ${status.type}`}>
                {status.message}
              </div>
            )}

            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? t('contact.sending') : t('contact.send')}
            </button>
          </form>

          <div className="contact-info">
            <h3>{t('contact.info')}</h3>
            <div className="info-item">
              <span className="info-icon">
                <i className="fa-solid fa-envelope"></i>
              </span>
              <span>editchaosam@gmail.com</span>
            </div>
            <div className="info-item">
              <span className="info-icon">
                <i className="fa-solid fa-phone"></i>
              </span>
              <span>+228 99 25 38 43</span>
            </div>
            <div className="info-item">
              <span className="info-icon">
                <i className="fa-brands fa-whatsapp"></i>
              </span>
              <span>WhatsApp: +228 99 25 38 43</span>
            </div>
            <div className="info-item">
              <span className="info-icon">
                <i className="fa-solid fa-location-dot"></i>
              </span>
              <span>Lomé, Togo</span>
            </div>
            <div className="social-links">
              <a href="https://wa.me/22899253843" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <i className="fa-brands fa-whatsapp"></i>
              </a>
              <a href="mailto:editchaosam@gmail.com" aria-label="Email">
                <i className="fa-solid fa-envelope"></i>
              </a>
              <a href="#" aria-label="LinkedIn">
                <i className="fa-brands fa-linkedin"></i>
              </a>
              <a href="#" aria-label="Facebook">
                <i className="fa-brands fa-facebook"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
