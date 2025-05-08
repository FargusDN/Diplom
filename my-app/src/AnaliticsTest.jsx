import SubjectAnalytics from './SubjectAnalytics';
import React from 'react';
const demoData = [
  { month: 'Сентябрь', attendance: 85, averageScore: 4.2 },
  { month: 'Октябрь', attendance: 78, averageScore: 3.9 },
  { month: 'Ноябрь', attendance: 92, averageScore: 4.5 },
  { month: 'Декабрь', attendance: 85, averageScore: 4.2 },
  { month: 'Январь', attendance: 78, averageScore: 3.9 },
  { month: 'Февраль', attendance: 92, averageScore: 4.5 },
  { month: 'Март', attendance: 85, averageScore: 4.2 },
  { month: 'Апрель', attendance: 78, averageScore: 3.9 },
  { month: 'Май', attendance: 92, averageScore: 4.5 },
  { month: 'Июнь', attendance: 85, averageScore: 4.2 },
  { month: 'Июль', attendance: 78, averageScore: 3.9 },
  { month: 'Август', attendance: 92, averageScore: 4.5 },
];

const groups = [
  { id: '1', name: 'ЦИС-19' },
  { id: '2', name: 'ЦИС-20' },
  { id: '3', name: 'ПИ-21' },
];
const subject = [
    { id: '1', name: 'WEB - технологии' },
    { id: '2', name: 'СУБД' },
    { id: '3', name: 'Технологии программирования' },
  ];

const AnaliticsTest = () => {
  return (
    <SubjectAnalytics
      role="student"
      data={demoData}
      groups={groups}
      subjects={subject}
    />
  );
}

export default AnaliticsTest;