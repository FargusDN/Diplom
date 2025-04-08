import React from 'react';
import './Header.css';
import Logo from "../src/imgs/logotype-big.png"
import eyeLogo from '../src/imgs/menu_eye.png'
import searchLogo from "../src/imgs/fi-rr-search.png"

const Header = () => {
  return (
    <header className="header">
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
      <div className='header_button'><button>вход</button></div>
    </header>
  );
};

export default Header;