import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  // Состояния для формы уведомлений
  const [notification, setNotification] = useState({
    type_id: '',
    message: '',
    user_ids: [],
    group_ids: [],
    institute_ids: []
  });

  // Состояния для формы заявок
  const [newRequest, setNewRequest] = useState({
    user_id: '',
    request_type_id: '',
    title: '',
    description: ''
  });

  // Состояния для данных
  const [data, setData] = useState({
    users: [],
    groups: [],
    institutes: [],
    requestTypes: [],
    notifications: [],
    requests: []
  });

  // Состояние для фильтров заявок
  const [filters, setFilters] = useState({
    status: 'all',
    user_id: '',
    request_type_id: ''
  });

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    fetchData();
  }, []);

  // Функция загрузки данных
  const fetchData = async () => {
    try {
      const [users, groups, institutes, requestTypes, requests] = await Promise.all([
        axios.get('http://localhost:8000/users'),
        axios.get('http://localhost:8000/groups'),
        axios.get('http://localhost:8000/institutes'),
        axios.get('http://localhost:8000/request-types'),
        axios.get('http://localhost:8000/requests')
      ]);

      setData({
        users: users.data,
        groups: groups.data,
        institutes: institutes.data,
        requestTypes: requestTypes.data,
        requests: requests.data
      });
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      alert('Ошибка при загрузке данных с сервера');
    }
  };

  // Обработчик создания уведомления
  const handleNotificationSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/notifications', notification);
      alert(response.data.message);
      setNotification({
        type_id: '',
        message: '',
        user_ids: [],
        group_ids: [],
        institute_ids: []
      });
    } catch (error) {
      console.error('Ошибка создания уведомлений:', error);
      alert('Ошибка при создании уведомлений');
    }
  };

  // Обработчик создания заявки
  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/requests', newRequest);
      alert('Заявка успешно создана!');
      setNewRequest({
        user_id: '',
        request_type_id: '',
        title: '',
        description: ''
      });
      fetchData();
    } catch (error) {
      console.error('Ошибка создания заявки:', error);
      alert('Ошибка при создании заявки');
    }
  };

  // Обработчик обновления статуса заявки
  const handleRequestUpdate = async (requestId, status) => {
    try {
      await axios.patch(`http://localhost:8000/requests/${requestId}`, {
        status_request: status
      });
      alert('Статус заявки обновлен!');
      fetchData();
    } catch (error) {
      console.error('Ошибка обновления заявки:', error);
      alert('Ошибка при обновлении статуса заявки');
    }
  };

  // Фильтрация заявок
  const filteredRequests = data.requests.filter(request => {
    return (
      (filters.status === 'all' || request.status_request === filters.status) &&
      (filters.user_id === '' || request.user_id == filters.user_id) &&
      (filters.request_type_id === '' || request.request_type_id == filters.request_type_id)
    );
  });

  // Получение информации о пользователе по ID
  const getUserInfo = (userId) => {
    const user = data.users.find(u => u.user_id === userId);
    return user ? `${user.first_name || ''} ${user.last_name || ''} (${user.email})` : `Пользователь #${userId}`;
  };

  // Получение названия типа заявки по ID
  const getRequestTypeName = (typeId) => {
    const type = data.requestTypes.find(t => t.request_type_id === typeId);
    return type ? type.request_type_name : `Тип #${typeId}`;
  };

  return (
    <div className="container">
      <h1 className="my-4">Система управления уведомлениями ЯГТУ</h1>

      {/* Форма уведомлений */}
      <section className="card mb-4">
        <div className="card-body">
          <h2 className="card-title">Создать уведомление</h2>
          <form onSubmit={handleNotificationSubmit}>
            <div className="mb-3">
              <label className="form-label">Тип уведомления:</label>
              <select
                className="form-select"
                value={notification.type_id}
                onChange={e => setNotification({...notification, type_id: e.target.value})}
                required
              >
                <option value="">Выберите тип уведомления</option>
                <option value="1">Системное</option>
                <option value="2">Академическое</option>
                <option value="3">Оповещение</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Сообщение:</label>
              <textarea
                className="form-control"
                rows="3"
                value={notification.message}
                onChange={e => setNotification({...notification, message: e.target.value})}
                required
              ></textarea>
            </div>

            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label">Пользователи:</label>
                <select
                  multiple
                  className="form-select"
                  size="5"
                  value={notification.user_ids}
                  onChange={e => setNotification({
                    ...notification,
                    user_ids: Array.from(e.target.selectedOptions, o => o.value)
                  })}
                >
                  {data.users.map(user => (
                    <option key={user.user_id} value={user.user_id}>
                      {user.email || `Пользователь #${user.user_id}`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Группы:</label>
                <select
                  multiple
                  className="form-select"
                  size="5"
                  value={notification.group_ids}
                  onChange={e => setNotification({
                    ...notification,
                    group_ids: Array.from(e.target.selectedOptions, o => o.value)
                  })}
                >
                  {data.groups.map(group => (
                    <option key={group.group_id} value={group.group_id}>
                      {group.group_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Институты:</label>
                <select
                  multiple
                  className="form-select"
                  size="5"
                  value={notification.institute_ids}
                  onChange={e => setNotification({
                    ...notification,
                    institute_ids: Array.from(e.target.selectedOptions, o => o.value)
                  })}
                >
                  {data.institutes.map(institute => (
                    <option key={institute.institute_id} value={institute.institute_id}>
                      {institute.institute_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-primary">
              Создать уведомления
            </button>
          </form>
        </div>
      </section>

      {/* Управление заявками */}
      <section className="card">
        <div className="card-body">
          <h2 className="card-title">Управление заявками</h2>

          {/* Фильтры заявок */}
          <div className="row mb-4">
            <div className="col-md-3">
              <label className="form-label">Статус:</label>
              <select
                className="form-select"
                value={filters.status}
                onChange={e => setFilters({...filters, status: e.target.value})}
              >
                <option value="all">Все статусы</option>
                <option value="pending">Ожидание</option>
                <option value="in_progress">В работе</option>
                <option value="completed">Завершено</option>
                <option value="rejected">Отклонено</option>
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label">Пользователь:</label>
              <select
                className="form-select"
                value={filters.user_id}
                onChange={e => setFilters({...filters, user_id: e.target.value})}
              >
                <option value="">Все пользователи</option>
                {data.users.map(user => (
                  <option key={user.user_id} value={user.user_id}>
                    {user.email || `Пользователь #${user.user_id}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label">Тип заявки:</label>
              <select
                className="form-select"
                value={filters.request_type_id}
                onChange={e => setFilters({...filters, request_type_id: e.target.value})}
              >
                <option value="">Все типы</option>
                {data.requestTypes.map(type => (
                  <option key={type.request_type_id} value={type.request_type_id}>
                    {type.request_type_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3 d-flex align-items-end">
              <button
                className="btn btn-secondary"
                onClick={() => setFilters({
                  status: 'all',
                  user_id: '',
                  request_type_id: ''
                })}
              >
                Сбросить фильтры
              </button>
            </div>
          </div>

          {/* Форма создания заявки */}
          <form onSubmit={handleRequestSubmit} className="mb-4 border p-3 rounded">
            <h4>Создать новую заявку</h4>
            <div className="row">
              <div className="col-md-3 mb-3">
                <label className="form-label">Пользователь:</label>
                <select
                  className="form-select"
                  value={newRequest.user_id}
                  onChange={e => setNewRequest({...newRequest, user_id: e.target.value})}
                  required
                >
                  <option value="">Выберите пользователя</option>
                  {data.users.map(user => (
                    <option key={user.user_id} value={user.user_id}>
                      {user.email || `Пользователь #${user.user_id}`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-3 mb-3">
                <label className="form-label">Тип заявки:</label>
                <select
                  className="form-select"
                  value={newRequest.request_type_id}
                  onChange={e => setNewRequest({...newRequest, request_type_id: e.target.value})}
                  required
                >
                  <option value="">Выберите тип</option>
                  {data.requestTypes.map(type => (
                    <option key={type.request_type_id} value={type.request_type_id}>
                      {type.request_type_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-3 mb-3">
                <label className="form-label">Заголовок:</label>
                <input
                  type="text"
                  className="form-control"
                  value={newRequest.title}
                  onChange={e => setNewRequest({...newRequest, title: e.target.value})}
                  required
                />
              </div>

              <div className="col-md-3 mb-3">
                <label className="form-label">Описание:</label>
                <textarea
                  className="form-control"
                  value={newRequest.description}
                  onChange={e => setNewRequest({...newRequest, description: e.target.value})}
                  required
                ></textarea>
              </div>
            </div>

            <button type="submit" className="btn btn-success">
              Создать заявку
            </button>
          </form>

          {/* Список заявок */}
          <h3>Список заявок</h3>
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Пользователь</th>
                  <th>Тип заявки</th>
                  <th>Заголовок</th>
                  <th>Описание</th>
                  <th>Статус</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map(request => (
                  <tr key={request.request_id}>
                    <td>{request.request_id}</td>
                    <td>{getUserInfo(request.user_id)}</td>
                    <td>{getRequestTypeName(request.request_type_id)}</td>
                    <td>{request.title}</td>
                    <td>{request.description}</td>
                    <td>
                      <span className={`badge ${
                        request.status_request === 'completed' ? 'bg-success' :
                        request.status_request === 'rejected' ? 'bg-danger' :
                        request.status_request === 'in_progress' ? 'bg-primary' : 'bg-warning'
                      }`}>
                        {request.status_request}
                      </span>
                    </td>
                    <td>
                      {request.status_request !== 'completed' && (
                        <div className="btn-group">
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handleRequestUpdate(request.request_id, 'completed')}
                          >
                            Завершить
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleRequestUpdate(request.request_id, 'rejected')}
                          >
                            Отклонить
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;