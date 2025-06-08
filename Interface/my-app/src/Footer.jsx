import React from 'react';
import './Footer.css';

const Footer = () => {
  const links = {
    student: [
      {text: 'Социальная поддержка', url: 'https://ystu.ru/information/students/sotsialnaya-pomoshch/'},
      {text: 'Стандарты оформления работ', url: '/information/students/standart/'},
      // ... остальные ссылки
    ],
    applicant: [
      {text: 'НАПРАВЛЕНИЯ ПОДГОТОВКИ', url: '/information/admissions/napravleniya-podgotovki-i-obrazovatelnye-programmy/'},
      // ... остальные ссылки
    ],
    // ... другие категории
  };

  return (
    <footer className="footer">
      <div className="wrapper">
        <div className="footer-container">
          
          {/* Секция для студента */}
          <div className="footer-section">
            <details className="footer-details">
              <summary className="footer-title">Студенту</summary>
              <div className="footer-links">
                {links.student.map((link, index) => (
                  <a key={index} href={link.url} className="footer-link">{link.text}</a>
                ))}
              </div>
            </details>
          </div>

          {/* Секция для поступающего */}
          <div className="footer-section">
            <details className="footer-details">
              <summary className="footer-title">Поступающему</summary>
              <div className="footer-links">
                {links.applicant.map((link, index) => (
                  <a key={index} href={link.url} className="footer-link">{link.text}</a>
                ))}
              </div>
            </details>
          </div>

          {/* Контакты и социальные сети */}
          <div className="footer-contacts">
            <div className="contact-block">
              <h4>+7 (4852) 40-21-99</h4>
              <p>По общим вопросам</p>
            </div>
            
            <div className="social-links">
              <a href="https://vk.com/ystu" className="social-icon">
                {/* SVG для VK */}
              </a>
              {/* Остальные социальные иконки */}
            </div>
          </div>

          {/* Копирайт и баннеры */}
          <div className="footer-bottom">
            <p className="copyright">© 1944-2025, ФГБОУ ВО «ЯГТУ»</p>
            <div className="partners">
              <a href="https://redstar.agency/" className="partner-logo"></a>
              <div className="counter">
                {/* Счетчик Спутника */}
              </div>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;