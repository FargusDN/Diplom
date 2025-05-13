import React from 'react';
import './MTC.css';
import Header from './Header';
import Footer from './Footer';
import NewsSlider from './NewsSlider';
import MTCSchedule from './MTCSchedule';
import DutyOfficer from './DutyOfficer';

const WidgetRenderer = ({ widget, data }) => {
  if (!widget.settings.visible) return null;

  return (
    <section className="mtc-widget">
      <h2>{widget.settings.title}</h2>
      {widget.type === 'news' && <NewsSlider items={data} />}
      {widget.type === 'schedule' && <MTCSchedule data={data} />}
      {widget.type === 'duty' && <DutyOfficer info={data} />}
    </section>
  );
};

const MTC = ({ template }) => {
  if (!template || !template.layout) {
    return <div className="mtc-loading">Загрузка данных...</div>;
  }

  return (
    <div className="mtc-container">
      <Header />
      
      <main className="mtc-main-content">
        {template.layout.map(widget => (
          <WidgetRenderer
            key={widget.id}
            widget={widget}
            data={template.dataSources[widget.type]}
          />
        ))}
      </main>

      <Footer />
    </div>
  );
};

export default MTC;