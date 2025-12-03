import apiClient from '../lib/apiClient';

export const userInfosApi = {
    getAll: () => apiClient.get('/api/user-infos'),
    getById: (id) => apiClient.get(`/api/user-infos/${id}`),
    create: (data) => apiClient.post('/api/user-infos', data),
    update: (id, data) => apiClient.put(`/api/user-infos/${id}`, data),
    delete: (id) => apiClient.delete(`/api/user-infos/${id}`),
};
