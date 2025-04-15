// Modal.js (обновленная версия)
import React from "react";
import './Modal.css';
import { useState } from "react";
import { Link } from "react-router-dom";
import Portfolio from "./Portfolio";
import Schedule from "./Shedule";
// Modal.js
const Modal = ({ isOpen, onClose, title, data }) => {
  const scheduleData = {
    'Вторник':[
        { time: '8:30-10:00', subject: 'Базы данных', room: 'А-305', type: 'Лабораторная' },
            { time: '10:10-11:40', subject: 'Веб-программирование', room: 'Б-207', type: 'Практика' },
            { time: '12:20-13:50', subject: 'Базы данных', room: 'А-305', type: 'Лекция' },
            { time: '14:00-15:30', subject: 'Веб-программирование', room: 'Б-207', type: 'Лекция' },
            { time: '15:40-17:10', subject: 'Веб-программирование', room: 'Б-207', type: 'Лабораторная' },
            { time: '17:30-19:00', subject: 'Веб-программирование', room: 'Б-207', type: 'Лабораторная' },
    ]
            
}
  if (!isOpen) return null;

  const renderContent = () => {
    switch(data?.type) {
      case 'portfolio':
        return (

            <Portfolio/>
        );
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
            <Link className="schedule-button" to="/MilitaryCenter">Войти в ВУЦ</Link>
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
            // <>
            // <div className="details">
            //         <p className="_time">Время</p>
            //         <p className="subject">Предмет</p>
            //         <p className="room">Кабинет</p>
            //         <p className="type_of_class">Тип занятия</p>
            //       </div>
            //   {data.scheduleData.today.map((item, index) => (
            //     <div key={index} className="schedule-item">
            //       <span className="time">{item.time}</span>
                  
            //       <div className="details">
            //         <p className="subject">{item.subject}</p>
            //         <p className="room">{item.room}</p>
            //         <p className="type_of_class">{item.type_of_class}</p>
            //       </div>
            //     </div>
            //   ))}
            //   <a href={data.scheduleLink} className="schedule-button">
            //   Посмотреть полное расписание
            // </a>
            // </>
           
           
          <Schedule weekRange="14.04.2025-19.04.2025" scheduleData={scheduleData} group={"ЦИС-49"}/>
            
           
            
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