import React from 'react';
import './DutyOfficer.css';

const DutyOfficer = ({ info }) => {
  if (!info) {
    return (
      <div className="duty-officer2 empty">
        Информация о дежурном отсутствует
      </div>
    );
  }

  return (
    <div className="duty-officer2">
      <div>
        <span>Дежурный</span>
      </div>
      <div className="officer-badge2">
        <span className="rank2">{info.rank}</span>
        <span className="name2">{info.name}</span>
      </div>
      <div className="contact-info2">
        <span className="phone-label2">Телефон:</span>
        <span className="phone-number2">{info.phone}</span>
      </div>
    </div>
  );
};

export default DutyOfficer;