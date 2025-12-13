import apiClient from "@/lib/apiClient";

export const userApi = {
    getOne: (id) => apiClient.get(`/api/user/${id}`)
};