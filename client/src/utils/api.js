// client/src/utils/api.js
import axios from 'axios';

const api = axios.create({
    // This ensures that even if VITE_API_URL is just the domain, 
    // it always appends /api to match your backend index.js
    baseURL: import.meta.env.VITE_API_URL
        ? `${import.meta.env.VITE_API_URL}/api`
        : 'http://localhost:5000/api',
    withCredentials: true
});

api.interceptors.request.use((config) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && userInfo.token) {
        // This is what the backend "protect" middleware looks for
        config.headers.Authorization = `Bearer ${userInfo.token}`;
    }
    return config;
});

export default api;