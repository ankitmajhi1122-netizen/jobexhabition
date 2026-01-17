import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/jobportal-backend';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach Token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        console.log('Request URL:', config.url);
        if (token && !config.url?.includes('/auth/')) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('Attaching token to request');
        } else {
            console.log('Skipping token attachment');
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle Errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
