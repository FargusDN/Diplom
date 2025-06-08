import { useState } from 'react';
import userLogo from "./imgs/userLogo.jpg"
import "./MilitaryCenterZayavky.css"

// Компонент заявки
const Zayavka = ({ application, onClick }) => {
  return (
    <div 
      className="military-application-card"
      onClick={() => onClick(application)}
    >
      <h4>{application.fullName}</h4>
      <p>Курс: {application.course}</p>
      <p>Направление: {application.department}</p>
      <p>Статус: {application.status}</p>
    </div>
  );
};

// Модальное окно заявки
const ApplicationModal = ({ application, onClose, onStatusChange }) => {
  const [status, setStatus] = useState(application.status);
  const [reason, setReason] = useState('');

  const handleSave = () => {
    onStatusChange(application.id, status, reason);
    onClose();
  };

  return (
    <div className="military-modal-overlay" onClick={onClose}>
      <div className="military-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="military-modal-close-btn" onClick={onClose}>×</button>
        
        <div className="military-application-details">
          <div className="military-student-photo">
            <img src={application.photo} alt={application.fullName} />
            <div className="military-student-info">
            <h2>{application.fullName}</h2>
            <p>Курс: {application.course}</p>
            <p>Группа: {application.group}</p>
            <p>Направление: {application.department}</p>
          </div>
          </div>
          
          

          <div className="military-attachments">
            <h3>Прикрепленные документы:</h3>
            {application.attachments.map((file, index) => (
              <a 
                key={index} 
                href={file.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="military-file-link"
              >
                {file.name}
              </a>
            ))}
          </div>

          <div className="military-status-control">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="military-status-select"
            >
              <option value="pending">На рассмотрении</option>
              <option value="approved">Одобрить</option>
              <option value="rejected">Отклонить</option>
            </select>

            {status === 'rejected' && (
              <textarea
                placeholder="Причина отклонения..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="military-reason-input"
              />
            )}

            <button 
              onClick={handleSave}
              className="military-save-btn"
            >
              Сохранить изменения
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Основной компонент
const MilitaryCenterZayavky = () => {
  const [applications, setApplications] = useState([
    {
      id: 1,
      fullName: 'Иванов Иван Иванович',
      course: 3,
      group: 'ВУЦ-21',
      department: 'Кибербезопасность',
      photo: userLogo,
      attachments: [
        { name: 'Согласие.pdf', url: '/path/to/file.pdf' }
      ],
      status: 'pending'
    },
    // ... другие заявки
  ]);

  const [selectedApplication, setSelectedApplication] = useState(null);

  const handleStatusChange = (id, newStatus, reason) => {
    setApplications(prev => prev.map(app => 
      app.id === id ? { ...app, status: newStatus, rejectionReason: reason } : app
    ));
  };

  return (
    <div className="user-management">
      <h2>Заявки в ВУЦ</h2>
      <div className="military-applications-list">
        {applications.map(app => (
          <Zayavka 
            key={app.id}
            application={app}
            onClick={setSelectedApplication}
          />
        ))}
      </div>

      {selectedApplication && (
        <ApplicationModal
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
};

export default MilitaryCenterZayavky;