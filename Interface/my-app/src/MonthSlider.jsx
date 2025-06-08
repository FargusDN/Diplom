import { useState } from 'react';
import './MonthSlider.css';

const MonthSlider = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const months = [
    'Январь', 'Февраль', 'Март', 'Апрель',
    'Май', 'Июнь', 'Июль', 'Август',
    'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  const getAdjacentMonth = (offset) => {
    const date = new Date(currentDate);
    date.setMonth(date.getMonth() + offset);
    return date;
  };

  const handlePrev = () => setCurrentDate(getAdjacentMonth(-1));
  const handleNext = () => setCurrentDate(getAdjacentMonth(1));

  const formatMonth = (date) => {
    const year = date.getFullYear();
    const monthIndex = date.getMonth();
    return {
      name: months[monthIndex],
      year: year !== new Date().getFullYear() ? year : null
    };
  };

  return (
    <div className="month-slider">
      <button className="arrow" onClick={handlePrev}>&lt;</button>
      
      <div className="month-container">
        <div className="adjacent-month">
          {formatMonth(getAdjacentMonth(-1)).name}
        </div>
        
        <div className="current-month">
          {formatMonth(currentDate).name}
          {formatMonth(currentDate).year && 
            <span className="year">{formatMonth(currentDate).year}</span>}
        </div>
        
        <div className="adjacent-month">
          {formatMonth(getAdjacentMonth(1)).name}
        </div>
      </div>

      <button className="arrow" onClick={handleNext}>&gt;</button>
    </div>
  );
};

export default MonthSlider;