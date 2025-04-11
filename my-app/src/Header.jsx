import React from 'react';
import './Header.css';
import Logo from "../src/imgs/logotype-big.png"
import eyeLogo from '../src/imgs/menu_eye.png'
import searchLogo from "../src/imgs/fi-rr-search.png"
import ProfileDropdown from './ProfileDropdown';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';


const Header = ({ onLoginClick, user }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className='header-refs'>
  {/* ... другие ссылки ... */}
  <div className='header-refs-ref'>
    <Link to="/profile">Личный кабинет (тест)</Link>
  </div>
</div>
      <div className="header-logo">
        <img src={Logo} alt="Логотип ЯГТУ" className="header-logo"/>  
      </div>
      <div className='header-refs'>
        <div className='header-refs-ref'><a href="/">Поступающему</a></div>
        <div className='header-refs-ref'><a href="/">Студенту</a></div>
        <div className='header-refs-ref'><a href="/about">Университет</a></div>
        <div className='header-refs-ref'><a href="/education">Партнерам</a></div>
        <div className='header-refs-ref'><a href="/contacts">Контакты</a></div>
      </div>
      <div className='header-funcs'>
        <div className='header-funcs-func'><div className='header-funcs-func-block'><img src={eyeLogo}/></div></div>
        <div className='header-funcs-func'><div className='header-funcs-func-block'><p>ru</p></div></div>
        <div className='header-funcs-func'><div className='header-funcs-func-block'><img src={searchLogo}/></div></div>
      </div>
      {user ? (
          <div className="profile-container">
            <ProfileDropdown />
          </div>
        ) : (
          <div className='header_button'>
            <button onClick={onLoginClick}>вход</button>
          </div>
        )}
    </header>
  );
};

export default Header;