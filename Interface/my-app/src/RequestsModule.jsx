import React, { useState } from 'react';
import './RequestsModule.css';

const RequestsModule = ({ requests, onUpdateRequest, onModalToggle, onClose }) => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [editedRequest, setEditedRequest] = useState(null);

  const handleRequestClick = (request) => {
    setSelectedRequest(request);
    setEditedRequest({ ...request });
    onModalToggle(true);
  };

  const handleStatusChange = (e) => {
    setEditedRequest({
      ...editedRequest,
      status: e.target.value
    });
  };

  const saveChanges = () => {
    if (typeof onUpdateRequest === 'function') {
      onUpdateRequest(editedRequest);
    }
    handleClose(); 
  };
  const handleClose = () => {
    setSelectedRequest(null);
    onModalToggle(false);
    onClose(); // Уведомляем о закрытии модалки
  };

  return (
    <div className="requests-module">
      <h2>Активные заявки ({requests.length})</h2>
      
      <div className="requests-list">
        {requests.map(request => (
          <div 
            key={request.id}
            className="request-card"
            onClick={() => handleRequestClick(request)}
          >
            <div className="request-header">
              <h3>{request.student}</h3>
              <span className={`status-badge ${request.status.toLowerCase().replace(' ', '-')}`}>
                {request.status}
              </span>
            </div>
            <p className="problem-preview">{request.problem}</p>
            <p className="request-date">{request.date}</p>
          </div>
        ))}
      </div>

      {selectedRequest && (
        <div className="modal-overlay_r" onClick={handleClose}>
          <div className="request-modal_r" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header_r">
              <h2>Детали заявки #{selectedRequest.id}</h2>
              <button 
                className="close-btn_r"
                onClick={handleClose}
              >
                &times;
              </button>
            </div>

            <div className="modal-content_r">
              <div className="request-info_r">
                <div className="info-row_r">
                  <span className="label_r">Студент:</span>
                  <span>{editedRequest.student}</span>
                </div>
                
                <div className="info-row_r">
                  <span className="label_r">Дата:</span>
                  <span>{editedRequest.date}</span>
                </div>

                <div className="info-row_r">
                  <span className="label_r">Статус:</span>
                  <select
                    value={editedRequest.status}
                    onChange={handleStatusChange}
                    className="status-select"
                  >
                    <option value="Отправлена">Отправлена</option>
                    <option value="На рассмотрении">На рассмотрении</option>
                    <option value="Рассмотрена">Рассмотрена</option>
                    <option value="Закрыта">Закрыта</option>
                  </select>
                </div>

                <div className="info-row_r full-width_r">
                  <span className="label_r">Описание проблемы:</span>
                  <p className="problem-description_r">{editedRequest.problem}</p>
                </div>
              </div>

              <button 
                className="save-btn_r"
                onClick={saveChanges}
              >
                Сохранить изменения
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestsModule;