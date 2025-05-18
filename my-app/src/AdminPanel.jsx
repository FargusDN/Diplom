import React, { useState, useEffect } from 'react';
import './AdminPanel.css'
import MilitaryCenter from './MilitaryCenter';
import MTC from './MTC';
import PageBuilder from './PageBuilder';
import MilitaryCenterMaterial from './MilitaryCenterMaterial';
import MilitaryCenterZayavky from './MilitaryCenterZayavky';

const AdminPanel = () => {
  const [notificationTemplates, setNotificationTemplates] =useState([
    {
      id: 1,
      name: "Экстренная эвакуация",
      recipientType: "all",
      importance: "critical",
      message: "ВНИМАНИЕ! Незамедлительно покиньте здание по маршрутам эвакуации!"
    },
    {
      id: 2,
      name: "Персональное задание",
      recipientType: "specific",
      recipientUser: {
        id: 34,
        fio: "Иванов А.С.",
        email: "ivanov@example.com"
      },
      importance: "important",
      message: "Алексей, ваш отчет по инвентаризации ожидает проверки. Срок сдачи - до пятницы."
    }
  ]); // Ваши шаблоны
const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([
    { id: 1, login: 'admin', email: 'admin@university.edu', fio:'Иванов Иван Иванович', kyrs:2,napr:'ИЦС', role: 'Администратор', regDate: '2023-01-15', vycRole:'Администратор', },
    { id: 2, login: 'ivanov', email: 'ivanov@university.edu',fio:'Петров Петр Петрович', kyrs:4,napr:'ЭКОНОМ', role: 'Преподаватель', regDate: '2023-02-20', vycRole:'Преподаватель', }
  ]);
  const [recipientType, setRecipientType] = useState('all');
  const [searchResults, setSearchResults] = useState([
    { id: 1, login: 'admin', email: 'admin@university.edu', fio:'Иванов Иван Иванович', kyrs:2,napr:'ИЦС', role: 'Администратор', regDate: '2023-01-15', vycRole:'Администратор', },
    { id: 2, login: 'ivanov', email: 'ivanov@university.edu',fio:'Петров Петр Петрович', kyrs:4,napr:'ЭКОНОМ', role: 'Преподаватель', regDate: '2023-02-20', vycRole:'Преподаватель', }
  ]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [importance, setImportance] = useState('normal');
  const [message, setMessage] = useState('');
  const [editData, setEditData] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [newUser, setNewUser] = useState({
    login: '',
    password: '',
    email: '',
    role: 'Студент'
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [notification, setNotification] = useState({
    recipient: 'all',
    importance: 'normal',
    message: ''
  });
  const [activeRequests, setActiveRequests] = useState([
    {
      id: 1,
      status: 'Создана',
      userName: 'Иванов Иван Иванович',
      date: '09-05-2025'
    },
    {
      id: 2,
      status: 'В работе',
      userName: 'Иванов Иван Иванович',
      date: '09-05-2025'
    }
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedFile, setSelectedFile] = useState(null);
  
  const updateStatus = (newStatus) => {
    setActiveRequests(activeRequests.map(req => 
      req.id === selectedRequestId ? {...req, status: newStatus} : req
    ));
    setIsModalOpen(false);
  };
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleInputChange = (e) => {
    setNewUser({
      ...newUser,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitNewUser = (e) => {
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
  useEffect(() => {
    if (searchQuery.length > 2) {
      fetch(`/api/users/search?q=${searchQuery}`)
        .then(res => res.json())
        .then(data => setUsers(data));
    }
  }, [searchQuery]);
  useEffect(() => {
    fetch('/api/requests/active')
      .then(res => res.json())
      .then(data => setActiveRequests(data));
  }, []);
  

  const handleNotificationSubmit = () => {
    fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notification)
    }).then(() => {
      setNotification({
        recipient: 'all',
        importance: 'normal',
        message: ''
      });
      alert('Уведомление успешно создано!');
    });
  };
  useEffect(() => {
    if (recipientType === 'specific' && searchQuery.length > 2) {
      const searchUsers = async () => {
        try {
          const response = await fetch(`/api/users?search=${searchQuery}`);
          const data = await response.json();
          setSearchResults(data);
        } catch (error) {
          console.error('Ошибка поиска:', error);
        }
      };
      
      const debounceTimer = setTimeout(searchUsers, 300);
      return () => clearTimeout(debounceTimer);
    }
  }, [searchQuery, recipientType]);

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
  

  // Выбор пользователя из результатов поиска
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setSearchQuery(user.fio); // Показываем имя в поле поиска
    setSearchResults([]); // Очищаем результаты
  };

  // Отправка уведомления
  const handleSubmit = async () => {
    // Валидация
    if (recipientType === 'specific' && !selectedUser) {
      alert('Пожалуйста, выберите пользователя');
      return;
    }

    const notificationData = {
      recipient: recipientType === 'all' ? 'all' : selectedUser.id,
      importance,
      message
    };

    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notificationData)
      });

      if (response.ok) {
        alert('Уведомление отправлено!');
        // Сброс формы
        setRecipientType('all');
        setSearchQuery('');
        setSelectedUser(null);
        setImportance('normal');
        setMessage('');
      }
    } catch (error) {
      console.error('Ошибка отправки:', error);
      alert('Не удалось отправить уведомление');
    }
  };

  return (
    <div className="admin-panel">
      <h1>Панель администрирования ИС ЯГТУ</h1>
      
      {window.location.href.includes("Militaryadmin") ?(
        <div className="tabs">
        <button 
          className={activeTab === 'usersMilitary' ? 'active' : ''}
          onClick={() => handleTabClick('usersMilitary')}
        >
          Управление заявками
        </button>
        <button
          className={activeTab === 'konstructor' ? 'active' : ''}
          onClick={() => handleTabClick('konstructor')}
        >
          Конструктор
        </button>
        <button
          className={activeTab === 'accounts' ? 'active' : ''}
          onClick={() => handleTabClick('accounts')}
        >
          Управление учетными записями
        </button>
        <button
          className={activeTab === 'Militarymessages' ? 'active' : ''}
          onClick={() => handleTabClick('Militarymessages')}
        >
          Управление уведомлениями
        </button>
        <button
          className={activeTab === 'material' ? 'active' : ''}
          onClick={() => handleTabClick('material')}
        >
          Материальный учет
        </button>
      </div>
      ):(
         <div className="tabs">
        <button 
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => handleTabClick('users')}
        >
          Добавление пользователей
        </button>
        <button
          className={activeTab === 'backups' ? 'active' : ''}
          onClick={() => handleTabClick('backups')}
        >
          Управление данными и мониторинг
        </button>
        <button
          className={activeTab === 'accounts' ? 'active' : ''}
          onClick={() => handleTabClick('accounts')}
        >
          Управление учетными записями
        </button>
        <button
          className={activeTab === 'messages' ? 'active' : ''}
          onClick={() => handleTabClick('messages')}
        >
          Управление уведомлениями
        </button>
      </div>
      )}



      {activeTab === 'Militarymessages' && (
  <>
    {/* Список шаблонов */}
    <div className='military-message'>
      <div className='military-message-active'>
        <h2>Шаблоны</h2>
    {notificationTemplates.map(template => (
      <div 
        key={template.id}
        className="template-item"
        onClick={() => {
          setSelectedTemplate(template);
          setIsTemplateModalOpen(true);
        }}
      >
        <div className="template-header">
          <h4>{template.name}</h4>
          <span className="template-recipient">
            {template.recipientType === 'all' 
              ? "Все пользователи" 
              : template.recipientUser?.fio || "Конкретный пользователь"}
          </span>
        </div>
        <div className="template-preview">
          <p>{template.message.substring(0, 50)}...</p>
        </div>
      </div>
    ))}
    
    {/* Модальное окно */}
    {isTemplateModalOpen && selectedTemplate && (
      <div className="modal-overlay" onClick={() => setIsTemplateModalOpen(false)}>
        <div className="status-modal" onClick={(e) => e.stopPropagation()}>
          <h2>{selectedTemplate.name}</h2>
          
          <div className="template-details">
            <div className="recipient-info">
              <strong>Получатель: </strong>
              {selectedTemplate.recipientType === 'all' 
                ? "Все пользователи"
                : selectedTemplate.recipientUser?.fio || "Не выбран"}
            </div>
    
            <div className="template-message">
              <label>Шаблон сообщения:</label>
              <textarea
                value={selectedTemplate.message}
                readOnly
                rows="6"
              />
            </div>
          </div>
    
          <div className="template-actions">
            <button 
              className="send-btn"
              onClick={() => {
                alert('Уведомление отправлено');
                setIsTemplateModalOpen(false);
              }}
            >
              Отправить уведомление
            </button>
            
            <button
              className="edit-btn"
              onClick={() => {
                setRecipientType(selectedTemplate.recipientType);
                setImportance(selectedTemplate.importance);
                setMessage(selectedTemplate.message);
                if (selectedTemplate.recipientUser) {
                  setSelectedUser(selectedTemplate.recipientUser);
                }
                setIsTemplateModalOpen(false);
              }}
            >
              Редактировать
            </button>
          </div>
    
          <button 
            className="close-btn_profile"
            onClick={() => setIsTemplateModalOpen(false)}
          >
            &times;
          </button>
        </div>
      </div>
    )}
       </div>
        {/* Правая часть - Создание уведомления */}
        <div className="notification-panel">
  <h3>Создать уведомление</h3>
  <div className="notification-form">
    
    {/* Блок выбора получателя */}
    <div className="recipient-section">
      <label>Получатель:</label>
      
      <div className="recipient-type-selector">
        <label className="radio-option">
          <input
            type="radio"
            name="recipientType"
            value="all"
            checked={recipientType === 'all'}
            onChange={() => setRecipientType('all')}
          />
          <span className="custom-radio"></span>
          Все пользователи
        </label>
        
        <label className="radio-option">
          <input
            type="radio"
            name="recipientType"
            value="specific"
            checked={recipientType === 'specific'}
            onChange={() => setRecipientType('specific')}
          />
          <span className="custom-radio"></span>
          Конкретный пользователь
        </label>
      </div>

      {/* Поле поиска при выборе конкретного пользователя */}
      {recipientType === 'specific' && (
        <div className="user-search">
          <input
            type="text"
            placeholder="Поиск пользователя..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="user-search-input"
          />
          
          {/* Выпадающий список с результатами поиска */}
          {searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map(user => (
                <div
                  key={user.id}
                  className="user-result"
                  onClick={() => handleUserSelect(user)}
                >
                  {user.fio} ({user.email})
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>

    {/* Остальные элементы формы */}
    <div className="form-group">
      <label>Важность:</label>
      <select
        value={importance}
        onChange={(e) => setImportance(e.target.value)}
      >
        <option value="normal">Обычное</option>
        <option value="important">Важное</option>
        <option value="critical">Экстренное</option>
      </select>
    </div>

    <div className="form-group">
      <label>Сообщение:</label>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows="4"
      />
    </div>
      <div className='message-buttons'>
      <button className="submit-button" onClick={handleSubmit}>Отправить</button>
      <button className="save-btn" >Сохранить шаблон</button>
      </div>
   
  </div>
</div>
</div>
</>
)}

      {activeTab === 'usersMilitary'&&(
         <div className="user-management">
          <MilitaryCenterZayavky/>
       </div>
      )}
      {activeTab === 'material'&&(
        <MilitaryCenterMaterial/>
      )}
      {activeTab === 'konstructor'&&(
        <PageBuilder/>
      )}
      {activeTab === 'users' && (
        <div className="user-management">
          <div className="create-user">
            <h2>Создание нового пользователя</h2>
            <form onSubmit={handleSubmitNewUser}>
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
          <div className='dataManage'>
          <div>
          <h2>Управление резервными копиями</h2>
        <div className="backup-buttons">
          <button className="backup-btn">Создать резервную копию</button>
          <button className="backup-btn">Восстановить из копии</button>
          <button className="backup-btn">Загрузить последнюю копию</button>
        </div>
          </div>
          <div>
          <h2>Управление резервными копиями</h2>
        <div className="airflow-buttons">
          <button className="backup-btn">Вход в Apache Airflow</button>
        </div>
          </div>
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
          <th>ФИО</th>
          <th>Курс</th>
          <th>Направление</th>
          <th>Роль</th>
          <th>Дата регистрации</th>
          {!window.location.href.includes("Militaryadmin")&&(
            <th>ВУЦ</th>
          )}
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
                <input
                  value={editData.fio}
                  onChange={(e) => handleEditChange(e, 'fio')}
                  onKeyDown={handleKeyPress}
                />
              ) : user.fio}
            </td>
            <td>
              {editingId === user.id ? (
                <input
                  value={editData.kyrs}
                  onChange={(e) => handleEditChange(e, 'kyrs')}
                  onKeyDown={handleKeyPress}
                />
              ) : user.kyrs}
            </td>
            <td>
              {editingId === user.id ? (
                <input
                  value={editData.napr}
                  onChange={(e) => handleEditChange(e, 'napr')}
                  onKeyDown={handleKeyPress}
                />
              ) : user.napr}
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
                  <option value="Студент">Студент</option>
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
            {!window.location.href.includes("Militaryadmin")&&(
           <td>
           {editingId === user.id ? (
             <select
               value={editData.vycRole}
               onChange={(e) => handleEditChange(e, 'vycRole')}
               onKeyDown={handleKeyPress}
             >
               <option value="Нет">Нет</option>
               <option value="Студент">Студент</option>
               <option value="Преподаватель">Преподаватель</option>
               <option value="Администратор">Администратор</option>
             </select>
           ) : user.vycRole}
         </td>
          )}

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
{activeTab === 'messages'&&(
  <div className="split-layout">
        {/* Левая часть - Активные заявки */}
        <div className="requests-panel">
          <h3>Активные заявки ({activeRequests.length})</h3>
          <div className="requests-list">
            {activeRequests.map(request => (
              <div 
                key={request.id}
                className={`request-item`}
                onClick={() => {
                  setSelectedRequestId(request.id);
                  setIsModalOpen(true);
                }}
              >
                <div className="request-header">
                  <span>#{request.id}</span>
                  <span className={`status-badge ${request.status}`}>
                    {request.status.toUpperCase()}
                  </span>
                </div>
                <div className="request-info">
                  <p>{request.userName}</p>
                  <small>{new Date(request.date).toLocaleDateString()}</small>
                </div>
              </div>
            ))}
          </div>
          
          
        </div>
        {isModalOpen && (
        <div className="modal-overlay">
          <div className="status-modal">
            <h2>Изменение статуса заявки # {selectedRequestId}</h2>
            
            <div className="status-grid">
              {['СОЗДАНА', 'В РАБОТЕ', 'РЕШЕНА', 'ЗАКРЫТА'].map(status => (
                <button
                  key={status}
                  className={`status-btn ${status}`}
                  onClick={() => updateStatus(status)}
                >
                  {status}
                </button>
              ))}
            </div>

            <button 
              className="close-btn_profile"
              onClick={() => setIsModalOpen(false)}
            >
              &times;
            </button>
          </div>
        </div>
      )}
        {/* Правая часть - Создание уведомления */}
        <div className="notification-panel">
  <h3>Создать уведомление</h3>
  <div className="notification-form">
    
    {/* Блок выбора получателя */}
    <div className="recipient-section">
      <label>Получатель:</label>
      
      <div className="recipient-type-selector">
        <label className="radio-option">
          <input
            type="radio"
            name="recipientType"
            value="all"
            checked={recipientType === 'all'}
            onChange={() => setRecipientType('all')}
          />
          <span className="custom-radio"></span>
          Все пользователи
        </label>
        
        <label className="radio-option">
          <input
            type="radio"
            name="recipientType"
            value="specific"
            checked={recipientType === 'specific'}
            onChange={() => setRecipientType('specific')}
          />
          <span className="custom-radio"></span>
          Конкретный пользователь
        </label>
      </div>

      {/* Поле поиска при выборе конкретного пользователя */}
      {recipientType === 'specific' && (
        <div className="user-search">
          <input
            type="text"
            placeholder="Поиск пользователя..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="user-search-input"
          />
          
          {/* Выпадающий список с результатами поиска */}
          {searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map(user => (
                <div
                  key={user.id}
                  className="user-result"
                  onClick={() => handleUserSelect(user)}
                >
                  {user.fio} ({user.email})
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>

    {/* Остальные элементы формы */}
    <div className="form-group">
      <label>Важность:</label>
      <select
        value={importance}
        onChange={(e) => setImportance(e.target.value)}
      >
        <option value="normal">Обычное</option>
        <option value="important">Важное</option>
        <option value="critical">Экстренное</option>
      </select>
    </div>

    <div className="form-group">
      <label>Сообщение:</label>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows="4"
      />
    </div>

    <button className="submit-button" onClick={handleSubmit}>Отправить</button>
  </div>
</div>
      </div>
)}
    </div>
  );
};

export default AdminPanel;