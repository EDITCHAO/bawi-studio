import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { API_ENDPOINTS } from '../config';
import './Contact.css';

const Contact = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    domain: '',
    projectType: '',
    budget: '',
    deadline: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isStudent = formData.domain === 'student';

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

      const response = await fetch(API_ENDPOINTS.contact, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setStatus({ type: 'success', message: t('contact.success') });
        setFormData({ 
          name: '', 
          email: '', 
          contact: '', 
          domain: '', 
          projectType: '', 
          budget: '', 
          deadline: '', 
          message: '' 
        });
      } else {
        throw new Error(result.error || 'Erreur d\'envoi');
      }

    } catch (error) {
      console.error('Erreur:', error);
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
            <input
              type="tel"
              name="contact"
              placeholder={t('contact.contactNumber') + ' *'}
              value={formData.contact}
              onChange={handleChange}
              required
              minLength="8"
              title="Entrez un numéro de téléphone valide (minimum 8 chiffres)"
            />
            
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
            </select>
            
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
