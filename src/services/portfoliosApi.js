import apiClient from '../lib/apiClient';

export const portfoliosApi = {
    getAll: () => apiClient.get('/api/portfolios'),
    getById: (id) => apiClient.get(`/api/portfolios/${id}`),
    create: (data) => apiClient.post('/api/portfolios', data),
    update: (id, data) => apiClient.put(`/api/portfolios/${id}`, data),
    delete: (id) => apiClient.delete(`/api/portfolios/${id}`),
};
