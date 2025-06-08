import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './MilitaryNewsSlider.css';

const MilitaryNewsSlider = ({ items }) => {
  return (
    <div className="military-slider-container">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 }
        }}
      >
        {items.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="military-news-card">
              {item.image && (
                <div className="news-image-container">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="news-image"
                  />
                  <div className="image-overlay" />
                </div>
              )}
              <div className="news-content">
                <div className="news-date">{item.date}</div>
                <h3 className="news-title">{item.title}</h3>
                <p className="news-description">{item.description}</p>
                <button className="read-more-btn">
                  Подробнее
                  <span className="arrow">➜</span>
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default MilitaryNewsSlider;