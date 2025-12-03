import apiClient from '../lib/apiClient';

export const portfolioImagesApi = {
    getAll: () => apiClient.get('/api/portfolio-images'),
    getById: (id) => apiClient.get(`/api/portfolio-images/${id}`),
    create: (data) => apiClient.post('/api/portfolio-images', data),
    update: (id, data) => apiClient.put(`/api/portfolio-images/${id}`, data),
    delete: (id) => apiClient.delete(`/api/portfolio-images/${id}`),
};
