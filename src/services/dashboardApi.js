import apiClient from '../lib/apiClient';

export const dashboardApi = {
    getAll: () => apiClient.get('/api/users/dashboard'),
};
