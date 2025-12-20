import apiClient from '../lib/apiClient';

export const jobRequestApi = {
    getMy: () => apiClient.get('/api/job-requests/my'),
    accept: (id) => apiClient.patch(`/api/job-requests/${id}/accept`),
    reject: (id) => apiClient.patch(`/api/job-requests/${id}/reject`),
};


