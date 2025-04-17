import React, { useState, useEffect } from 'react';
import './AdminPanel.css';
import RequestsModule from './RequestsModule';
import AddUserModal from './AddUserModal';

const AdminPanel = () => {
  const handleRequestModalClose = () => {
    setIsRequestModalOpen(false);
  };
 const [isAddModalOpen, setIsAddModalOpen] = useState(false);
 const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const handleAddUser = (newUser) => {
    // Логика добавления пользователя
    console.log('Добавлен пользователь:', newUser);
  };
  const [users, setUsers] = useState([
    { id: 1, name: 'Иванов Иван Иванович', group: 'ЦИС-49', role: 'студент' },
    { id: 2, name: 'Петрова Анна Сергеевна', group: 'ПИ-31', role: 'преподаватель' },
    { id: 1, name: 'Иванов Иван Иванович', group: 'ЦИС-49', role: 'студент' },
    { id: 2, name: 'Петрова Анна Сергеевна', group: 'ПИ-31', role: 'преподаватель' },
    { id: 1, name: 'Иванов Иван Иванович', group: 'ЦИС-49', role: 'студент' },
    { id: 2, name: 'Петрова Анна Сергеевна', group: 'ПИ-31', role: 'преподаватель' },
    // ... другие пользователи
  ]);
  const [requests, setRequests] = useState([
    {
      id: 1,
      student: 'Иванов Иван Иванович',
      group: 'ЦИС-49',
      problem: 'Не работает личный кабинет',
      date: '2024-04-15',
      status: 'Отправлена'
    },
    {
        id: 2,
        student: 'Иванов Иван Иванович',
        group: 'ЦИС-49',
        problem: 'Не работает личный кабинет',
        date: '2024-04-15',
        status: 'Отправлена'
    },
    {
        id: 3,
        student: 'Иванов Иван Иванович',
        group: 'ЦИС-49',
        problem: 'Не работает личный кабинет',
        date: '2024-04-15',
        status: 'Отправлена'
      }

  ]);
  const handleUpdateRequest = (updatedRequest) => {
    setRequests(prev => 
      prev.map(req => req.id === updatedRequest.id ? updatedRequest : req)
    );
  };
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [editedUser, setEditedUser] = useState(null);
  const handleDelete = () => {
    setUsers(users.filter(user => user.id !== editedUser.id));
    setSelectedUser(null);
  };

  const handleBlock = () => {
    setEditedUser({ ...editedUser, isBlocked: !editedUser.isBlocked });
    setUsers(users.map(user => 
      user.id === editedUser.id ? { ...user, isBlocked: !user.isBlocked } : user
    ));
  };
  // Фильтрация пользователей
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Открытие формы редактирования
  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditedUser({ ...user });
  };

  // Сохранение изменений
  const handleSave = () => {
    setUsers(users.map(user => 
      user.id === editedUser.id ? editedUser : user
    ));
    setSelectedUser(null);
  };

  // Обработчик изменений в форме
  const handleChange = (e) => {
    setEditedUser({
      ...editedUser,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="admin-container">
      <h1>Панель администратора ЯГТУ</h1>
      {/* Поиск */}
      <div className="admin-layout">
        {/* Блок заявок справа сверху */}
        <div className="requests-column">
          <RequestsModule requests={requests} onUpdateRequest={handleUpdateRequest} onModalToggle={setIsRequestModalOpen} onClose={handleRequestModalClose}/>
        </div>
        <div className="users-column">
        <h2>Пользователи</h2>
        <button  className="add-user-btn" onClick={() => setIsAddModalOpen(true)} disabled={isRequestModalOpen}>Добавить пользователя</button>
        <AddUserModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAddUser={handleAddUser}
        />
      <div className="search-box">
      
        <input
          type="text"
          placeholder="Поиск по ФИО"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Список пользователей */}
      <div className="users-list">
        
        {filteredUsers.map(user => (
          <div 
            key={user.id} 
            className="user-card"
            onClick={() => handleEdit(user)}
          >
            <h3>{user.name}</h3>
            <p>Группа: {user.group}</p>
            <p>Роль: {user.role}</p>
          </div>
        ))}
      </div>
      </div>
      </div>
      
      {/* Модальное окно редактирования */}
      {selectedUser && (
        <div className="edit-modal">
          <div className="modal-content_admin">
            <div className="modal-header_admin">
              <h2>Редактирование пользователя</h2>
              <button 
                className="close-btn"
                onClick={() => setSelectedUser(null)}
              >
                &times;
              </button>
            </div>
            
            <form>
              <div className="form-group">
                <label>ФИО:</label>
                <input
                  type="text"
                  name="name"
                  value={editedUser.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Группа:</label>
                <input
                  type="text"
                  name="group"
                  value={editedUser.group}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Роль:</label>
                <select 
                  name="role" 
                  value={editedUser.role} 
                  onChange={handleChange}
                >
                  <option value="студент">Студент</option>
                  <option value="преподаватель">Преподаватель</option>
                </select>
              </div>

              <div className="modal-buttons">
                <button 
                  type="button" 
                  className="save-btn"
                  onClick={handleSave}
                >
                  Сохранить изменения
                </button>

                <button
                  type="button"
                  className="block-btn"
                  onClick={handleBlock}
                >
                  {editedUser.isBlocked ? 'Разблокировать' : 'Заблокировать'}
                </button>
                
                <button
                  type="button"
                  className="delete-btn"
                  onClick={handleDelete}
                >
                  Удалить пользователя
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;