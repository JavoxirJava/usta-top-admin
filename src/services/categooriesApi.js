import apiClient from '../lib/apiClient';

export const categoriesApi = {
    getAll: () => apiClient.get('/api/categories'),
    getById: (id) => apiClient.get(`/api/categories/${id}`),
    create: (data) => apiClient.post('/api/categories', data),
    update: (id, data) => apiClient.put(`/api/categories/${id}`, data),
    delete: (id) => apiClient.delete(`/api/categories/${id}`),
};
