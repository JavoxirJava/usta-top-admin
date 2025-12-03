import apiClient from '../lib/apiClient';

export const usersApi = {
    getAll: () => apiClient.get('/api/users'),
    getById: (id) => apiClient.get(`/api/users/${id}`),
    create: (data) => apiClient.post('/api/users', data),
    update: (id, data) => apiClient.put(`/api/users/${id}`, data),
    delete: (id) => apiClient.delete(`/api/users/${id}`),
};
