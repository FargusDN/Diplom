// ProfileDropdown.js
import React, { useState, useRef, useEffect } from 'react';
import './ProfileDropdown.css';
import UserLogo from './imgs/userLogo.jpg'
import { Link } from 'react-router-dom';
import bell from './imgs/bell.svg'
import Message from './Message';

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [MessageisOpen, setMessageIsOpen] = useState(false);
  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false);
      setMessageIsOpen(false)
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="profile-dropdown" ref={dropdownRef}>
      <div className='message' onClick={()=> {setMessageIsOpen(!MessageisOpen); setIsOpen(false)}} style={{backgroundImage: `url(${bell})`}}>
        <div className='newMessage'></div>
      </div>
      <div 
        className="profile-icon" 
        onClick={() => {setIsOpen(!isOpen); setMessageIsOpen(false)}}
        style={{ backgroundImage: `url(${UserLogo})` }}
      />
      
      {MessageisOpen &&(
        <Message/>
      )}
      {isOpen && (
        <div className="dropdown-menu">
         <button className='logout-btn return'><Link  to="/profile">Вернуться в ЯГТУ</Link></button>
          <button className="logout-btn out" onClick={() => {/* логика выхода */}}>
            Выйти
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;