// StudentProfile.js
import React, { useState } from 'react';
import './StudentProfile.css';
import Header from './Header';
import UserLogo from './imgs/userLogo.jpg'

const StudentProfile = () => {
  const mockUser = {
    name: 'Чикалев Илья Максимович',
    photo: '/default-avatar.jpg'
  };
  const [activeTab, setActiveTab] = useState('profile');
  
  const studentData = {
    photo: UserLogo,
    name: 'Чикалев Илья Максимович',
    status: 'Студент',
    faculty: 'Институт цифровых систем',
    group: 'ЦИС-49',
    direction: '09.03.02 - Информационные системы и технологии',
    profile: 'Информационные системы и технологии'
  };

  const scheduleData = {
    today: [
      { time: '8:30-10:00', subject: 'Базы данных', room: 'А-305' },
      { time: '10:10-11:40', subject: 'Веб-программирование', room: 'Б-207' },
      { time: '12:20-13:50', subject: 'Базы данных', room: 'А-305' },
      { time: '14:00-15:30', subject: 'Веб-программирование', room: 'Б-207' },
      { time: '15:40-17:10', subject: 'Веб-программирование', room: 'Б-207' },
      { time: '17:30-19:00', subject: 'Веб-программирование', room: 'Б-207' },
    ]
  };

  return (
    <div className='userProfile'>
      <Header user={mockUser} />
      <main>
      <div className="student-profile-container">
      {/* Левая колонка - Профиль */}
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

      {/* Средняя колонка - Контент */}
      <div className="center-column">
        {activeTab === 'schedule' && (
          <div className="content-block">
            <h3>Расписание на сегодня</h3>
            <a href='/'>Полное расписание</a>
            <div className="schedule-items">
              {scheduleData.today.map((item, index) => (
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
        )}
        {activeTab === 'profile' && (
          <div className="content-block">
            <h3>Личный кабинет</h3>
            <table>
              <tbody>
                <tr>
                  <th align="right" class="lable">Источник финансирования:</th>
                  <td class="input">Бюджет</td>
                </tr>
                <tr>
                  <th align="right" class="lable">Квалификация:</th>
                  <td>Бакалавр</td>
                </tr>
                <tr>
                  <th align="right" class="lable">Форма обучения:</th>
                  <td>очная</td>
                </tr>
                <tr>
                  <th align="right" class="lable">Дата рождения:</th>
                  <td>07.06.2003</td>
                </tr>
                <tr>
                  <th align="right" class="lable">Адрес регистрации:</th>
                  <td><font size="-1">, 150510, Ярославская обл, Ярославский р-н,  , Кузнечиха (Кузнечихинский с.о.) д, Нефтяников ул, 5, , 15</font></td>
                </tr>
                <tr>
                  <th align="right" class="lable">E-mail:</th>
                  <td><font size="-1">omichika200@gmail.com chikalevim.21@edu.ystu.ru</font></td>
                </tr>
                <tr>
                  <th align="right" class="lable">Тел:</th>
                  <td><font size="-1">+7(960)545-53-48   </font></td>
                </tr>
                <tr><th align="right" class="lable">Информация для<br/>электронного обходного:</th>
                  <td><font size="-1">Библиотека  - задолженностей нет<br/>Бухгалтерия - задолженностей нет<br/>Общежитие -  не проживал, задолженностей нет<br/>Воинский учет - Не снят (долг)<br/></font></td>
                </tr><tr><td align="right" class="lable"><font size="-1">Читательский билет №:<br/>login:</font></td><td><font size="-1">180D028382 <br/>chikalevim.21</font></td>
                </tr>
                </tbody>
                </table>
          </div>
        )}
        {activeTab === 'progress' && (
          <div className="content-block">
            <h3>Успеваемость</h3>
            {/* ... содержимое расписания ... */}
          </div>
        )}
        {activeTab === 'portfolio' && (
          <div className="content-block">
            <h3>Портфолио</h3>
            {/* ... содержимое расписания ... */}
          </div>
        )}
        {activeTab === 'MTC' && (
          <div className="content-block">
            <h3>ВОЕННЫЙ УЧЕБНЫЙ ЦЕНТР</h3>
            {/* ... содержимое расписания ... */}
          </div>
        )}
        {activeTab === 'Scientific_works' && (
          <div className="content-block">
            <h3>Мои труды</h3>
            {/* ... содержимое расписания ... */}
          </div>
        )}
        {activeTab === 'Statements' && (
          <div className="content-block">
            <h3>Мои Заявления</h3>
            {/* ... содержимое расписания ... */}
          </div>
        )}
      </div>

      {/* Правая колонка - Навигация */}
      <div className="right-column">
        <nav className="navigation-menu">
          <button 
            className={activeTab === 'profile' ? 'active' : ''}
            onClick={() => setActiveTab('profile')}
          >
            👤 Личный кабинет
          </button>
          <button 
            className={activeTab === 'progress' ? 'active' : ''}
            onClick={() => setActiveTab('progress')}
          >
            📈 Успеваемость
          </button>
          <button 
            className={activeTab === 'portfolio' ? 'active' : ''}
            onClick={() => setActiveTab('portfolio')}
          >
            🖼️ Портфолио
          </button>
          <button 
            className={activeTab === 'schedule' ? 'active' : ''}
            onClick={() => setActiveTab('schedule')}
          >
            🕒 Расписание
          </button>
          <button 
            className={activeTab === 'MTC' ? 'active' : ''}
            onClick={() => setActiveTab('MTC')}
          >
            <svg 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M12 2L3 7v10l9 5 9-5V7l-9-5z"/>
    <path d="M12 22V12"/>
    <path d="M17 7l-5-3-5 3"/>
    <path d="M17 7v10l-5 3"/>
    <path d="M7 7v10l5 3"/>
    <circle cx="12" cy="12" r="2.5"/>
            </svg> ВУЦ
          </button>
          <button 
            className={activeTab === 'Scientific_works' ? 'active' : ''}
            onClick={() => setActiveTab('Scientific_works')}
          >
            <svg 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    {/* Основная книга */}
    <path d="M4 19.5V5.5C4 4.94772 4.44772 4.5 5 4.5H19C19.5523 4.5 20 4.94772 20 5.5V19.5C20 20.0523 19.5523 20.5 19 20.5H5C4.44772 20.5 4 20.0523 4 19.5Z"/>
    
    {/* Страницы с текстом */}
    <path d="M8 8.5H16"/>
    <path d="M8 11.5H16"/>
    <path d="M8 14.5H12"/>
    
    {/* Декоративный свиток */}
    <path d="M17 2.5V6.5" strokeLinecap="square"/>
    <path d="M18 3.5L16 5.5" strokeLinecap="square"/>
    <path d="M18 5.5L16 3.5" strokeLinecap="square"/>
  </svg> Мои научные труды
          </button>
          <button 
            className={activeTab === 'Statements' ? 'active' : ''}
            onClick={() => setActiveTab('Statements')}
          >
            <svg 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    {/* Основной документ */}
    <path d="M14 2.5H7C5.89543 2.5 5 3.39543 5 4.5V19.5C5 20.6046 5.89543 21.5 7 21.5H17C18.1046 21.5 19 20.6046 19 19.5V8.5H14V2.5Z"/>
    
    {/* Текст в документе */}
    <path d="M14 2.5V8.5H19"/>
    <path d="M8 12.5H16"/>
    <path d="M8 15.5H13"/>
    
    {/* Подпись */}
    <path d="M10 18.5L12 20.5L15 17.5" strokeLinecap="square"/>
  </svg>Заявления
          </button>
        </nav>
      </div>
    </div>
    </main>
    </div>
  );
};

export default StudentProfile;