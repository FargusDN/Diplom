import React from "react";
import "../src/Zayavky.css"
import { useState } from 'react';


const Zayavky = ()=>{

    const [selectedApp, setSelectedApp] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        type: '',
        serviceType: '',
        problemDescription: '',
      });

      const serviceOptions = [
        'Справка подтверждающая обучение',
        'Справка-вызов на сессию для заочников',
        'Справка о стипендии за период',
        'Заявка на заселение в общежитие',
        'Справка о проживании в общежитии',
        'Заявка на выезд из общежития',
        'Заявка на возвращение в общежитие',
        'Копия документа о предыдущем образовании (не для выпускников)',
        'Заявка на автопарковку корп.А и студенческую автопарковку ЯГТУ',
        'Запись на Вакцинацию',
        'Запись на Ре-Вакцинацию',
        'Заявка на ремонт общежития',
        'Заявление на конкурс на назначение стипендии',
        'Справка о составе семьи',
      ];
    
      const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
          ...prev,
          [name]: value,
          ...(name === 'type' && { serviceType: '', problemDescription: '' }),
        }));
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        // Логика создания новой заявки
        const newApplication = {
          id: applications.length + 1,
          date: new Date().toLocaleDateString(),
          title: formData.type === 'Получение услуг' ? formData.serviceType : 'Техническая заявка',
          type: formData.type,
          department: 'Г-104 ИЦ', // Пример значения
          status: 'Создана',
          ...(formData.type === 'Техническая' && { notes: formData.problemDescription }),
        };
    
        // Добавление в список заявок (нужно подключить состояние applications)
        setShowAddForm(false);
        setFormData({ type: '', serviceType: '', problemDescription: '' });
      };
    // Пример данных
    const [applications] = useState([
      {
        id: 1,
        date: '17.09.2021',
        title: 'Справка по месту требования',
        type: 'Получение услуг',
        department: 'Г-104 ИЦ',
        status: 'Готова',
        completionDate: '20.09.2021',
        notes: 'Готова к выдаче'
      },
      {
        id: 2,
        date: '11.11.2022',
        title: 'Заявка на автопарковку',
        type: 'Техническая',
        department: 'Управление по безопасности',
        status: 'Отклонена',
        rejectionReason: 'Неправильное заполнение'
      },
      // ... остальные заявки
    ]);
  
    const handleCloseModal = () => setSelectedApp(null);
  
    return (
      <div className="applications-container">
        <table className="applications-table">
          <thead>
            <tr>
              <th>№</th>
              <th>Дата</th>
              <th>Заявка</th>
              <th>Тип</th>
              <th>Отдел</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {applications.map(app => (
              <tr key={app.id} onClick={() => setSelectedApp(app)}>
                <td>{app.id}</td>
                <td>{app.date}</td>
                <td>{app.title}</td>
                <td>{app.type}</td>
                <td>{app.department}</td>
                <td >
                  <div className={`status status-${app.status.toLowerCase().replace(' ', '-')}`}>{app.status}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
  
        {selectedApp && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="application-modal" onClick={(e) => e.stopPropagation()}>
              <button 
                className="close-btn"
                onClick={handleCloseModal}
              >
                &times;
              </button>
              
              <h2>{selectedApp.title}</h2>
              
              <div className="modal-section">
                <div className="modal-row">
                  <span>Дата создания:</span>
                  <span>{selectedApp.date}</span>
                </div>
                
                <div className="modal-row">
                  <span>Тип заявки:</span>
                  <span>{selectedApp.type}</span>
                </div>
  
                {selectedApp.status === 'Готова' && (
                  <div className="modal-row">
                    <span>Дата выполнения:</span>
                    <span>{selectedApp.completionDate}</span>
                  </div>
                )}
  
                {selectedApp.status === 'Отклонена' && (
                  <div className="modal-row">
                    <span>Причина отклонения:</span>
                    <span>{selectedApp.rejectionReason || 'Не указана'}</span>
                  </div>
                )}
              </div>
  
              <div className="modal-section">
                <h4>Замечания:</h4>
                <p>{selectedApp.notes || 'Отсутствуют'}</p>
              </div>
            </div>
          </div>
        )}
        <button 
        className="add-button"
        onClick={() => setShowAddForm(true)}
      >
        Добавить заявку
      </button>

      {showAddForm && (
        <div className="modal-overlay" onClick={() => setShowAddForm(false)}>
          <div className="application-form" onClick={(e) => e.stopPropagation()}>
            <button 
              className="close-btn"
              onClick={() => setShowAddForm(false)}
            >
              &times;
            </button>

            <h2>Новая заявка</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Тип заявки:</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Выберите тип</option>
                  <option value="Получение услуг">Получение услуг</option>
                  <option value="Техническая">Техническая</option>
                </select>
              </div>

              {formData.type === 'Получение услуг' && (
                <div className="form-group">
                  <label>Вид услуги:</label>
                  <select
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="">Выберите услугу</option>
                    {serviceOptions.map((option, index) => (
                      <option key={index} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              )}

              {formData.type === 'Техническая' && (
                <div className="form-group">
                  <label>Описание проблемы:</label>
                  <textarea
                    name="problemDescription"
                    value={formData.problemDescription}
                    onChange={handleFormChange}
                    required
                    rows="4"
                  />
                </div>
              )}

              <button type="submit" className="submit-button">
                Создать заявку
              </button>
            </form>
          </div>
        </div>
      )}
      </div>
    );
}
export default Zayavky