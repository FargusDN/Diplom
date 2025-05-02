import React from "react";
import { useState } from 'react';
import './Message.css'

const Message = () =>{

    const notifications = [
        {
          id: 1,
          title: 'Ваша заявка готова',
          type: 'Обычное',
          details: {
            type: 'Заявка на справку',
            date: '2024-03-20',
            status: 'Готова к выдаче',
            location: 'Кабинет 304, 3 этаж',
            comment: 'Не забудьте паспорт для получения'
          }
        },
        {
          id: 2,
          title: 'Новое сообщение',
          type: 'Важное',
          details: {
            type: 'Системное уведомление',
            date: '2024-03-21',
            status: 'Важное',
            message: 'Запланированы технические работы 25 марта с 20:00 до 23:00'
          }
        },
        {
            id: 3,
            title: 'Уведомление об отчислении',
            type: 'Экстренное',
            details: {
              type: 'Системное уведомление',
              date: '2024-03-21',
              status: 'Важное',
              message: 'Уведомляем Вас о том, что на основании подпункта 3.2.2 Положения об отчислении обучающихся в ФГБОУ ВО «НИУ «МЭИ» по программам бакалавриата, специалитета и магистратуры Вы подлежите отчислению из ФГБОУ ВО «НИУ «МЭИ»'
            }
          }
      ];
      const [selectedNotification, setSelectedNotification] = useState(null);

      const handleClose = () => setSelectedNotification(null);
    return(
        <div className="notification-center">
      <h2>Уведомления ({notifications.length})</h2>
      
      <div className="notifications-list">
        {notifications.map(notification => (
          <div 
            key={notification.id}
            className="notification-item"
            onClick={() => setSelectedNotification(notification)}
          >
            {notification.type == "Важное" &&(
                <div style={{background:'blue'}} className="notification-badge"></div>
              )}
                {notification.type == "Экстренное" &&(
                <div style={{background:'red'}} className="notification-badge"></div>
              )}
              {notification.type == "Обычное" &&(
                <div style={{background:'gray'}} className="notification-badge"></div>
              )}
              <div className="notification-content">
              <h4>{notification.title}</h4>
            </div>
          </div>
        ))}
      </div>

      {selectedNotification && (
        <div className="mes-modal-overlay" onClick={handleClose}>
          <div className="notification-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={handleClose}>&times;</button>
            
            <div className="mes-modal-header">
              <h2>{selectedNotification.title}</h2>
              <span className="notification-date">
                {selectedNotification.details.date}
              </span>
            </div>

            <div className="mes-modal-body">
              <div className="detail-row">
                <span>Тип уведомления:</span>
                <span>{selectedNotification.details.type}</span>
              </div>
              
              {selectedNotification.details.status && (
                <div className="detail-row">
                  <span>Статус:</span>
                  <span className={`status-${selectedNotification.details.status.toLowerCase()}`}>
                    {selectedNotification.details.status}
                  </span>
                </div>
              )}

              {selectedNotification.details.message && (
                <div className="detail-message">
                  <p>{selectedNotification.details.message}</p>
                </div>
              )}

              {selectedNotification.details.location && (
                <div className="detail-row">
                  <span>Место получения:</span>
                  <span>{selectedNotification.details.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
    );
}

export default Message;