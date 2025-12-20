import axios from 'axios';
export const url = 'http://localhost:5001'
const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '',
    headers: {
        'Content-Type': 'application/json',
    },
});

// JWT token decode funksiyasi
const decodeToken = (token) => {
    try {
        const base64Url = token.split('.')[1];
        if (!base64Url) return null;
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        return null;
    }
};

// Token expiration tekshirish funksiyasi
const isTokenExpired = (token) => {
    if (!token) return true;
    
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    
    // exp - bu Unix timestamp (soniyalarda)
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
};

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('authToken');
            
            // Token expiration tekshirish
            if (token && isTokenExpired(token)) {
                // Token muddati tugagan, o'chirib tashlash
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
                
                // Login sahifasida bo'lmasa, login sahifasiga yuborish
                const currentPath = window.location.pathname;
                if (currentPath !== '/login' && !currentPath.startsWith('/login')) {
                    window.location.href = '/login';
                }
                
                // Request'ni cancel qilish
                return Promise.reject(new Error('Token expired'));
            }
            
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                // Token va user ma'lumotlarini o'chirish
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
                
                // Login sahifasida bo'lmasa, login sahifasiga yuborish
                const currentPath = window.location.pathname;
                if (currentPath !== '/login' && !currentPath.startsWith('/login')) {
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
