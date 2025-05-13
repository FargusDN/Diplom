import { useState, useEffect } from 'react';
import PageBuilder from './PageBuilder';
import MTC from './MTC';

const defaultTemplate = {
  version: "1.1",
  layout: [
    {
      id: 'news-default',
      type: 'news',
      settings: { visible: true, title: 'Новости центра' }
    },
    {
      id: 'schedule-default',
      type: 'schedule',
      settings: { visible: true, title: 'Расписание занятий' }
    },
    {
      id: 'duty-default',
      type: 'duty',
      settings: { visible: true, title: 'Дежурный по корпусу' }
    }
  ],
  dataSources: {
    news: [
      {
        title: 'Добро пожаловать!',
        description: 'Начните работу с настройки вашего шаблона',
        date: new Date().toLocaleDateString()
      }
    ],
    schedule: [
      { group: '101', location: 'Главный корпус', discipline: 'Строевая подготовка', teacher: 'Иванов И.И.' }
    ],
    duty: {
      rank: 'Капитан',
      name: 'Петров П.П.',
      phone: '11-22'
    }
  }
};

const MilitaryCenter = () => {
  const [template, setTemplate] = useState(() => {
    try {
      const saved = localStorage.getItem('pageLayout');
      return saved ? JSON.parse(saved) : defaultTemplate;
    } catch {
      return defaultTemplate;
    }
  });

  const [mode, setMode] = useState('view');

  // Функция для обновления шаблона
  const handleTemplateUpdate = (newTemplate) => {
    if (newTemplate && newTemplate.layout && newTemplate.dataSources) {
      setTemplate(newTemplate);
      localStorage.setItem('pageLayout', JSON.stringify(newTemplate));
    }
  };

  return (
    <div className="military-center">
      <button onClick={() => setMode(m => m === 'edit' ? 'view' : 'edit')}>
        {mode === 'edit' ? 'Закрыть редактор' : 'Редактировать страницу'}
      </button>

      {mode === 'edit' ? (
        <PageBuilder
          currentTemplate={template}
          onTemplateUpdate={handleTemplateUpdate} // Важно: правильное имя пропса
        />
      ) : (
        <MTC template={template} />
      )}
    </div>
  );
};

export default MilitaryCenter;