import React, { useState, useEffect } from 'react';
import './NewsSlider.css';

const NewsSlider = ({ items }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (items.length <= 1) return;
    
    const interval = setInterval(() => {
      if (!paused) {
        setActiveIndex(prev => (prev + 1) % items.length);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [items.length, paused]);

  if (items.length === 0) {
    return <div className="news-slider empty">Новостей нет</div>;
  }

  return (
    <div 
      className="news-slider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="slider-track">
        {items.map((item, index) => (
          <div 
            key={index}
            className={`slide ${index === activeIndex ? 'active' : ''}`}
            aria-hidden={index !== activeIndex}
          >
            <div className="slide-content">
              <h3 className="news-title">{item.title}</h3>
              <p className="news-description">{item.description}</p>
              <time className="news-date">{item.date}</time>
            </div>
          </div>
        ))}
      </div>

      {items.length > 1 && (
        <div className="slider-controls">
          {items.map((_, index) => (
            <button
              key={index}
              className={`control-dot ${index === activeIndex ? 'active' : ''}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Перейти к новости ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsSlider;