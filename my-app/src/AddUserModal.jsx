// components/AddUserModal.js
import React, { useState } from 'react';
import './AddUserModal.css';

const AddUserModal = ({ isOpen, onClose, onAddUser }) => {
  const [activeTab, setActiveTab] = useState('single');
  const [formData, setFormData] = useState({
    name: '',
    role: 'student',
    enrollmentType: 'new',
    faculty: '',
    group: '',
    file: null
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === 'single') {
      onAddUser({
        name: formData.name,
        role: formData.role,
        ...(formData.role === 'student' && {
          enrollmentType: formData.enrollmentType,
          faculty: formData.faculty,
          group: formData.group
        })
      });
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="add-user-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-tabs">
          <button
            className={`tab-btn2 ${activeTab === 'single' ? 'active' : ''}`}
            onClick={() => setActiveTab('single')}
          >
            Одиночное добавление
          </button>
          <button
            className={`tab-btn2 ${activeTab === 'multiple' ? 'active' : ''}`}
            onClick={() => setActiveTab('multiple')}
          >
            Множественное добавление
          </button>
        </div>

        <form className="modal-content" onSubmit={handleSubmit}>
          {activeTab === 'single' ? (
            <div className="single-add-form">
              <div className="form-group">
                <label>ФИО:</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Роль:</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value="student">Студент</option>
                  <option value="teacher">Преподаватель</option>
                </select>
              </div>

              {formData.role === 'student' && (
                <>
                  <div className="form-group">
                    <label>Тип зачисления:</label>
                    <select
                      value={formData.enrollmentType}
                      onChange={(e) => setFormData({...formData, enrollmentType: e.target.value})}
                    >
                      <option value="new">Новый</option>
                      <option value="restore">Восстановление</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Факультет:</label>
                    <input
                      type="text"
                      required
                      value={formData.faculty}
                      onChange={(e) => setFormData({...formData, faculty: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label>Группа:</label>
                    <input
                      type="text"
                      required
                      value={formData.group}
                      onChange={(e) => setFormData({...formData, group: e.target.value})}
                    />
                  </div>
                </>
              )}
              <button type="submit" className="submit-btn">
                Добавить пользователя
              </button>
            </div>
          ) : (
            <div className="multiple-add-form">
              <div className="form-group">
                <label>Загрузить файл (.xlsx, .csv):</label>
                <input
                  type="file"
                  accept=".xlsx,.csv"
                  onChange={(e) => setFormData({...formData, file: e.target.files[0]})}
                />
              </div>
              {formData.file && (
                <div className="file-preview">
                  Выбран файл: {formData.file.name}
                </div>
              )}
              <button type="button" className="submit-btn">
                Добавить пользователей
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;