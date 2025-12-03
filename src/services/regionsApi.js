import apiClient from '../lib/apiClient';

export const regionsApi = {
    getAll: () => apiClient.get('/api/regions'),
    getById: (id) => apiClient.get(`/api/regions/${id}`),
    create: (data) => apiClient.post('/api/regions', data),
    update: (id, data) => apiClient.put(`/api/regions/${id}`, data),
    delete: (id) => apiClient.delete(`/api/regions/${id}`),
};
