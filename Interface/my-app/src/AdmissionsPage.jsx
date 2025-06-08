import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header'; // Ваш существующий компонент шапки
import SocialIcons from './SocialIcons'; // Компонент с социальными иконками
import './AdmissionsPage.css'

const AdmissionsPage = () => {
  // Данные для секций (можно вынести в отдельный файл)
  const institutes = [
    { title: "Архитектуры и дизайна", link: "/institutes/architecture", programs: 3 },
    { title: "Цифровых систем", link: "/institutes/digital-systems", programs: 9 },
    // ... остальные институты
  ];

  const colleges = [
    { title: "Университетский колледж ЯГТУ 'ПОЛИТЕХНИК'", link: "/colleges/polytechnic", programs: 9 },
    // ... другие колледжи
  ];

  const additional = [
    { title: "НАПРАВЛЕНИЯ ПОДГОТОВКИ", link: "/directions", image: "directions.jpg" },
    { title: "ВОЕННЫЙ УЧЕБНЫЙ ЦЕНТР", link: "/military-center", image: "military.jpg" },
    // ... остальные элементы
  ];

  return (
    <div className="admissions-page">
      <Header />
      
      <main className="page-content">
        <HeroSection />
        
        <Section title="Институты" link="/institutes">
          <Grid items={institutes} renderItem={(item) => (
            <Card 
              title={item.title} 
              link={item.link} 
              info={`${item.programs} программ`}
            />
          )} />
        </Section>

        <Section title="Колледжи" link="/colleges">
          <Grid items={colleges} renderItem={(item) => (
            <Card 
              title={item.title} 
              link={item.link} 
              info={`${item.programs} программ`}
            />
          )} />
        </Section>

        <Section title="Дополнительно">
          <Grid items={additional} renderItem={(item) => (
            <Card 
              title={item.title} 
              link={item.link} 
              theme="invert"
              image={item.image}
            />
          )} />
        </Section>
      </main>

      <Footer />
    </div>
  );
};

// Hero-секция
const HeroSection = () => (
  <section className="hero block-overlay">
    <div className="container">
      <div className="section__header">
        <h1 className="heading">Поступающим</h1>
      </div>
      
      <div className="grid">
        <Card 
          title="Регламент поступления. Бакалавриат очно" 
          link="/admissions/bachelor-fulltime" 
          theme="contrast"
        />
        {/* ... другие карточки */}
      </div>
    </div>
  </section>
);

// Универсальный компонент секции
const Section = ({ title, link, children }) => (
  <section className="section">
    <div className="container">
      <div className="section__header">
        <h2 className="heading">
          {link ? <Link to={link} className="section__ref">{title}</Link> : title}
        </h2>
      </div>
      {children}
    </div>
  </section>
);

// Компонент сетки
const Grid = ({ items, renderItem, cols = 3 }) => (
  <div className={`grid cols-${cols}`}>
    {items.map((item, index) => (
      <div key={index} className="grid__cell">
        {renderItem(item)}
      </div>
    ))}
  </div>
);

// Компонент карточки
const Card = ({ title, link, info, theme = '', image = '' }) => (
  <Link to={link} className={`card ${theme}`} style={{ backgroundImage: image }}>
    <div className="card__inner">
      <span className="card__title">{title}</span>
      {info && <div className="card__footer">{info}</div>}
    </div>
  </Link>
);

// Футер
const Footer = () => (
  <footer className="footer">
    <div className="container">
      <SocialIcons />
      {/* Дополнительные элементы футера */}
    </div>
  </footer>
);

export default AdmissionsPage;