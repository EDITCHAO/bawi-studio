import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import './AcademicSection.css';

const AcademicSection = () => {
  const { language } = useLanguage();

  const content = {
    fr: {
      title: '🎓 Étudiants : Nous vous accompagnons !',
      subtitle: 'Besoin d\'aide pour votre projet de fin d\'études ?',
      description: 'Nous accompagnons les étudiants (BTS, Licence, Master) dans la réalisation de leurs projets web et mobile. Que ce soit pour un site vitrine, une application mobile ou un système complet, nous sommes là pour vous guider.',
      features: [
        {
          icon: 'fa-solid fa-user-graduate',
          title: 'Accompagnement Personnalisé',
          desc: 'Suivi individuel adapté à votre niveau et vos besoins'
        },
        {
          icon: 'fa-solid fa-lightbulb',
          title: 'Conseils Techniques',
          desc: 'Aide au choix des technologies et architecture'
        },
        {
          icon: 'fa-solid fa-code',
          title: 'Développement Guidé',
          desc: 'Assistance dans la réalisation de votre projet'
        },
        {
          icon: 'fa-solid fa-file-lines',
          title: 'Documentation',
          desc: 'Aide à la rédaction de votre rapport technique'
        }
      ],
      levels: 'Niveaux acceptés : BTS, Licence, Master',
      cta: 'Contactez-nous pour votre projet'
    },
    en: {
      title: '🎓 Students: We support you!',
      subtitle: 'Need help with your final year project?',
      description: 'We support students (BTS, Bachelor, Master) in completing their web and mobile projects. Whether it\'s a showcase website, mobile app or complete system, we\'re here to guide you.',
      features: [
        {
          icon: 'fa-solid fa-user-graduate',
          title: 'Personalized Support',
          desc: 'Individual follow-up adapted to your level and needs'
        },
        {
          icon: 'fa-solid fa-lightbulb',
          title: 'Technical Advice',
          desc: 'Help choosing technologies and architecture'
        },
        {
          icon: 'fa-solid fa-code',
          title: 'Guided Development',
          desc: 'Assistance in completing your project'
        },
        {
          icon: 'fa-solid fa-file-lines',
          title: 'Documentation',
          desc: 'Help writing your technical report'
        }
      ],
      levels: 'Accepted levels: BTS, Bachelor, Master',
      cta: 'Contact us for your project'
    }
  };

  const currentContent = content[language] || content['fr'];

  return (
    <section className="academic-section">
      <div className="container">
        <div className="academic-header">
          <h2 className="academic-title">{currentContent.title}</h2>
          <p className="academic-subtitle">{currentContent.subtitle}</p>
          <p className="academic-description">{currentContent.description}</p>
        </div>

        <div className="academic-features">
          {currentContent.features.map((feature, index) => (
            <div key={index} className="academic-feature">
              <div className="academic-icon">
                <i className={feature.icon}></i>
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>

        <div className="academic-footer">
          <p className="academic-levels">{currentContent.levels}</p>
          <a href="#contact" className="academic-cta">{currentContent.cta}</a>
        </div>
      </div>
    </section>
  );
};

export default AcademicSection;
