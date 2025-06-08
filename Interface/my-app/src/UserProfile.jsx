// StudentProfile.js
import React, { useState } from 'react';
import './UserProfile.css';
import Modal from './Modal';
import Header from './Header';
import UserLogo from './imgs/userLogo.jpg'
import { Link } from 'react-router-dom';


const UserProfile = () => {
  const [activeCard, setActiveCard] = useState(null);
  const mockUser = {
    name: 'Чикалев Илья Максимович',
    photo: '/default-avatar.jpg'
  };
  const studentData = {
    photo: UserLogo,
    name: 'Чикалев Илья Максимович',
    status: 'Студент',
    faculty: 'Институт цифровых систем',
    group: 'ЦИС-49',
    direction: '09.03.02 - Информационные системы и технологии',
    profile: 'Информационные системы и технологии'
  };
  if (activeCard) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'auto';
  }
  
  const infoCards = [
    {
      id: 'vuc',
      title: 'ВУЦ',
      summary: ['Звание: Рядовой', 'Срок службы: 1.5 года'],
      content: {
        type: 'military',
        description: 'Программа военной подготовки включает...',
        scheduleData:{
          today: [
            { time: '8:30-10:00', subject: 'Уборка', room: 'А-305' },
          ]
        },
        scheduleLink: '/vuc-schedule'
      }
    },
    {
      id: 'education',
      title: 'Журнал',
      summary: ['Курсов: 4', 'Сейчас: 2 семестр 2-го курса'],
      content: {
        type: 'education',
        description: 'Мои оценки:',
      }
    },
    {
      id: 'shedule',
      title: 'Расписание',
      summary: [ '8:30-10:00', 'Базы данных', 'А-305' ],
      content: {
        type: 'shedule',
        scheduleData : {
          today: [
            { time: '8:30-10:00', subject: 'Базы данных', room: 'А-305', type_of_class: 'Лабораторная' },
            { time: '10:10-11:40', subject: 'Веб-программирование', room: 'Б-207', type_of_class: 'Практика' },
            { time: '12:20-13:50', subject: 'Базы данных', room: 'А-305', type_of_class: 'Лекция' },
            { time: '14:00-15:30', subject: 'Веб-программирование', room: 'Б-207', type_of_class: 'Лекция' },
            { time: '15:40-17:10', subject: 'Веб-программирование', room: 'Б-207', type_of_class: 'Лабораторная' },
            { time: '17:30-19:00', subject: 'Веб-программирование', room: 'Б-207', type_of_class: 'Лабораторная' },
          ]
        },
        description: 'Доступные программы дополнительного образования:',
        courses: ['Web-разработка', 'Data Science', 'Английский язык']
      }
    },
    {
      id: 'portfolio',
      title: 'Портфолио',
      summary: [ 'Последнее достижение: Золотой значек ГТО' ],
      content: {
        type: 'portfolio',
        description: 'Здесь отобразятся ваши последние достижения и научные труды:',
        courses: ['Web-разработка', 'Data Science', 'Английский язык']
      }
    },
    {
      id: 'zayavky',
      title: 'Мои заявки',
      summary: [ 'Статус последней заявки: Готова' ],
      content: {
        type: 'zayavky',
        description: 'Здесь отобразятся ваши заявки:',
      }
    },
    {
      id: 'settings',
      title: 'Настройки',
      summary: [ 'Статус последней заявки: Готова' ],
      content: {
        type: 'settings',
        description: 'Настройки:',
      }
    }
    // ... другие карточки
  ];

  return (
    <div>
        <Header user={mockUser} />
    
    <div className="student-profile-container">
      {/* Левая колонка (профиль) */}
      <div className="left-column">
      <div className="profile-card">
          <div 
            className="student-photo" 
            style={{ backgroundImage: `url(${studentData.photo})` }}
          />
          <div className="student-info">
            <h2>{studentData.name}</h2>
            <div className="info-grid">
              <div className="info-item">
                <span>Группа : {studentData.group}</span>
              </div>
              {/* Остальные поля информации */}
            </div>
          </div>
        </div>
      </div>

      {/* Центральная колонка (блоки) */}
      <div className="cards-grid">
        {infoCards.map(card => (
          <div 
            key={card.id} 
            className="info-card"
            onClick={() => setActiveCard(card)}
          >
            <h3>{card.title}</h3>
            <div className="card-summary">
              {card.summary.map((item, i) => (
                <p key={i}>{item}</p>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Modal 
        isOpen={!!activeCard} 
        onClose={() => setActiveCard(null)}
        data={activeCard?.content}
        title={activeCard?.title}
      />
    </div>
    </div>
  );
};
export default UserProfile;