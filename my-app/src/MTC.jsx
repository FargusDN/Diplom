// MilitaryCenter.js
import React from 'react';
import './MTC.css';
import MilitaryLogo from './imgs/Frame-818-_2_.png';
import Header from './Header';
import MTC_LOGO from './imgs/Frame-818-_2_.png'
import Footer from './Footer';
import NewsSlider from './NewsSlider';


const MilitaryCenter = () => {
    const mockUser = {
        name: 'Чикалев Илья Максимович',
        photo: '/default-avatar.jpg'
      };
      const scheduleData = [
        { group: '112', location: '620', discipline: 'Инф', teacher: 'Ященко А.В.' },
        { group: '9111', location: '620', discipline: 'Инф', teacher: 'Ященко А.В.' },
        { group: '112', location: '620', discipline: 'Инф', teacher: 'Ященко А.В.' },
        { group: '9111', location: '620', discipline: 'Инф', teacher: 'Ященко А.В.' },
        { group: '112', location: '620', discipline: 'Инф', teacher: 'Ященко А.В.' },
        { group: '9111', location: '620', discipline: 'Инф', teacher: 'Ященко А.В.' },
        { group: '112', location: '620', discipline: 'Инф', teacher: 'Ященко А.В.' },
        { group: '9111', location: '620', discipline: 'Инф', teacher: 'Ященко А.В.' },
        // ... остальные данные
      ];
      const newsItems = [
        {
          title: 'Подготовка к смотру-конкурсу',
          description: 'Началась активная подготовка к ежегодному смотру-конкурсу строевой подготовки...',
          date: '15 февраля 2025'
        },
        {
          title: 'Новые программы обучения',
          description: 'Внедрены новые образовательные программы по кибербезопасности...',
          date: '14 февраля 2025'
        }
      ];
      const dutyOfficer = {
        rank: 'майор',
        name: 'Петров С.М.',
        phone: '32-76'
      };
      
{/* <Header user={mockUser} LogoHeader={MilitaryLogo}/> */}
{/* <Footer/> */}
  return (
    // MilitarySchedule.js
    <div>
        <Header user={mockUser} LogoHeader={MilitaryLogo}/>
        <NewsSlider newsItems={newsItems} />
        <div className="military-schedule-container">
      {/* Блок расписания (левая часть) */}
      <div className="schedule-block">
        <h3>Расписание занятий групп</h3>
        <div className="schedule-table-wrapper">
          <table>
            <thead>
              <tr>
                <th>№ группы</th>
                <th>Место</th>
                <th>Дисциплина</th>
                <th>Преподаватель</th>
              </tr>
            </thead>
            <tbody>
              {scheduleData.map((item, index) => (
                <tr key={index}>
                  <td>{item.group}</td>
                  <td>{item.location}</td>
                  <td>{item.discipline}</td>
                  <td>{item.teacher}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Блок дежурного (правая часть) */}
      <div className="duty-block">
        <div className="duty-officer-card">
          <h3>Дежурный по учебному корпусу</h3>
          {dutyOfficer ? (
            <div className="officer-info">
              <p className="officer-rank">{dutyOfficer.rank}</p>
              <p className="officer-name">{dutyOfficer.name}</p>
              <p className="officer-phone">{dutyOfficer.phone}</p>
            </div>
          ) : (
            <p className="no-officer">Дежурный не назначен</p>
          )}
        </div>
      </div>
    </div>
    <Footer/>
    </div>
  );
};

export default MilitaryCenter;