// ProfileDropdown.js
import React, { useState, useRef, useEffect } from 'react';
import './ProfileDropdown.css';
import UserLogo from './imgs/userLogo.jpg'

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="profile-dropdown" ref={dropdownRef}>
      <div 
        className="profile-icon" 
        onClick={() => setIsOpen(!isOpen)}
        style={{ backgroundImage: `url(${UserLogo})` }}
      />
      {isOpen && (
        <div className="dropdown-menu">
          <button className="logout-btn" onClick={() => {/* логика выхода */}}>
            Выйти
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;