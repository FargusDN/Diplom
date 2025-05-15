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
    return <div className="news-slider2 empty">Новостей нет</div>;
  }

  return (
    <div 
      className="news-slider2"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="slider-track2">
        {items.map((item, index) => (
          <div 
            key={index}
            className={`slide2 ${index === activeIndex ? 'active' : ''}`}
            aria-hidden={index !== activeIndex}
          >
            <div className="slide-content2">
              <h3 className="news-title2">{item.title}</h3>
              <p className="news-description2">{item.description}</p>
              <time className="news-date2">{item.date}</time>
            </div>
          </div>
        ))}
      </div>

      {items.length > 1 && (
        <div className="slider-controls2">
          {items.map((_, index) => (
            <button
              key={index}
              className={`control-dot2 ${index === activeIndex ? 'active' : ''}`}
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