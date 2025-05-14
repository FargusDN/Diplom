import React from 'react';
import './Header.css';
import Logo from "../src/imgs/logotype-big.png";
import burgerIcon from '../src/imgs/burger-icon2.svg'; // Добавьте иконку бургера
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ProfileDropdown from './ProfileDropdown';

const Header = ({ LogoHeader, onLoginClick, user, isMillitary }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''} ${isMillitary ? 'MillitaryHeader' : ''}` } >
      <div className={`header-logo ${isMillitary ? 'Military' : ''}`}>
      {LogoHeader ? (
         <img src={LogoHeader} className='MilitaryLogo' alt="ЯГТУ" />
        ) : (
          <img src={Logo} alt="ЯГТУ" />
        )}
        
      </div>

      {/* Основной контент для десктопов */}
      <div className="desktop-content">
        {!isMillitary ?(
          <nav className="header-nav">
          <Link to="/admissions">Поступающему</Link>
          <Link to="/students">Студенту</Link>
          <Link to="/university">Университет</Link>
          <Link to="/partners">Партнерам</Link>
          <Link to="/contacts">Контакты</Link>
        </nav>
        ):(
          <div className='isMillitary'>
            <span>ВОЕННЫЙ УЧЕБНЫЙ ЦЕНТР ЯГТУ</span>
          </div>
        )}
        
        {user ? (
          <div className="profile-container">
            <ProfileDropdown />
          </div>
        ) : (
          <button className="login-btn" onClick={onLoginClick}>
            ВХОД
          </button>
        )}
        
      </div>

      {/* Мобильное меню */}
      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
      {user ? (
         <button className="login-btn" onClick={onLoginClick}>
         ВЫХОД
       </button>
        ) : (
          <button className="login-btn" onClick={onLoginClick}>
            ВХОД
          </button>
        )}
        
        <nav className="mobile-nav">
          <Link to="/admissions">Поступающему</Link>
          <Link to="/students">Студенту</Link>
          <Link to="/university">Университет</Link>
          <Link to="/partners">Партнерам</Link>
          <Link to="/contacts">Контакты</Link>
        </nav>
      </div>

      <button 
        className={`burger-btn ${isMenuOpen ? 'open' : ''}`} 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <img src={burgerIcon} alt="Меню" />
      </button>
    </header>
  );
};

export default Header;