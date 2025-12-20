import apiClient from '../lib/apiClient';

export const imagesApi = {
    getAll: () => apiClient.get('/api/images'),
    getById: (id) => apiClient.get(`/api/images/${id}`),
    create: (data) => apiClient.post('/api/images', data),
    update: (id, data) => apiClient.put(`/api/images/${id}`, data),
    delete: (id) => apiClient.delete(`/api/images/${id}`),
};


