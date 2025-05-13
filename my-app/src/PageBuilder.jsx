import React, { useState } from 'react';
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import NewsSlider from './NewsSlider';
import MTCSchedule from './MTCSchedule';
import DutyOfficer from './DutyOfficer';
import './PageBuilder.css';
import PropTypes from 'prop-types';

const SortableWidget = ({ id, children, onRemove, onToggleVisibility, isVisible }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
      cursor: 'move'
    };
  return (
    <div ref={setNodeRef} style={style} className="sortable-widget">
      <div className="widget-controls">
        <button onClick={onToggleVisibility}>
          {isVisible ? 'Скрыть' : 'Показать'}
        </button>
        <button onClick={onRemove}>Удалить</button>
        <span className="drag-handle" {...attributes} {...listeners}>☰</span>
      </div>
      <div className="widget-content">
        {children}
      </div>
    </div>
  );
};
const defaultTemplate = {
    version: "1.1",
    layout: [],
    dataSources: {
      news: [],
      schedule: [],
      duty: null
    }
  };
  
const PageBuilder = ({ currentTemplate, onTemplateUpdate }) => {
    const [template, setTemplate] = useState(currentTemplate || defaultTemplate);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!active || !over) return;

    setTemplate(prev => ({
      ...prev,
      layout: arrayMove(prev.layout, 
        prev.layout.findIndex(w => w.id === active.id),
        prev.layout.findIndex(w => w.id === over.id)
    )}));
  };

  const addWidget = (type) => {
    const newWidget = {
      id: `widget-${Date.now()}`,
      type,
      settings: {
        visible: true,
        ...(type === 'news' && { title: 'Новости', maxItems: 3 }),
        ...(type === 'schedule' && { title: 'Расписание' }),
        ...(type === 'duty' && { title: 'Дежурный' })
      }
    };
    
    setTemplate(prev => ({
      ...prev,
      layout: [...prev.layout, newWidget]
    }));
  };

  const removeWidget = (widgetId) => {
    setTemplate(prev => ({
      ...prev,
      layout: prev.layout.filter(w => w.id !== widgetId)
    }));
  };

  const toggleVisibility = (widgetId) => {
    setTemplate(prev => ({
      ...prev,
      layout: prev.layout.map(w => 
        w.id === widgetId 
          ? { ...w, settings: { ...w.settings, visible: !w.settings.visible } } 
          : w
      )
    }));
  };

  const handleSave = () => {
   
    if (typeof onTemplateUpdate === 'function') {
        onTemplateUpdate(template);
      } else {
        console.error('onTemplateUpdate должен быть функцией');
      }
    
  };
  PageBuilder.propTypes = {
    onTemplateUpdate: PropTypes.func.isRequired,
    currentTemplate: PropTypes.object
  };
  const renderWidgetPreview = (widget) => {
    const data = template.dataSources[widget.type]|| [];
    switch(widget.type) {
      case 'news':
        return <NewsSlider items={data.slice(0, widget.settings.maxItems)} />;
      case 'schedule':
        return <MTCSchedule data={data} />;
      case 'duty':
        return <DutyOfficer info={data} />;
      default:
        return null;
    }
  };

  return (
    <div className="page-builder">
      <div className="workspace">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={template.layout}
            strategy={verticalListSortingStrategy}
          >
            {template.layout.map(widget => (
              <SortableWidget
                key={widget.id}
                id={widget.id}
                isVisible={widget.settings.visible}
                onRemove={() => removeWidget(widget.id)}
                onToggleVisibility={() => toggleVisibility(widget.id)}
              >
                {renderWidgetPreview(widget)}
              </SortableWidget>
            ))}
          </SortableContext>
        </DndContext>
      </div>

      <div className="controls-panel">
        <h3>Доступные компоненты</h3>
        <div className="widget-selector">
          <div className="widget-option" onClick={() => addWidget('news')}>
            <h4>📰 Новостная лента</h4>
            <p>Актуальные новости и объявления</p>
          </div>
          
          <div className="widget-option" onClick={() => addWidget('schedule')}>
            <h4>📅 Расписание</h4>
            <p>График занятий и тренировок</p>
          </div>

          <div className="widget-option" onClick={() => addWidget('duty')}>
            <h4>🎖️ Дежурный</h4>
            <p>Информация о текущем дежурном</p>
          </div>
        </div>

        <div className="management-buttons">
          <button 
            className="save-btn"
            onClick={handleSave}
          >
            💾 Сохранить изменения
          </button>
          <button
            className="reset-btn"
            onClick={() => setTemplate(currentTemplate)}
          >
            ↩️ Сбросить изменения
          </button>
        </div>
      </div>
    </div>
  );
};
PageBuilder.defaultProps = {
    onTemplateUpdate: () => console.warn('onTemplateUpdate не передан'),
    currentTemplate: null
  };
  
  // Важно: Валидация пропсов
  PageBuilder.propTypes = {
    onTemplateUpdate: PropTypes.func,
    currentTemplate: PropTypes.shape({
      version: PropTypes.string,
      layout: PropTypes.array,
      dataSources: PropTypes.object
    })
  };
export default PageBuilder;