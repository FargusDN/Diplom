import React, { useState } from 'react';
import './MilitaryDutySchedule.css';

const MilitaryDutySchedule = ({ dutySchedule }) => {
  const dutyPeriods = ['Утро', 'День', 'Вечер', 'Ночь'];
  const [selectedPeriod, setSelectedPeriod] = useState(dutyPeriods[0]);
  const [currentPeriodIndex, setCurrentPeriodIndex] = useState(0);

  const handlePeriodChange = (index) => {
    setSelectedPeriod(dutyPeriods[index]);
    setCurrentPeriodIndex(index);
  };

  const handlePrevPeriod = () => {
    const newIndex = (currentPeriodIndex - 1 + dutyPeriods.length) % dutyPeriods.length;
    handlePeriodChange(newIndex);
  };

  const handleNextPeriod = () => {
    const newIndex = (currentPeriodIndex + 1) % dutyPeriods.length;
    handlePeriodChange(newIndex);
  };

  return (
    <div className="military-duty-schedule">
      <div className="period-selector">
        <button className="nav-arrow" onClick={handlePrevPeriod}>&lt;</button>
        
        <div className="periods-container">
          {dutyPeriods.map((period, index) => (
            <div
              key={period}
              className={`period-item ${selectedPeriod === period ? 'active' : ''}`}
              onClick={() => handlePeriodChange(index)}
            >
              {period}
            </div>
          ))}
        </div>

        <button className="nav-arrow" onClick={handleNextPeriod}>&gt;</button>
      </div>

      <div className="duty-table-container">
        <table className="duty-table">
          <thead>
            <tr>
              <th>Время</th>
              <th>Ответственный</th>
              <th>Должность</th>
              <th>Место</th>
              <th>Задание</th>
            </tr>
          </thead>
          <tbody>
            {dutySchedule[selectedPeriod]?.length > 0 ? (
              dutySchedule[selectedPeriod].map((item, index) => (
                <tr key={index}>
                  <td>{item.time}</td>
                  <td>{item.responsible}</td>
                  <td>{item.position}</td>
                  <td>{item.location}</td>
                  <td>{item.task}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-duty">
                  Нет нарядов на выбранный период
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MilitaryDutySchedule;