import React from "react";
import { useState,useEffect } from 'react';
import './Message.css'
import MessageCreate from "./MessageCreate";

const Message = () =>{ 
  
  // Добавляем состояние для активного фильтра
  const user={
    role:"user",
  }
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Ваша заявка готова',
      type: 'Обычное',
      isRead: false,
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
      isRead: false,
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
      isRead: false,
      details: {
        type: 'Системное уведомление',
        date: '2024-03-21',
        status: 'Важное',
        message: 'Уведомляем Вас о том, что на основании подпункта 3.2.2 Положения об отчислении обучающихся в ФГБОУ ВО «НИУ «МЭИ» по программам бакалавриата, специалитета и магистратуры Вы подлежите отчислению из ФГБОУ ВО «НИУ «МЭИ»'
      }
    },
    {
      id: 4,
      title: 'Новое сообщение',
      type: 'Важное',
      isRead: false,
      details: {
        type: 'Системное уведомление',
        date: '2024-03-21',
        status: 'Важное',
        message: 'Запланированы технические работы 25 марта с 20:00 до 23:00'
      }
    },
    {
      id: 5,
      title: 'Новое сообщение',
      type: 'Важное',
      isRead: false,
      details: {
        type: 'Системное уведомление',
        date: '2024-03-21',
        status: 'Важное',
        message: 'Запланированы технические работы 25 марта с 20:00 до 23:00'
      }
    },
    {
      id: 6,
      title: 'Новое сообщение',
      type: 'Обычное',
      isRead: false,
      details: {
        type: 'Системное уведомление',
        date: '2024-03-21',
        status: 'Важное',
        message: 'Запланированы технические работы 25 марта с 20:00 до 23:00'
      }
    },
    {
      id: 7,
      title: 'Новое сообщение',
      type: 'Обычное',
      isRead: false,
      details: {
        type: 'Системное уведомление',
        date: '2024-03-21',
        status: 'Важное',
        message: 'Запланированы технические работы 25 марта с 20:00 до 23:00'
      }
    },
    {
      id: 8,
      title: 'Новое сообщение',
      type: 'Экстренное',
      isRead: false,
      details: {
        type: 'Системное уведомление',
        date: '2024-03-21',
        status: 'Важное',
        message: 'Запланированы технические работы 25 марта с 20:00 до 23:00'
      }
    },
    {
      id: 9,
      title: 'Новое сообщение',
      type: 'Экстренное',
      isRead: false,
      details: {
        type: 'Системное уведомление',
        date: '2024-03-21',
        status: 'Важное',
        message: 'Запланированы технические работы 25 марта с 20:00 до 23:00'
      }
    },
  ]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Вычисляем счетчики для каждой категории
  const emergencyCount = notifications.filter(n => n.type === 'Экстренное' && !n.isRead).length;
  const importantCount = notifications.filter(n => n.type === 'Важное' && !n.isRead).length;
  const normalCount = notifications.filter(n => n.type === 'Обычное' && !n.isRead).length;
  const allCount = notifications.filter(n => !n.isRead).length;;
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [expandedGroups, setExpandedGroups] = useState({
    emergency: true,
    important: false, // По умолчанию развернута важная категория
    normal: false
  });
  const handleGroupToggle = (groupKey) => {
    setExpandedGroups(prev => {
      const newState = {
        emergency: false,
        important: false,
        normal: false
      };
      newState[groupKey] = !prev[groupKey];
      return newState;
    });
  };

  // Группировка уведомлений
  const groupedNotifications = notifications.reduce((acc, notification) => {
    const typeMap = {
      'Экстренное': 'emergency',
      'Важное': 'important',
      'Обычное': 'normal'
    };
    const key = typeMap[notification.type];
    if (!acc[key]) acc[key] = [];
    acc[key].push(notification);
    return acc;
  }, {});

  const handleClose = () => setSelectedNotification(null);
  const getVisibleGroups = () => {
    if (activeFilter === 'all') return groupedNotifications;
    return { [activeFilter]: groupedNotifications[activeFilter] || [] };
  };
  const toggleGroup = (group) => {
    setExpandedGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };
  const GROUP_ORDER = ['emergency', 'important', 'normal'];
  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? {...n, isRead: true} : n)
    );
  };
  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
  }, [isModalOpen]);

  return (
    <div className="notification-center">
      <h2>Уведомления</h2>
      <div className="filter-buttons">
      <button 
    className={activeFilter === 'all' ? 'active' : ''}
    onClick={() => setActiveFilter('all')}
  >
    Все
    <span className="unread-badge">{allCount}</span>
  </button>
  <button 
    className={activeFilter === 'emergency' ? 'active' : ''}
    onClick={() => setActiveFilter('emergency')}
  >
    Экстренные
    <span className="unread-badge">{emergencyCount}</span>
  </button>
  <button
    className={activeFilter === 'important' ? 'active' : ''}
    onClick={() => setActiveFilter('important')}
  >
    Важные
    <span className="unread-badge">{importantCount}</span>
  </button>
  <button
    className={activeFilter === 'normal' ? 'active' : ''}
    onClick={() => setActiveFilter('normal')}
  >
    Обычные
    <span className="unread-badge">{normalCount}</span>
  </button>
</div>
      <div className="notification-groups">
      {['emergency', 'important', 'normal'] // Желаемый порядок групп
  .filter(groupKey => getVisibleGroups().hasOwnProperty(groupKey))
  .map(groupKey => {
    const items = getVisibleGroups()[groupKey];
    const groupNames = {
      emergency: 'Экстренные',
      important: 'Важные',
      normal: 'Обычные'
    };
          
          return items.length > 0 && (
            <div key={groupKey} className="notification-group">
            <div className="group-header">
              <h3>{groupNames[groupKey]} ({items.length})</h3>
              <button
                onClick={() => handleGroupToggle(groupKey)}
                className="toggle-group-btn"
              >
                {expandedGroups[groupKey] ? 'Свернуть' : 'Развернуть'}
              </button>
            </div>
              
              {expandedGroups[groupKey] && (
                <div className="group-items">
                  {items.map(notification => (
                    <div
                      key={notification.id}
                      className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                      onClick={() => {
                        setSelectedNotification(notification);
                        markAsRead(notification.id);
                      }}
                    >
                      {!notification.isRead && <div className="unread-dot"></div>}
                      <div className="notification-content">
                        <h4>{notification.title}</h4>
                        <span className="notification-date">
                          {notification.details.date}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {user.role==="teacher"&&(
        <button className="submit-btn" onClick={()=>setIsModalOpen(true)}>Создать уведомление</button>
      )}
        
        {isModalOpen && (
        <div className="modal-overlay_message">
          <div className="status-modal_message">
            <h2>Создание уведомления</h2>
            

            <button 
              className="close-btn_profile"
              onClick={() => setIsModalOpen(false)}
            >
              &times;
            </button>
            <MessageCreate/>
          </div>
        </div>
      )}

      {selectedNotification && (
        <div className="mes-modal-overlay" onClick={handleClose}>
          <div className="notification-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn_profile" onClick={handleClose}>&times;</button>
            
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