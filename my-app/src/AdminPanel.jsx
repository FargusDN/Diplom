import React, { useState, useEffect } from 'react';
import './AdminPanel.css'

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([
    { id: 1, login: 'admin', email: 'admin@university.edu', role: 'Администратор', regDate: '2023-01-15' },
    { id: 2, login: 'ivanov', email: 'ivanov@university.edu', role: 'Преподаватель', regDate: '2023-02-20' }
  ]);
  const [editData, setEditData] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [newUser, setNewUser] = useState({
    login: '',
    password: '',
    email: '',
    role: 'Студент'
  });
  
  const [selectedFile, setSelectedFile] = useState(null);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleInputChange = (e) => {
    setNewUser({
      ...newUser,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newUserWithId = {
      ...newUser,
      id: users.length + 1,
      regDate: new Date().toISOString().split('T')[0]
    };
    setUsers([...users, newUserWithId]);
    setNewUser({ login: '', password: '', email: '', role: 'Студент' });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };
  const [loading, setLoading] = useState(false);

  // Загрузка данных при монтировании
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    } finally {
      setLoading(false);
    }
  };
  const startEditing = (user) => {
    setEditingId(user.id);
    setEditData({...user});
  };
  const handleEditChange = (e, field) => {
    setEditData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };
const saveChanges = async () => {
    if (!editingId) return;

    try {
      // Отправка изменений на сервер
      await fetch(`/api/users/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData)
      });

      // Обновление локального состояния
      setUsers(users.map(user => 
        user.id === editingId ? {...user, ...editData} : user
      ));
      
      setEditingId(null);
    } catch (error) {
      console.error('Ошибка обновления:', error);
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      saveChanges();
    }
  };
  const handleResetPassword = async (userId) => {
    if (!window.confirm('Сбросить пароль?')) return;
    
    try {
      await fetch(`/api/users/${userId}/reset-password`, { method: 'POST' });
      alert('Новый пароль отправлен на email');
    } catch (error) {
      console.error('Ошибка сброса:', error);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Удалить пользователя?')) return;

    try {
      await fetch(`/api/users/${userId}`, { method: 'DELETE' });
      setUsers(users.filter(u => u.id !== userId));
    } catch (error) {
      console.error('Ошибка удаления:', error);
    }
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div className="admin-panel">
      <h1>Панель администрирования ИС ЯГТУ</h1>
      
      <div className="tabs">
        <button 
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => handleTabClick('users')}
        >
          Управление пользователями
        </button>
        <button
          className={activeTab === 'backups' ? 'active' : ''}
          onClick={() => handleTabClick('backups')}
        >
          Резервные копии и мониторинг
        </button>
        <button
          className={activeTab === 'accounts' ? 'active' : ''}
          onClick={() => handleTabClick('accounts')}
        >
          Учетные записи
        </button>
      </div>

      {activeTab === 'users' && (
        <div className="user-management">
          <div className="create-user">
            <h2>Создание нового пользователя</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Логин:</label>
                <input
                  type="text"
                  name="login"
                  value={newUser.login}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Пароль:</label>
                <input
                  type="password"
                  name="password"
                  value={newUser.password}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Роль:</label>
                <select
                  name="role"
                  value={newUser.role}
                  onChange={handleInputChange}
                >
                  <option value="Студент">Студент</option>
                  <option value="Преподаватель">Преподаватель</option>
                  <option value="Администратор">Администратор</option>
                </select>
              </div>

              <button type="submit" className="create-btn">
                Создать пользователя
              </button>
            </form>
          </div>

          <div className="csv-upload">
            <h3>Или загрузите пользователей из CSV-файла</h3>
            <div className="file-input2"> 
                <input 
                  type="file" 
                  accept=".csv" 
                  onChange={handleFileChange} 
                  placeholder='Выбор файла'
                />
              <button className="upload-btn">Загрузить CSV</button>
            </div>
            <p className="file-requirements">
              Файл должен содержать колонки: Логин, Пароль, Email, Роль
            </p>
          </div>

     
        </div>
      )}
      {activeTab === 'backups' &&(
        <div className="backup-management">
        <h2>Управление резервными копиями</h2>
        <div className="backup-buttons">
          <button className="backup-btn">Создать резервную копию</button>
          <button className="backup-btn">Восстановить из копии</button>
          <button className="backup-btn">Загрузить последнюю копию</button>
        </div>
    
        <div className="monitoring">
          <h3>Мониторинг активности сайта</h3>
          <div className="monitoring-graph">
            График посещаемости за последние 30 дней
          </div>
        </div>
      </div>
      )}
{activeTab === 'accounts' && (
  <div className="accounts-management">
    <h2>Управление учетными записями пользователей</h2>

    <div className="search-bar">
      <input type="text" placeholder="Поиск пользователей..." />
      <button>Найти</button>
    </div>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Логин</th>
          <th>Email</th>
          <th>Роль</th>
          <th>Дата регистрации</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
      {users.map(user => (
          <tr key={user.id}>
            <td>
              {user.id}
            </td>
            <td>
              {editingId === user.id ? (
                <input
                  value={editData.login}
                  onChange={(e) => handleEditChange(e, 'login')}
                  onKeyDown={handleKeyPress}
                />
              ) : user.login}
            </td>
            
            <td>
              {editingId === user.id ? (
                <input
                  value={editData.email}
                  onChange={(e) => handleEditChange(e, 'email')}
                  onKeyDown={handleKeyPress}
                />
              ) : user.email}
            </td>

            <td>
              {editingId === user.id ? (
                <select
                  value={editData.role}
                  onChange={(e) => handleEditChange(e, 'role')}
                  onKeyDown={handleKeyPress}
                >
                  <option value="Администратор">Администратор</option>
                  <option value="Преподаватель">Преподаватель</option>
                </select>
              ) : user.role}
            </td>

            <td>
              {editingId === user.id ? (
                <input
                  type="date"
                  value={editData.regDate}
                  onChange={(e) => handleEditChange(e, 'registrationDate')}
                  onKeyDown={handleKeyPress}
                />
              ) : user.regDate}
            </td>

            <td>
              {editingId === user.id ? (
                <button className='action-btn save' onClick={saveChanges}>Сохранить</button>
              ) : (
                <>
                  <button className='action-btn edit' onClick={() => startEditing(user)}>Редактировать</button>
                  <button className='action-btn reset' onClick={() => handleResetPassword(user.id)}>Сбросить пароль</button>
                  <button className='action-btn delete' onClick={() => handleDelete(user.id)}>Удалить</button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    <div className="pagination">
      <button className="active">1</button>
      <button>2</button>
      <button>3</button>
      <button>...</button>
      <button>10</button>
    </div>
  </div>
)}
    </div>
  );
};

export default AdminPanel;