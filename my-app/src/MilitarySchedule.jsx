import React, { useState } from 'react';
import './MilitarySchedule.css';

const MilitarySchedule = ({ scheduleData }) => {
  const daysOfWeek = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];
  const [selectedDay, setSelectedDay] = useState(daysOfWeek[0]);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);

  const handleDayChange = (index) => {
    setSelectedDay(daysOfWeek[index]);
    setCurrentDayIndex(index);
  };

  const handlePrevDay = () => {
    const newIndex = (currentDayIndex - 1 + daysOfWeek.length) % daysOfWeek.length;
    handleDayChange(newIndex);
  };

  const handleNextDay = () => {
    const newIndex = (currentDayIndex + 1) % daysOfWeek.length;
    handleDayChange(newIndex);
  };

  return (
    <div className="military-schedule">
      <div className="days-slider">
        <button className="nav-arrow" onClick={handlePrevDay}>&lt;</button>
        
        <div className="days-container">
          {daysOfWeek.map((day, index) => (
            <div
              key={day}
              className={`day-item ${selectedDay === day ? 'active' : ''}`}
              onClick={() => handleDayChange(index)}
            >
              {day}
            </div>
          ))}
        </div>

        <button className="nav-arrow" onClick={handleNextDay}>&gt;</button>
      </div>

      <div className="schedule-table-container">
        <table className="schedule-table">
          <thead>
            <tr>
              <th>Время</th>
              <th>Предмет</th>
              <th>Кабинет</th>
              <th>Преподаватель</th>
            </tr>
          </thead>
          <tbody>
            {scheduleData[selectedDay]?.length > 0 ? (
              scheduleData[selectedDay].map((item, index) => (
                <tr key={index}>
                  <td>{item.group}</td>
                  <td>{item.subject}</td>
                  <td>{item.room}</td>
                  <td>{item.teacher}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="no-schedule">
                  Расписание отсутствует
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MilitarySchedule;