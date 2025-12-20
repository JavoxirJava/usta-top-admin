import apiClient from '../lib/apiClient';

export const notificationApi = {
    getMy: () => apiClient.get('/api/notifications'),
};


