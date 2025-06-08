import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
});

export default api;

export const getUsers = () => api.get('/users');
export const createUser = (user) => api.post('/users', user);
export const updateUser = (login, user) => api.put(`/users/${login}`, user);
export const getUser = (login) => api.get(`/users/${login}`);
export const resetPassword = (login) => api.put(`/users/${login}/reset-password`);
export const deleteUser = async (login) => {
  try {
    const response = await api.delete(`/users/${encodeURIComponent(login)}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Ошибка при удалении');
  }
};

export const createBackup = () => api.post('/backup/create');
export const restoreBackup = (filename) => api.post('/backup/restore', { file: filename });
export const listBackups = () => api.get('/backup/list');
export const bulkCreateUsers = (formData) => api.post('/users/bulk', formData, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
});
