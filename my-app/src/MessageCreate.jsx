import React,{useState, useEffect} from "react";
import "./MessageCreate.css"

const MessageCreate=()=>{
    const [searchQuery, setSearchQuery] = useState('');
    const [importance, setImportance] = useState('normal');
  const [message, setMessage] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchResults, setSearchResults] = useState([
        { id: 1, login: 'admin', email: 'admin@university.edu', fio:'Иванов Иван Иванович', kyrs:2,napr:'ИЦС', role: 'Администратор', regDate: '2023-01-15', vycRole:'Администратор', },
        { id: 2, login: 'ivanov', email: 'ivanov@university.edu',fio:'Петров Петр Петрович', kyrs:4,napr:'ЭКОНОМ', role: 'Преподаватель', regDate: '2023-02-20', vycRole:'Преподаватель', }
      ]);
    const [recipientType, setRecipientType] = useState('all');
    const [notification, setNotification] = useState({
        recipient: 'all',
        importance: 'normal',
        message: ''
      });
  
  const [selectedGroupCategory, setSelectedGroupCategory] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedStream, setSelectedStream] = useState('');
  const [selectedStudentGroup, setSelectedStudentGroup] = useState('');

  // Заглушки для данных (замените на реальные данные из API)
  const courses = [];
  const streams = [];
  const studentGroups = [];

  // Заглушка обработчика отправки
      const handleUserSelect = (user) => {
        setSelectedUser(user);
        setSearchQuery(user.fio); // Показываем имя в поле поиска
        setSearchResults([]); // Очищаем результаты
      };
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
    return(
        <div className="notification-panel">
  <h3>Создать уведомление</h3>
  <div className="notification-form">
    
    {/* Блок выбора получателя */}
    <div className="recipient-section">
      <label>Получатель:</label>
      
      <div className="recipient-type-selector">
  {/* Существующие радио-кнопки */}
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

  {/* Новая опция для групп */}
  <label className="radio-option">
    <input
      type="radio"
      name="recipientType"
      value="group"
      checked={recipientType === 'group'}
      onChange={() => setRecipientType('group')}
    />
    <span className="custom-radio"></span>
    Группа
  </label>

  {/* Блок выбора группы */}

</div>
{recipientType === 'group' && (
    <div className="group-selector">
      <div className="group-category-selector">
        <select
          value={selectedGroupCategory}
          onChange={(e) => setSelectedGroupCategory(e.target.value)}
        >
          <option value="">Выберите категорию группы</option>
          <option value="role">По роли</option>
          <option value="course">По курсу</option>
          <option value="stream">По потоку</option>
          <option value="student-group">Студенческая группа</option>
        </select>
      </div>

      {selectedGroupCategory && (
        <div className="specific-group-selector">
          {selectedGroupCategory === 'role' && (
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="">Выберите роль</option>
              <option value="student">Студенты</option>
              <option value="teacher">Преподаватели</option>
              <option value="admin">Администраторы</option>
            </select>
          )}

          {selectedGroupCategory === 'course' && (
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              <option value="">Выберите курс</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.name} ({course.year})
                </option>
              ))}
            </select>
          )}

          {selectedGroupCategory === 'stream' && (
            <div className="stream-selector">
              <select
                value={selectedStream}
                onChange={(e) => setSelectedStream(e.target.value)}
              >
                <option value="">Выберите поток</option>
                {streams.map(stream => (
                  <option key={stream.id} value={stream.id}>
                    {stream.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedGroupCategory === 'student-group' && (
            <div className="student-group-selector">
              <select
                value={selectedStudentGroup}
                onChange={(e) => setSelectedStudentGroup(e.target.value)}
              >
                <option value="">Выберите группу</option>
                {studentGroups.map(group => (
                  <option key={group.id} value={group.id}>
                    {group.name} ({group.faculty})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}
    </div>
  )}

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
)}

export default MessageCreate;