import React, { useState, useEffect, useRef } from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import './SubjectAnalytics.css'; // Создайте этот файл для стилей
import MonthSlider from './MonthSlider';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const SubjectAnalytics = ({ data, role, groups, subjects = [] }) => {
  // Состояния для управления UI
  const [searchText, setSearchText] = useState('');
  const [timeInterval, setTimeInterval] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showGroupList, setShowGroupList] = useState(false);
  const [showSubjectList, setShowSubjectList] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const chartRef = useRef(null);
  // Фильтрация групп по поисковому запросу
  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchText.toLowerCase())
  );
  const [isMounted, setIsMounted] = useState(false);

  // Отслеживаем монтирование компонента
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const generateReport = async (data, chartRef) => {
    if (!isMounted || !chartRef.current) {
      console.error('Элемент не найден или компонент не смонтирован');
      return;
    }
    // Анализ данных
    const analysis = {
      totalMonths: data.length,
      avgAttendance: Math.round(data.reduce((sum, item) => sum + item.attendance, 0)) / data.length,
      avgScore: (data.reduce((sum, item) => sum + item.averageScore, 0)) / data.length,
      bestMonth: data.reduce((best, current) => 
        (current.averageScore > best.averageScore ? current : best), data[0])
    };
    try {
      const canvas = await html2canvas(chartRef.current, {
        useCORS: true, // Для корректного рендера внешних ресурсов
        logging: true, // Включите логирование для отладки
      });

      const pdf = new jsPDF('landscape');
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 280;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save('report.pdf');
    } catch (error) {
      console.error('Ошибка при генерации PDF:', error);
    }
  };
  return (
    <div className="analytics-container">
    {role === 'teacher' && (
        <div className="groups-column">
          <div 
            className="group-selector" 
            onClick={() => {setShowGroupList(!showGroupList);setShowSubjectList(false)}}
          >
            {selectedGroup?.name || 'Выберите группу ▼'}
          </div>
          <div 
            className="group-selector" 
            onClick={() => {setShowGroupList(false);setShowSubjectList(!showSubjectList)}}
          >
            {selectedSubject?.name || 'Выберите предмет ▼'}
          </div>
          {showSubjectList && (
            <div className="group-popover">
              <input
                type="text"
                placeholder="Поиск предмета"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <div className="group-list">
                {subjects
                  .filter(g => g.name.includes(searchText))
                  .map(group => (
                    <div
                      key={group.id}
                      className="group-item"
                      onClick={() => {
                        setSelectedSubject(group);
                        setShowSubjectList(false);
                      }}
                    >
                      {group.name}
                    </div>
                  ))}
              </div>
            </div>
          )}
          {showGroupList && (
            <div className="group-popover">
              <input
                type="text"
                placeholder="Поиск группы"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <div className="group-list">
                {groups
                  .filter(g => g.name.includes(searchText))
                  .map(group => (
                    <div
                      key={group.id}
                      className="group-item"
                      onClick={() => {
                        setSelectedGroup(group);
                        setShowGroupList(false);
                      }}
                    >
                      {group.name}
                    </div>
                  ))}
              </div>
            </div>
          )}
           
        </div>
      )}
      {role === 'student' && (
        <div className="groups-column">
          <select className='timeInterval' value={timeInterval} onChange={(e) => {setTimeInterval(e.target.value)}}>
            <option value="">Выберите временной интервал</option>
            <option value="month">Месяца</option>
            <option value="semestrs">Семестры</option>
          </select>
          {timeInterval=='month' &&(<MonthSlider/>)}
          <div 
            className="group-selector" 
            onClick={() => {setShowSubjectList(!showSubjectList)}}
          >
            {selectedSubject?.name || 'Выберите предмет ▼'}
          </div>
          {showSubjectList && (
            <div className="group-popover">
              <input
                type="text"
                placeholder="Поиск предмета"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <div className="group-list">
                {subjects
                  .filter(g => g.name.includes(searchText))
                  .map(group => (
                    <div
                      key={group.id}
                      className="group-item"
                      onClick={() => {
                        setSelectedSubject(group);
                        setShowSubjectList(false);
                      }}
                    >
                      {group.name}
                    </div>
                  ))}
              </div>
            </div>
          )}
          {showGroupList && (
            <div className="group-popover">
              <input
                type="text"
                placeholder="Поиск группы"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <div className="group-list">
                {groups
                  .filter(g => g.name.includes(searchText))
                  .map(group => (
                    <div
                      key={group.id}
                      className="group-item"
                      onClick={() => {
                        setSelectedGroup(group);
                        setShowGroupList(false);
                      }}
                    >
                      {group.name}
                    </div>
                  ))}
              </div>
            </div>
          )}
           
        </div>
      )}

      {/* Основной график */}
      <div className="chart-container">
        <ComposedChart
          width={1200}
          height={400}
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="month" 
            label={{ 
              value: 'Месяца', 
              position: 'bottom', 
              offset: 0 
            }} 
          />
          <YAxis
            yAxisId="attendance"
            label={{ 
              value: 'Посещаемость (%)', 
              angle: -90, 
              position: 'left' 
            }}
            domain={[0, 100]}
          />
          <YAxis
            yAxisId="score"
            orientation="right"
            label={{ 
              value: 'Средний балл', 
              angle: -90, 
              position: 'right' 
            }}
            domain={[0, 5]}
          />
          <Tooltip />
          <Legend bottom={0}/>
          <Bar
            yAxisId="attendance"
            dataKey="attendance"
            name="Посещаемость"
            fill="#8884d8"
            barSize={20}
          />
          <Line
            yAxisId="score"
            type="monotone"
            dataKey="averageScore"
            name="Средний балл"
            stroke="#ff7300"
            strokeWidth={2}
          />
        </ComposedChart>
      </div>
      <button 
        onClick={() => {generateReport(data, chartRef);console.log('Chart ref:', chartRef.current);
          console.log('Component mounted:', isMounted);
          console.log('Data:', data)}}
        style={{ margin: '20px', padding: '10px 20px' }}
        disabled={!data?.length}
      >
        Сформировать отчет PDF
      </button>
    </div>
  );
};

export default SubjectAnalytics;