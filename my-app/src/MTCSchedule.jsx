import React from 'react';
import './MTCSchedule.css';

const MTCSchedule = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="schedule-empty">Расписание отсутствует</div>;
  }

  return (
    <div className="schedule-container">
      <div className="schedule-scroll-wrapper">
        <table className="schedule-table">
          <thead>
            <tr>
              <th>Группа</th>
              <th>Аудитория</th>
              <th>Дисциплина</th>
              <th>Преподаватель</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
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
  );
};

export default MTCSchedule;