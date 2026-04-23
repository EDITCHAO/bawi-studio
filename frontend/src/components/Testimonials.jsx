import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './Testimonials.css';

const Testimonials = () => {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    { key: 'client1' },
    { key: 'client2' },
    { key: 'client3' }
  ];

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[currentIndex];

  return (
    <section className="testimonials">
      <div className="container">
        <h2 className="section-title">{t('testimonials.title')}</h2>
        
        <div className="testimonial-carousel">
          <button className="carousel-btn prev" onClick={prev}>‹</button>
          
          <div className="testimonial-card">
            <p className="testimonial-text">"{t(`testimonials.${current.key}.text`)}"</p>
            <div className="testimonial-author">
              <strong>{t(`testimonials.${current.key}.name`)}</strong>
              <span>{t(`testimonials.${current.key}.company`)}</span>
            </div>
          </div>
          
          <button className="carousel-btn next" onClick={next}>›</button>
        </div>

        <div className="carousel-dots">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
