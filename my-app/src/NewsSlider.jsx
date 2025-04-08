// NewsSlider.jsx
import React, { useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import './NewsSlider.css';

const NewsSlider = () => {
  const newsItems = [
    {
      id: 1,
      title: 'Новая образовательная программа',
      date: '10.04.2025',
      preview: 'Описание новости...'
    },
    // Добавьте остальные новости
  ];

  return (
    <section className="news-section">
      <h2>Новости и события</h2>
      <Swiper
        spaceBetween={30}
        slidesPerView={3}
        autoplay={{ delay: 20000 }}
        modules={[Autoplay]}
      >
        {newsItems.map((news) => (
          <SwiperSlide key={news.id}>
            <div className="news-card">
              <div className="news-date">{news.date}</div>
              <h3>{news.title}</h3>
              <p>{news.preview}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default NewsSlider;