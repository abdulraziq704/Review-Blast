// client/src/utils/api.js
import axios from 'axios';

const api = axios.create({
    // Use the Vite environment variable, fallback to local for development
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
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