import React from 'react';
import './DutyOfficer.css';

const DutyOfficer = ({ info }) => {
  if (!info) {
    return (
      <div className="duty-officer empty">
        Информация о дежурном отсутствует
      </div>
    );
  }

  return (
    <div className="duty-officer">
      <div>
        <span>Дежурный</span>
      </div>
      <div className="officer-badge">
        <span className="rank">{info.rank}</span>
        <span className="name">{info.name}</span>
      </div>
      <div className="contact-info">
        <span className="phone-label">Телефон:</span>
        <span className="phone-number">{info.phone}</span>
      </div>
    </div>
  );
};

export default DutyOfficer;