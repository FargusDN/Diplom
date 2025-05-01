import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Analytics.css';
import MonthSlider from './MonthSlider';

const Analytics = ({ user }) => {
  // Состояния
  const [groups] = useState(['ЦИС-49', 'ПИ-31']);
  const [subjects] = useState(['Базы данных', 'Веб-программирование']);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [lessonDates, setLessonDates] = useState([
    '15',
    '19',
    '21',
    '22',
    '29'
  ]);
  
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
      grades: [
        { date: '15', value: 4 },
        { date: '22', value: 5 },
      ],
      attendance: 95
    },
    { 
      id: 2,
      lesson: 'WEB - разработка', 
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
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="">Выберите предмет</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>

              
            <div className="add-lesson-date">
            {selectedGroup && selectedSubject ?(
              <DatePicker
                selected={new Date()}
                onChange={addNewLessonDate}
                dateFormat="dd"
                placeholderText="Добавить дату занятия"
              />):(<div></div>)}
            </div>
          </div>

          {selectedGroup && selectedSubject && (
            <div className="journal-table">
              <table className="scrollable-table">
                <thead>
                  <tr>
                    <th className="fixed-first">Студент</th>
                    {lessonDates.map(date => (
                      <th key={date}>
                        <div className="date-header">
                          {date}
                          <button 
                            className="edit-date-btn"
                            onClick={() => console.log('Редактирование даты')}
                          >
                            ✎
                          </button>
                        </div>
                      </th>
                    ))}
                    <th className="fixed-penultimate">Средний балл</th>
                    <th className="fixed-last">Посещаемость</th>
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
                                onChange={(e) => 
                                  handleGradeChange(student.id, date, e.target.value)
                                }
                              />
                            ) : (
                              <button
                                className="add-grade-btn"
                                onClick={() => addNewGrade(student.id, date)}
                              >
                                +
                              </button>
                            )}
                          </td>
                        );
                      })}
                      <td className="fixed-penultimate">{calculateAverage(student.grades)}</td>
                      <td className="fixed-last">{student.attendance}%</td>
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