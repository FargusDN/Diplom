import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Analytics.css';
import MonthSlider from './MonthSlider';

const Analytics = ({ user }) => {
  // Состояния
  const [hoveredGrade, setHoveredGrade] = useState(null);

  // Генерируем уникальный ключ для каждой ячейки
  const getGradeKey = (studentId, date) => `${studentId}-${date}`;
  const [isOpen, setIsOpen] = useState(false)
  const [newLesson, setNewLesson] = useState(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [groups] = useState(['ЦИС-49', 'ПИ-31']);
  const [subjects] = useState(
    [
      {
        id:1,
        name: 'Базы данных',
        type_of_subject: 'Лекция'
      },
      {
        id:2,
        name: 'Веб-программирование',
        type_of_subject: 'Практика'
      },
      
    ]
  );
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedSubject2, setSelectedSubject2] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(
    {
      name:'Выберите предмет'
    }
  );

  const [lessonDates, setLessonDates] = useState([
    "1",  "2",  "3",  "4",  "5",  "6",  "7",
  "8",  "9",  "10", "11", "12", "13", "14",
  "15", "16", "17", "18", "19", "20", "21",
  "22", "23", "24", "25", "26", "27", "28",
  "29", "30", "31"
  ]);
  const handleAddClick = () => {
    setIsDatePickerOpen(true);
    setIsOpen(true)
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setIsDatePickerOpen(false);
    // Ваша логика для добавления даты занятия
    addNewLessonDate(date);
  };
  // Данные об оценках
  const [grades, setGrades] = useState([
    { 
      id: 1,
      student: 'Иванов И.И.', 
      grades: [
        { date: '15', value: 4 },
        { date: '22', value: 5 },
      ],
      attendance: 95
    },
    { 
      id: 2,
      student: 'Петрова А.С.', 
      grades: [
        { date: '15', value: 5 },
      ],
      attendance: 100
    }
  ]);

  const lessons = [
    { 
      id: 1,
      lesson: 'Базы данных',
      type:'Лекция', 
      grades: [
        { date: '15', value: 4 },
        { date: '22', value: 5 },
      ],
      attendance: 95
    },
    { 
      id: 2,
      lesson: 'WEB - разработка', 
      type:'Практика', 
      grades: [
        { date: '15', value: 5 },
      ],
      attendance: 100
    }
  ];

  // Эффекты
  useEffect(() => {
    // Здесь можно добавить загрузку данных с API
  }, []);

  // Функции
  const calculateAverage = (grades) => {
    const values = grades.map(g => g.value);
    return values.length > 0 
      ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2)
      : '—';
  };

  const handleGradeChange = (studentId, date, value) => {
    const numericValue = Math.max(2, Math.min(5, Number(value)));
    setGrades(prev => prev.map(student => {
      if (student.id === studentId) {
        const updatedGrades = student.grades.map(grade => 
          grade.date === date ? { ...grade, value: numericValue } : grade
        );
        return { ...student, grades: updatedGrades };
      }
      return student;
    }));
  };

  const addNewLessonDate = (date) => {
    const formattedDate = date.toISOString().split('T')[0].split('-')[2];
    if (!lessonDates.includes(formattedDate)) {
      setLessonDates([...lessonDates, formattedDate]);
    }
  };

  const addNewGrade = (studentId, date) => {
    setGrades(prev => prev.map(student => {
      if (student.id === studentId) {
        const hasGrade = student.grades.some(g => g.date === date);
        if (!hasGrade) {
          return { 
            ...student, 
            grades: [...student.grades, { date, value: 5 }]
          };
        }
      }
      return student;
    }));
  };

  return (
    <div className="analytics-container">
      <h1>Электронный журнал</h1>
      <MonthSlider/>
      {user.role === 'teacher' ? (
        <div className="teacher-view">
          <div className="filters">
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
            >
              <option value="">Выберите группу</option>
              {groups.map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
           
            <select
              value={selectedSubject.name}
              onChange={(e) => {setSelectedSubject(subjects.find( subj => subj.name == e.target.value) );console.log(selectedSubject)}}
            >
              <option value="">Выберите предмет</option>
              {subjects.map(subject => (
                <option key={subject.id} value={subject.name}>{subject.name +" ("+subject.type_of_subject+")"}</option>
              ))}
            </select>

              
            <div className="add-lesson-date">
            {selectedGroup && selectedSubject.name!="Выберите предмет" ?(
              <button onClick={handleAddClick}>Добавить занятие</button>
              ):(<div></div>)}
            </div>
            {isDatePickerOpen && isOpen &&(
              <div className='addNewLessonModal'>
                <button className="close-btn_profile" onClick={()=>{setIsOpen(false)}}>&times;</button>
                <h2 >Добавление занятия</h2>
                <div>
                <p>Выберите дату занятия</p>
                <DatePicker
              selected={new Date()}
              onChange={setNewLesson}
              dateFormat="dd-MM-yyyy"
              placeholderText="Добавить дату занятия"
            />
                </div>
                
            <button className='addLessonBtn' onClick={
              () => {
                const formattedDate = newLesson.toISOString().split('T')[0].split('-')[2];
                if (!lessonDates.includes(formattedDate)) {
                  setLessonDates([...lessonDates, formattedDate]);
                }
              }
            }>Добавить занятие</button>
              </div>
              
            )}
            
          </div>

          {selectedGroup && selectedSubject.name!="Выберите предмет" && (
            <div className="journal-table">
              <table className="scrollable-table">
                <thead>
                  <tr>
                    <th className="fixed-first">Студент</th>
                    {lessonDates.map(date => (
                      <th key={date}>
                        <div className="date-header">
                          {date}
                        </div>
                      </th>
                    ))}
                    {selectedSubject.type_of_subject == 'Практика' &&(
                      <th style={{display:'flex'}} className="fixed-last">
                        <th className='thChild'>Средний балл</th>
                        <th className='thChild'>Посещаемость</th>
                      </th>
                      
                    )}
                    {selectedSubject.type_of_subject == 'Лекция'&&(
                      <th style={{color:'white'}} className="fixed-last">Посещаемость</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {grades.map(student => (
                    <tr  key={student.id}>
                      <td className="fixed-first">{student.student}</td>
                      {lessonDates.map(date => {
                        const grade = student.grades.find(g => g.date === date);
                        return (
                          <td key={date}>
                            {grade ? (
  <input
    type="number"
    value={grade.value}
    min="2"
    max="5"
    onChange={(e) => handleGradeChange(student.id, date, e.target.value)}
    className="grade-input"
  />
) : (
  <div 
    className="grade-placeholder"
    onMouseEnter={() => setHoveredGrade(getGradeKey(student.id, date))}
    onMouseLeave={() => setHoveredGrade(null)}
  >
    {hoveredGrade === getGradeKey(student.id, date) ? (
      <button
        className="add-grade-btn"
        onClick={() => addNewGrade(student.id, date)}
      >
        +
      </button>
    ) : (
      <div className="empty-grade" />
    )}
  </div>
)}
                          </td>
                        );
                      })}
                      {selectedSubject.type_of_subject == 'Практика' &&(
                        <th style={{display:'flex'}} className="fixed-last">
                          <th className='thChild'>{calculateAverage(student.grades)}</th>
                          <th className='thChild'>{student.attendance}%</th>
                        </th>
                    )}
                    {selectedSubject.type_of_subject == 'Лекция' &&(
                      <th className="fixed-last">{student.attendance}%</th>
                    )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="student-view">
          <div className="journal-table">
              <table>
                <thead>
                  <tr>
                    <th>Предмет</th>
                    {lessonDates.map(date => (
                      <th key={date}>
                        <div className="date-header">
                          {date}
                        </div>
                      </th>
                    ))}
                    <th>Средний балл</th>
                    <th>Посещаемость</th>
                  </tr>
                </thead>
                <tbody>
                  {lessons.map(lesson => (
                    <tr key={lesson.id}>
                      <td>{lesson.lesson}</td>
                      {lessonDates.map(date => {
                        const grade = lesson.grades.find(g => g.date === date);
                        return (
                            <td key={date}>
                            {grade ? (
                              <p>{grade.value}</p>
                            ) : (
                              '-' // Или любой другой плейсхолдер
                            )}
                          </td>
                        );
                      })}
                      <td>{calculateAverage(lesson.grades)}</td>
                      <td>{lesson.attendance}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;