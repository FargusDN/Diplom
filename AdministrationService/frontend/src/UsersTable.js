import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUsers, deleteUser, createBackup, restoreBackup, listBackups, resetPassword } from './api';

const UsersTable = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [backupMessage, setBackupMessage] = useState('');
    const [backupError, setBackupError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const response = await getUsers();
            setUsers([...response.data]);
        } catch (error) {
            console.error('Ошибка загрузки users:', error);
        }
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const handleDelete = async (login) => {
        if (window.confirm(`Delete user ${login}?`)) {
            try {
                await deleteUser(login);
                await loadUsers();
            } catch (error) {
                alert(error.message);
            }
        }
    };

    const filteredUsers = users.filter(user =>
        user.login_user.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

    const goToPage = (page) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };

    // Функция для генерации номеров страниц с многоточиями
    const getPageNumbers = () => {
        const pages = [];
        const visiblePages = 3; // Текущая страница + по 1 с каждой стороны

        // Всегда показываем первую страницу
        pages.push(1);

        // Показываем первые две страницы или многоточие
        if (currentPage > visiblePages + 1) {
            pages.push('...');
        } else {
            if (totalPages > 2) pages.push(2);
            if (totalPages > 3 && currentPage <= visiblePages + 1) pages.push(3);
        }

        // Центральные страницы (текущая и соседние)
        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);

        for (let i = start; i <= end; i++) {
            if (i > 1 && i < totalPages && !pages.includes(i)) {
                pages.push(i);
            }
        }

        // Показываем последние две страницы или многоточие
        if (currentPage < totalPages - visiblePages) {
            if (!pages.includes(totalPages - 2)) pages.push('...');
        } else {
            if (totalPages > 4 && !pages.includes(totalPages - 2)) pages.push(totalPages - 2);
            if (totalPages > 3 && !pages.includes(totalPages - 1)) pages.push(totalPages - 1);
        }

        // Всегда показываем последнюю страницу
        if (totalPages > 1) pages.push(totalPages);

        return pages;
    };


    const [backups, setBackups] = useState([]);
    const [selectedBackup, setSelectedBackup] = useState('');
    const [showBackupModal, setShowBackupModal] = useState(false);

    // Загрузка списка бэкапов
    const loadBackups = async () => {
        try {
            const response = await listBackups();
            setBackups(response.data.backups || []);
            if (response.data.backups.length > 0) {
                setSelectedBackup(response.data.backups[0]);
            }
        } catch (error) {
            console.error('Error loading backups:', error);
        }
    };

    // Создание бэкапа
    const handleCreateBackup = async () => {
        try {
            setBackupMessage('Creating backup...');
            setBackupError('');
            const response = await createBackup();
            await loadBackups(); // Обновляем список после создания
            setBackupMessage(`Backup created successfully! File: ${response.data.file}`);
        } catch (error) {
            setBackupError('Backup creation failed: ' + error.message);
            setBackupMessage('');
        }
    };

    // Восстановление из бэкапа
    const handleRestoreBackup = async () => {
        if (!selectedBackup) return;

        if (!window.confirm(`Вы уверены, что хотите восстановить из backup ${selectedBackup}? Это приведет к перезаписи текущих данных.`)) {
            return;
        }

        try {
            setBackupMessage('Restoring from backup...');
            setBackupError('');
            await restoreBackup(selectedBackup);
            setBackupMessage('Database restored successfully!');
            loadUsers();  // Перезагружаем данные
            setShowBackupModal(false);  // Закрываем модальное окно
        } catch (error) {
            setBackupError('Restore failed: ' + error.message);
            setBackupMessage('');
        }
    };

    // Обработчик сброса пароля
    const handleResetPassword = async (login) => {
        if (window.confirm(`Reset password for ${login}?`)) {
            try {
                const response = await resetPassword(login);
                alert('Пароль сброшен успешно!');
                alert('Новый пароль отправлен на email пользователя');
            } catch (error) {
                alert('Ошибка при сбросе пароля: ' + error.message);
            }
        }
    };


    const translateRole = (role) => {
      const roleMap = {
        'simple_user': 'Студент',
        'middle_user': 'Сотрудник ЯГТУ',
        'super_user': 'Администратор'
      };

      return roleMap[role] || role;
    };

    const translateStatus = (status_for_translate) => {
      const statusMap = {
        'active': 'Активна',
        'disabled': 'Заморожена',
        'deleted': 'Удалена'
      };

      return statusMap[status_for_translate] || status_for_translate;
    };

    return (
        <div className="container">
            {/* Кнопки управления бэкапами */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Управление пользователями</h2>
                <div>
                    <button onClick={() => window.open("http://localhost:8080/home", "_blank")}
                        className="btn btn-success me-2">
                           Перейти в Apache Airflow
                    </button>
                    <button onClick={handleCreateBackup} className="btn btn-outline-secondary me-2">
                        Создать Backup
                    </button>
                    <button onClick={() => { setShowBackupModal(true); loadBackups(); }}
                            className="btn btn-outline-secondary me-2">
                        Восстановление из Backup
                    </button>
                </div>
            </div>
            {/* Модальное окно выбора бэкапа */}
            {showBackupModal && (
                <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Select Backup</h5>
                                <button type="button" className="btn-close"
                                    onClick={() => setShowBackupModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                {backups.length === 0 ? (
                                    <p>No backups available</p>
                                ) : (
                                    <select className="form-select"
                                        value={selectedBackup}
                                        onChange={(e) => setSelectedBackup(e.target.value)}>
                                        {backups.map(backup => (
                                            <option key={backup} value={backup}>
                                                {backup}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary"
                                    onClick={() => setShowBackupModal(false)}>
                                    Отмена
                                </button>
                                <button type="button" className="btn btn-primary"
                                    onClick={handleRestoreBackup}
                                    disabled={backups.length === 0}>
                                    Восстановление
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Панель добавления и поиска */}
            <div className="row mb-3">
                <div className="col-md-6">
                    <Link to="/users/new" className="btn btn-primary">
                        Добавить новых пользователей
                    </Link>
                </div>
                <div className="col-md-6">
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Поиск по логину..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Таблица пользователей */}
            <table className="table table-striped table-bordered">
                <thead className="thead-dark">
                    <tr>
                        <th>Логин</th>
                        <th>Роль</th>
                        <th>Статус записи</th>
                        <th>Привилегия ВУЦ</th>
                        <th>Создан</th>
                        <th>Последнее изменение</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedUsers.map(user => (
                        <tr key={user.login_user}>
                            <td>{user.login_user}</td>
                            <td>{translateRole(user.role_user)}</td>
                            <td>
                                <span className={`badge ${user.signal_ind === 'active' ? 'bg-success' :
                                                user.signal_ind === 'disabled' ? 'bg-warning' : 'bg-danger'}`}>
                                    {translateStatus(user.signal_ind)}
                                </span>
                            </td>
                            <td>{user.privilege_mil_center_ystu ? '✅' : '❌'}</td>
                            <td>{new Date(user.create_dttm).toLocaleDateString()}</td>
                            <td>{user.change_dttm ?
                                new Date(user.change_dttm).toLocaleString() : ''}</td>
                            <td>
                                <Link
                                    to={`/users/${user.login_user}`}
                                    className="btn btn-sm btn-primary me-2">
                                    Редактировать
                                </Link>
                                <button
                                    onClick={() => handleResetPassword(user.login_user)}
                                    className="btn btn-sm btn-warning me-2">
                                    Сбросить пароль
                                </button>
                                <button
                                    onClick={() => handleDelete(user.login_user)}
                                    className="btn btn-sm btn-danger">
                                    Удалить
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Сообщение о пустом результате */}
            {filteredUsers.length === 0 ? (
                <div className="alert alert-warning">
                    Не найдено пользователей, соответствующих вашим критериям поиска
                </div>
            ) : (
                // Пагинация
                <div className="d-flex justify-content-between align-items-center mt-3">
                    <div>
                        Показано с {Math.min(startIndex + 1, filteredUsers.length)} по{' '}
                        {Math.min(startIndex + itemsPerPage, filteredUsers.length)} из{' '}
                        {filteredUsers.length} users
                    </div>

                    <div>
                        <nav>
                            <ul className="pagination mb-0">
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => goToPage(currentPage - 1)}
                                    >
                                        &laquo; Назад
                                    </button>
                                </li>

                                {/* Динамически генерируемые страницы */}
                                {getPageNumbers().map((page, index) => (
                                    <li
                                        key={index}
                                        className={`page-item ${
                                            page === '...' ? 'disabled' :
                                            page === currentPage ? 'active' : ''
                                        }`}
                                    >
                                        {page === '...' ? (
                                            <span className="page-link">...</span>
                                        ) : (
                                            <button
                                                className="page-link"
                                                onClick={() => goToPage(page)}
                                            >
                                                {page}
                                            </button>
                                        )}
                                    </li>
                                ))}

                                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => goToPage(currentPage + 1)}
                                    >
                                        Вперёд &raquo;
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersTable;