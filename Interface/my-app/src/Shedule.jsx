// Schedule.js
import React, { useState, useEffect } from 'react';
import './Shedule.css';

const Schedule = ({ weekRange,group, scheduleData}) => {
  const [expandedDay, setExpandedDay] = useState(null);

  const daysOfWeek = [
    'Понедельник',
    'Вторник',
    'Среда',
    'Четверг',
    'Пятница',
    'Суббота'
  ];
  const getCurrentDay = () => {
    const today = new Date().getDay();
    // Воскресенье (0) не показываем, возвращаем null
    return today === 0 ? null : daysOfWeek[today - 1];
  };

  useEffect(() => {
    const currentDay = getCurrentDay();
    if (currentDay && scheduleData[currentDay]) {
      setExpandedDay(currentDay);
    }
  }, [scheduleData]);

  const toggleDay = (day) => {
    setExpandedDay(expandedDay === day ? null : day);
  };

  return (
    <div className="schedule-container">
      <div className="week-header">
        <p>Неделя: {weekRange}</p>
        <p>Группа: {group}</p>
      </div>

      {daysOfWeek.map((day) => (
        <div key={day} className="day-container">
          <div 
            className="day-header"
            onClick={() => toggleDay(day)}
          >
            {day}
            <span className={`arrow ${expandedDay === day ? 'open' : ''}`}></span>
          </div>

          {expandedDay === day && (
            <div className="schedule-table">
              <table>
                <thead>
                  <tr>
                    <th>Время</th>
                    <th>Предмет</th>
                    <th>Кабинет</th>
                    <th>Тип занятия</th>
                  </tr>
                </thead>
                <tbody>
                  {scheduleData[day]?.map((lesson, index) => (
                    <tr key={index}>
                      <td>{lesson.time}</td>
                      <td>{lesson.subject}</td>
                      <td>{lesson.room}</td>
                      <td>{lesson.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Schedule;