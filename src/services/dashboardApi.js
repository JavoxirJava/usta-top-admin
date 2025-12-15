import apiClient from '../lib/apiClient';

export const dashboardApi = {
    getAll: ({range}) => apiClient.get(`/api/users/dashboard?range=${range}`),
};
