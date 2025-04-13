// Modal.js (обновленная версия)
import React from "react";
import './Modal.css';
import { useState } from "react";
import { Link } from "react-router-dom";
// Modal.js
const Modal = ({ isOpen, onClose, title, data }) => {
  if (!isOpen) return null;

  const renderContent = () => {
    switch(data?.type) {
      case 'military':
        return (
          <>
            <div className="mil_shedule">
            <h3>Расписание нарядов</h3>
            <div className="content-block">
            <div className="schedule-items">
              {data.scheduleData.today.map((item, index) => (
                <div key={index} className="schedule-item">
                  <span className="time">{item.time}</span>
                  <div className="details">
                    <p className="subject">{item.subject}</p>
                    <p className="room">{item.room}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
            </div>
            <Link className="schedule-button" to="/MilitaryCenter">Посмотреть расписание нарядов</Link>
            {/* <a href={data.scheduleLink} className="schedule-button">
              Посмотреть расписание нарядов
            </a> */}
          </>
        );
      
      case 'courses':
        return (
          <>
            <p>{data.description}</p>
            <ul className="courses-list">
              {data.courses.map((course, i) => (
                <li key={i}>{course}</li>
              ))}
            </ul>
          </>
        );

        case 'shedule':
          return (
            <>
            <div className="details">
                    <p className="_time">Время</p>
                    <p className="subject">Предмет</p>
                    <p className="room">Кабинет</p>
                    <p className="type_of_class">Тип занятия</p>
                  </div>
              {data.scheduleData.today.map((item, index) => (
                <div key={index} className="schedule-item">
                  <span className="time">{item.time}</span>
                  
                  <div className="details">
                    <p className="subject">{item.subject}</p>
                    <p className="room">{item.room}</p>
                    <p className="type_of_class">{item.type_of_class}</p>
                  </div>
                </div>
              ))}
              <a href={data.scheduleLink} className="schedule-button">
              Посмотреть полное расписание
            </a>
            </>
          );
  
        default:
          return <p>{data?.description || 'Информация не найдена'}</p>;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
export default Modal;