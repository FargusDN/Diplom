import React from 'react';
import { useSyncedLocalStorage } from './hooks/useSyncedLocalStorage';
import NewsSlider from './NewsSlider';
import MTCSchedule from './MTCSchedule'
import DutyOfficer from './DutyOfficer'

const MTC = () => {
  const [template] = useSyncedLocalStorage('militaryTemplate', {
    version: "1.0",
    widgets: []
  });
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
},
]
  return (
    <div className="display">
      {template.widgets.map(widget => (
        <div key={widget.id} className="widget" >
          {widget.type === 'news' && (
            <NewsSlider items={newsItem}/>
          )}
          
          {widget.type === 'schedule' && (
            <MTCSchedule data={sheduleData}/>
          )}
          {widget.type === 'duty' && (
            <DutyOfficer info={dutyOfficer}/>
          )}
        </div>
      ))}
    </div>
  );
};

export default MTC;