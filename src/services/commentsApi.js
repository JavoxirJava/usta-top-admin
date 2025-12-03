import apiClient from '../lib/apiClient';

export const commentsApi = {
    getAll: () => apiClient.get('/api/comments'),
    getById: (id) => apiClient.get(`/api/comments/${id}`),
    create: (data) => apiClient.post('/api/comments', data),
    update: (id, data) => apiClient.put(`/api/comments/${id}`, data),
    delete: (id) => apiClient.delete(`/api/comments/${id}`),
};
