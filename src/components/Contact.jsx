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
    customDomain: '',
    projectType: '',
    budget: '',
    deadline: '',
    message: ''
  });
  const [cahierDeCharge, setCahierDeCharge] = useState(null);
  const [cahierDeChargePreview, setCahierDeChargePreview] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isStudent = formData.domain === 'student';
  const isOtherDomain = formData.domain === 'other';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setStatus({ type: '', message: '' });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier le type de fichier
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/plain'];
      
      if (!allowedTypes.includes(file.type)) {
        setStatus({ type: 'error', message: 'Format de fichier non autorisé. Acceptés: PDF, Word, Excel, TXT' });
        return;
      }

      // Vérifier la taille (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setStatus({ type: 'error', message: 'Le fichier ne doit pas dépasser 10MB' });
        return;
      }

      setCahierDeCharge(file);
      setCahierDeChargePreview(file.name);
      setStatus({ type: '', message: '' });
    }
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

      // Créer un FormData pour envoyer le fichier
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('email', formData.email);
      submitData.append('contact', formData.contact);
      submitData.append('domain', formData.domain === 'other' ? formData.customDomain : formData.domain);
      submitData.append('projectType', formData.projectType);
      submitData.append('budget', formData.budget);
      submitData.append('deadline', formData.deadline);
      submitData.append('message', formData.message);
      
      // Ajouter le fichier s'il existe
      if (cahierDeCharge) {
        submitData.append('cahierDeCharge', cahierDeCharge);
      }

      const response = await fetch(API_ENDPOINTS.contact, {
        method: 'POST',
        body: submitData
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setStatus({ type: 'success', message: t('contact.success') });
        setFormData({ 
          name: '', 
          email: '', 
          contact: '', 
          domain: '', 
          customDomain: '',
          projectType: '', 
          budget: '', 
          deadline: '', 
          message: '' 
        });
        setCahierDeCharge(null);
        setCahierDeChargePreview('');
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

            <div className="file-upload-section">
              <label htmlFor="cahierDeCharge" className="file-upload-label">
                <i className="fa-solid fa-file-upload"></i> Cahier de charge (optionnel)
              </label>
              <input
                type="file"
                id="cahierDeCharge"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                style={{ display: 'none' }}
              />
              <label htmlFor="cahierDeCharge" className="file-upload-btn">
                <i className="fa-solid fa-cloud-arrow-up"></i> Choisir un fichier
              </label>
              {cahierDeChargePreview && (
                <div className="file-preview">
                  <i className="fa-solid fa-file-check"></i>
                  <span>{cahierDeChargePreview}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setCahierDeCharge(null);
                      setCahierDeChargePreview('');
                    }}
                    className="file-remove-btn"
                  >
                    <i className="fa-solid fa-times"></i>
                  </button>
                </div>
              )}
            </div>
            
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
