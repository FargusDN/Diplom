// Modal.js (обновленная версия)
import React from "react";
import './Modal.css';
import { useState } from "react";
import { Link } from "react-router-dom";
import Portfolio from "./Portfolio";
import Schedule from "./Shedule";
import Zayavky from "./Zayavky";
import UserSettings from "./UserSettings";
import Analytics from "./Analytics";
import MilitaryCenterUserCard from "./MilitaryCenterUserCard";
import userLogo from "./imgs/userLogo.jpg";
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
const user={
  name:"Чикалев Илья Максимович",
  rank:"Рядовой",
  role:"Студент",
  photo: userLogo
};
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
            <MilitaryCenterUserCard isProfile={true} user={user}/>
            <Link className="schedule-button" to="/MilitaryCenter">Войти в ВУЦ</Link>
          </>
        );
      
      case 'education':
        return (
          <div>
                      <Analytics user={{ role: 'teacher' }}/>
                      <Link to="/analitic">Подробнее</Link>
          </div>

        );

        case 'shedule':
          return (      
          <Schedule weekRange="14.04.2025-19.04.2025" scheduleData={scheduleData} group={"ЦИС-49"}/>
          );
        case 'zayavky':
          return(
            <Zayavky/>
          );
        case 'settings':
          return(
            <UserSettings/>
          );
        default:
          return <p>{data?.description || 'Информация не найдена'}</p>;
    }
  };

  return (
    <div className="modal-overlay_profile" onClick={onClose}>
      <div className="modal-content_profile" onClick={e => e.stopPropagation()}>
        <div className="modal-header_profile">
          <h2>{title}</h2>
          <button className="close-btn_profile" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body_profile">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
export default Modal;