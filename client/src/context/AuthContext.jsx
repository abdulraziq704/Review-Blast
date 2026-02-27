import { createContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const { data } = await api.get('/auth/me');
                // Sync localStorage with server data (role, etc.)
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                if (userInfo) {
                    localStorage.setItem('userInfo', JSON.stringify({ ...userInfo, ...data }));
                }
                setUser(data);
            } catch (error) {
                console.error('Session check failed:', error.response?.status, error.response?.data);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkUser();
    }, []);

    const register = async (userData) => {
        try {
            const { data } = await api.post('/auth/register', userData);
            localStorage.setItem('userInfo', JSON.stringify(data));
            setUser(data);
            toast.success('Registration successful');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
            return false;
        }
    };

    const login = async (formData) => {
        try {
            const { data } = await api.post('/auth/login', formData);
            localStorage.setItem('userInfo', JSON.stringify(data));
            setUser(data);
            toast.success('Login successful');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
            return false;
        }
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
            localStorage.removeItem('userInfo');
            setUser(null);
            toast.info('Logged out');
        } catch (error) {
            toast.error('Logout failed');
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, register, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
