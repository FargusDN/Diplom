import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api, { createUser, updateUser, getUser, bulkCreateUsers } from './api';


const UserForm = () => {
    const { login } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        login_user: '',
        password_user: '',
        role_user: 'simple_user',
        signal_ind: 'active',
        privilege_mil_center_ystu: false
    });
    const [error, setError] = useState('');


    useEffect(() => {
        if (login) {
            const fetchUser = async () => {
                try {
                    const response = await getUser(login);
                    const user = response.data;
                    setFormData({
                        ...user,
                        password_user: '' // Не показываем текущий пароль
                    });
                } catch (err) {
                    setError('Failed to load user data');
                }
            };
            fetchUser();
        }
    }, [login]);


const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
        const payload = {
            ...formData,
            // Явно передаем все обязательные поля
            role_user: formData.role_user,
            signal_ind: formData.signal_ind,
            privilege_mil_center_ystu: formData.privilege_mil_center_ystu
        };

        if (!payload.password_user) {
            delete payload.password_user;
        }

        if (login) {
            await updateUser(login, payload);
        } else {
            await createUser(payload);
        }
        navigate('/');
    } catch (err) {
        setError(err.response?.data?.detail || 'Ошибка при обновлении');
    }
};

const [csvFile, setCsvFile] = useState(null);
    const [bulkUploadStatus, setBulkUploadStatus] = useState('');

    // Функция для скачивания шаблона
    const downloadTemplate = async () => {
        try {
            const response = await api.get('/users/template', {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'users_template.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            setError('Ошибка при скачивании шаблона');
        }
    };

    // Обработка массовой загрузки
    const handleBulkUpload = async () => {
        if (!csvFile) {
            setError('Выберите CSV файл');
            return;
        }

        const formData = new FormData();
        formData.append('file', csvFile);

        try {
            setBulkUploadStatus('Загрузка...');
            const response = await bulkCreateUsers(formData);
            setBulkUploadStatus(`Успешно добавлено: ${response.data.message}`);
            setTimeout(() => navigate('/'), 2000);
        } catch (err) {
            setBulkUploadStatus('Ошибка при загрузке');
            setError(err.response?.data?.detail || 'Ошибка при массовом добавлении');
        }
    };

    return (
    <div className="container mt-4">
        <div className="d-flex flex-column align-items-center">
            <h2 className="text-center mb-4">{login ? 'Редактирование учетной записи' : 'Создание новых учетных записей'}</h2>
            {error && <div className="alert alert-danger w-100" style={{ maxWidth: '800px' }}>{error}</div>}

            {login ? (
                // Режим редактирования - одна форма по центру
                <div className="d-flex justify-content-center w-100">
                    <form onSubmit={handleSubmit} className="card" style={{ width: '40%', maxWidth: '600px', minWidth: '400px' }}>
                        <div className="card-body">
                            <div className="mb-3">
                                <label className="form-label">Логин:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.login_user}
                                    onChange={e => setFormData({...formData, login_user: e.target.value})}
                                    required
                                    disabled={!!login}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Пароль:</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={formData.password_user}
                                    onChange={e => setFormData({...formData, password_user: e.target.value})}
                                    required={!login}
                                    placeholder={login ? '...' : ''}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Роль:</label>
                                <select
                                    className="form-select"
                                    value={formData.role_user}
                                    onChange={e => setFormData({...formData, role_user: e.target.value})}
                                >
                                    <option value="simple_user">Студент</option>
                                    <option value="middle_user">Сотрудник ЯГТУ</option>
                                    <option value="super_user">Администратор</option>
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Статус записи:</label>
                                <select
                                    className="form-select"
                                    value={formData.signal_ind}
                                    onChange={e => setFormData({...formData, signal_ind: e.target.value})}
                                >
                                    <option value="active">Активна</option>
                                    <option value="disabled">Заморожена</option>
                                    <option value="deleted">Удалена</option>
                                </select>
                            </div>

                            <div className="mb-3 form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    checked={formData.privilege_mil_center_ystu}
                                    onChange={e => setFormData({...formData, privilege_mil_center_ystu: e.target.checked})}
                                />
                                <label className="form-check-label">Привилегия ВУЦ</label>
                            </div>

                            <div className="mt-4 d-flex justify-content-center">
                                <button type="submit" className="btn btn-primary me-2">
                                    {login ? 'Обновить пользователя' : 'Создать пользователя'}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => navigate('/')}>
                                    Отмена
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            ) : (
                // Режим создания - две формы рядом по центру
                <div className="d-flex justify-content-center w-100">
                    <div className="d-flex flex-column flex-md-row gap-4" style={{ maxWidth: '1200px', width: '100%' }}>
                        {/* Форма одиночного добавления */}
                        <div className="flex-grow-1" style={{ maxWidth: '500px' }}>
                            <form onSubmit={handleSubmit} className="card h-100">
                                <div className="card-body">
                                <h3 className="text-center mb-3">Одиночное добавление пользователя</h3>
                                    <div className="mb-3">
                                        <label className="form-label">Логин:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.login_user}
                                            onChange={e => setFormData({...formData, login_user: e.target.value})}
                                            required
                                            disabled={!!login}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Пароль:</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            value={formData.password_user}
                                            onChange={e => setFormData({...formData, password_user: e.target.value})}
                                            required={!login}
                                            placeholder={login ? '...' : ''}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Роль:</label>
                                        <select
                                            className="form-select"
                                            value={formData.role_user}
                                            onChange={e => setFormData({...formData, role_user: e.target.value})}
                                        >
                                            <option value="simple_user">Студент</option>
                                            <option value="middle_user">Сотрудник ЯГТУ</option>
                                            <option value="super_user">Администратор</option>
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Статус записи:</label>
                                        <select
                                            className="form-select"
                                            value={formData.signal_ind}
                                            onChange={e => setFormData({...formData, signal_ind: e.target.value})}
                                        >
                                            <option value="active">Активна</option>
                                            <option value="disabled">Заморожена</option>
                                            <option value="deleted">Удалена</option>
                                        </select>
                                    </div>

                                    <div className="mb-3 form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            checked={formData.privilege_mil_center_ystu}
                                            onChange={e => setFormData({...formData, privilege_mil_center_ystu: e.target.checked})}
                                        />
                                        <label className="form-check-label">Привилегия ВУЦ</label>
                                    </div>

                                    <div className="mt-4 d-flex justify-content-center">
                                        <button type="submit" className="btn btn-primary me-2">
                                            Создать пользователя
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => navigate('/')}>
                                            Отмена
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Форма массового добавления */}
                        <div className="flex-grow-1" style={{ maxWidth: '500px' }}>
                            <div className="card h-100">
                                <div className="card-body d-flex flex-column">
                                    <h3 className="text-center mb-3">Массовое добавление пользователей</h3>

                                    <div className="d-flex justify-content-center mb-3">
                                        <button
                                            type="button"
                                            className="btn btn-outline-primary me-2"
                                            onClick={downloadTemplate}
                                        >
                                            Скачать шаблон CSV
                                        </button>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Выберите CSV файл:</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            accept=".csv"
                                            onChange={(e) => setCsvFile(e.target.files[0])}
                                        />
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center mt-auto">
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={handleBulkUpload}
                                            disabled={!csvFile}
                                        >
                                            Загрузить пользователей
                                        </button>

                                        {bulkUploadStatus && (
                                            <span className="text-success">{bulkUploadStatus}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
);
};

export default UserForm;