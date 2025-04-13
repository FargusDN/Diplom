
import React, { useState, useEffect } from 'react';
import './NewsSlider.css';

const NewsSlider = ({ newsItems }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % newsItems.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [newsItems.length]);

  if (!newsItems.length) return <div className="no-news">Новостей нет</div>;

  return (
    <div className="news-slider">
      <div className="slider-track" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
        {newsItems.map((item, index) => (
          <div 
            key={index}
            className={`slide ${index === activeIndex ? 'active' : ''}`}
          >
            <div className="slide-content">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <span className="news-date">{item.date}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="slider-controls">
        {newsItems.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === activeIndex ? 'active' : ''}`}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default NewsSlider;