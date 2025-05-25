import React, { useState, useEffect, useRef } from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import './SubjectAnalytics.css'; // Создайте этот файл для стилей
import MonthSlider from './MonthSlider';
import pdfMake from 'pdfmake/build/pdfmake';
import html2canvas from 'html2canvas'
import pdfFonts from 'pdfmake/build/vfs_fonts';
// Пример корректного импорта
import RobotoMedium from './fonts/Roboto-Medium.ttf';




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

  const generateReport = async (data, chartRef) => {
    // Проверка наличия данных
    if (!data || data.length === 0) {
      alert('Нет данных для генерации отчета');
      return;
    }
  
    // Анализ данных
    const analyzeData = (data) => {
      const trends = {
        attendanceTrend: '',
        scoreTrend: ''
      };
  
      if (data.length > 1) {
        const first = data[0];
        const last = data[data.length - 1];
        
        trends.attendanceTrend = last.attendance > first.attendance 
          ? 'положительная' 
          : last.attendance < first.attendance 
            ? 'отрицательная' 
            : 'стабильная';
  
        trends.scoreTrend = last.averageScore > first.averageScore 
          ? 'положительная' 
          : last.averageScore < first.averageScore 
            ? 'отрицательная' 
            : 'стабильная';
      }
      
      return trends;
    };
    const canvas = await html2canvas(chartRef.current, {
      useCORS: true, // Для обхода CORS
      logging: true,  // Для отладки
      scale: 2        // Увеличиваем качество
    });

    // 2. Получаем Data URL изображения
    const imgData = canvas.toDataURL('image/png');
    const trends = analyzeData(data);
    
    const analysis = {
      totalMonths: data.length,
      avgAttendance: (data.reduce((sum, item) => sum + item.attendance, 0) / data.length).toFixed(1),
      avgScore: (data.reduce((sum, item) => sum + item.averageScore, 0) / data.length).toFixed(2),
      bestMonth: data.reduce((best, current) => 
        (current.averageScore > best.averageScore ? current : best), data[0]),
      ...trends
    };
  
   
    // pdfMake.vfs = {
    //   ...pdfFonts.pdfMake.vfs,
    //   'Roboto-Medium.ttf': RobotoMedium
    // };
    pdfMake.fonts = {
      Roboto: {
        normal: 'Roboto-Regular.ttf',
        bold: 'Roboto-Bold.ttf',
        italics: 'Roboto-Italic.ttf',
        bolditalics: 'Roboto-BoldItalic.ttf',
        medium: 'Roboto-Medium.ttf' // Добавляем Medium
      }};
    const docDefinition = {
      content: [
        { text: 'Аналитический отчет' },
        // { text: 'Выбранная группа: '+selectedGroup.value},
        // { text: 'Выбранный предмет: '+selectedSubject.value},
          { 
            image: imgData,
            width: 500,
            margin: [0, 10, 0, 20]
          },
        { text: `Период: ${data[0].month} - ${data[data.length-1].month}` },
        { text: `Средний балл: ${analysis.avgScore}`, margin: [0, 10] },
        { text: `Посещаемость: ${analysis.avgAttendance}%` },
        { text: `Тренд успеваемости: ${analysis.scoreTrend}` },
        { text: `Тренд посещаемости: ${analysis.attendanceTrend}` }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        }
      },
      defaultStyle: {
        font: 'Roboto'
      }
    };
  
    // Генерация PDF
    pdfMake.createPdf(docDefinition).download('report.pdf');
  };
  return (
    <div className="analytics-container" >
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
            <option value="month">Месяца</option>
            <option value="semestrs">Семестры</option>
          </select>
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
      <div className="chart-container" ref={chartRef}>
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
        onClick={() => {generateReport(data, chartRef);}}
        style={{ margin: '20px', padding: '10px 20px' }}
        disabled={!data?.length}
      >
        Сформировать отчет PDF
      </button>
    </div>
  );
};

export default SubjectAnalytics;