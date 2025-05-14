// PageBuilder.jsx
import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useLocalStorage } from './hooks/useLocalStorage';

import "./PageBuilder.css"
import NewsSlider from './NewsSlider';
import MTCSchedule from './MTCSchedule';
import DutyOfficer from './DutyOfficer';

const SortableItem = ({ id, children, onRemove }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="widget-container">
      <div className="widget-controls">
        <button className="drag-handle" {...attributes} {...listeners}>
          ☰
        </button>
        <button className="remove-btn" onClick={() => onRemove(id)}>
          ×
        </button>
      </div>
      {children}
    </div>
  );
};

const PageBuilder = () => {
  const [template, setTemplate] = useLocalStorage('militaryTemplate', {
    version: "1.0",
    widgets: [],
  });
  
  const [activeId, setActiveId] = useState(null);
  const [savedTemplate, setSavedTemplate] = useState(template);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const widgetTypes = [
    { type: 'news', name: 'Новости' },
    { type: 'schedule', name: 'Расписание' },
    { type: 'duty', name: 'Дежурный' },
    { type: 'announcement', name: 'Объявления' },
    { type: 'gallery', name: 'Галерея' },
    { type: 'contacts', name: 'Контакты' },
  ];

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      setTemplate(prev => ({
        ...prev,
        widgets: arrayMove(
          prev.widgets,
          prev.widgets.findIndex(w => w.id === active.id),
          prev.widgets.findIndex(w => w.id === over.id)
        ),
      }));
    }
    setActiveId(null);
  };

  const addWidget = (type) => {
    const newWidget = {
      id: Date.now(),
      type,
      settings: { visible: true }
    };
    setTemplate(prev => ({
      ...prev,
      widgets: [...prev.widgets, newWidget]
    }));
  };

  const removeWidget = (id) => {
    setTemplate(prev => ({
      ...prev,
      widgets: prev.widgets.filter(w => w.id !== id)
    }));
  };

  const handleSave = () => {
    setSavedTemplate(template);
    
  };

  const handleReset = () => {
    setTemplate(savedTemplate);
  };
  const dutyOfficer = {
    rank:'Майор',
    name:'Кукушкин М.О',
    phone:'89999999999',
  }
  const sheduleData = [
    {
      group:'ЦИС-49',
      location:'каб 403',
      discipline:'Высш мат',
      teacher:'Корягин В.В.'
    },
    {
      group:'ЦИС-49',
      location:'каб 403',
      discipline:'Высш мат',
      teacher:'Корягин В.В.'
    },
    {
      group:'ЦИС-49',
      location:'каб 403',
      discipline:'Высш мат',
      teacher:'Корягин В.В.'
    },
    {
      group:'ЦИС-49',
      location:'каб 403',
      discipline:'Высш мат',
      teacher:'Корягин В.В.'
    },
    {
      group:'ЦИС-49',
      location:'каб 403',
      discipline:'Высш мат',
      teacher:'Корягин В.В.'
    },
  ]
  const newsItem = [
    {
    title:'Новые противогазы',
    description:'Завезены новые противогазы',
    date:'10.05.2025'
  },
  {
    title:'Всем по АК',
    description:'Минобороны предложило ...',
    date:'12.05.2025'
  },
  {
    title:'Сдача нормативов',
    description:'Курсанты сдают нормативы на 5+',
    date:'11.05.2025'
  }]
  return (
    <div className="page-builder-container">
      <div className="builder-main">
        <div className="widgets-panel">
          <h3>Доступные компоненты</h3>
          <div className="widgets-list">
            {widgetTypes.map((widget) => (
              <button
                key={widget.type}
                className="widget-type"
                onClick={() => addWidget(widget.type)}
              >
                {widget.name}
              </button>
            ))}
          </div>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="construction-area" >
            <SortableContext
              items={template.widgets}
              strategy={rectSortingStrategy}
              
            >
              {template.widgets.map(widget => (
                <SortableItem
                  key={widget.id}
                  id={widget.id}
                  onRemove={removeWidget}
                  style={{
                    gridColumn: widget.layout?.col || 'auto',
                    gridRow: widget.layout?.row || 'auto'
                  }}
                >
                 <div className={`widget-preview ${widget.type}`}>
  {(() => {
    switch(widget.type) {
      case 'news':
        return <NewsSlider items={newsItem}/>;
      case 'schedule':
        return <MTCSchedule data={sheduleData}/>;
      case 'duty':
        return <DutyOfficer info={dutyOfficer}/>;
      case 'announcement':
        return 'Объявления';
      case 'gallery':
        return 'Галерея';
      case 'contacts':
        return 'Контакты';
      default:
        return 'Неизвестный виджет';
    }
  })()}
</div>
                </SortableItem>
              ))}
            </SortableContext>
          </div>

          <DragOverlay>
            {activeId ? (
              <div className="widget-preview dragging">
                {template.widgets.find(w => w.id === activeId)?.type}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
      
      <div className="controls-footer">
        <button className="btn primary" onClick={handleSave}>
          Сохранить шаблон
        </button>
        <button className="btn" onClick={() => localStorage.setItem('militaryTemplate', JSON.stringify(template))}>
          Установить шаблон
        </button>
        <button className="btn danger" onClick={handleReset}>
          Отменить изменения
        </button>
      </div>
    </div>
  );
};

export default PageBuilder;